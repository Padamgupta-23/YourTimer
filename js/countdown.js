(() => {
    // Countdown Timer Functionality
    const countdownState = {
        isRunning: false,
        isPaused: false,
        totalSeconds: 0,
        currentSeconds: 0,
        intervalId: null
    };

    document.addEventListener('DOMContentLoaded', () => {
        initializeCountdown();
    });

    function initializeCountdown() {
        const startBtn = document.getElementById('countdownStartBtn');
        const pauseBtn = document.getElementById('countdownPauseBtn');
        const resetBtn = document.getElementById('countdownResetBtn');
        const hoursInput = document.getElementById('countdownHours');
        const minutesInput = document.getElementById('countdownMinutes');
        const secondsInput = document.getElementById('countdownSeconds');
        
        if (startBtn) startBtn.addEventListener('click', startCountdown);
        if (pauseBtn) pauseBtn.addEventListener('click', pauseCountdown);
        if (resetBtn) resetBtn.addEventListener('click', resetCountdown);
        
        [hoursInput, minutesInput, secondsInput].forEach(input => {
            if (input) {
                input.addEventListener('input', updateCountdownFromInputs);
                input.addEventListener('change', updateCountdownFromInputs);
            }
        });
        
        updateCountdownDisplay();
    }

    function updateCountdownFromInputs() {
        if (!countdownState.isRunning) {
            const hours = parseInt(document.getElementById('countdownHours')?.value) || 0;
            const minutes = parseInt(document.getElementById('countdownMinutes')?.value) || 0;
            const seconds = parseInt(document.getElementById('countdownSeconds')?.value) || 0;
            
            countdownState.totalSeconds = hours * 3600 + minutes * 60 + seconds;
            countdownState.currentSeconds = countdownState.totalSeconds;
            updateCountdownDisplay();
        }
    }

    function startCountdown() {
        if (!countdownState.isRunning) {
            if (countdownState.currentSeconds === 0) {
                updateCountdownFromInputs();
            }
            
            if (countdownState.currentSeconds > 0) {
                countdownState.isRunning = true;
                countdownState.isPaused = false;
                
                countdownState.intervalId = setInterval(() => {
                    if (countdownState.currentSeconds > 0) {
                        countdownState.currentSeconds--;
                        updateCountdownDisplay();
                    } else {
                        completeCountdown();
                    }
                }, 1000);
                
                const startBtn = document.getElementById('countdownStartBtn');
                const pauseBtn = document.getElementById('countdownPauseBtn');
                
                if (startBtn) startBtn.disabled = true;
                if (pauseBtn) pauseBtn.disabled = false;
                
                ['countdownHours', 'countdownMinutes', 'countdownSeconds'].forEach(id => {
                    const input = document.getElementById(id);
                    if (input) input.disabled = true;
                });
            }
        }
    }

    function pauseCountdown() {
        if (countdownState.isRunning) {
            countdownState.isRunning = false;
            countdownState.isPaused = true;
            clearInterval(countdownState.intervalId);
            
            const startBtn = document.getElementById('countdownStartBtn');
            const pauseBtn = document.getElementById('countdownPauseBtn');
            
            if (startBtn) startBtn.disabled = false;
            if (pauseBtn) pauseBtn.disabled = true;
        }
    }

    function resetCountdown() {
        countdownState.isRunning = false;
        countdownState.isPaused = false;
        clearInterval(countdownState.intervalId);
        countdownState.currentSeconds = countdownState.totalSeconds;
        
        updateCountdownDisplay();
        
        const startBtn = document.getElementById('countdownStartBtn');
        const pauseBtn = document.getElementById('countdownPauseBtn');
        
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        
        ['countdownHours', 'countdownMinutes', 'countdownSeconds'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.disabled = false;
        });
        
        const display = document.getElementById('countdownDisplay');
        if (display) display.classList.remove('countdown-complete');
    }

    function completeCountdown() {
        clearInterval(countdownState.intervalId);
        countdownState.isRunning = false;

        playEndNotification("Countdown Complete! Time's up! ⏰");

        const display = document.getElementById('countdownDisplay');
        if (display) display.classList.add('countdown-complete');

        const startBtn = document.getElementById('countdownStartBtn');
        const pauseBtn = document.getElementById('countdownPauseBtn');

        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;

        ['countdownHours', 'countdownMinutes', 'countdownSeconds'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.disabled = false;
        });
    }

    function updateCountdownDisplay() {
        const display = document.getElementById('countdownDisplay');
        if (!display) return;
        
        const hours = Math.floor(countdownState.currentSeconds / 3600);
        const minutes = Math.floor((countdownState.currentSeconds % 3600) / 60);
        const seconds = countdownState.currentSeconds % 60;
        
        display.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
})();
