let timerOn = false;
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

document.getElementById('pauseButton').addEventListener('click', startOrEndTimer);