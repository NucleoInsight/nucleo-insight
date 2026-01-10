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
    desvalorizada: { title: "A Doadora Excessiva", desc: "Você dá 100% e recebe 20%. Ele não te respeita como desafio porque você já se entregou por completo." }
};

function LIBERAR_CONTEUDO(userData) {
    const ids = ['quiz-container', 'processing-container', 'result-container'];
    ids.forEach(id => { if(document.getElementById(id)) document.getElementById(id).classList.add('hidden'); });
    
    const prot = document.getElementById('protocolo');
    if(prot) prot.classList.remove('hidden');

    const upsellBox = document.getElementById('upsell-container');
    if(userData.protocol === "active") {
        upsellBox.innerHTML = `<div class="glass-card p-8 rounded-3xl border border-emerald-500/30 text-center"><h2 class="text-xl font-bold text-emerald-400">✅ Protocolo 2.0 Ativado</h2><p class="text-slate-300 text-sm mt-2">A Reversão de Polaridade está liberada nos slides acima.</p></div>`;
    } else {
        upsellBox.innerHTML = `
            <div class="bg-gradient-to-br from-purple-800 to-black p-8 rounded-[2.5rem] border-2 border-purple-400/40 shadow-2xl text-left relative overflow-hidden">
                <span class="text-pink-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Expansão Neural Vitalícia</span>
                <h2 class="text-2xl font-black text-white mb-4 leading-tight">O Protocolo Secreto:<br><span class="text-purple-300">Reversão de Polaridade</span></h2>
                <p class="text-slate-200 text-sm mb-6">O Guia 1 parou seus erros. O <b>Protocolo 2.0</b> força ele a te procurar em menos de 24h, invertendo o medo de perda visceral.</p>
                <a href="https://pay.kiwify.com.br/7B4m9iI" class="block w-full bg-white text-purple-900 text-center font-black py-4 rounded-2xl hover:scale-105 transition shadow-2xl">ATIVAR PROTOCOLO 2.0</a>
                <p class="text-[10px] text-center text-purple-400 mt-4 font-bold uppercase tracking-widest text-center">De R$ 197 por apenas R$ 47</p>
            </div>`;
    }
}

window.finishQuizFlow = function(answers) {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('processing-container').classList.remove('hidden');
    let p = 0;
    const int = setInterval(() => {
        p += 10; document.getElementById('process-pct').innerText = p + '%';
        if(p >= 100) {
            clearInterval(int);
            const perfil = (answers.join("").length % 2 === 0) ? RESULTS.ansiosa : RESULTS.desvalorizada;
            document.getElementById('processing-container').classList.add('hidden');
            document.getElementById('result-container').classList.remove('hidden');
            document.getElementById('result-title').innerText = perfil.title;
            document.getElementById('result-description').innerText = perfil.desc;
            let t = 600, d = document.getElementById('countdown-timer');
            setInterval(() => {
                let m = parseInt(t/60), s = parseInt(t%60);
                if(d) d.textContent = (m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
                if(--t < 0) t = 0;
            }, 1000);
        }
    }, 200);
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        onSnapshot(doc(db, "users", user.email), (snapshot) => {
            const data = snapshot.data();
            if (data && data.status === 'premium') LIBERAR_CONTEUDO(data);
        });
    }
});

const btnLogin = document.getElementById('btn-login-manual');
if (btnLogin) btnLogin.onclick = async () => { try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { console.error(e); } };
