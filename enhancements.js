/*
 * enhancements.js - Lógica de Revelação, Timer e Conversão
 */

// 1. Textos Persuasivos por Perfil
const RESULTS = {
    ansiosa: {
        title: "A Ansiosa Disponível",
        desc: "Você inconscientemente ensinou a ele que <strong>o seu tempo vale menos que o dele</strong>. Ao responder rápido demais e aceitar migalhas, você desligou o instinto de 'caça' no cérebro dele. A boa notícia? Esse é o padrão mais fácil de reverter com a técnica de Escassez Programada."
    },
    controladora: {
        title: "A Investigadora Emocional",
        desc: "Sua necessidade de saber tudo e controlar os passos dele está gerando um efeito de <strong>Sufocamento Silencioso</strong>. Ele sente que perdeu a liberdade e, por instinto, se afasta para respirar. Você precisa aprender a soltar a corda para ele vir até sua mão."
    },
    desvalorizada: {
        title: "A Doadora Excessiva",
        desc: "Você dá 100% e recebe 20%. O desequilíbrio está óbvio. Ele gosta de você, mas <strong>não te respeita como desafio</strong>. Homens valorizam aquilo que custa caro (emocionalmente) para conquistar. Você entregou o prêmio antes da corrida acabar."
    }
};

// 2. Função Principal (Acionada no fim do Quiz)
window.finishQuizFlow = function(answers) {
    const quizContainer = document.getElementById('quiz-container');
    const processingContainer = document.getElementById('processing-container');
    const resultContainer = document.getElementById('result-container');

    // Troca para tela de carregamento
    quizContainer.classList.add('hidden');
    processingContainer.classList.remove('hidden');

    // Animação de 0% a 100%
    let p = 0;
    const int = setInterval(() => {
        p += Math.floor(Math.random() * 15);
        if(p > 100) p = 100;
        document.getElementById('process-pct').innerText = p + '%';
        
        if(p === 100) {
            clearInterval(int);
            
            // Define o perfil e atualiza o texto
            const perfil = defineProfile(answers);
            document.getElementById('result-title').innerHTML = perfil.title;
            document.getElementById('result-description').innerHTML = perfil.desc;

            // Mostra o resultado final e INICIA O TIMER
            setTimeout(() => {
                processingContainer.classList.add('hidden');
                resultContainer.classList.remove('hidden');
                
                // Inicia contagem regressiva de 10 minutos (600 segundos)
                startTimer(600, document.getElementById('countdown-timer'));

                // Dispara pixel
                if(window.fbq) window.fbq('track', 'ViewContent', { content_name: perfil.title });
            }, 800);
        }
    }, 250);
};

// 3. Lógica de Perfilamento
function defineProfile(answers) {
    const textAnswers = answers.join(" ").toLowerCase();
    if (textAnswers.includes("imediatamente") || textAnswers.includes("medo")) return RESULTS.ansiosa;
    if (textAnswers.includes("sei tudo") || textAnswers.includes("stalkei")) return RESULTS.controladora;
    if (textAnswers.includes("cancelei") || textAnswers.includes("deixei de fazer")) return RESULTS.desvalorizada;
    return RESULTS.ansiosa; // Padrão
}

// 4. Função do Relógio (Escassez)
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = 0;
            display.textContent = "00:00";
            display.classList.add("text-red-500"); // Fica vermelho quando zera
        }
    }, 1000);
}
