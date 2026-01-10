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

// Variável para saber se o usuário está vendo o resultado
window.isAtResultStage = false;

// ============================================================================
// FUNÇÃO DE TROCA DE TELA (PROTEGIDA)
// ============================================================================
function forceShowProtocol() {
    console.log("Acionando transição para o Protocolo...");
    
    // Se estiver no modo teste ou for admin, e não estiver na tela de resultado, 
    // não forçamos a saída para permitir testar o quiz.
    const isTesting = new URLSearchParams(window.location.search).get('mode') === 'test';
    if (isTesting && !window.isAtResultStage) return;

    if (window.switchTab) {
        window.switchTab('protocolo');
    } else {
        const toHide = ['quiz-container', 'processing-container', 'result-container'];
        toHide.forEach(id => {
            const el = document.getElementById(id);
            if(el) { el.style.display = 'none'; el.classList.add('hidden'); }
        });
        
        const prot = document.getElementById('protocolo-container') || document.getElementById('protocolo');
        if(prot) {
            prot.style.display = 'block';
            prot.classList.remove('hidden');
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
    window.isAtResultStage = true; // Agora o sistema sabe que pode redirecionar se for pago
    
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
            
            // Verifica se já é premium para pular logo
            checkPremiumStatus();
        }
    }, 200);
};

function checkPremiumStatus() {
    const user = auth.currentUser;
    if (user) {
        getDoc(doc(db, "users", user.email)).then(docSnap => {
            if (docSnap.exists() && docSnap.data().status === 'premium') {
                setTimeout(() => forceShowProtocol(), 1500);
            }
        });
    }
}

function defineProfile(answers) {
    const text = answers.join(" ").toLowerCase();
    if (text.includes("imediatamente")) return RESULTS.ansiosa;
    if (text.includes("sei tudo")) return RESULTS.controladora;
    return RESULTS.desvalorizada;
}

// ============================================================================
// 2. LÓGICA DE LOGIN E ADMIN
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById('btn-login-action');
    const btnAdmin = document.getElementById('btn-admin-action');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (ADMIN_EMAILS.includes(user.email) && btnAdmin) {
                btnAdmin.classList.remove('hidden-force');
            }

            // OUVINTE EM TEMPO REAL: Só age se o usuário estiver na fase de resultado
            onSnapshot(doc(db, "users", user.email), (snapshot) => {
                const data = snapshot.data();
                if (data && data.status === "premium" && window.isAtResultStage) {
                    forceShowProtocol();
                }
            });
        }
    });

    if (btnLogin) {
        btnLogin.addEventListener("click", async (e) => {
            e.preventDefault();
            btnLogin.innerText = "Verificando...";
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
                btnLogin.innerText = "Já fiz o pagamento";
            } catch (error) {
                console.error(error);
                btnLogin.innerText = "Já fiz o pagamento";
            }
        });
    }

    if (btnAdmin) {
        btnAdmin.addEventListener("click", async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user) return alert("Logue primeiro.");
            
            btnAdmin.innerText = "Processando...";
            try {
                const userRef = doc(db, "users", user.email);
                await setDoc(userRef, { status: "premium" }, { merge: true });
                btnAdmin.innerText = "Aprovado!";
                window.isAtResultStage = true; // Força a permissão de troca de tela
                setTimeout(() => forceShowProtocol(), 500);
            } catch (error) {
                alert(error.message);
                btnAdmin.innerText = "Simular Compra";
            }
        });
    }
});
