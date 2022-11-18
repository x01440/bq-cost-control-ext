chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "invalidQuery") {
        console.info("Worker received invalid query signal");
        // Temporarily change the icon to a warning.
        chrome.action.setBadgeBackgroundColor(
            {color: '#F00'}
        );
        chrome.action.setBadgeText({ text: '!' });
        setTimeout(() => {
            chrome.action.setBadgeText({ text: '' });
        }, 6000)
    }
});
