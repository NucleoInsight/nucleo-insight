// ... (inicialização do Firebase igual) ...

function LIBERAR_CONTEUDO(data) {
    // Esconde o Quiz
    const ids = ['quiz-container', 'processing-container', 'result-container'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });
    
    // Mostra o Portal Principal
    const prot = document.getElementById('protocolo');
    if(prot) {
        prot.classList.remove('hidden');
        prot.style.display = 'block';
    }

    // LÓGICA DO UPSELL (PROTOCOL ACTIVE)
    const blocoUpsell = document.getElementById('bloco-upsell');
    const blocoConteudo = document.getElementById('bloco-conteudo-protocolo');

    if (data.protocol === "active") {
        // Se já comprou o Upsell: Esconde a oferta e mostra o conteúdo
        if(blocoUpsell) blocoUpsell.classList.add('hidden');
        if(blocoConteudo) blocoConteudo.classList.remove('hidden');
    } else {
        // Se NÃO comprou o Upsell: Mostra a oferta
        if(blocoUpsell) blocoUpsell.classList.remove('hidden');
        if(blocoConteudo) blocoConteudo.classList.add('hidden');
    }

    window.scrollTo(0,0);
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        onSnapshot(doc(db, "users", user.email), (snapshot) => {
            const data = snapshot.data();
            if (data && data.status === 'premium') {
                // Passamos os dados do usuário para a função decidir o que mostrar
                LIBERAR_CONTEUDO(data); 
            }
        });
    }
});
// ... (resto do código) ...
