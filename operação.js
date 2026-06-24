// Dados dos exercicios
const exercicios = {
    adicao: { num1: 0, num2: 0 },
    subtracao: { num1: 0, num2: 0 },
    multiplicacao: { num1: 0, num2: 0 },
    divisao: { num1: 0, num2: 0 }
};

// Navegar entre paginas
function irParaPagina(pagina) {
    // Esconder todas as paginas
    document.querySelectorAll('.pagina').forEach(p => {
        p.classList.remove('ativa');
    });

    if (pagina === 'principal') {
        document.getElementById('pagina-principal').classList.add('ativa');
    } else {
        const paginaEl = document.getElementById('pagina-' + pagina);
        paginaEl.classList.add('ativa');
        novoExercicio(pagina);
    }
}

// Gerar numero aleatorio entre min e max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Criar novo exercicio
function novoExercicio(operacao) {
    let num1, num2;

    switch (operacao) {
        case 'adicao':
            num1 = randomInt(1, 20);
            num2 = randomInt(1, 20);
            break;
        case 'subtracao':
            num1 = randomInt(5, 25);
            num2 = randomInt(1, num1); // Garante resultado positivo
            break;
        case 'multiplicacao':
            num1 = randomInt(1, 10);
            num2 = randomInt(1, 10);
            break;
        case 'divisao':
            num2 = randomInt(1, 10);
            num1 = num2 * randomInt(1, 10); // Garante divisao exata
            break;
    }

    exercicios[operacao].num1 = num1;
    exercicios[operacao].num2 = num2;

    document.getElementById('num1-' + operacao).textContent = num1;
    document.getElementById('num2-' + operacao).textContent = num2;
    document.getElementById('resposta-' + operacao).value = '';
    document.getElementById('feedback-' + operacao).textContent = '';
    document.getElementById('feedback-' + operacao).className = 'feedback';
    document.getElementById('resposta-' + operacao).focus();
}

// Verificar resposta
function verificar(operacao) {
    const num1 = exercicios[operacao].num1;
    const num2 = exercicios[operacao].num2;
    const respostaInput = document.getElementById('resposta-' + operacao);
    const feedback = document.getElementById('feedback-' + operacao);
    const resposta = parseInt(respostaInput.value);

    if (isNaN(resposta)) {
        feedback.textContent = 'Digite um numero!';
        feedback.className = 'feedback errado';
        return;
    }

    let correta;
    switch (operacao) {
        case 'adicao':
            correta = num1 + num2;
            break;
        case 'subtracao':
            correta = num1 - num2;
            break;
        case 'multiplicacao':
            correta = num1 * num2;
            break;
        case 'divisao':
            correta = num1 / num2;
            break;
    }

    if (resposta === correta) {
        feedback.textContent = 'Parabens! Resposta correta!';
        feedback.className = 'feedback correto';
    } else {
        feedback.textContent = 'Tente novamente! A resposta correta e ' + correta;
        feedback.className = 'feedback errado';
    }
}

// Permitir verificar com Enter
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const paginas = ['adicao', 'subtracao', 'multiplicacao', 'divisao'];
        for (const op of paginas) {
            const paginaEl = document.getElementById('pagina-' + op);
            if (paginaEl.classList.contains('ativa')) {
                verificar(op);
                break;
            }
        }
    }
});
// ==================== ESTADO DO JOGO ====================
const estado = {
    operacaoAtual: '',
    hiperfoco: '',
    personagemEmoji: '',
    num1: 0,
    num2: 0,
    respostaCorreta: 0,
    estrelas: 0,
    nivel: 1,
    acertosConsecutivos: 0,
    errosConsecutivos: 0,
    totalAcertos: 0,
    totalErros: 0,
    tentativasNoExercicio: 0
};

