// Pomodoro Timer Functionality
let timerState = {
    isRunning: false,
    isPaused: false,
    currentTime: 25 * 60,
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionCount: 1,
    isBreak: false,
    intervalId: null
};

const motivationalQuotes = [
    "Small steps daily create the biggest change.",
    "Focus is a superpower in a distracted world.",
    "Progress, not perfection, is the goal.",
    "Your future self will thank you for starting today.",
    "Consistency is the key to unlocking your potential.",
    "Every minute counts when you're building your dreams.",
    "Stay present, stay focused, stay productive.",
    "The best time to start was yesterday. The second best is now.",
    "Productivity is not about being busy, it's about being effective.",
    "One focused hour is worth ten distracted ones.",
    "Your attention is your most valuable asset.",
    "Small consistent actions lead to extraordinary results."
];

document.addEventListener('DOMContentLoaded', () => {
    initializeTimer();
    initializeDate();
    initializeQuotes();
    initializeAnimations();
});

function initializeTimer() {
    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const shortBreakBtn = document.getElementById('shortBreakBtn');
    
    // Load saved durations from localStorage
    const savedDurations = localStorage.getItem('timerDurations');
    if (savedDurations) {
        const durations = JSON.parse(savedDurations);
        timerState.workDuration = durations.work * 60;
        timerState.breakDuration = durations.break * 60;
        timerState.longBreakDuration = durations.longBreak * 60;
        timerState.currentTime = timerState.workDuration;
        updateTimerDisplay();
    }
    
    if (startPauseBtn) startPauseBtn.addEventListener('click', toggleTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
    if (shortBreakBtn) shortBreakBtn.addEventListener('click', toggleShortBreak);
    
    // Initialize fullscreen timer button
    const fullscreenTimerBtn = document.getElementById('fullscreenTimerBtn');
    if (fullscreenTimerBtn) {
        fullscreenTimerBtn.addEventListener('click', toggleTimerFullscreen);
    }
}

function toggleTimer() {
    const startPauseBtn = document.getElementById('startPauseBtn');
    const btnIcon = startPauseBtn?.querySelector('.btn-icon');
    const btnText = startPauseBtn?.querySelector('span');
    
    if (!timerState.isRunning) {
        startTimer();
        if (btnIcon) btnIcon.setAttribute('data-feather', 'pause');
        if (btnText) btnText.textContent = 'Pause';
        feather.replace();
    } else {
        pauseTimer();
        if (btnIcon) btnIcon.setAttribute('data-feather', 'play');
        if (btnText) btnText.textContent = 'Start';
        feather.replace();
    }
}

function startTimer() {
    timerState.isRunning = true;
    timerState.isPaused = false;
    
    timerState.intervalId = setInterval(() => {
        if (timerState.currentTime > 0) {
            timerState.currentTime--;
            updateTimerDisplay();
        } else {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    timerState.isRunning = false;
    timerState.isPaused = true;
    
    if (timerState.intervalId) {
        clearInterval(timerState.intervalId);
        timerState.intervalId = null;
    }
}

function resetTimer() {
    pauseTimer();
    
    // Reset to current mode (break or work)
    if (timerState.isBreak) {
        timerState.currentTime = 5 * 60; // 5 minutes for short break
    } else {
        timerState.currentTime = timerState.workDuration; // 25 minutes for work
    }
    
    timerState.isPaused = false;
    updateTimerDisplay();
    
    const startPauseBtn = document.getElementById('startPauseBtn');
    const btnIcon = startPauseBtn?.querySelector('.btn-icon');
    const btnText = startPauseBtn?.querySelector('span');
    if (btnIcon) btnIcon.setAttribute('data-feather', 'play');
    if (btnText) btnText.textContent = 'Start';
    feather.replace();
}

function completeTimer() {
    playEndNotification(timerState.isBreak ? "Break over! Back to work." : "Great job! Take a break.");
    pauseTimer();
    
    // if ('Notification' in window && Notification.permission === 'granted') {
    //     new Notification('Timer Complete!', {
    //         body: timerState.isBreak ? 'Break time is over. Back to work!' : 'Great job! Time for a break.',
    //         icon: '🔔'
    //     });
    // }
    
    // if ('vibrate' in navigator) {
    //     navigator.vibrate([200, 100, 200]);
    // }
    
    // If it was a short break, just stop and reset to work session
    if (timerState.isBreak) {
        timerState.isBreak = false;
        timerState.currentTime = timerState.workDuration;
        updateSessionText(`Focus Session #${timerState.sessionCount}`);
        updateTimerDisplay();
        
        // Update Short Break button back to "Short Break"
        const shortBreakBtn = document.getElementById('shortBreakBtn');
        const btnIcon = shortBreakBtn?.querySelector('.btn-icon');
        const btnText = shortBreakBtn?.querySelector('span');
        if (btnIcon) btnIcon.setAttribute('data-feather', 'coffee');
        if (btnText) btnText.textContent = 'Short Break';
        feather.replace();
    } else {
        // Work session completed - go to break
        timerState.sessionCount++;
        timerState.isBreak = true;
        
        if (timerState.sessionCount % 4 === 0) {
            timerState.currentTime = timerState.longBreakDuration;
            updateSessionText('Long Break Time! 🎉');
        } else {
            timerState.currentTime = timerState.breakDuration;
            updateSessionText('Break Time! ☕');
        }
        updateTimerDisplay();
    }
    
    const startPauseBtn = document.getElementById('startPauseBtn');
    const btnIcon = startPauseBtn?.querySelector('.btn-icon');
    const btnText = startPauseBtn?.querySelector('span');
    if (btnIcon) btnIcon.setAttribute('data-feather', 'play');
    if (btnText) btnText.textContent = 'Start';
    feather.replace();
}

// Toggle Short Break / Pomodoro
function toggleShortBreak() {
    const shortBreakBtn = document.getElementById('shortBreakBtn');
    const btnIcon = shortBreakBtn?.querySelector('.btn-icon');
    const btnText = shortBreakBtn?.querySelector('span');
    
    // Stop current timer if running
    if (timerState.isRunning) {
        pauseTimer();
    }
    
    if (timerState.isBreak) {
        // Switch back to Pomodoro (25 minutes)
        timerState.isBreak = false;
        timerState.currentTime = timerState.workDuration; // 25 minutes
        updateSessionText(`Focus Session #${timerState.sessionCount}`);
        
        // Update button to show "Short Break"
        if (btnIcon) btnIcon.setAttribute('data-feather', 'coffee');
        if (btnText) btnText.textContent = 'Short Break';
    } else {
        // Switch to Short Break (5 minutes)
        timerState.isBreak = true;
        timerState.currentTime = 5 * 60; // Always 5 minutes
        updateSessionText('Short Break ☕');
        
        // Update button to show "Pomodoro"
        if (btnIcon) btnIcon.setAttribute('data-feather', 'clock');
        if (btnText) btnText.textContent = 'Pomodoro';
    }
    
    updateTimerDisplay();
    
    // Update Start/Pause button states
    const startPauseBtn = document.getElementById('startPauseBtn');
    const startBtnIcon = startPauseBtn?.querySelector('.btn-icon');
    const startBtnText = startPauseBtn?.querySelector('span');
    if (startBtnIcon) startBtnIcon.setAttribute('data-feather', 'play');
    if (startBtnText) startBtnText.textContent = 'Start';
    feather.replace();
}

function updateTimerDisplay() {
    const timerDigits = document.getElementById('timerDigits');
    if (!timerDigits) return;
    
    const minutes = Math.floor(timerState.currentTime / 60);
    const seconds = timerState.currentTime % 60;
    timerDigits.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateSessionText(text) {
    const sessionText = document.getElementById('sessionText');
    if (sessionText) {
        sessionText.textContent = text;
    }
}

function initializeDate() {
    const dateText = document.getElementById('dateText');
    if (dateText) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const today = new Date();
        dateText.textContent = today.toLocaleDateString('en-US', options);
    }
}

function initializeQuotes() {
    const quoteElement = document.getElementById('motivationalQuote');
    if (!quoteElement) return;
    
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    quoteElement.textContent = randomQuote;
    
    setInterval(() => {
        const newQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        quoteElement.textContent = newQuote;
    }, 30 * 60 * 1000);
}

function initializeAnimations() {
    if (typeof gsap !== 'undefined') {
        gsap.from('.timer-digits', {
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
    }
}

// Toggle Timer Fullscreen Mode
let isTimerFullscreen = false;

function toggleTimerFullscreen() {
    const sidebar = document.getElementById('sidebar');
    const navbar = document.getElementById('navbar');
    const timerSection = document.getElementById('timer');
    const explanationSection = document.getElementById('explanation');
    const footer = document.querySelector('.footer');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const spotifyPlayer = document.getElementById('spotifyPlayer');
    
    if (!isTimerFullscreen) {
        // Enter fullscreen mode - hide everything except timer
        if (sidebar) sidebar.style.display = 'none';
        if (navbar) navbar.style.display = 'none';
        if (explanationSection) explanationSection.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (sidebarToggle) sidebarToggle.style.display = 'none';
        if (spotifyPlayer) spotifyPlayer.style.display = 'none';
        
        // Make timer section fullscreen
        if (timerSection) {
            timerSection.style.position = 'fixed';
            timerSection.style.top = '0';
            timerSection.style.left = '0';
            timerSection.style.width = '100vw';
            timerSection.style.height = '100vh';
            timerSection.style.zIndex = '9999';
            timerSection.style.background = 'var(--bg-main)';
            timerSection.style.display = 'flex';
            timerSection.style.alignItems = 'center';
            timerSection.style.justifyContent = 'center';
        }
        
        // Update fullscreen button icon
        const fullscreenBtn = document.getElementById('fullscreenTimerBtn');
        const fullscreenIcon = fullscreenBtn?.querySelector('i');
        if (fullscreenIcon) {
            fullscreenIcon.setAttribute('data-feather', 'minimize-2');
            feather.replace();
        }
        
        isTimerFullscreen = true;
    } else {
        // Exit fullscreen mode - show everything
        if (sidebar) sidebar.style.display = '';
        if (navbar) navbar.style.display = '';
        if (explanationSection) explanationSection.style.display = '';
        if (footer) footer.style.display = '';
        if (sidebarToggle) sidebarToggle.style.display = '';
        if (spotifyPlayer) spotifyPlayer.style.display = '';
        
        // Reset timer section styles
        if (timerSection) {
            timerSection.style.position = '';
            timerSection.style.top = '';
            timerSection.style.left = '';
            timerSection.style.width = '';
            timerSection.style.height = '';
            timerSection.style.zIndex = '';
            timerSection.style.background = '';
            timerSection.style.display = '';
            timerSection.style.alignItems = '';
            timerSection.style.justifyContent = '';
        }
        
        // Update fullscreen button icon
        const fullscreenBtn = document.getElementById('fullscreenTimerBtn');
        const fullscreenIcon = fullscreenBtn?.querySelector('i');
        if (fullscreenIcon) {
            fullscreenIcon.setAttribute('data-feather', 'maximize-2');
            feather.replace();
        }
        
        isTimerFullscreen = false;
    }
}

