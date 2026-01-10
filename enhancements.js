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
    ansiosa: { title: "A Ansiosa Disponível", desc: "Você ensinou a ele que seu tempo vale menos que o dele. Ao responder rápido demais, desligou o instinto de 'caça' no cérebro dele." },
    controladora: { title: "A Investigadora Emocional", desc: "Sua necessidade de controle gera um Sufocamento Silencioso. Ele se afasta para respirar por instinto." },
    desvalorizada: { title: "A Doadora Excessiva", desc: "Você dá 100% e recebe 20%. Ele não te respeita como desafio porque você já se entregou por completo." }
};

function LIBERAR_CONTEUDO(userData) {
    document.getElementById('quiz-flow').classList.remove('items-center', 'justify-center');
    const ids = ['quiz-container', 'processing-container', 'result-container'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });
    
    document.getElementById('protocolo').classList.remove('hidden');

    const upsellBox = document.getElementById('upsell-container');

    // LÓGICA DE UPSELL (PRODUTO 2)
    if(userData.protocol === "active") {
        upsellBox.innerHTML = `
            <div class="glass-card p-8 rounded-3xl border border-emerald-500/30 fade-in">
                <h2 class="text-2xl font-bold text-white mb-4">✅ Protocolo Secreto Liberado</h2>
                <p class="text-slate-300 text-sm leading-relaxed mb-6">
                    <strong>Fase 02: Reversão de Polaridade Iniciada.</strong><br>
                    Você agora possui a chave para forçar uma resposta imediata. Siga o guia de gatilhos mentais avançados nos slides acima.
                </p>
            </div>`;
    } else {
        upsellBox.innerHTML = `
            <div class="bg-gradient-to-br from-purple-700 via-purple-950 to-black p-8 rounded-[2.5rem] border-2 border-purple-400/40 shadow-2xl fade-in text-center lg:text-left">
                <span class="text-pink-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Expansão Neural Vitalícia</span>
                <h2 class="text-3xl font-black text-white mb-4 leading-tight">O Protocolo Secreto:<br>Reversão de Polaridade</h2>
                <p class="text-slate-200 text-sm mb-6">
                    O Produto 1 parou seus erros. Mas para <strong>forçar o contato dele em 24h</strong>, você precisa da peça que falta: a técnica que inverte o jogo de poder e faz ELE ter medo de te perder.
                </p>
                <a href="https://pay.kiwify.com.br/cAMh7az" class="block w-full bg-white text-purple-900 text-center font-black py-4 rounded-2xl hover:scale-[1.02] transition shadow-2xl">
                    ADICIONAR PROTOCOLO SECRETO (PRODUTO 2)
                </a>
            </div>`;
    }
}

// O restante do monitoramento permanece igual
onAuthStateChanged(auth, (user) => {
    if (user) {
        onSnapshot(doc(db, "users", user.email), (snapshot) => {
            const data = snapshot.data();
            if (data && data.status === 'premium') {
                LIBERAR_CONTEUDO(data);
            }
        });
    }
});

// finishQuizFlow e Login manual
window.finishQuizFlow = function(answers) {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('processing-container').classList.remove('hidden');
    let p = 0;
    const int = setInterval(() => {
        p += 10;
        document.getElementById('process-pct').innerText = p + '%';
        if(p >= 100) {
            clearInterval(int);
            const perfil = (answers.join(" ").length % 3 === 0) ? RESULTS.ansiosa : RESULTS.desvalorizada;
            document.getElementById('processing-container').classList.add('hidden');
            document.getElementById('result-container').classList.remove('hidden');
            document.getElementById('result-title').innerText = perfil.title;
            document.getElementById('result-description').innerHTML = perfil.desc;
        }
    }, 200);
};

const btnLogin = document.getElementById('btn-login-manual');
if (btnLogin) {
    btnLogin.onclick = async () => {
        try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { console.error(e); }
    };
}
