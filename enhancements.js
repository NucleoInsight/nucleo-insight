/*
 * enhancements.js - Cérebro Central (Quiz, Timer, Login e Admin)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
// 1. LÓGICA DO QUIZ (SEM MUDANÇA DE TELA AUTOMÁTICA)
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
            
            // Inicia o timer de 10 minutos
            var display = document.getElementById('countdown-timer');
            var timer = 600;
            setInterval(() => {
                var min = parseInt(timer / 60, 10);
                var sec = parseInt(timer % 60, 10);
                if(display) display.textContent = (min < 10 ? "0"+min : min) + ":" + (sec < 10 ? "0"+sec : sec);
                if (--timer < 0) timer = 0;
            }, 1000);
        }
    }, 200);
};

function defineProfile(answers) {
    const text = answers.join(" ").toLowerCase();
    if (text.includes("imediatamente")) return RESULTS.ansiosa;
    if (text.includes("sei tudo")) return RESULTS.controladora;
    return RESULTS.desvalorizada;
}

// ============================================================================
// 2. LÓGICA DE LOGIN E ADMIN (MUDANÇA APENAS SOB COMANDO)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById('btn-login-action');
    const btnAdmin = document.getElementById('btn-admin-action');

    // Monitora login apenas para mostrar o botão de admin
    onAuthStateChanged(auth, (user) => {
        if (user && ADMIN_EMAILS.includes(user.email) && btnAdmin) {
            btnAdmin.classList.remove('hidden-force');
        }
    });

    if (btnLogin) {
        btnLogin.addEventListener("click", async (e) => {
            e.preventDefault();
            btnLogin.innerText = "Verificando...";
            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                // Verifica status de pagamento
                const docSnap = await getDoc(doc(db, "users", user.email));
                if (docSnap.exists() && docSnap.data().status === 'premium') {
                    // SE PAGOU: Muda o botão para "ACESSAR PROTOCOLO" em vez de mudar a tela sozinho
                    btnLogin.innerHTML = "🔓 ACESSAR PROTOCOLO AGORA";
                    btnLogin.classList.replace('bg-white/5', 'bg-green-600');
                    btnLogin.onclick = () => { if(window.switchTab) window.switchTab('protocolo'); };
                } else {
                    alert("Pagamento não identificado para: " + user.email);
                    btnLogin.innerText = "Já fiz o pagamento";
                }
            } catch (error) {
                btnLogin.innerText = "Já fiz o pagamento";
            }
        });
    }

    if (btnAdmin) {
        btnAdmin.addEventListener("click", async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user) return alert("Logue primeiro.");
            
            btnAdmin.innerText = "Simulando...";
            try {
                // 1. Atualiza o Firebase
                await setDoc(doc(db, "users", user.email), { status: "premium" }, { merge: true });
                
                // 2. Transforma o botão de Admin em um botão de navegação
                btnAdmin.innerText = "✅ APROVADO! CLIQUE PARA IR AO UPSELL";
                btnAdmin.classList.replace('border-slate-700', 'bg-purple-600');
                btnAdmin.onclick = () => { if(window.switchTab) window.switchTab('protocolo'); };
                
                alert("Simulação concluída. O botão acima agora te levará ao Upsell.");
            } catch (error) {
                alert(error.message);
                btnAdmin.innerText = "Simular Compra";
            }
        });
    }
});
