import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Função para pular direto para o conteúdo
function LIBERAR_CONTEUDO() {
    const loader = document.getElementById('initial-auth-check');
    if(loader) loader.classList.add('hidden');
    
    const flow = document.getElementById('quiz-flow');
    if(flow) flow.classList.remove('hidden');

    const ids = ['quiz-container', 'processing-container', 'result-container'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });
    const prot = document.getElementById('protocolo');
    if(prot) {
        prot.classList.remove('hidden');
        prot.style.display = 'block';
    }
}

// Lógica de monitoramento de Login
onAuthStateChanged(auth, (user) => {
    const loader = document.getElementById('initial-auth-check');
    const flow = document.getElementById('quiz-flow');

    if (user) {
        // Usuário logado: Checa status no banco
        onSnapshot(doc(db, "users", user.email), (snapshot) => {
            if (snapshot.exists() && snapshot.data().status === 'premium') {
                // É PREMIUM: Pula tudo
                LIBERAR_CONTEUDO();
            } else {
                // LOGADO MAS NÃO COMPROU: Mostra o Quiz normal
                if(loader) loader.classList.add('hidden');
                if(flow) flow.classList.remove('hidden');
            }
        });
    } else {
        // NÃO LOGADO: Mostra o Quiz normal imediatamente
        if(loader) loader.classList.add('hidden');
        if(flow) flow.classList.remove('hidden');
    }
});

// Lógica do Quiz
window.finishQuizFlow = function(answers) {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('processing-container').classList.remove('hidden');
    let p = 0;
    const int = setInterval(() => {
        p += 10;
        document.getElementById('process-pct').innerText = p + '%';
        if(p >= 100) {
            clearInterval(int);
            document.getElementById('processing-container').classList.add('hidden');
            document.getElementById('result-container').classList.remove('hidden');
            document.getElementById('result-title').innerText = "Diagnóstico Pronto";
            document.getElementById('result-description').innerText = "Análise concluída com base no seu comportamento neural.";
            
            var t = 600, d = document.getElementById('countdown-timer');
            setInterval(() => {
                var m = parseInt(t/60), s = parseInt(t%60);
                if(d) d.textContent = (m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
                if(--t < 0) t = 0;
            }, 1000);
        }
    }, 200);
};
