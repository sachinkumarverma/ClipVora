(async function() {
    const frame = document.getElementById('clipvoraFrame');
    const loader = document.getElementById('loader');

    // 1. Get current tab URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Don't auto-fill if we are already on the ClipVora domain
    const isClipVora = tab && tab.url && (tab.url.includes('localhost:5173') || tab.url.includes('clipvora.com'));
    
    if (tab && tab.url && !isClipVora) {
        // Save the URL for the content script to find
        await chrome.storage.local.set({ targetUrl: tab.url });
    }

    // 2. Load the site in iframe using the CONFIG
    frame.src = CONFIG.activeUrl;
    
    frame.onload = () => {
        loader.style.display = 'none';
        frame.style.display = 'block';
    };
})();