// ==================== MAPEAMENTO DE HIPERFOCOS ====================
const hiperfocoMap = {
    dinossauro:  { emoji: '\u{1F996}', nome: 'Dino' },
    dinossauros: { emoji: '\u{1F996}', nome: 'Dino' },
    dino:        { emoji: '\u{1F996}', nome: 'Dino' },
    espaco:      { emoji: '\u{1F680}', nome: 'Foguete' },
    foguete:     { emoji: '\u{1F680}', nome: 'Foguete' },
    astronauta:  { emoji: '\u{1F468}\u200D\u{1F680}', nome: 'Astronauta' },
    planeta:     { emoji: '\u{1FA90}', nome: 'Planeta' },
    planetas:    { emoji: '\u{1FA90}', nome: 'Planeta' },
    estrela:     { emoji: '\u2B50', nome: 'Estrela' },
    estrelas:    { emoji: '\u2B50', nome: 'Estrela' },
    futebol:     { emoji: '\u26BD', nome: 'Bola' },
    bola:        { emoji: '\u26BD', nome: 'Bola' },
    gato:        { emoji: '\u{1F431}', nome: 'Gatinho' },
    gatos:       { emoji: '\u{1F431}', nome: 'Gatinho' },
    cachorro:    { emoji: '\u{1F436}', nome: 'Dogzinho' },
    cachorros:   { emoji: '\u{1F436}', nome: 'Dogzinho' },
    dog:         { emoji: '\u{1F436}', nome: 'Dogzinho' },
    unicornio:   { emoji: '\u{1F984}', nome: 'Unicornio' },
    cavalo:      { emoji: '\u{1F40E}', nome: 'Cavalo' },
    musica:      { emoji: '\u{1F3B5}', nome: 'Musica' },
    piano:       { emoji: '\u{1F3B9}', nome: 'Piano' },
    guitarra:    { emoji: '\u{1F3B8}', nome: 'Guitarra' },
    arte:        { emoji: '\u{1F3A8}', nome: 'Arte' },
    pintura:     { emoji: '\u{1F3A8}', nome: 'Arte' },
    desenho:     { emoji: '\u{1F3A8}', nome: 'Arte' },
    carro:       { emoji: '\u{1F697}', nome: 'Carrinho' },
    carros:      { emoji: '\u{1F697}', nome: 'Carrinho' },
    trem:        { emoji: '\u{1F682}', nome: 'Trem' },
    aviao:       { emoji: '\u2708\uFE0F', nome: 'Aviao' },
    robo:        { emoji: '\u{1F916}', nome: 'Robo' },
    robos:       { emoji: '\u{1F916}', nome: 'Robo' },
    lego:        { emoji: '\u{1F9F1}', nome: 'Lego' },
    livro:       { emoji: '\u{1F4DA}', nome: 'Livro' },
    livros:      { emoji: '\u{1F4DA}', nome: 'Livro' },
    jogo:        { emoji: '\u{1F3AE}', nome: 'Game' },
    jogos:       { emoji: '\u{1F3AE}', nome: 'Game' },
    videogame:   { emoji: '\u{1F3AE}', nome: 'Game' },
    minecraft:   { emoji: '\u{1F3AE}', nome: 'Game' },
    roblox:      { emoji: '\u{1F3AE}', nome: 'Game' },
    comida:      { emoji: '\u{1F354}', nome: 'Chef' },
    cozinha:     { emoji: '\u{1F468}\u200D\u{1F373}', nome: 'Chef' },
    doce:        { emoji: '\u{1F370}', nome: 'Docinho' },
    chocolate:   { emoji: '\u{1F36B}', nome: 'Chocolate' },
    sorvete:     { emoji: '\u{1F366}', nome: 'Sorvete' },
    flor:        { emoji: '\u{1F33B}', nome: 'Florzinha' },
    flores:      { emoji: '\u{1F33B}', nome: 'Florzinha' },
    natureza:    { emoji: '\u{1F333}', nome: 'Natureza' },
    borboleta:   { emoji: '\u{1F98B}', nome: 'Borboleta' },
    borboletas:  { emoji: '\u{1F98B}', nome: 'Borboleta' },
    princesa:    { emoji: '\u{1F478}', nome: 'Princesa' },
    heroi:       { emoji: '\u{1F9B8}', nome: 'Heroi' },
    super:       { emoji: '\u{1F9B8}', nome: 'Heroi' },
    dragao:      { emoji: '\u{1F409}', nome: 'Dragao' },
    dragoes:     { emoji: '\u{1F409}', nome: 'Dragao' },
    tubarao:     { emoji: '\u{1F988}', nome: 'Tubarao' },
    peixe:       { emoji: '\u{1F420}', nome: 'Peixe' },
    oceano:      { emoji: '\u{1F30A}', nome: 'Oceano' },
    mar:         { emoji: '\u{1F30A}', nome: 'Oceano' },
    sol:         { emoji: '\u{1F31E}', nome: 'Sol' },
    lua:         { emoji: '\u{1F31D}', nome: 'Lua' },
    arco:        { emoji: '\u{1F308}', nome: 'Arco-iris' },
    'arco-iris': { emoji: '\u{1F308}', nome: 'Arco-iris' },
    coracao:     { emoji: '\u2764\uFE0F', nome: 'Coracao' },
    amor:        { emoji: '\u2764\uFE0F', nome: 'Coracao' },
    macaco:      { emoji: '\u{1F435}', nome: 'Macaco' },
    leao:        { emoji: '\u{1F981}', nome: 'Leao' },
    urso:        { emoji: '\u{1F43B}', nome: 'Urso' },
    coelho:      { emoji: '\u{1F430}', nome: 'Coelho' },
    panda:       { emoji: '\u{1F43C}', nome: 'Panda' },
    passaro:     { emoji: '\u{1F426}', nome: 'Passaro' },
    coruja:      { emoji: '\u{1F989}', nome: 'Coruja' },
    morcego:     { emoji: '\u{1F987}', nome: 'Morcego' },
    aranha:      { emoji: '\u{1F577}\uFE0F', nome: 'Aranha' },
    inseto:      { emoji: '\u{1F41B}', nome: 'Inseto' },
    cobra:       { emoji: '\u{1F40D}', nome: 'Cobra' },
    girafa:      { emoji: '\u{1F992}', nome: 'Girafa' },
    elefante:    { emoji: '\u{1F418}', nome: 'Elefante' },
    polvo:       { emoji: '\u{1F419}', nome: 'Polvo' },
    bicicleta:   { emoji: '\u{1F6B2}', nome: 'Bike' },
    skate:       { emoji: '\u{1F6F9}', nome: 'Skate' },
    basquete:    { emoji: '\u{1F3C0}', nome: 'Basquete' },
    tenis:       { emoji: '\u{1F3BE}', nome: 'Tenis' },
    natacao:     { emoji: '\u{1F3CA}', nome: 'Nadador' },
    danca:       { emoji: '\u{1F483}', nome: 'Danca' },
    dancar:      { emoji: '\u{1F483}', nome: 'Danca' },
    ninja:       { emoji: '\u{1F977}', nome: 'Ninja' },
    pirata:      { emoji: '\u{1F3F4}\u200D\u2620\uFE0F', nome: 'Pirata' },
    mago:        { emoji: '\u{1F9D9}', nome: 'Mago' },
    fada:        { emoji: '\u{1F9DA}', nome: 'Fada' },
    sereia:      { emoji: '\u{1F9DC}', nome: 'Sereia' },
};

