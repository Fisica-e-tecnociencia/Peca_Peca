// 1. Importando as ferramentas do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. COLE AQUI A SUA CONFIGURAÇÃO DO FIREBASE (Igualzinho fez no cadastro.js)
const firebaseConfig = {
    apiKey: "AIzaSyCp_AUfhRJexk9foyx04E-LvMZ0JPWzMIs",
    authDomain: "projetos-pecaporpeca.firebaseapp.com",
    projectId: "projetos-pecaporpeca",
    storageBucket: "projetos-pecaporpeca.firebasestorage.app",
    messagingSenderId: "548296185982",
    appId: "1:548296185982:web:45d5aa51c76b5231a1602f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const inputNome = document.getElementById("nome-login");
const inputEmail = document.getElementById("email-login");
const btnEntrar = document.getElementById("btn-entrar");
// Ligando o banco de dados
btnEntrar.addEventListener("click", async () => {
    const nomeDigitado = inputNome.value.trim();
    const emailDigitado = inputEmail.value.trim();

    if(nomeDigitado === "" || emailDigitado === "") {
        alert("Por favor, preencha tudo!");
        return; 
    }

    try {
        const docRef = doc(db, "usuarios", nomeDigitado);
        const gaveta = await getDoc(docRef);

        if (gaveta.exists()) {
            const dadosDoJogador = gaveta.data();
            
            if (dadosDoJogador.email === emailDigitado) {
                // Se estiver usando SweetAlert:
                // Swal.fire("Sucesso!", "Bem-vindo!", "success").then(() => { window.location.href = "avatar.html"; });
                
                // Se estiver usando o alert comum:
                alert("Bem-vindo de volta!");
                window.location.href = "operacao.html"; 
            } else {
                alert("E-mail incorreto!");
            }
        } else {
            alert("Jogador não encontrado!");
        }
    } catch (erro) {
        console.error("Erro ao entrar:", erro);
        alert("Algo deu errado na conexão!");
    }
});
