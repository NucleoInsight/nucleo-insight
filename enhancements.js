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
    controladora: { title: "A Investigadora Emocional", desc: "Sua necessidade de saber tudo gera um Sufocamento Silencioso. Ele se afasta para respirar por instinto." },
    desvalorizada: { title: "A Doadora Excessiva", desc: "Você dá 100% e recebe 20%. Ele não te respeita como desafio porque você entregou o prêmio antes da corrida começar." }
};

function LIBERAR_CONTEUDO(userData) {
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

    const upsellBox = document.getElementById('upsell-container');
    if(userData.protocol === "active") {
        upsellBox.innerHTML = `
            <div class="glass-card p-8 rounded-3xl border border-emerald-500/30">
                <h2 class="text-xl font-bold text-emerald-400 mb-4">✅ Protocolo Secreto Liberado</h2>
                <p class="text-slate-300 text-sm leading-relaxed">Você agora tem acesso à Reversão de Polaridade. <br><br> <strong>Próximo Passo:</strong> Use o gatilho da negação nas próximas 24 horas para forçar o contato.</p>
            </div>`;
    } else {
        upsellBox.innerHTML = `
            <div class="bg-gradient-to-br from-purple-900 via-black to-purple-900 p-8 rounded-3xl border-2 border-purple-400/50 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 bg-pink-600 text-[8px] font-bold px-3 py-1 uppercase tracking-widest">Acesso Restrito</div>
                <span class="text-pink-300 text-[10px] font-bold uppercase tracking-widest">Oportunidade Única</span>
                <h2 class="text-2xl font-black text-white mt-2 mb-4 leading-tight text-left">Protocolo Secreto 2.0:<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Reversão de Polaridade</span></h2>
                <p class="text-slate-300 text-sm mb-6 text-left">O Guia 1 parou seus erros. O <strong>Protocolo 2.0</strong> é a arma final para <strong>forçar o contato dele em até 24h</strong>, invertendo o jogo e fazendo ele implorar por sua atenção.</p>
                <a href="https://nucleoinsight.github.io/nucleo-insight/upsell.html" class="inline-block w-full bg-white text-purple-900 font-black px-6 py-4 rounded-xl text-center shadow-white/10 shadow-lg transform active:scale-95 transition">ATIVAR PROTOCOLO 2.0</a>
                <p class="text-[10px] text-slate-400 mt-4 text-center">De <span class="line-through">R$ 197</span> por apenas <span class="text-emerald-400 font-bold text-lg">R$ 47</span></p>
            </div>`;
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
            const perfil = (answers.join(" ").length % 3 === 0) ? RESULTS.ansiosa : RESULTS.desvalorizada;
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

const btnLogin = document.getElementById('btn-login-manual');
if (btnLogin) {
    btnLogin.onclick = async () => {
        try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { console.error(e); }
    };
}
