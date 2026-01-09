/*
 * enhancements.js - Lógica de Revelação e Conversão
 * Responsável por: Processamento final, Definição do Arquétipo e Exibição do Resultado.
 */

// Mapeamento de Resultados (Copywriting Persuasivo)
const RESULTS = {
    // Padrão 1: A Ansiosa (A maioria cai aqui)
    ansiosa: {
        title: "A Ansiosa Disponível",
        desc: "Você inconscientemente ensinou a ele que <strong>o seu tempo vale menos que o dele</strong>. Ao responder rápido demais e aceitar migalhas, você desligou o instinto de 'caça' no cérebro dele. A boa notícia? Esse é o padrão mais fácil de reverter com a técnica de Escassez Programada."
    },
    // Padrão 2: A Controladora (Para quem responde que 'Stalkea')
    controladora: {
        title: "A Investigadora Emocional",
        desc: "Sua necessidade de saber tudo e controlar os passos dele está gerando um efeito de <strong>Sufocamento Silencioso</strong>. Ele sente que perdeu a liberdade e, por instinto, se afasta para respirar. Você precisa aprender a soltar a corda para ele vir até sua mão."
    },
    // Padrão 3: A Desvalorizada (Para quem 'cancelou compromissos')
    desvalorizada: {
        title: "A Doadora Excessiva",
        desc: "Você dá 100% e recebe 20%. O desequilíbrio está óbvio. Ele gosta de você, mas <strong>não te respeita como desafio</strong>. Homens valorizam aquilo que custa caro (emocionalmente) para conquistar. Você entregou o prêmio antes da corrida acabar."
    }
};

// Função principal chamada pelo HTML quando o quiz acaba
window.finishQuizFlow = function(answers) {
    const quizContainer = document.getElementById('quiz-container');
    const processingContainer = document.getElementById('processing-container');
    const resultContainer = document.getElementById('result-container');

    // 1. Esconde Quiz e Mostra Processamento
    quizContainer.classList.add('hidden');
    processingContainer.classList.remove('hidden');

    // 2. Animação de porcentagem (Engajamento Visual)
    let p = 0;
    const int = setInterval(() => {
        p += Math.floor(Math.random() * 15);
        if(p > 100) p = 100;
        document.getElementById('process-pct').innerText = p + '%';
        
        if(p === 100) {
            clearInterval(int);
            
            // 3. Define o Perfil Baseado nas Respostas
            const perfil = defineProfile(answers);
            
            // 4. Injeta o Texto Personalizado
            document.getElementById('result-title').innerHTML = perfil.title;
            document.getElementById('result-description').innerHTML = perfil.desc;

            // 5. Troca para a Tela de Resultado
            setTimeout(() => {
                processingContainer.classList.add('hidden');
                resultContainer.classList.remove('hidden');
                
                // Trackeia o evento de "Visualizou Resultado"
                if(window.fbq) window.fbq('track', 'ViewContent', { content_name: perfil.title });
            }, 800);
        }
    }, 250);
};

// Lógica simples para definir o perfil (pode ser refinada)
function defineProfile(answers) {
    // Verifica palavras-chave nas respostas
    const textAnswers = answers.join(" ").toLowerCase();

    if (textAnswers.includes("imediatamente") || textAnswers.includes("medo")) {
        return RESULTS.ansiosa;
    }
    if (textAnswers.includes("sei tudo") || textAnswers.includes("stalkei")) {
        return RESULTS.controladora;
    }
    if (textAnswers.includes("cancelei") || textAnswers.includes("deixei de fazer")) {
        return RESULTS.desvalorizada;
    }

    // Padrão (Fallback) - O mais comum
    return RESULTS.ansiosa;
}
