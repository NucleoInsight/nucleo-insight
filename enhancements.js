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
    ansiosa: { title: "A Ansiosa Disponível", desc: "Você ensinou a ele que seu tempo vale menos que o dele. Ao responder rápido demais, você desligou o instinto de 'caça' e tirou o prazer da conquista." },
    desvalorizada: { title: "A Doadora Excessiva", desc: "Você dá 100% e recebe 20%. Ele não te respeita como um desafio porque você entregou o prêmio antes mesmo da corrida começar." }
};

function LIBERAR_CONTEUDO(userData) {
    document.getElementById('quiz-flow').classList.add('hidden');
    const prot = document.getElementById('protocolo');
    prot.classList.remove('hidden');
    prot.style.display = 'block';

    const upsellBox = document.getElementById('upsell-container');

    if(userData.protocol === "active") {
        upsellBox.innerHTML = `
            <div class="glass-card p-8 rounded-[2.5rem] border border-emerald-500/30 bg-emerald-500/5">
                <h2 class="text-xl font-bold text-emerald-400 mb-2">Protocolo 2.0 Ativo</h2>
                <p class="text-slate-400 text-sm">Use o guia de Reversão Neural nos slides ao lado.</p>
            </div>`;
    } else {
        upsellBox.innerHTML = `
            <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2.5rem] blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                <div class="relative bg-slate-950 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <span class="inline-block bg-pink-500/20 text-pink-400 text-[9px] font-black uppercase px-3 py-1 rounded-full mb-4">Acesso Restrito</span>
                    <h2 class="text-2xl font-black text-white mb-4 leading-tight">O Protocolo Secreto 2.0: <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Reversão de Polaridade</span></h2>
                    <p class="text-slate-300 text-sm mb-6">O Produto 1 parou seus erros. O <b>Protocolo 2.0</b> força ele a te procurar em menos de 24 horas, invertendo o medo de perda.</p>
                    <div class="space-y-3 mb-8 text-xs text-slate-400">
                        <p>✓ Gatilho da "Punição Silenciosa"</p>
                        <p>✓ Técnica do Vácuo Estratégico</p>
                    </div>
                    <a href="https://pay.kiwify.com.br/cAMh7az" class="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-black py-4 rounded-2xl hover:scale-105 transition">ATIVAR PROTOCOLO 2.0</a>
                    <p class="text-[9px] text-center text-slate-600 mt-4 uppercase tracking-widest">Acesso Vitalício + Garantia de Resposta</p>
                </div>
            </div>`;
    }
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
            const perfil = (answers.join("").length % 2 === 0) ? RESULTS.ansiosa : RESULTS.desvalorizada;
            document.getElementById('processing-container').classList.add('hidden');
            document.getElementById('result-container').classList.remove('hidden');
            document.getElementById('result-title').innerText = perfil.title;
            document.getElementById('result-description').innerText = perfil.desc;

            let t = 600;
            setInterval(() => {
                let m = Math.floor(t/60), s = t%60;
                document.getElementById('countdown-timer').innerText = `${m<10?'0':''}${m}:${s<10?'0':''}${s}`;
                if(t > 0) t--;
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

const btn = document.getElementById('btn-login-manual');
if (btn) btn.onclick = async () => await signInWithPopup(auth, new GoogleAuthProvider());
