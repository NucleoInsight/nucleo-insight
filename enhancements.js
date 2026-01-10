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
    ansiosa: { title: "A Ansiosa Disponível", desc: "Você ensinou a ele que seu tempo vale menos. Ao responder rápido demais, desligou o instinto de 'caça' dele." },
    controladora: { title: "A Investigadora Emocional", desc: "Sua necessidade de controle gera um Sufocamento Silencioso. Ele se afasta para respirar por instinto." },
    desvalorizada: { title: "A Doadora Excessiva", desc: "Você entrega o prêmio antes da corrida. Ele não te respeita como desafio." }
};

function LIBERAR_CONTEUDO(userData) {
    document.getElementById('quiz-flow').classList.remove('p-4', 'items-center', 'justify-center'); // Ajusta layout para portal
    
    const ids = ['quiz-container', 'processing-container', 'result-container'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });
    
    document.getElementById('protocolo').classList.remove('hidden');

    // ESTRATÉGIA DE VENDA UPSELL
    const upsellBox = document.getElementById('upsell-container');
    if(userData.protocol === "active") {
        // CONTEÚDO LIBERADO (PRODUTO 2)
        upsellBox.innerHTML = `
            <div class="glass-card p-8 rounded-[2rem] border border-emerald-500/30 fade-in">
                <h2 class="text-2xl font-bold text-white mb-4">✅ Protocolo Secreto: Ativado</h2>
                <p class="text-slate-300 text-sm leading-relaxed mb-6">
                    <strong>Fase Final: A Reversão de Polaridade.</strong><br>
                    O objetivo agora é gerar um pânico subconsciente de perda no cérebro dele. Siga as instruções das imagens acima e aplique o gatilho de negação.
                </p>
            </div>`;
    } else {
        // OFERTA AGRESSIVA (VENDA DO PRODUTO 2)
        upsellBox.innerHTML = `
            <div class="bg-gradient-to-br from-purple-600 via-purple-900 to-black p-8 rounded-[2rem] border-2 border-purple-400/50 shadow-2xl fade-in">
                <span class="text-pink-400 text-[10px] font-bold uppercase tracking-widest mb-4 block">Expansão de Acesso</span>
                <h2 class="text-3xl font-extrabold text-white mb-4 leading-tight">O Protocolo Secreto:<br>Reversão de Polaridade</h2>
                <p class="text-slate-300 text-sm mb-6">
                    O Produto 1 te ensinou a parar de errar. Mas para <strong>forçar uma resposta dele em menos de 24h</strong>, você precisa da peça que falta: a Reversão de Polaridade.
                </p>
                <ul class="space-y-3 mb-8 text-sm text-slate-400">
                    <li class="flex items-center gap-2">✔ Como fazer ele stalkear você obsessivamente.</li>
                    <li class="flex items-center gap-2">✔ O gatilho que inverte o jogo de poder.</li>
                </ul>
                <a href="https://pay.kiwify.com.br/cAMh7az" class="block w-full bg-white text-purple-900 text-center font-black py-4 rounded-2xl shadow-xl">
                    ADICIONAR PROTOCOLO SECRETO (PRODUTO 2)
                </a>
            </div>`;
    }
    window.scrollTo(0,0);
}

// ... Restante da lógica de Monitoramento de Login e Quiz igual ao anterior ...
// (Lembre de manter o onSnapshot e o finishQuizFlow)
