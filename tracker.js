// tracker.js - The Silent Observer
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Re-use your existing config (safe to duplicate here for the standalone module)
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

// Generate a unique Session ID for this visit
const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
const projectId = document.title || "Unknown Project"; // Grabs page title as project name

// Helper to get User Device Info
const getDeviceInfo = () => {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        url: window.location.href,
        referrer: document.referrer
    };
};

// --- CORE TRACKING FUNCTION ---
async function trackEvent(eventName, eventData = {}) {
    const payload = {
        projectId: projectId,
        sessionId: sessionId,
        eventName: eventName,
        timestamp: new Date(),
        device: getDeviceInfo(),
        data: eventData
    };

    try {
        // "Fire and forget" - we don't await this so it doesn't slow down the UI
        addDoc(collection(db, "analytics_events"), payload);
        console.log(`[Tracker] ${eventName}`, eventData);
    } catch (e) {
        console.error("[Tracker Error]", e);
    }
}

// --- AUTOMATIC LISTENERS ---

// 1. Track Page View
trackEvent("page_view");

// 2. Track Clicks (Smart Tracking)
document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, .clickable');
    if (target) {
        let label = target.innerText || target.id || target.className;
        label = label.substring(0, 50); // Truncate if too long
        trackEvent("click", {
            element: target.tagName,
            label: label,
            id: target.id
        });
    }
});

// 3. Track Time on Page (Heartbeat every 30 seconds)
setInterval(() => {
    if (document.visibilityState === 'visible') {
        trackEvent("heartbeat", { timeElapsed: "30s" });
    }
}, 30000);

// 4. Track Video Logic (Custom function you can call)
window.trackVideo = (videoName, action, currentTime) => {
    trackEvent("video_interaction", {
        video: videoName,
        action: action, // 'play', 'pause', '25%', '50%', '100%'
        time: currentTime
    });
};

// Expose trackEvent globally so your main app can use it manually if needed
window.customTrack = trackEvent;
