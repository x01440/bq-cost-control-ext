const messageQueue = [];
let timerOn = false;

// Show any messages recorded by the extension.
chrome.storage.local.get(['message']).then((result) => {
    if (result.message) {
        document.getElementById('ft-messages').innerText = result.message;
    }
});

function startOrEndTimer() {
    timerOn = !timerOn;
    const timerStatusEl = document.getElementById('ft-timer-status');
    const timerEl = document.getElementById('ft-timer-time');
    if (timerOn) { // Timer On.
        timerStatusEl.innerText = 'PAUSED';
        timerEl.innerText = '5:00'
    } else {
        timerStatusEl.innerText = '';
        timerEl.innerText = '';
    }
}

document.getElementById('pause-button').addEventListener('click', startOrEndTimer);