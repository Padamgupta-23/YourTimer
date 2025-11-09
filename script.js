// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    initializeApp();
});

// App Initialization
function initializeApp() {
    initializeTheme();
    initializeSidebar();
    initializeSpotifyPlayer();
    initializePageRouting();
    initializeTimer();
    initializeStopwatch();
    initializeCountdown();
    initializeClock();
    initializeDate();
    initializeQuotes();
    initializeDropdown();
    initializeModal();
    initializeFullscreen();
    initializeMobileMenu();
    initializeAnimations();
    scrollToTimer();
}

const alertSound = new Audio("assets/sounds/alarm.mp3");
alertSound.load();


// ✅ Unified Sound + Vibration + Notification System
// ✅ Unified Sound + Vibration + Notification System
function playEndNotification(message = "Your timer has finished!") {
    const sound = new Audio("assets/sounds/alarm.mp3");
    sound.play().catch(err => console.log("Audio play blocked:", err));

    if ("vibrate" in navigator) {
        navigator.vibrate([300, 150, 300]);
    }

    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("⏰ Timer Complete!", {
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827340.png"
        });
    }

    console.log("✅ playEndNotification triggered!");
}



// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
        
        // Animate theme transition
        gsap.to('body', { duration: 0.3, opacity: 0.95, yoyo: true, repeat: 1 });
    });
}

function updateThemeIcon(icon, theme) {
    icon.setAttribute('data-feather', theme === 'dark' ? 'sun' : 'moon');
    feather.replace();
}

// Timer State
let timerState = {
    isRunning: false,
    isPaused: false,
    currentTime: 25 * 60, // 25 minutes in seconds
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionCount: 1,
    isBreak: false,
    intervalId: null
};

