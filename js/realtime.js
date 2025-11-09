// 🌍 Real-Time World Clock Functionality (Dropdown below logo)
let clockState = {
    format24: false,
    intervalId: null,
    selectedZone: 'Asia/Kolkata'
};

document.addEventListener('DOMContentLoaded', () => {
    initializeClock();
});

// 🕓 Initialize clock, event listeners, and saved preferences
function initializeClock() {
    const format12Btn = document.getElementById('format12Btn');
    const format24Btn = document.getElementById('format24Btn');
    const timezoneSelect = document.getElementById('timezoneSelect');

    // Load preferences from localStorage
    const savedFormat = localStorage.getItem('clockFormat');
    const savedZone = localStorage.getItem('selectedZone');

    if (savedFormat === '24') clockState.format24 = true;
    if (savedZone) clockState.selectedZone = savedZone;

    // Set initial UI states
    if (timezoneSelect) timezoneSelect.value = clockState.selectedZone;
    updateFormatButtons();

    // ⏰ Start clock updates
    updateClock();
    clockState.intervalId = setInterval(updateClock, 1000);

    // 🔄 Format toggle buttons
    if (format12Btn) format12Btn.addEventListener('click', () => setClockFormat(false));
    if (format24Btn) format24Btn.addEventListener('click', () => setClockFormat(true));

    // 🌍 Timezone selection
    if (timezoneSelect) {
        timezoneSelect.addEventListener('change', (e) => {
            clockState.selectedZone = e.target.value;
            localStorage.setItem('selectedZone', clockState.selectedZone);
            animateDropdown(timezoneSelect);
            updateClock();
        });
    }
}

// 🌐 Update the displayed time and date
function updateClock() {
    const display = document.getElementById('clockDisplay');
    const dateDisplay = document.getElementById('clockDate');
    const zone = clockState.selectedZone || 'Asia/Kolkata';

    if (!display) return;

    const now = new Date();
    const localTime = new Date(now.toLocaleString("en-US", { timeZone: zone }));

    let hours = localTime.getHours();
    const minutes = localTime.getMinutes();
    const seconds = localTime.getSeconds();

    // 🕕 12-hour / 24-hour format
    if (!clockState.format24) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        display.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    } else {
        display.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    // 📅 Date and timezone
    if (dateDisplay) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZoneName: 'short'
        };
        dateDisplay.textContent = localTime.toLocaleDateString('en-US', { ...options, timeZone: zone });
    }
}

// 🧭 Helper for leading zero padding
function pad(num) {
    return String(num).padStart(2, '0');
}

// 🌓 Toggle 12-hour and 24-hour mode
function setClockFormat(format24) {
    clockState.format24 = format24;
    localStorage.setItem('clockFormat', format24 ? '24' : '12');
    updateFormatButtons();
    updateClock();
}

// 🎨 Visually update active format buttons
function updateFormatButtons() {
    const format12Btn = document.getElementById('format12Btn');
    const format24Btn = document.getElementById('format24Btn');

    if (!format12Btn || !format24Btn) return;

    if (clockState.format24) {
        format12Btn.classList.remove('active');
        format24Btn.classList.add('active');
    } else {
        format24Btn.classList.remove('active');
        format12Btn.classList.add('active');
    }
}

// ✨ Animate dropdown when timezone changes (premium glow effect)
function animateDropdown(element) {
    element.style.boxShadow = `0 0 12px 3px var(--accent-primary)`;

    setTimeout(() => {
        element.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
    }, 800);
}
