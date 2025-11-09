// Navigation System - Shared across all pages
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeSidebar();
    initializeSpotifyPlayer();
    updateActivePage();
    checkAuthBeforeNavigation();
});

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    document.getElementById('toolsMenu').classList.remove('active');
  });
});


// Get current page name from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '') {
        return 'pomodoro';
    } else if (page === 'stopwatch.html') {
        return 'stopwatch';
    } else if (page === 'countdown.html') {
        return 'countdown';
    } else if (page === 'realtime.html') {
        return 'clock';
    } else if (page === 'diary.html') {
        return 'diary';
    } else if (page === 'profile.html') {
        return 'profile';
    }
    return 'pomodoro';
}

// Update active state in sidebar
function updateActivePage() {
    const currentPage = getCurrentPage();
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Initialize Navigation Dropdown
function initializeNavigation() {
    const toolsBtn = document.getElementById('toolsBtn');
    const toolsMenu = document.getElementById('toolsMenu');
    const dropdown = toolsBtn?.closest('.dropdown');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navRight = document.querySelector('.nav-right');
    
    if (!toolsBtn || !toolsMenu || !dropdown) return;
    
    // Toggle dropdown on click
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
    
    // Handle dropdown item clicks
    const dropdownItems = toolsMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
            dropdown.classList.remove('active');
        });
    });
    
    // Hover effect for dropdown (desktop only)
    if (window.innerWidth > 768) {
        toolsBtn.addEventListener('mouseenter', () => {
            dropdown.classList.add('active');
        });
        
        dropdown.addEventListener('mouseleave', () => {
            dropdown.classList.remove('active');
        });
    }
    
    // Mobile menu toggle
    if (mobileMenuBtn && navRight) {
        mobileMenuBtn.addEventListener('click', () => {
            navRight.classList.toggle('mobile-active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navRight.classList.contains('mobile-active')) {
                icon?.setAttribute('data-feather', 'x');
            } else {
                icon?.setAttribute('data-feather', 'menu');
            }
            feather.replace();
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = navRight.querySelectorAll('a, button');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navRight.classList.remove('mobile-active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', 'menu');
                    feather.replace();
                }
            });
        });
    }
}

// Initialize Sidebar
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar?.classList.toggle('mobile-active');
            const icon = sidebarToggle.querySelector('i');
            if (sidebar?.classList.contains('mobile-active')) {
                icon?.setAttribute('data-feather', 'x');
            } else {
                icon?.setAttribute('data-feather', 'menu');
            }
            feather.replace();
        });
    }
    
    // Sidebar item click handlers
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href && href !== '#') {
                window.location.href = href;
            }
            
            // Close mobile sidebar
            if (window.innerWidth <= 768) {
                sidebar?.classList.remove('mobile-active');
                const icon = sidebarToggle?.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', 'menu');
                    feather.replace();
                }
            }
        });
    });
}

// Initialize Spotify Player
function initializeSpotifyPlayer() {
    const spotifyPlayer = document.getElementById('spotifyPlayer');
    
    if (spotifyPlayer) {
        setTimeout(() => {
            spotifyPlayer.classList.add('visible');
        }, 500);
    }
}

// Check auth before navigating to protected pages
async function checkAuthBeforeNavigation() {
    // Protect Write button and My Writings link
    const writeLink = document.querySelector('.write-link');
    const writingsLink = document.querySelector('a[href="writings.html"]');
    
    // Helper function to check auth
    async function checkAuth() {
        // Wait for Firebase to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!window.firebaseAuth) {
            return false;
        }
        
        return new Promise((resolve) => {
            const unsubscribe = window.firebaseAuth.onAuthStateChanged((user) => {
                unsubscribe(); // Unsubscribe after first check
                resolve(!!user);
            });
        });
    }
    
    // Handle Write button click
    if (writeLink) {
        writeLink.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'diary.html';
            }
        });
    }
    
    // Handle My Writings link click
    if (writingsLink) {
        writingsLink.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'writings.html';
            }
        });
    }
}