// Timer Functions
function initializeTimer() {
    const startBtn = document.getElementById('timerStartBtn');
    const pauseBtn = document.getElementById('timerPauseBtn');
    const resetBtn = document.getElementById('timerResetBtn');

    if (!startBtn || !pauseBtn || !resetBtn) {
        // This page doesn't have timer controls — skip initialization
        return;
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}


function toggleTimer() {
    const startPauseBtn = document.getElementById('startPauseBtn');
    const btnIcon = startPauseBtn.querySelector('.btn-icon');
    const btnText = startPauseBtn.querySelector('span');
    
    if (!timerState.isRunning) {
        startTimer();
        btnIcon.setAttribute('data-feather', 'pause');
        btnText.textContent = 'Pause';
        feather.replace();
        
        // Animate button
        gsap.to(startPauseBtn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    } else {
        pauseTimer();
        btnIcon.setAttribute('data-feather', 'play');
        btnText.textContent = 'Start';
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
            
            // Pulse animation every second
            gsap.to('#timerDigits', { 
                scale: 1.02, 
                duration: 0.1, 
                yoyo: true, 
                repeat: 1,
                ease: 'power2.out'
            });
        } else {
            // Timer completed
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
    timerState.currentTime = timerState.isBreak ? timerState.breakDuration : timerState.workDuration;
    timerState.isPaused = false;
    updateTimerDisplay();
    
    const startPauseBtn = document.getElementById('startPauseBtn');
    const btnIcon = startPauseBtn.querySelector('.btn-icon');
    const btnText = startPauseBtn.querySelector('span');
    btnIcon.setAttribute('data-feather', 'play');
    btnText.textContent = 'Start';
    feather.replace();
    
    // Reset animation
    gsap.to('#timerDigits', { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
}

function completeTimer() {
    pauseTimer();
    
    // Play notification sound (optional - browser notification)
    if ("Notification" in window && Notification.permission === "default") {
        document.addEventListener("click", () => {
            Notification.requestPermission();
        }, { once: true });
    }

    
    // Vibrate if supported
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
    
    // Determine next session
    if (!timerState.isBreak) {
        // Work session completed
        timerState.sessionCount++;
        timerState.isBreak = true;
        
        // Determine break type
        if (timerState.sessionCount % 4 === 0) {
            timerState.currentTime = timerState.longBreakDuration;
            updateSessionText('Long Break Time! 🎉');
        } else {
            timerState.currentTime = timerState.breakDuration;
            updateSessionText('Break Time! ☕');
        }
    } else {
        // Break completed
        timerState.isBreak = false;
        timerState.currentTime = timerState.workDuration;
        updateSessionText(`Focus Session #${timerState.sessionCount}`);
    }
    
    updateTimerDisplay();
    
    // Celebration animation
    gsap.to('#timerDigits', { 
        scale: 1.1, 
        duration: 0.3, 
        yoyo: true, 
        repeat: 3,
        ease: 'elastic.out(1, 0.5)'
    });
    
    // Reset button state
    const startPauseBtn = document.getElementById('startPauseBtn');
    const btnIcon = startPauseBtn.querySelector('.btn-icon');
    const btnText = startPauseBtn.querySelector('span');
    btnIcon.setAttribute('data-feather', 'play');
    btnText.textContent = 'Start';
    feather.replace();
}

function updateTimerDisplay() {
    const timerDigits = document.getElementById('timerDigits');
    const minutes = Math.floor(timerState.currentTime / 60);
    const seconds = timerState.currentTime % 60;
    timerDigits.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateSessionText(text) {
    const sessionText = document.getElementById('sessionText');
    gsap.to(sessionText, { opacity: 0, duration: 0.2, onComplete: () => {
        sessionText.textContent = text;
        gsap.to(sessionText, { opacity: 1, duration: 0.2 });
    }});
}

// Date Display
function initializeDate() {
    const dateText = document.getElementById('dateText');
    if (!dateText) return; // 🛑 If the element doesn't exist, skip this function

    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Date();
    dateText.textContent = today.toLocaleDateString('en-US', options);
}


// Motivational Quotes System
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

let quoteUpdateInterval = null;

function initializeQuotes() {
    const quoteElement = document.getElementById('motivationalQuote');
    if (!quoteElement) {
        // 🛑 This page doesn't have a quote element — skip the function entirely
        return;
    }

    // ✅ Guard against missing quote data
    if (!Array.isArray(motivationalQuotes) || motivationalQuotes.length === 0) {
        console.warn("⚠️ No motivational quotes found in 'motivationalQuotes' array.");
        return;
    }

    // ✅ Set the initial random quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    quoteElement.textContent = randomQuote;

    // ✅ Re-update quote every 30 minutes safely
    quoteUpdateInterval = setInterval(() => {
        if (!document.body.contains(quoteElement)) {
            // If element was removed (e.g., page navigation), stop interval
            clearInterval(quoteUpdateInterval);
            return;
        }

        const newQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

        // Fade out old quote, switch text, fade in new quote
        gsap.to(quoteElement, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                quoteElement.textContent = newQuote;
                gsap.to(quoteElement, { opacity: 1, duration: 0.5 });
            }
        });
    }, 30 * 60 * 1000); // 30 minutes
}


// Dropdown Menu
function initializeDropdown() {
    const toolsBtn = document.getElementById('toolsBtn');
    const toolsMenu = document.getElementById('toolsMenu');
    const dropdown = toolsBtn.closest('.dropdown');
    
    toolsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // Close dropdown when selecting an item and navigate
    const dropdownItems = toolsMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            if (page) {
                navigateToPage(page);
                // Update sidebar active state
                const sidebarItems = document.querySelectorAll('.sidebar-item');
                sidebarItems.forEach(sidebarItem => {
                    sidebarItem.classList.remove('active');
                    if (sidebarItem.getAttribute('data-page') === page) {
                        sidebarItem.classList.add('active');
                    }
                });
            }
            dropdown.classList.remove('active');
        });
    });
}