const emojiPadrao = { emoji: '\u{1F981}', nome: 'Amigo' };

// ==================== IA - MENSAGENS INTELIGENTES ====================
const IA = {
    msgAcerto: [
        'Incrivel! Voce e um genio da matematica!',
        'Mandou muito bem! Resposta certinha!',
        'Uau! Isso ai, continue assim!',
        'Perfeito! Voce esta arrasando!',
        'Que demais! Acertou na mosca!',
        'Brilhante! Voce esta cada vez melhor!',
        'Fantastico! Mais uma pra conta!',
        'Show! Voce e demais!',
    ],
    msgAcertoComHiperfoco(hiperfoco) {
        return [
            `Incrivel! Ate o ${hiperfoco} esta aplaudindo!`,
            `Acertou! O ${hiperfoco} ficou muito orgulhoso!`,
            `Mandou bem! O ${hiperfoco} esta comemorando!`,
            `Perfeito! O ${hiperfoco} deu um pulo de alegria!`,
            `Brilhante! O ${hiperfoco} esta dancando!`,
        ];
    },
    msgErro: [
        'Quase la! Tente de novo, eu acredito em voce!',
        'Hmm, nao foi dessa vez. Vamos tentar mais uma vez?',
        'Errou, mas tudo bem! Tente novamente!',
        'Ops! Vamos pensar juntos? Tente de novo!',
        'Nao desista! Voce consegue! Tente mais uma vez.',
    ],
    msgErroComHiperfoco(hiperfoco) {
        return [
            `O ${hiperfoco} esta torcendo por voce! Tente de novo!`,
            `Quase! O ${hiperfoco} sabe que voce consegue!`,
            `Hmm, o ${hiperfoco} quer ver voce acertar! Tenta mais uma vez!`,
        ];
    },
    msgNivel: [
        'Novo nivel! Voce esta evoluindo!',
        'Subiu de nivel! Desafio aumentado!',
        'Level up! Voce e incrivel!',
    ],
    msgDica(operacao, num1, num2) {
        switch (operacao) {
            case 'adicao':
                return `Dica: comece com ${num1} e conte mais ${num2}!`;
            case 'subtracao':
                return `Dica: comece com ${num1} e tire ${num2}!`;
            case 'multiplicacao':
                return `Dica: some ${num1} + ${num1} (${num2} vezes)!`;
            case 'divisao':
                return `Dica: quantas vezes ${num2} cabe em ${num1}?`;
        }
    },
    escolher(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
    obterMsgAcerto() {
        if (estado.hiperfoco) {
            const msgs = [...this.msgAcerto, ...this.msgAcertoComHiperfoco(estado.hiperfoco)];
            return this.escolher(msgs);
        }
        return this.escolher(this.msgAcerto);
    },
    obterMsgErro() {
        if (estado.tentativasNoExercicio >= 2) {
            return this.msgDica(estado.operacaoAtual, estado.num1, estado.num2);
        }
        if (estado.hiperfoco) {
            const msgs = [...this.msgErro, ...this.msgErroComHiperfoco(estado.hiperfoco)];
            return this.escolher(msgs);
        }
        return this.escolher(this.msgErro);
    }
};

// ==================== NAVEGACAO ====================
function mostrarPagina(id) {
    document.querySelectorAll('.pagina').forEach(p => p.classList.remove('ativa'));
    document.getElementById(id).classList.add('ativa');
}

function selecionarOperacao(op) {
    estado.operacaoAtual = op;
    mostrarPagina('pagina-hiperfoco');
    document.getElementById('input-hiperfoco').focus();
}

function voltarParaInicio() {
    estado.estrelas = 0;
    estado.nivel = 1;
    estado.acertosConsecutivos = 0;
    estado.errosConsecutivos = 0;
    estado.totalAcertos = 0;
    estado.totalErros = 0;
    mostrarPagina('pagina-bemvindo');
}

// ==================== HIPERFOCO ====================
function definirHiperfoco() {
    const input = document.getElementById('input-hiperfoco').value.trim().toLowerCase();
    estado.hiperfoco = input;

    // Buscar emoji correspondente
    let match = hiperfocoMap[input];
    if (!match) {
        // Buscar parcial
        for (const key in hiperfocoMap) {
            if (input.includes(key) || key.includes(input)) {
                match = hiperfocoMap[key];
                break;
            }
        }
    }
    if (!match) match = emojiPadrao;

    estado.personagemEmoji = match.emoji;
    estado.hiperfoco = match.nome;

    iniciarJogo();
}

// ==================== JOGO ====================
function iniciarJogo() {
    const fundo = document.getElementById('fundo-jogo');
    fundo.className = 'fundo-jogo';

    const opLabels = {
        adicao: { titulo: 'ADICAO', fundo: 'laranja-bg', simbolo: '+' },
        subtracao: { titulo: 'SUBTRACAO', fundo: 'azul-bg', simbolo: '-' },
        multiplicacao: { titulo: 'MULTIPLICACAO', fundo: 'laranja-bg', simbolo: '\u00D7' },
        divisao: { titulo: 'DIVISAO', fundo: 'azul-bg', simbolo: '\u00F7' }
    };
    const cfg = opLabels[estado.operacaoAtual];
    fundo.classList.add(cfg.fundo);
    document.getElementById('titulo-jogo').textContent = cfg.titulo;
    document.getElementById('operador-simbolo').textContent = cfg.simbolo;

    // Personagem
    document.getElementById('personagem').textContent = estado.personagemEmoji;
    document.getElementById('fala-personagem').textContent =
        `Oi! Eu sou o ${estado.hiperfoco}! Vamos resolver juntos!`;

    atualizarPlacar();
    mostrarPagina('pagina-jogo');
    gerarExercicio();
}

function gerarExercicio() {
    let n1, n2;
    const maxVal = 5 + (estado.nivel * 5);

    switch (estado.operacaoAtual) {
        case 'adicao':
            n1 = randInt(1, maxVal);
            n2 = randInt(1, maxVal);
            estado.respostaCorreta = n1 + n2;
            break;
        case 'subtracao':
            n1 = randInt(Math.min(5, maxVal), maxVal);
            n2 = randInt(1, n1);
            estado.respostaCorreta = n1 - n2;
            break;
        case 'multiplicacao':
            n1 = randInt(1, Math.min(estado.nivel + 3, 12));
            n2 = randInt(1, Math.min(estado.nivel + 3, 12));
            estado.respostaCorreta = n1 * n2;
            break;
        case 'divisao':
            n2 = randInt(1, Math.min(estado.nivel + 3, 12));
            estado.respostaCorreta = randInt(1, Math.min(estado.nivel + 3, 10));
            n1 = n2 * estado.respostaCorreta;
            break;
    }
    estado.num1 = n1;
    estado.num2 = n2;
    estado.tentativasNoExercicio = 0;

    document.getElementById('num1').textContent = n1;
    document.getElementById('num2').textContent = n2;

    const inputResp = document.getElementById('input-resposta');
    inputResp.value = '';
    inputResp.className = 'input-resposta';
    inputResp.disabled = false;
    inputResp.focus();

    document.getElementById('btn-verificar').style.display = '';
    document.getElementById('btn-proximo').style.display = 'none';
    document.getElementById('feedback-area').innerHTML = '';

    // Personagem volta ao normal
    const pers = document.getElementById('personagem');
    pers.className = 'personagem';
}

function verificarResposta() {
    const inputResp = document.getElementById('input-resposta');
    const valor = parseInt(inputResp.value);

    if (isNaN(valor)) {
        document.getElementById('fala-personagem').textContent = 'Digite um numero!';
        return;
    }

    estado.tentativasNoExercicio++;

    if (valor === estado.respostaCorreta) {
        acertou();
    } else {
        errou();
    }
}

function acertou() {
    estado.estrelas++;
    estado.acertosConsecutivos++;
    estado.errosConsecutivos = 0;
    estado.totalAcertos++;

    // Subir de nivel a cada 5 acertos consecutivos
    if (estado.acertosConsecutivos > 0 && estado.acertosConsecutivos % 5 === 0) {
        estado.nivel++;
        setTimeout(() => {
            document.getElementById('fala-personagem').textContent =
                IA.escolher(IA.msgNivel) + ` Agora no nivel ${estado.nivel}!`;
        }, 2000);
    }

    atualizarPlacar();

    // Visual
    const inputResp = document.getElementById('input-resposta');
    inputResp.classList.add('correto');
    inputResp.disabled = true;
    document.getElementById('btn-verificar').style.display = 'none';
    document.getElementById('btn-proximo').style.display = '';

    // Personagem comemora
    const pers = document.getElementById('personagem');
    pers.classList.add('comemorando');

    // Fala
    document.getElementById('fala-personagem').textContent = IA.obterMsgAcerto();

    // Feedback
    document.getElementById('feedback-area').innerHTML =
        '<span style="color:#2ECC71;font-weight:800;text-shadow:1px 1px 3px rgba(0,0,0,0.2);">&#9733; Correto!</span>';

    // Confetti
    lancarConfetti();
    criarParticulasAcerto();
}

function errou() {
    estado.errosConsecutivos++;
    estado.acertosConsecutivos = 0;
    estado.totalErros++;

    // Adaptar nivel se muitos erros
    if (estado.errosConsecutivos >= 3 && estado.nivel > 1) {
        estado.nivel--;
        estado.errosConsecutivos = 0;
    }

    atualizarPlacar();

    // Visual
    const inputResp = document.getElementById('input-resposta');
    inputResp.classList.add('errado');
    setTimeout(() => inputResp.classList.remove('errado'), 600);
    inputResp.value = '';
    inputResp.focus();

    // Personagem triste
    const pers = document.getElementById('personagem');
    pers.classList.add('triste');
    setTimeout(() => pers.classList.remove('triste'), 800);

    // Fala
    document.getElementById('fala-personagem').textContent = IA.obterMsgErro();

    // Feedback
    document.getElementById('feedback-area').innerHTML =
        '<span style="color:#FFE066;font-weight:800;text-shadow:1px 1px 3px rgba(0,0,0,0.2);">Tente de novo!</span>';
}

function proximoExercicio() {
    gerarExercicio();
    document.getElementById('fala-personagem').textContent = 'Vamos para a proxima!';
}

function atualizarPlacar() {
    document.getElementById('estrelas').innerHTML = `&#9733; ${estado.estrelas}`;
    document.getElementById('nivel-display').textContent = `Nivel ${estado.nivel}`;
}

// ==================== CONFETTI ====================
function lancarConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cores = ['#FADE6B', '#5BC0EB', '#E8994E', '#2ECC71', '#E74C3C', '#9B59B6', '#F39C12', '#1ABC9C'];
    const particulas = [];

    for (let i = 0; i < 80; i++) {
        particulas.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: Math.random() * -14 - 4,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            cor: cores[Math.floor(Math.random() * cores.length)],
            rotacao: Math.random() * 360,
            vr: (Math.random() - 0.5) * 10,
            vida: 1
        });
    }

    let frame = 0;
    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let ativo = false;

        particulas.forEach(p => {
            if (p.vida <= 0) return;
            ativo = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3;
            p.rotacao += p.vr;
            p.vida -= 0.012;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotacao * Math.PI / 180);
            ctx.globalAlpha = p.vida;
            ctx.fillStyle = p.cor;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        frame++;
        if (ativo && frame < 120) {
            requestAnimationFrame(animar);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animar();
}

function criarParticulasAcerto() {
    const emojis = ['\u2B50', '\u{1F389}', '\u{1F31F}', '\u{1F3C6}', estado.personagemEmoji];
    for (let i = 0; i < 6; i++) {
        const el = document.createElement('div');
        el.className = 'particula';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = (Math.random() * 60 + 20) + 'vw';
        el.style.top = (Math.random() * 40 + 30) + 'vh';
        el.style.setProperty('--dx', (Math.random() - 0.5) * 200 + 'px');
        el.style.setProperty('--dy', -(Math.random() * 200 + 50) + 'px');
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1300);
    }
}

// ==================== UTILITARIOS ====================
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Enter para verificar
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const paginaJogo = document.getElementById('pagina-jogo');
        if (paginaJogo.classList.contains('ativa')) {
            const btnVerificar = document.getElementById('btn-verificar');
            const btnProximo = document.getElementById('btn-proximo');
            if (btnProximo.style.display !== 'none') {
                proximoExercicio();
            } else {
                verificarResposta();
            }
        }
        const paginaHiperfoco = document.getElementById('pagina-hiperfoco');
        if (paginaHiperfoco.classList.contains('ativa')) {
            definirHiperfoco();
        }
    }
});
