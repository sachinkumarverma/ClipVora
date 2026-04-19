(async function() {
    // Tell the website that the extension is installed
    document.documentElement.dataset.clipvoraInstalled = "true";

    // Check if we have a URL to process
    const data = await chrome.storage.local.get('targetUrl');
    const targetUrl = data.targetUrl;

    if (targetUrl) {
        console.log('ClipVora Extension: Automating download for', targetUrl);
        
        // Wait for the UI to be ready
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            const input = document.querySelector('.search-bar input');
            const button = document.querySelector('.search-bar button.btn-primary');

            // Also check for standard forms if class names are different
            const alternateInput = document.querySelector('input[type="text"]');
            const alternateButton = document.querySelector('button[type="submit"]');

            const targetInput = input || alternateInput;
            const targetButton = button || alternateButton;

            if (targetInput && targetButton) {
                clearInterval(checkInterval);
                
                // Clear storage so we don't repeat this on refresh
                chrome.storage.local.remove('targetUrl');

                // Fill the input
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(targetInput, targetUrl);
                targetInput.dispatchEvent(new Event('input', { bubbles: true }));

                // Small delay to let React process the state
                setTimeout(() => {
                    targetButton.click();
                }, 200);
            }

            if (attempts > 30) { // Give up after 15 seconds
                clearInterval(checkInterval);
                console.log('ClipVora Extension: Could not find search bar after 15s');
            }
        }, 500);
    }
})();
