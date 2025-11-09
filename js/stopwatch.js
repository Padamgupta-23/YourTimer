// Stopwatch Functionality
let stopwatchState = {
    isRunning: false,
    startTime: 0,
    elapsedTime: 0,
    intervalId: null,
    laps: []
};

document.addEventListener('DOMContentLoaded', () => {
    initializeStopwatch();
});

function initializeStopwatch() {
    const startBtn = document.getElementById('stopwatchStartBtn');
    const stopBtn = document.getElementById('stopwatchStopBtn');
    const lapBtn = document.getElementById('stopwatchLapBtn');
    const resetBtn = document.getElementById('stopwatchResetBtn');
    
    if (startBtn) startBtn.addEventListener('click', startStopwatch);
    if (stopBtn) stopBtn.addEventListener('click', stopStopwatch);
    if (lapBtn) lapBtn.addEventListener('click', recordLap);
    if (resetBtn) resetBtn.addEventListener('click', resetStopwatch);
    
    updateStopwatchDisplay();
}

function startStopwatch() {
    if (!stopwatchState.isRunning) {
        stopwatchState.isRunning = true;
        stopwatchState.startTime = Date.now() - stopwatchState.elapsedTime;
        
        stopwatchState.intervalId = setInterval(() => {
            stopwatchState.elapsedTime = Date.now() - stopwatchState.startTime;
            updateStopwatchDisplay();
        }, 10);
        
        const startBtn = document.getElementById('stopwatchStartBtn');
        const stopBtn = document.getElementById('stopwatchStopBtn');
        const lapBtn = document.getElementById('stopwatchLapBtn');
        
        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        if (lapBtn) lapBtn.disabled = false;
    }
}

function stopStopwatch() {
    if (stopwatchState.isRunning) {
        stopwatchState.isRunning = false;
        clearInterval(stopwatchState.intervalId);
        
        const startBtn = document.getElementById('stopwatchStartBtn');
        const stopBtn = document.getElementById('stopwatchStopBtn');
        const lapBtn = document.getElementById('stopwatchLapBtn');
        
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        if (lapBtn) lapBtn.disabled = true;
    }
}

function recordLap() {
    const lapTime = stopwatchState.elapsedTime;
    stopwatchState.laps.push(lapTime);
    displayLaps();
}

function resetStopwatch() {
    stopwatchState.isRunning = false;
    stopwatchState.elapsedTime = 0;
    stopwatchState.laps = [];
    clearInterval(stopwatchState.intervalId);
    
    updateStopwatchDisplay();
    displayLaps();
    
    const startBtn = document.getElementById('stopwatchStartBtn');
    const stopBtn = document.getElementById('stopwatchStopBtn');
    const lapBtn = document.getElementById('stopwatchLapBtn');
    
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (lapBtn) lapBtn.disabled = true;
}

function updateStopwatchDisplay() {
    const display = document.getElementById('stopwatchDisplay');
    if (!display) return;
    
    const total = stopwatchState.elapsedTime;
    const hours = Math.floor(total / 3600000);
    const minutes = Math.floor((total % 3600000) / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const milliseconds = Math.floor((total % 1000) / 10);
    
    display.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

function displayLaps() {
    const lapRecords = document.getElementById('lapRecords');
    if (!lapRecords) return;
    
    lapRecords.innerHTML = '';
    
    if (stopwatchState.laps.length === 0) {
        return;
    }
    
    stopwatchState.laps.forEach((lap, index) => {
        const hours = Math.floor(lap / 3600000);
        const minutes = Math.floor((lap % 3600000) / 60000);
        const seconds = Math.floor((lap % 60000) / 1000);
        const milliseconds = Math.floor((lap % 1000) / 10);
        
        const lapTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
        
        const lapCard = document.createElement('div');
        lapCard.className = 'lap-card';
        lapCard.innerHTML = `
            <span class="lap-number">Lap ${index + 1}</span>
            <span class="lap-time">${lapTime}</span>
        `;
        lapRecords.appendChild(lapCard);
    });
}

