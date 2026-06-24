// Configurações Iniciais e Banco de Dados de Itens
const itens = {
    blusa: ['Borboleta', 'Morango', 'Gato', 'Cogumelo', 'Abelha', 'Robo', 'Baleia', 'Trem', 'Dinossauro', 'Espaço'],
    calca: ['SaiaM', 'SaiaV', 'SaiaCamada', 'Pata', 'ShortAmarelo', 'ShortVerde', 'Estrela', 'Macacao', 'ShortCinza', 'ShortAzul', 'CargoMarrom', 'Cargo'],
    sapato: ['Sapatenis', 'Chinelo', 'AllRosa', 'AllPreto', 'AllAzul', 'Patins', 'Bota'],
    conjunto: ['Brasil', 'VestidoRosa', 'VestidoRoxo'],
    acessorio: ['Cubo', 'Fone', 'Brinco', 'Relógio', 'Presilha'],
    extra: ['Orelha'],
    cabelo: ['Tranca', 'Ovelha', 'Baixo', 'Topete', 'CacheadoM', 'Cacheado', 'Coque', 'Ondulado', 'Liso', 'LisoFranja'],
    pele: ['Padrão'] 
};

// Ordem inicial das camadas (Z-Index)
let ordemCamadas = {
    pele: 1,
    roupaFixa: 2,
    sapato: 3,
    calca: 4,
    blusa: 5,
    cabelo: 6,
    conjunto: 7,
    acessorio: 8,
    extra: 9
};

let categoriaSelecionada = '';
let corCabeloAtual = 'Preto';
let formatoCabeloAtual = '';

// Função para mudar a Aba
window.mudarAba = function(categoria) {
    categoriaSelecionada = categoria;
    const grade = document.getElementById('grade-itens');
    const menuCores = document.getElementById('menu-cores');
    grade.innerHTML = '';
    
    document.getElementById('titulo-aba').innerText = "Escolha: " + categoria.toUpperCase();

    // Mostrar/Esconder menu de cores (Apenas para Cabelo e Pele)
    if (categoria === 'cabelo' || categoria === 'pele') {
        menuCores.classList.remove('oculto');
        gerarCores(categoria);
    } else {
        menuCores.classList.add('oculto');
    }

    // Criar os quadrados dinamicamente
    itens[categoria].forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-quadrado';
        // Para o cabelo, mostramos a versão preta no menu
        const caminhoImg = `assets/img/${item}.png`;
        div.innerHTML = `<img src="${caminhoImg}" title="${item}">`;
        
        div.onclick = () => equiparItem(categoria, item);
        grade.appendChild(div);
    });
}

// Função de Equipar / Desequipar (Toggle)
function equiparItem(categoria, item) {
    const container = document.getElementById('camadas-equipadas');
    const idItem = `item-${categoria}`;
    const jaExiste = document.getElementById(idItem);

    // Se clicar no mesmo item que já está lá, ele remove
    if (jaExiste && jaExiste.dataset.nome === item) {
        jaExiste.remove();
        if(categoria === 'cabelo') formatoCabeloAtual = '';
        return;
    }

    // Se for Blusa/Calça/Cabelo/Sapato, substitui o anterior
    if (jaExiste) jaExiste.remove();

    // Se for Conjunto, remove blusa e calça para não bugar
    if (categoria === 'conjunto') {
        const b = document.getElementById('item-blusa'); if(b) b.remove();
        const c = document.getElementById('item-calca'); if(c) c.remove();
    }

    // Cria a nova imagem no avatar
    const img = document.createElement('img');
    img.id = idItem;
    img.dataset.nome = item;
    img.className = 'camada';
    img.style.zIndex = ordemCamadas[categoria];

    // Lógica especial do Cabelo B
    if (categoria === 'cabelo') {
        formatoCabeloAtual = item;
        img.src = corCabeloAtual === 'Preto' ? `assets/img/${item}.png` : `assets/img/${item}B.png`;
        aplicarFiltroCabelo(img, corCabeloAtual);
    } else {
        img.src = `assets/img/${item}.png`;
    }

    container.appendChild(img);
}

// Lógica das Cores
function gerarCores(tipo) {
    const lista = document.getElementById('lista-cores');
    lista.innerHTML = '';
    const cores = tipo === 'pele' ? 
        {Claro: '#f5d1b5', Bronze: '#d2a37e', Escuro: '#634430'} : 
        {Preto: '#000', Marrom: '#4b3121', Loiro: '#e8be5e', Ruivo: '#a33b20', Azul: '#2196F3'};

    for (let nome in cores) {
        const box = document.createElement('div');
        box.className = 'cor-quadrado';
        box.style.background = cores[nome];
        box.onclick = () => {
            if (tipo === 'pele') aplicarFiltroPele(cores[nome]);
            else mudarCorCabelo(nome);
        };
        lista.appendChild(box);
    }
}

function mudarCorCabelo(cor) {
    corCabeloAtual = cor;
    const imgCabelo = document.getElementById('item-cabelo');
    if (imgCabelo && formatoCabeloAtual) {
        // Troca para versão B se não for preto
        imgCabelo.src = cor === 'Preto' ? `assets/img/${formatoCabeloAtual}.png` : `assets/img/${formatoCabeloAtual}B.png`;
        aplicarFiltroCabelo(imgCabelo, cor);
    }
}

function aplicarFiltroCabelo(el, cor) {
    const filtros = {
        'Preto': 'none',
        'Marrom': 'sepia(1) brightness(0.5)',
        'Loiro': 'sepia(1) hue-rotate(10deg) saturate(2)',
        'Ruivo': 'sepia(1) hue-rotate(-20deg) saturate(3)',
        'Azul': 'sepia(1) hue-rotate(180deg) saturate(4)'
    };
    el.style.filter = filtros[cor] || 'none';
}

function aplicarFiltroPele(corHex) {
    // Aqui usamos um truque de brilho/contraste ou você pode trocar a imagem do corpo
    const corpo = document.getElementById('camada-corpo');
    // Para simplificar, vamos usar opacidade e cor de fundo no container se o corpo for transparente
    // Ou você pode ter 3 fotos: Corpo_Claro.png, etc.
    // Como combinamos filtro:
    if(corHex === '#f5d1b5') corpo.style.filter = "none";
    if(corHex === '#d2a37e') corpo.style.filter = "sepia(0.5) brightness(0.8)";
    if(corHex === '#634430') corpo.style.filter = "sepia(1) brightness(0.4) contrast(1.2)";
}

// Função das Setas (Ajustar Z-Index)
window.ajustarCamada = function(direcao) {
    if (!categoriaSelecionada) return;
    
    if (direcao === 'subir') ordemCamadas[categoriaSelecionada] += 1;
    else ordemCamadas[categoriaSelecionada] -= 1;

    const img = document.getElementById(`item-${categoriaSelecionada}`);
    if (img) img.style.zIndex = ordemCamadas[categoriaSelecionada];
    
    console.log(`${categoriaSelecionada} agora está no nível ${ordemCamadas[categoriaSelecionada]}`);
}

// Iniciar na aba blusa
mudarAba('blusa');