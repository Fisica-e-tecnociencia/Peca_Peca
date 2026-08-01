// 1. Importando as "varinhas mágicas" do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. COLE AQUI A SUA CONFIGURAÇÃO DO FIREBASE
// (Aquelas chaves que o Firebase te dá quando você cria o projeto lá no site deles)
const firebaseConfig = {
    apiKey: "AIzaSyCp_AUfhRJexk9foyx04E-LvMZ0JPWzMIs",
    authDomain: "projetos-pecaporpeca.firebaseapp.com",
    projectId: "projetos-pecaporpeca",
    storageBucket: "projetos-pecaporpeca.firebasestorage.app",
    messagingSenderId: "548296185982",
    appId: "1:548296185982:web:45d5aa51c76b5231a1602f"
  };

// Ligando o banco de dados
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Pegando os elementos que etiquetamos no HTML
const inputNome = document.getElementById("nome-cadastro");
const inputEmail = document.getElementById("email-cadastro");
const btnCadastrar = document.getElementById("btn-cadastrar");

// 4. A ação que acontece quando clicam no botão CADASTRAR
btnCadastrar.addEventListener("click", async () => {
    // Pegamos o que foi digitado e tiramos espaços em branco das pontas
    const nomeDigitado = inputNome.value.trim();
    const emailDigitado = inputEmail.value.trim();

    // Checando se a pessoa não deixou tudo em branco
    if(nomeDigitado === "" || emailDigitado === "") {
        alert("Por favor, preencha todos os campos antes de cadastrar!");
        return; // Para a mágica aqui se estiver vazio
    }

    // A MÁGICA DE CHECAGEM NO FIREBASE:
    // "Ei Firebase, vá na gaveta 'usuarios' e procure alguém com esse nome"
    const usuariosRef = collection(db, "usuarios");
    const pesquisa = query(usuariosRef, where("nome", "==", nomeDigitado));
    const resultado = await getDocs(pesquisa);

    if (!resultado.empty) {
        // Se o resultado NÃO estiver vazio, alguém já tem esse nome!
        alert("Poxa, esse nome de jogador já existe! Que tal colocar um número no final ou tentar outro nome?");
    } else {
        // Se o resultado estiver vazio, o nome está livre! Vamos criar a conta.
        try {
            // Salvando no banco de dados
            await setDoc(doc(usuariosRef, nomeDigitado), {
                nome: nomeDigitado,
                email: emailDigitado
            });
            
            Swal.fire({
                title: "Aêêê! 🎉",
                text: "Conta criada! Agora vamos montar seu personagem?",
                icon: "success",
                confirmButtonColor: "#00a000"
              }).then(() => {
                // Isso manda direto para a tela do avatar
                window.location.href = "operacao.html";
              });
            
            
        } catch (erro) {
            console.error("Erro ao salvar:", erro);
            alert("Ops, deu um errinho de conexão. Tente novamente!");
        }
    }
});
