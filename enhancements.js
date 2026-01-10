/*
 * enhancements.js - Cérebro Central (Quiz, Timer, Login e Admin)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ============================================================================
// CONFIGURAÇÃO DO FIREBASE (ATUALIZADA)
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

// Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAILS = ["gilvanxavierborges@gmail.com", "contatogilvannborges@gmail.com"];

// ============================================================================
// 1. LÓGICA DO QUIZ E RESULTADO
// ============================================================================
const RESULTS = {
    ansiosa: {
        title: "A Ansiosa Disponível",
        desc: "Você inconscientemente ensinou a ele que <strong>o seu tempo vale menos que o dele</strong>. Ao responder rápido demais e aceitar migalhas, você desligou o instinto de 'caça' no cérebro dele. A boa notícia? Esse é o padrão mais fácil de reverter com a técnica de Escassez Programada."
    },
    controladora: {
        title: "A Investigadora Emocional",
        desc: "Sua necessidade de saber tudo e controlar os passos dele está gerando um efeito de <strong>Sufocamento Silencioso</strong>. Ele sente que perdeu a liberdade e, por instinto, se afasta para respirar. Você precisa aprender a soltar a corda para ele vir até sua mão."
    },
    desvalorizada: {
        title: "A Doadora Excessiva",
        desc: "Você dá 100% e recebe 20%. O desequilíbrio está óbvio. Ele gosta de você, mas <strong>não te respeita como desafio</strong>. Homens valorizam aquilo que custa caro (emocionalmente) para conquistar. Você entregou o prêmio antes da corrida acabar."
    }
};

window.finishQuizFlow = function(answers) {
    const quizContainer = document.getElementById('quiz-container');
    const processingContainer = document.getElementById('processing-container');
    const resultContainer = document.getElementById('result-container');

    quizContainer.classList.add('hidden');
    processingContainer.classList.remove('hidden');

    let p = 0;
    const int = setInterval(() => {
        p += Math.floor(Math.random() * 15);
        if(p > 100) p = 100;
        document.getElementById('process-pct').innerText = p + '%';
        
        if(p === 100) {
            clearInterval(int);
            const perfil = defineProfile(answers);
            document.getElementById('result-title').innerHTML = perfil.title;
            document.getElementById('result-description').innerHTML = perfil.desc;

            setTimeout(() => {
                processingContainer.classList.add('hidden');
                resultContainer.classList.remove('hidden');
                startTimer(600, document.getElementById('countdown-timer'));
                if(window.fbq) window.fbq('track', 'ViewContent', { content_name: perfil.title });
            }, 800);
        }
    }, 250);
};

function defineProfile(answers) {
    const textAnswers = answers.join(" ").toLowerCase();
    if (textAnswers.includes("imediatamente") || textAnswers.includes("medo")) return RESULTS.ansiosa;
    if (textAnswers.includes("sei tudo") || textAnswers.includes("stalkei")) return RESULTS.controladora;
    if (textAnswers.includes("cancelei") || textAnswers.includes("deixei de fazer")) return RESULTS.desvalorizada;
    return RESULTS.ansiosa;
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) timer = 0;
    }, 1000);
}

// ============================================================================
// 2. LÓGICA DE LOGIN, PAGAMENTO E ADMIN
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById('btn-login-action');
    const btnAdmin = document.getElementById('btn-admin-action');

    // Monitoramento em tempo real do status para redirecionamento automático
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (ADMIN_EMAILS.includes(user.email)) {
                btnAdmin.classList.remove('hidden-force');
            }

            // OUVINTE EM TEMPO REAL: Detecta se o status virou "premium" no Firebase
            onSnapshot(doc(db, "users", user.email), (snapshot) => {
                const data = snapshot.data();
                // Se pagou o diagnóstico mas não o protocolo, envia para a aba de Upsell
                if (data && data.status === "premium" && data.protocol !== "active") {
                    if (window.switchTab) {
                        console.log("Status Premium detectado. Redirecionando para Upsell...");
                        // Removemos o reload aqui para manter o estado da página
                        setTimeout(() => window.switchTab('protocolo'), 800);
                    }
                }
            });
        }
    });

    if (btnLogin) {
        btnLogin.addEventListener("click", async () => {
            const originalText = btnLogin.innerHTML;
            btnLogin.innerHTML = "Verificando...";

            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                if (ADMIN_EMAILS.includes(user.email)) {
                    alert("Modo Admin Ativado! Use o botão secreto para simular.");
                    btnAdmin.classList.remove('hidden-force');
                    btnLogin.innerHTML = originalText;
                    return;
                }

                const docRef = doc(db, "users", user.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().status === 'premium') {
                    btnLogin.innerHTML = "Sucesso! Entrando...";
                    // Mantido reload rápido apenas para login manual de quem já pagou
                    setTimeout(() => window.location.reload(), 500);
                } else {
                    alert(`Pagamento não encontrado para ${user.email}. Se pagou agora, aguarde 1 minuto.`);
                    btnLogin.innerHTML = "Tentar Novamente";
                }
            } catch (error) {
                alert("Erro: " + error.message);
                btnLogin.innerHTML = originalText;
            }
        });
    }

    if (btnAdmin) {
        btnAdmin.addEventListener("click", async () => {
            const user = auth.currentUser;
            if (!user) return alert("Faça login primeiro.");
            if (!confirm(`Simular R$27 para ${user.email}?`)) return;

            try {
                btnAdmin.innerHTML = "Processando...";
                const userRef = doc(db, "users", user.email);
                
                // GRAVA NO BANCO: O onSnapshot acima vai detectar isso e trocar de aba sozinho!
                await setDoc(userRef, { status: "premium" }, { merge: true });
                
                alert("✅ Compra Simulada! O sistema vai te redirecionar em 1 segundo.");
                
                // RESET DO BOTÃO (Sem dar reload na página inteira)
                btnAdmin.innerHTML = "👑 Admin: Simular Compra Aprovada";
                
            } catch (error) {
                alert("Erro: " + error.message);
                btnAdmin.innerHTML = "Erro";
            }
        });
    }
});
