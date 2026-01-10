/*
 * enhancements.js - Versão Final Anti-Erro
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
// A FUNÇÃO QUE VAI FAZER FUNCIONAR NA MARRA
// ============================================================================
function LIBERAR_PROTOCOLO_AGORA() {
    console.log("Limpando interface e liberando protocolo...");
    
    // 1. Esconde TUDO que for do Quiz/Resultado usando Style Direto (Mais forte que classes)
    const fluxos = ['quiz-flow', 'quiz-container', 'processing-container', 'result-container', 'paywall-overlay'];
    fluxos.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.setAttribute('style', 'display: none !important');
            el.classList.add('hidden');
        }
    });

    // 2. Procura a seção do Protocolo e FORÇA ela a aparecer
    // Tentamos os 3 IDs possíveis que você pode ter usado
    const secoes = ['protocolo', 'protocolo-container', 'premium-content'];
    let achou = false;

    secoes.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.setAttribute('style', 'display: block !important; opacity: 1 !important; visibility: visible !important');
            el.classList.remove('hidden', 'blur-secret');
            achou = true;
        }
    });

    if(!achou) {
        alert("Acesso Liberado! O conteúdo está logo abaixo ou na aba Protocolo.");
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// LÓGICA DO QUIZ
// ============================================================================
window.finishQuizFlow = function(answers) {
    const quiz = document.getElementById('quiz-container');
    const proc = document.getElementById('processing-container');
    const res = document.getElementById('result-container');

    if(quiz) quiz.classList.add('hidden');
    if(proc) proc.classList.remove('hidden');

    let p = 0;
    const int = setInterval(() => {
        p += 10;
        if(document.getElementById('process-pct')) document.getElementById('process-pct').innerText = p + '%';
        if(p >= 100) {
            clearInterval(int);
            if(proc) proc.classList.add('hidden');
            if(res) res.classList.remove('hidden');
            
            // Pega o título do resultado (simples para não dar erro)
            const title = document.getElementById('result-title');
            if(title) title.innerText = "Análise Concluída";
            
            // Timer
            var timer = 600, display = document.getElementById('countdown-timer');
            setInterval(() => {
                var m = parseInt(timer / 60, 10), s = parseInt(timer % 60, 10);
                if(display) display.textContent = (m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
                if (--timer < 0) timer = 0;
            }, 1000);
        }
    }, 200);
};

// ============================================================================
// EVENTOS DOS BOTÕES
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById('btn-login-action');
    const btnAdmin = document.getElementById('btn-admin-action');

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

                const docSnap = await getDoc(doc(db, "users", user.email));
                if (docSnap.exists() && docSnap.data().status === 'premium') {
                    btnLogin.innerHTML = "🔓 ACESSAR AGORA";
                    btnLogin.style.cssText = "background-color: #16a34a !important; color: white !important; font-weight: bold;";
                    btnLogin.onclick = (ev) => { ev.preventDefault(); LIBERAR_PROTOCOLO_AGORA(); };
                } else {
                    alert("Pagamento não encontrado.");
                    btnLogin.innerText = "Já fiz o pagamento";
                }
            } catch (err) { btnLogin.innerText = "Erro ao logar"; }
        });
    }

    if (btnAdmin) {
        btnAdmin.addEventListener("click", async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            if(!user) return alert("Logue primeiro!");

            try {
                btnAdmin.innerText = "Liberando...";
                await setDoc(doc(db, "users", user.email), { status: "premium" }, { merge: true });
                
                btnAdmin.innerHTML = "🔥 APROVADO! ENTRAR NO PROTOCOLO";
                btnAdmin.style.cssText = "background-color: #9333ea !important; color: white !important; font-weight: bold;";
                btnAdmin.onclick = (ev) => { ev.preventDefault(); LIBERAR_PROTOCOLO_AGORA(); };
            } catch (err) { alert(err.message); }
        });
    }
});
