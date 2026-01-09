// tracker.js v2.0 - Com UTMs, Modo Teste e Integração Pixel
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

// --- 1. CAPTURA DE PARÂMETROS DE URL (UTMs e Teste) ---
const urlParams = new URLSearchParams(window.location.search);

// Verifica se é teste (?mode=test na URL)
const isTestMode = urlParams.get('mode') === 'test' || window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

// Captura UTMs
const campaignData = {
    source: urlParams.get('utm_source') || 'direct',
    medium: urlParams.get('utm_medium') || 'none',
    campaign: urlParams.get('utm_campaign') || 'none',
    content: urlParams.get('utm_content') || 'none'
};

// ID da Sessão
const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);

// --- 2. FUNÇÃO PRINCIPAL DE RASTREAMENTO ---
async function trackEvent(eventName, eventData = {}) {
    const payload = {
        projectId: document.title,
        sessionId: sessionId,
        eventName: eventName,
        timestamp: new Date(),
        isTest: isTestMode, // Aqui está a mágica da separação
        campaign: campaignData, // Aqui entram os dados da campanha
        device: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            url: window.location.href
        },
        data: eventData
    };

    try {
        // Envia para o Nosso Banco (Firebase)
        addDoc(collection(db, "analytics_events"), payload);
        
        if(isTestMode) {
            console.log(`🧪 [TESTE] Evento disparado: ${eventName}`, payload);
        } else {
            // --- 3. PONTE PARA O FACEBOOK PIXEL (Se existir) ---
            // Se o Pixel estiver instalado no index.html, nós avisamos ele também
            if (typeof fbq === 'function') {
                if(eventName === 'page_view') fbq('track', 'PageView');
                else if(eventName === 'checkout') fbq('track', 'InitiateCheckout');
                else if(eventName === 'purchase') fbq('track', 'Purchase');
                else fbq('trackCustom', eventName, eventData);
            }
        }

    } catch (e) {
        console.error("[Tracker Error]", e);
    }
}

// --- AUTOMATIC LISTENERS ---

// Page View Automático
trackEvent("page_view");

// Cliques Automáticos
document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, .clickable');
    if (target) {
        let label = target.innerText || target.id || target.className;
        label = label.substring(0, 50);
        trackEvent("click", {
            element: target.tagName,
            label: label,
            id: target.id
        });
    }
});

// Heartbeat (Tempo na página)
setInterval(() => {
    if (document.visibilityState === 'visible') {
        trackEvent("heartbeat", { timeElapsed: "30s" });
    }
}, 30000);

// Expõe globalmente
window.customTrack = trackEvent;