// ✅ Modal Management (Safe Across All Pages)
function initializeModal() {
    const setDurationBtn = document.getElementById('setDurationBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelDurationBtn');
    const saveBtn = document.getElementById('saveDurationBtn');

    // 🛡️ Safety check — if modal or trigger elements don't exist on this page, skip
    if (!setDurationBtn || !modalOverlay || !modalClose || !cancelBtn || !saveBtn) {
        // console.warn("⚠️ Modal elements not found — skipping modal initialization for this page.");
        return;
    }

    // ✅ Load current Pomodoro values into modal on click
    setDurationBtn.addEventListener('click', () => {
        const workInput = document.getElementById('workDuration');
        const breakInput = document.getElementById('breakDuration');
        const longBreakInput = document.getElementById('longBreakDuration');

        if (workInput && breakInput && longBreakInput && timerState) {
            workInput.value = timerState.workDuration / 60;
            breakInput.value = timerState.breakDuration / 60;
            longBreakInput.value = timerState.longBreakDuration / 60;
        }

        openModal();
    });

    // ✅ Close modal actions
    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // ✅ Click outside to close
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // ✅ Save button logic
    saveBtn.addEventListener('click', () => {
        const work = parseInt(document.getElementById('workDuration')?.value);
        const breakTime = parseInt(document.getElementById('breakDuration')?.value);
        const longBreak = parseInt(document.getElementById('longBreakDuration')?.value);

        if (work > 0 && breakTime > 0 && longBreak > 0) {
            // Update Pomodoro state
            timerState.workDuration = work * 60;
            timerState.breakDuration = breakTime * 60;
            timerState.longBreakDuration = longBreak * 60;

            // Save to localStorage
            localStorage.setItem('timerDurations', JSON.stringify({
                work,
                break: breakTime,
                longBreak
            }));

            // Update UI if timer not running
            if (!timerState.isRunning) {
                timerState.currentTime = timerState.isBreak ? timerState.breakDuration : timerState.workDuration;
                updateTimerDisplay();
            }

            closeModal();

            // ✅ Success button animation
            gsap.to(saveBtn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
        } else {
            // Optional: give user feedback if invalid input
            gsap.to(saveBtn, { backgroundColor: "#E88787", duration: 0.3, yoyo: true, repeat: 1 });
        }
    });
}


function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate modal in
    gsap.fromTo('.modal', 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Fullscreen Functionality
function initializeFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenTimerBtn = document.getElementById('fullscreenTimerBtn');
    const timerSection = document.querySelector('.timer-section');
    
    [fullscreenBtn, fullscreenTimerBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    timerSection.requestFullscreen().then(() => {
                        timerSection.classList.add('fullscreen');
                        updateFullscreenIcon();
                    }).catch(err => {
                        console.log('Fullscreen error:', err);
                    });
                } else {
                    document.exitFullscreen().then(() => {
                        timerSection.classList.remove('fullscreen');
                        updateFullscreenIcon();
                    });
                }
            });
        }
    });
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            timerSection.classList.remove('fullscreen');
        }
        updateFullscreenIcon();
    });
}

function updateFullscreenIcon() {
    const icons = document.querySelectorAll('[data-feather="maximize-2"], [data-feather="minimize-2"]');
    icons.forEach(icon => {
        if (document.fullscreenElement) {
            icon.setAttribute('data-feather', 'minimize-2');
        } else {
            icon.setAttribute('data-feather', 'maximize-2');
        }
    });
    feather.replace();
}

// GSAP Animations
function initializeAnimations() {
    // Animate elements on load
    // gsap.from('.timer-digits', {
    //     scale: 0.8,
    //     opacity: 0,
    //     duration: 0.8,
    //     ease: 'back.out(1.7)'
    // });
    
    // gsap.from('.timer-info', {
    //     y: 20,
    //     opacity: 0,
    //     duration: 0.6,
    //     delay: 0.2
    // });
    
    // gsap.from('.quote-container', {
    //     y: 20,
    //     opacity: 0,
    //     duration: 0.6,
    //     delay: 0.4
    // });
    
    // gsap.from('.timer-controls .btn', {
    //     y: 20,
    //     opacity: 0,
    //     duration: 0.5,
    //     delay: 0.6,
    //     stagger: 0.1
    // });
    
    // Animate explanation section on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target.querySelectorAll('.explanation-heading, .explanation-text, .explanation-subheading, .explanation-list li, .explanation-quote'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const explanationSection = document.getElementById('explanation');
    if (explanationSection) {
        // Set initial state
        gsap.set(explanationSection.querySelectorAll('.explanation-heading, .explanation-text, .explanation-subheading, .explanation-list li, .explanation-quote'), {
            opacity: 0,
            y: 30
        });
        observer.observe(explanationSection);
    }
    
    // Navbar hover animations and navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, { y: -2, duration: 0.2 });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { y: 0, duration: 0.2 });
        });
        
        // Handle navigation for links with data-page attribute
        const page = link.getAttribute('data-page');
        if (page) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToPage(page);
                // Update sidebar active state
                const sidebarItems = document.querySelectorAll('.sidebar-item');
                sidebarItems.forEach(sidebarItem => {
                    sidebarItem.classList.remove('active');
                    if (sidebarItem.getAttribute('data-page') === page) {
                        sidebarItem.classList.add('active');
                    }
                });
            });
        }
    });
}

