import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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

const RESULTS = {
    ansiosa: { title: "A Ansiosa Disponível", desc: "Você ensinou que seu tempo vale menos. Ao responder rápido demais, desligou o instinto de 'caça' dele." },
    controladora: { title: "A Investigadora Emocional", desc: "Sua necessidade de controle gera um Sufocamento Silencioso. Ele se afasta para respirar." },
    desvalorizada: { title: "A Doadora Excessiva", desc: "Você entrega o prêmio antes da corrida. Ele não te respeita como desafio porque já te tem por completo." }
};

function LIBERAR_CONTEUDO() {
    // Esconde TUDO do fluxo do quiz e mostra o Portal Premium
    const flow = document.getElementById('quiz-flow');
    const ids = ['quiz-container', 'processing-container', 'result-container'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });
    
    const prot = document.getElementById('protocolo');
    if(prot) {
        prot.classList.remove('hidden');
        prot.classList.add('fade-in');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            const textAnswers = answers.join(" ").toLowerCase();
            let perfil = RESULTS.ansiosa;
            if (textAnswers.includes("imediatamente")) perfil = RESULTS.ansiosa;
            else if (textAnswers.includes("sei tudo")) perfil = RESULTS.controladora;
            else perfil = RESULTS.desvalorizada;

            document.getElementById('processing-container').classList.add('hidden');
            document.getElementById('result-container').classList.remove('hidden');
            document.getElementById('result-title').innerText = perfil.title;
            document.getElementById('result-description').innerHTML = perfil.desc;
            
            var t = 600, d = document.getElementById('countdown-timer');
            setInterval(() => {
                var m = parseInt(t/60), s = parseInt(t%60);
                if(d) d.textContent = (m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
                if(--t < 0) t = 0;
            }, 1000);
        }
    }, 200);
};

// VIGILANTE DE ACESSO: Se logar e tiver pago, abre o Portal na hora
onAuthStateChanged(auth, (user) => {
    if (user) {
        onSnapshot(doc(db, "users", user.email), (snapshot) => {
            if (snapshot.exists() && snapshot.data().status === 'premium') {
                LIBERAR_CONTEUDO();
            }
        });
    }
});

const btnLogin = document.getElementById('btn-login-manual');
if (btnLogin) {
    btnLogin.onclick = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (e) {
            console.error("Login cancelado");
        }
    };
}
