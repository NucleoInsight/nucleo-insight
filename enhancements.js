// ... (Dentro da função LIBERAR_CONTEUDO) ...

const upsellBox = document.getElementById('upsell-container');
if(userData.protocol === "active") {
    // SE COMPROU O PRODUTO 2 (O COMPLEMENTO)
    upsellBox.innerHTML = `
        <div class="glass-card p-8 rounded-[2rem] border border-emerald-500/30 fade-in">
            <div class="flex items-center gap-3 mb-4">
                <span class="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Ativado</span>
                <h2 class="text-2xl font-bold text-white">O Protocolo Secreto 2.0</h2>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-6">
                <strong>Fase Final: A Reversão de Polaridade.</strong><br>
                O objetivo aqui não é apenas ele te mandar mensagem, é ele sentir um <strong>pânico subconsciente de te perder</strong>. Siga as instruções abaixo:
            </p>
            <div class="space-y-4">
                <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p class="text-white font-bold text-sm mb-1">Passo 01: O Gatilho da Negação</p>
                    <p class="text-slate-400 text-xs">Mande exatamente esta frase se ele visualizar e não responder...</p>
                </div>
                </div>
        </div>`;
} else {
    // SE NÃO COMPROU O PRODUTO 2 (VENDA AGRESSIVA)
    upsellBox.innerHTML = `
        <div class="bg-gradient-to-br from-purple-600 via-purple-900 to-black p-8 rounded-[2rem] border-2 border-purple-400/50 shadow-[0_0_50px_rgba(168,85,247,0.3)] relative overflow-hidden fade-in">
            <div class="relative z-10">
                <div class="flex items-center gap-2 text-pink-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                    Falta uma peça no seu quebra-cabeça
                </div>
                <h2 class="text-3xl font-extrabold text-white mb-4 leading-tight">O Protocolo Secreto:<br>A Reversão de Polaridade</h2>
                <p class="text-slate-200 text-sm mb-6 leading-relaxed">
                    O Produto 1 te ensinou a parar de errar. Mas o <strong>Protocolo Secreto</strong> é o que faz ele agir. Sem ele, você apenas parou de ser ansiosa, mas continua sendo ignorada.
                </p>
                <ul class="space-y-3 mb-8 text-sm text-slate-300">
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Como forçar uma resposta dele em menos de 24h.</li>
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> A técnica do "Story Fantasma" (Impossível não stalkear).</li>
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Como inverter o jogo e fazer ELE ter medo de te perder.</li>
                </ul>
                <a href="https://pay.kiwify.com.br/cAMh7az" class="block w-full bg-white text-purple-900 text-center font-black py-4 rounded-2xl hover:scale-[1.02] transition shadow-2xl">
                    ADICIONAR PROTOCOLO SECRETO AO MEU ACESSO
                </a>
                <p class="text-center text-[10px] text-purple-300 mt-4 uppercase font-bold animate-pulse">Acesso vitalício liberado por tempo limitado</p>
            </div>
        </div>`;
}