// Sidebar Navigation
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-active');
            const icon = sidebarToggle.querySelector('i');
            if (sidebar.classList.contains('mobile-active')) {
                icon.setAttribute('data-feather', 'x');
            } else {
                icon.setAttribute('data-feather', 'menu');
            }
            feather.replace();
        });
    }
    
    // Sidebar item click handlers
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            
            // Update active state
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Navigate to page
            navigateToPage(page);
            
            // Close mobile sidebar
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-active');
                const icon = sidebarToggle.querySelector('i');
                icon.setAttribute('data-feather', 'menu');
                feather.replace();
            }
        });
    });
}

// Spotify Player
function initializeSpotifyPlayer() {
    const spotifyPlayer = document.getElementById('spotifyPlayer');
    
    // Fade in Spotify player on page load
    setTimeout(() => {
        if (spotifyPlayer) {
            spotifyPlayer.classList.add('visible');
            gsap.from(spotifyPlayer, {
                opacity: 0,
                y: -20,
                duration: 0.6,
                delay: 0.3
            });
        }
    }, 500);
}

// Page Routing
function navigateToPage(page) {
    const pages = {
        'pomodoro': 'pomodoroPage',
        'stopwatch': 'stopwatchPage',
        'countdown': 'countdownPage',
        'clock': 'clockPage'
    };
    
    // Hide all pages
    document.querySelectorAll('.page-container').forEach(pageEl => {
        pageEl.classList.remove('active');
        gsap.to(pageEl, { opacity: 0, duration: 0.2 });
    });
    
    // Show selected page
    const targetPage = document.getElementById(pages[page]);
    if (targetPage) {
        setTimeout(() => {
            targetPage.classList.add('active');
            gsap.fromTo(targetPage, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4 }
            );
        }, 100);
    }
}

function initializePageRouting() {
    // Set initial page
    navigateToPage('pomodoro');
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navRight = document.querySelector('.nav-right');
    
    if (mobileMenuBtn && navRight) {
        mobileMenuBtn.addEventListener('click', () => {
            navRight.classList.toggle('mobile-active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navRight.classList.contains('mobile-active')) {
                icon.setAttribute('data-feather', 'x');
            } else {
                icon.setAttribute('data-feather', 'menu');
            }
            feather.replace();
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = navRight.querySelectorAll('a, button');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navRight.classList.remove('mobile-active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-feather', 'menu');
                feather.replace();
            });
        });
    }
}

// Stopwatch Functionality
let stopwatchState = {
    isRunning: false,
    startTime: 0,
    elapsedTime: 0,
    intervalId: null,
    laps: []
};

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
        
        document.getElementById('stopwatchStartBtn').disabled = true;
        document.getElementById('stopwatchStopBtn').disabled = false;
        document.getElementById('stopwatchLapBtn').disabled = false;
    }
}

function stopStopwatch() {
    if (stopwatchState.isRunning) {
        stopwatchState.isRunning = false;
        clearInterval(stopwatchState.intervalId);
        
        document.getElementById('stopwatchStartBtn').disabled = false;
        document.getElementById('stopwatchStopBtn').disabled = true;
        document.getElementById('stopwatchLapBtn').disabled = true;
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
    
    document.getElementById('stopwatchStartBtn').disabled = false;
    document.getElementById('stopwatchStopBtn').disabled = true;
    document.getElementById('stopwatchLapBtn').disabled = true;
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

// Countdown Timer Functionality
let countdownState = {
    isRunning: false,
    isPaused: false,
    totalSeconds: 0,
    currentSeconds: 0,
    intervalId: null
};

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
        }
    });
    
    updateCountdownDisplay();
}

