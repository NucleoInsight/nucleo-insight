/*
 * enhancements.js - Cérebro Central (Quiz, Timer, Login e Admin)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ============================================================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyCFnz5Wis_b3CGGblNn-bfUjqEgTOlqGNE",
  authDomain: "nucleoinsight-e4566.firebaseapp.com",
  projectId: "nucleoinsight-e4566",
  storageBucket: "nucleoinsight-e4566.firebasestorage.app",
  messagingSenderId: "650150743348",
  appId: "1:650150743348:web:f62f3cc95a38a5e90ca961",
  measurementId: "G-M24P3TBP5J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAILS = ["gilvanxavierborges@gmail.com", "contatogilvannborges@gmail.com"];

// ============================================================================
// FUNÇÃO DE SALVAMENTO DO FUNIL (IMPEDE VOLTAR PRO QUIZ)
// ============================================================================
function forceShowProtocol() {
    console.log("Executando troca de tela forçada...");
    
    // 1. Tenta usar a função global de abas se ela existir
    if (window.switchTab) {
        window.switchTab('protocolo');
    } else {
        // 2. Se não existir, escondemos os containers do quiz manualmente
        const containers = ['quiz-container', 'processing-container', 'result-container'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.display = 'none';
        });
        
        // 3. Tenta mostrar o container do protocolo (se o ID for esse)
        const prot = document.getElementById('protocolo-container') || document.getElementById('protocolo');
        if(prot) {
            prot.style.display = 'block';
            prot.classList.remove('hidden');
        } else {
            // Caso extremo: Se não houver aba, redireciona para a página de vendas do Upsell
            console.warn("Aba não encontrada, redirecionando para checkout...");
            // window.location.href = "LINK_DO_SEU_UPSELL_AQUI"; 
        }
    }
}

// ============================================================================
// 1. LÓGICA DO QUIZ
// ============================================================================
const RESULTS = {
    ansiosa: { title: "A Ansiosa Disponível", desc: "Você ensinou que seu tempo vale menos." },
    controladora: { title: "A Investigadora Emocional", desc: "Sufocamento silencioso detectado." },
    desvalorizada: { title: "A Doadora Excessiva", desc: "Você dá 100% e recebe 20%." }
};

window.finishQuizFlow = function(answers) {
    const quizContainer = document.getElementById('quiz-container');
    const processingContainer = document.getElementById('processing-container');
    const resultContainer = document.getElementById('result-container');

    if(quizContainer) quizContainer.classList.add('hidden');
    if(processingContainer) processingContainer.classList.remove('hidden');

    let p = 0;
    const int = setInterval(() => {
        p += 10;
        if(document.getElementById('process-pct')) document.getElementById('process-pct').innerText = p + '%';
        if(p >= 100) {
            clearInterval(int);
            const perfil = defineProfile(answers);
            if(document.getElementById('result-title')) document.getElementById('result-title').innerHTML = perfil.title;
            if(document.getElementById('result-description')) document.getElementById('result-description').innerHTML = perfil.desc;

            if(processingContainer) processingContainer.classList.add('hidden');
            if(resultContainer) resultContainer.classList.remove('hidden');
            startTimer(600, document.getElementById('countdown-timer'));
        }
    }, 200);
};

function defineProfile(answers) {
    const text = answers.join(" ").toLowerCase();
    if (text.includes("imediatamente")) return RESULTS.ansiosa;
    if (text.includes("sei tudo")) return RESULTS.controladora;
    return RESULTS.desvalorizada;
}

function startTimer(duration, display) {
    if(!display) return;
    var timer = duration, minutes, seconds;
    setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        display.textContent = (minutes < 10 ? "0"+minutes : minutes) + ":" + (seconds < 10 ? "0"+seconds : seconds);
        if (--timer < 0) timer = 0;
    }, 1000);
}

// ============================================================================
// 2. LÓGICA DE LOGIN E REDIRECIONAMENTO (O CORAÇÃO DO SISTEMA)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById('btn-login-action');
    const btnAdmin = document.getElementById('btn-admin-action');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (ADMIN_EMAILS.includes(user.email) && btnAdmin) {
                btnAdmin.classList.remove('hidden-force');
            }

            // OUVINTE EM TEMPO REAL: Se mudar no Firebase, troca a tela na hora
            onSnapshot(doc(db, "users", user.email), (snapshot) => {
                const data = snapshot.data();
                if (data && data.status === "premium") {
                    console.log("Pagamento detectado no Firebase!");
                    forceShowProtocol();
                }
            });
        }
    });

    if (btnLogin) {
        btnLogin.addEventListener("click", async (e) => {
            e.preventDefault(); // Impede o navegador de dar reload no clique
            btnLogin.innerText = "Verificando...";
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
            } catch (error) {
                alert("Erro: " + error.message);
                btnLogin.innerText = "Já fiz o pagamento";
            }
        });
    }

    if (btnAdmin) {
        btnAdmin.addEventListener("click", async (e) => {
            e.preventDefault(); // FUNDAMENTAL: Impede o reload do botão
            const user = auth.currentUser;
            if (!user) return alert("Logue primeiro.");
            if (!confirm("Simular Pagamento?")) return;

            btnAdmin.innerText = "Gravando...";
            try {
                const userRef = doc(db, "users", user.email);
                // Atualiza o Firebase. O onSnapshot acima vai ver isso e mudar a tela.
                await setDoc(userRef, { status: "premium" }, { merge: true });
                btnAdmin.innerText = "Aprovado!";
            } catch (error) {
                alert(error.message);
            }
        });
    }
});
