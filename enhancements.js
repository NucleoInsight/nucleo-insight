import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

function LIBERAR_CONTEUDO() {
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
    window.scrollTo(0,0);
}

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
            document.getElementById('result-title').innerText = "Análise Neural Concluída";
            document.getElementById('result-description').innerText = "Identificamos padrões de alta reatividade emocional no seu perfil.";
            
            var t = 600, d = document.getElementById('countdown-timer');
            setInterval(() => {
                var m = parseInt(t/60), s = parseInt(t%60);
                if(d) d.textContent = (m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
                if(--t < 0) t = 0;
            }, 1000);
        }
    }, 200);
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Monitora o status no banco de dados. 
        // Se já for premium (seu caso), o LIBERAR_CONTEUDO() abre a tela na hora.
        onSnapshot(doc(db, "users", user.email), (snapshot) => {
            if (snapshot.exists() && snapshot.data().status === 'premium') {
                LIBERAR_CONTEUDO();
            }
        });
    }
});

const btnLogin = document.getElementById('btn-login-action');
if (btnLogin) {
    btnLogin.onclick = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (e) {
            console.error("Erro no login");
        }
    };
}