function updateCountdownFromInputs() {
    if (!countdownState.isRunning) {
        const hours = parseInt(document.getElementById('countdownHours').value) || 0;
        const minutes = parseInt(document.getElementById('countdownMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('countdownSeconds').value) || 0;
        
        countdownState.totalSeconds = hours * 3600 + minutes * 60 + seconds;
        countdownState.currentSeconds = countdownState.totalSeconds;
        updateCountdownDisplay();
    }
}

function startCountdown() {
    if (!countdownState.isRunning) {
        // Get values from inputs if not set
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
            
            document.getElementById('countdownStartBtn').disabled = true;
            document.getElementById('countdownPauseBtn').disabled = false;
            
            // Disable inputs
            ['countdownHours', 'countdownMinutes', 'countdownSeconds'].forEach(id => {
                document.getElementById(id).disabled = true;
            });
        }
    }
}

function pauseCountdown() {
    if (countdownState.isRunning) {
        countdownState.isRunning = false;
        countdownState.isPaused = true;
        clearInterval(countdownState.intervalId);
        
        document.getElementById('countdownStartBtn').disabled = false;
        document.getElementById('countdownPauseBtn').disabled = true;
    }
}

function resetCountdown() {
    countdownState.isRunning = false;
    countdownState.isPaused = false;
    clearInterval(countdownState.intervalId);
    countdownState.currentSeconds = countdownState.totalSeconds;
    
    updateCountdownDisplay();
    
    document.getElementById('countdownStartBtn').disabled = false;
    document.getElementById('countdownPauseBtn').disabled = true;
    
    // Enable inputs
    ['countdownHours', 'countdownMinutes', 'countdownSeconds'].forEach(id => {
        document.getElementById(id).disabled = false;
    });
    
    // Remove complete animation
    const display = document.getElementById('countdownDisplay');
    if (display) display.classList.remove('countdown-complete');
}

function completeCountdown() {
    clearInterval(countdownState.intervalId);
    countdownState.isRunning = false;
    
    const display = document.getElementById('countdownDisplay');
    if (display) {
        display.classList.add('countdown-complete');
    }
    
    // Notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Countdown Complete!', {
            body: 'Time\'s up!',
            icon: '🔔'
        });
    }
    
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    document.getElementById('countdownStartBtn').disabled = false;
    document.getElementById('countdownPauseBtn').disabled = true;
    
    // Enable inputs
    ['countdownHours', 'countdownMinutes', 'countdownSeconds'].forEach(id => {
        document.getElementById(id).disabled = false;
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

// Real-Time Clock Functionality
let clockState = {
    format24: false,
    intervalId: null
};

function initializeClock() {
    const format12Btn = document.getElementById('format12Btn');
    const format24Btn = document.getElementById('format24Btn');
    
    if (format12Btn) format12Btn.addEventListener('click', () => setClockFormat(false));
    if (format24Btn) format24Btn.addEventListener('click', () => setClockFormat(true));
    
    // Load saved format
    const savedFormat = localStorage.getItem('clockFormat');
    if (savedFormat === '24') {
        setClockFormat(true);
    }
    
    updateClock();
    clockState.intervalId = setInterval(updateClock, 1000);
}

function setClockFormat(format24) {
    clockState.format24 = format24;
    localStorage.setItem('clockFormat', format24 ? '24' : '12');
    
    const format12Btn = document.getElementById('format12Btn');
    const format24Btn = document.getElementById('format24Btn');
    
    if (format12Btn && format24Btn) {
        if (format24) {
            format12Btn.classList.remove('active');
            format24Btn.classList.add('active');
        } else {
            format24Btn.classList.remove('active');
            format12Btn.classList.add('active');
        }
    }
    
    updateClock();
}

function updateClock() {
    const display = document.getElementById('clockDisplay');
    const dateDisplay = document.getElementById('clockDate');
    
    if (!display || !dateDisplay) return;
    
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    if (!clockState.format24) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        display.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
    } else {
        display.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// Scroll to Timer on Load
function scrollToTimer() {
    // Smooth scroll to timer section (already at top, but ensure it's visible)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Request Notification Permission
if ('Notification' in window && Notification.permission === 'default') {
    // Optionally request permission on user interaction
    document.addEventListener('click', () => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, { once: true });
}

// Handle page visibility (pause timer when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && timerState.isRunning) {
        // Optionally pause when tab is hidden
        // pauseTimer();
    }
});

