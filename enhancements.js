import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

function LIBERAR_PROTOCOLO() {
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
            document.getElementById('result-title').innerText = "Análise Concluída";
            document.getElementById('result-description').innerText = "Identificamos padrões de alta reatividade emocional no seu perfil.";
        }
    }, 200);
};

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById('btn-login-action');
    const btnAdmin = document.getElementById('btn-admin-action');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (ADMIN_EMAILS.includes(user.email)) btnAdmin.classList.remove('hidden-force');
            
            // Monitora mudança no banco para liberar sozinho
            onSnapshot(doc(db, "users", user.email), (snap) => {
                if (snap.exists() && snap.data().status === 'premium') LIBERAR_PROTOCOLO();
            });
        }
    });

    if (btnLogin) {
        btnLogin.onclick = async () => {
            try {
                await signInWithPopup(auth, new GoogleAuthProvider());
            } catch (e) { alert("Erro ao conectar."); }
        };
    }

    if (btnAdmin) {
        btnAdmin.onclick = async () => {
            const user = auth.currentUser;
            if(!user) return alert("Logue primeiro!");
            await setDoc(doc(db, "users", user.email), { status: "premium" }, { merge: true });
            alert("✅ Compra Simulada!");
            LIBERAR_PROTOCOLO();
        };
    }
});
