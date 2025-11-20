// ===================================
// FUTURISTIC MINIMAL PORTFOLIO - JS
// 3D Effects + Parallax + Interactions
// ===================================

// ============ LOADER ============
window.addEventListener('load', () => {
    initLoaderParticles();
    animateLoader();
});

function initLoaderParticles() {
    const canvas = document.getElementById('loader-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get saved theme color
    const savedTheme = localStorage.getItem('portfolio-theme') || 'green';
    const themeColors = {
        green: { r: 80, g: 200, b: 120 },
        blue: { r: 0, g: 212, b: 255 },
        purple: { r: 157, g: 78, b: 237 },
        orange: { r: 255, g: 107, b: 53 },
        pink: { r: 255, g: 0, b: 110 }
    };
    const themeColor = themeColors[savedTheme] || themeColors.green;

    // Space travel particles
    const particles = [];
    const particleCount = 300;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 500;
        particles.push({
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            z: Math.random() * 1000,
            speed: 0
        });
    }

    // Speed multiplier for acceleration effect
    let speedMultiplier = 1;

    function animate() {
        // Clear with fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            // Calculate position from center
            const dx = particle.x - centerX;
            const dy = particle.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Move particle away from center (space travel)
            particle.z -= particle.speed * speedMultiplier;

            // Update speed based on z position
            particle.speed = 5 + (1000 - particle.z) / 50;

            // Calculate screen position (perspective)
            const scale = 1000 / (1000 + particle.z);
            const screenX = centerX + dx * scale;
            const screenY = centerY + dy * scale;

            // Calculate size and opacity based on z
            const size = (1 - particle.z / 1000) * 3;
            const opacity = Math.max(0, 1 - particle.z / 1000);

            // Draw particle
            if (opacity > 0 && size > 0) {
                ctx.fillStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${opacity})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${opacity})`;
                ctx.beginPath();
                ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
                ctx.fill();

                // Draw trail
                const trailLength = Math.min(50, particle.speed * speedMultiplier * 2);
                ctx.strokeStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${opacity * 0.5})`;
                ctx.lineWidth = size / 2;
                ctx.beginPath();
                ctx.moveTo(screenX, screenY);
                const angle = Math.atan2(dy, dx);
                ctx.lineTo(
                    screenX - Math.cos(angle) * trailLength * scale,
                    screenY - Math.sin(angle) * trailLength * scale
                );
                ctx.stroke();
            }

            // Reset particle when too close
            if (particle.z < -100) {
                const newAngle = Math.random() * Math.PI * 2;
                const newDistance = Math.random() * 500;
                particle.x = centerX + Math.cos(newAngle) * newDistance;
                particle.y = centerY + Math.sin(newAngle) * newDistance;
                particle.z = 1000;
                particle.speed = 0;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Export speed control
    window.loaderSpeedControl = {
        setSpeed: (multiplier) => { speedMultiplier = multiplier; }
    };

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function animateLoader() {
    const loader = document.getElementById('loader');

    let progress = 0;
    const duration = 3000; // 3 seconds
    const interval = 30; // Update every 30ms
    const increment = (100 * interval) / duration;

    const progressInterval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            // Go directly to site
            setTimeout(() => {
                loader.classList.add('hidden');
                initAll();
            }, 500);
        }

        // Accelerate particles based on progress (1x to 5x speed)
        const speedMultiplier = 1 + (progress / 100) * 4;
        if (window.loaderSpeedControl) {
            window.loaderSpeedControl.setSpeed(speedMultiplier);
        }
    }, interval);
}

// ============ INITIALIZATION ============
function initAll() {
    init3DBackground();
    initParallax();
    initScrollAnimations();
    initSkillsProgressBars();
    initContactForm();
    initSettings();
    initDigitalClock();
    initTerminal();
    initSkillModal();
    initSectionNavigation();
    initKonamiCode();
    initEasterEggs();
}

// Store Three.js materials for theme updates
window.threejsMaterials = { particles: null, shapes: [] };

// ============ 3D BACKGROUND WITH THREE.JS ============
function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0, 20, 50);
    camera.rotation.x = -0.3;

    // Create infinite 3D grid (Tron style)
    const gridHelper = new THREE.GridHelper(200, 50, window.currentThemeColor || 0x50c878, window.currentThemeColor || 0x50c878);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    gridHelper.position.y = -10;
    scene.add(gridHelper);

    // Create data stream particles
    const dataParticles = [];
    const particlesCount = 200;

    for (let i = 0; i < particlesCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: window.currentThemeColor || 0x50c878,
            transparent: true,
            opacity: 0.8
        });
        const particle = new THREE.Mesh(geometry, material);

        // Random position
        particle.position.set(
            (Math.random() - 0.5) * 100,
            Math.random() * 60 - 30,
            -Math.random() * 100 - 50
        );

        // Store velocity
        particle.userData = {
            velocity: 0.3 + Math.random() * 0.5,
            trail: []
        };

        scene.add(particle);
        dataParticles.push(particle);
    }

    // Store for theme updates
    window.threejsMaterials.grid = gridHelper;
    window.threejsMaterials.dataParticles = dataParticles;

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Animate grid movement
        gridHelper.position.z += 0.5;
        if (gridHelper.position.z > 4) {
            gridHelper.position.z = 0;
        }

        // Animate data particles (space travel effect)
        dataParticles.forEach(particle => {
            particle.position.z += particle.userData.velocity;

            // Reset particle when it goes too far
            if (particle.position.z > 50) {
                particle.position.z = -100;
                particle.position.x = (Math.random() - 0.5) * 100;
                particle.position.y = Math.random() * 60 - 30;
            }

            // Subtle pulse effect
            particle.scale.setScalar(1 + Math.sin(time * 3 + particle.position.x) * 0.3);
        });

        // Subtle camera movement
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
        camera.position.y = 20 + mouseY * 3;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ============ PARALLAX EFFECTS WITH GSAP ============
function initParallax() {
    gsap.registerPlugin(ScrollTrigger);

    const parallaxElements = document.querySelectorAll('.parallax-element');

    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;

        gsap.to(element, {
            y: () => -(window.innerHeight * speed * 0.3),
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                scroller: "#main-container"
            }
        });
    });
}

// ============ SCROLL ANIMATIONS ============
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContainer = document.getElementById('main-container');

    // Update active nav on scroll
    mainContainer.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = mainContainer.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ============ NAVIGATION (Removed) ============
// Navigation has been removed from the design

// ============ 3D PROJECT EFFECTS ============
function init3DProjectEffects() {
    const projects = document.querySelectorAll('.project-item:not(.disabled)');

    projects.forEach(project => {
        project.addEventListener('mouseenter', (e) => {
            // Add perspective effect
            gsap.to(project, {
                z: 20,
                rotateX: 2,
                duration: 0.6,
                ease: 'power3.out'
            });
        });

        project.addEventListener('mousemove', (e) => {
            const rect = project.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const centerX = rect.width / 2;

            const rotateY = (x - centerX) / 50;

            gsap.to(project, {
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        project.addEventListener('mouseleave', () => {
            gsap.to(project, {
                z: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: 'power3.out'
            });
        });
    });
}

// ============ CONTACT FORM ============
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    if (typeof emailjs !== 'undefined') {
        emailjs.init("stx4pVofchydMFDhJ");
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        if (typeof emailjs !== 'undefined') {
            emailjs.send('service_portfolio', 'template_contact', formData)
                .then(function(response) {
                    showNotification('Message sent successfully!', 'success');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, function(error) {
                    showNotification('Failed to send message. Please try again.', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        } else {
            setTimeout(() => {
                showNotification('Message sent successfully!', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        }
    });
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 40px;
        padding: 20px 30px;
        background: ${type === 'success' ? '#50c878' : '#ff3c78'};
        color: white;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 10px 40px ${type === 'success' ? 'rgba(80, 200, 120, 0.4)' : 'rgba(255, 60, 120, 0.4)'};
    `;

    document.body.appendChild(notification);

    gsap.from(notification, {
        y: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
    });

    setTimeout(() => {
        gsap.to(notification, {
            y: 100,
            opacity: 0,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => notification.remove()
        });
    }, 3000);
}

// ============ KEYBOARD NAVIGATION ============
document.addEventListener('keydown', (e) => {
    const mainContainer = document.getElementById('main-container');
    const sections = document.querySelectorAll('.section');
    const currentScroll = mainContainer.scrollTop;
    const windowHeight = window.innerHeight;

    let currentIndex = 0;

    sections.forEach((section, index) => {
        if (Math.abs(section.offsetTop - currentScroll) < windowHeight / 2) {
            currentIndex = index;
        }
    });

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
            mainContainer.scrollTo({
                top: sections[currentIndex + 1].offsetTop,
                behavior: 'smooth'
            });
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentIndex > 0) {
            mainContainer.scrollTo({
                top: sections[currentIndex - 1].offsetTop,
                behavior: 'smooth'
            });
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        mainContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else if (e.key === 'End') {
        e.preventDefault();
        mainContainer.scrollTo({
            top: sections[sections.length - 1].offsetTop,
            behavior: 'smooth'
        });
    }
});

// ============ TOUCH SWIPE SUPPORT ============
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        const mainContainer = document.getElementById('main-container');
        const sections = document.querySelectorAll('.section');
        const currentScroll = mainContainer.scrollTop;
        const windowHeight = window.innerHeight;

        let currentIndex = 0;

        sections.forEach((section, index) => {
            if (Math.abs(section.offsetTop - currentScroll) < windowHeight / 2) {
                currentIndex = index;
            }
        });

        if (diff > 0 && currentIndex < sections.length - 1) {
            mainContainer.scrollTo({
                top: sections[currentIndex + 1].offsetTop,
                behavior: 'smooth'
            });
        } else if (diff < 0 && currentIndex > 0) {
            mainContainer.scrollTo({
                top: sections[currentIndex - 1].offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ============ MOUSE TRAIL EFFECT (Optional) ============
function initMouseTrail() {
    let mouseX = 0;
    let mouseY = 0;
    let trail = [];

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const particle = document.createElement('div');
        particle.className = 'mouse-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #50c878;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.6;
            left: ${mouseX}px;
            top: ${mouseY}px;
            box-shadow: 0 0 10px rgba(80, 200, 120, 0.5);
        `;

        document.body.appendChild(particle);

        gsap.to(particle, {
            opacity: 0,
            scale: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    });
}

// Uncomment to enable mouse trail
// initMouseTrail();

// ============ SKILLS PROGRESS BARS ============
function initSkillsProgressBars() {
    const skillItems = document.querySelectorAll('.skill-item');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const level = skillItem.getAttribute('data-level');
                const progressBar = skillItem.querySelector('.skill-progress');
                const percentText = skillItem.querySelector('.skill-percent');

                if (progressBar && level) {
                    // Animate progress bar
                    setTimeout(() => {
                        progressBar.style.width = level + '%';
                        if (percentText) {
                            animateNumber(percentText, 0, parseInt(level), 1500);
                        }
                    }, 200);
                }

                // Unobserve after animation
                observer.unobserve(skillItem);
            }
        });
    }, observerOptions);

    skillItems.forEach(item => observer.observe(item));
}

// Animate number from start to end
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        const current = Math.floor(start + range * easeProgress);
        element.textContent = current + '%';

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ============ SETTINGS PANEL ============
function initSettings() {
    const themeBtn = document.getElementById('theme-btn');
    const themeSidebar = document.getElementById('theme-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');

    // Mode options
    const modeOptions = document.querySelectorAll('.mode-option');
    // Theme color options
    const themeOptions = document.querySelectorAll('.theme-option');
    // Language options
    const languageOptions = document.querySelectorAll('.language-option');
    // Effect toggles
    const parallaxToggle = document.getElementById('parallax-toggle');
    const particlesToggle = document.getElementById('particles-toggle');

    if (!themeBtn || !themeSidebar) return;

    // Load saved settings from localStorage
    const savedMode = localStorage.getItem('portfolio-mode') || 'light';
    const savedTheme = localStorage.getItem('portfolio-theme') || 'green';
    const savedLang = localStorage.getItem('portfolio-lang') || 'en';
    const savedParallax = localStorage.getItem('portfolio-parallax') !== 'false';
    const savedParticles = localStorage.getItem('portfolio-particles') !== 'false';

    // Apply saved settings
    document.documentElement.setAttribute('data-mode', savedMode);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-lang', savedLang);

    // Set active states
    modeOptions.forEach(option => {
        if (option.getAttribute('data-mode') === savedMode) {
            option.classList.add('active');
        }
    });

    themeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === savedTheme) {
            option.classList.add('active');
        }
    });

    languageOptions.forEach(option => {
        if (option.getAttribute('data-lang') === savedLang) {
            option.classList.add('active');
        }
    });

    if (parallaxToggle) parallaxToggle.checked = savedParallax;
    if (particlesToggle) particlesToggle.checked = savedParticles;

    // Update Three.js particle color based on theme
    updateParticleColor(savedTheme);

    // Open sidebar
    themeBtn.addEventListener('click', () => {
        themeSidebar.classList.add('active');
    });

    // Close sidebar
    closeSidebar.addEventListener('click', () => {
        themeSidebar.classList.remove('active');
    });

    // Close sidebar on outside click
    document.addEventListener('click', (e) => {
        if (!themeSidebar.contains(e.target) && !themeBtn.contains(e.target)) {
            themeSidebar.classList.remove('active');
        }
    });

    // Mode selection
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.getAttribute('data-mode');
            modeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            document.documentElement.setAttribute('data-mode', mode);
            localStorage.setItem('portfolio-mode', mode);
        });
    });

    // Theme color selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
            updateParticleColor(theme);
        });
    });

    // Language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            languageOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            document.documentElement.setAttribute('data-lang', lang);
            localStorage.setItem('portfolio-lang', lang);
        });
    });

    // Parallax toggle
    if (parallaxToggle) {
        parallaxToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            localStorage.setItem('portfolio-parallax', enabled);
            toggleParallax(enabled);
        });
    }

    // Particles toggle
    if (particlesToggle) {
        particlesToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            localStorage.setItem('portfolio-particles', enabled);
            toggleParticles(enabled);
        });
    }

    // Toggle parallax effect
    function toggleParallax(enabled) {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        if (enabled) {
            parallaxElements.forEach(el => {
                el.style.transform = '';
            });
        } else {
            parallaxElements.forEach(el => {
                el.style.transform = 'translateY(0) !important';
            });
        }
    }

    // Toggle particles
    function toggleParticles(enabled) {
        const canvas = document.getElementById('bg-canvas');
        if (canvas) {
            canvas.style.opacity = enabled ? '0.4' : '0';
        }
    }
}

// Update Three.js particle color based on theme
function updateParticleColor(theme) {
    const themeColors = {
        green: 0x50c878,
        blue: 0x00d4ff,
        purple: 0x9d4edd,
        orange: 0xff6b35,
        pink: 0xff006e
    };

    const color = themeColors[theme] || themeColors.green;

    // Store the color for when the scene is created
    window.currentThemeColor = color;

    // Update grid
    if (window.threejsMaterials.grid) {
        window.threejsMaterials.grid.material.color.setHex(color);
    }

    // Update data particles
    if (window.threejsMaterials.dataParticles) {
        window.threejsMaterials.dataParticles.forEach(particle => {
            particle.material.color.setHex(color);
        });
    }
}

// ============ DIGITAL CLOCK ============
function initDigitalClock() {
    const clockTime = document.getElementById('clock-time');
    const clockDate = document.getElementById('clock-date');
    const digitalClock = document.querySelector('.digital-clock');

    if (!clockTime || !clockDate) return;

    function updateClock() {
        const now = new Date();

        // Format time (HH:MM:SS)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockTime.textContent = `${hours}:${minutes}:${seconds}`;

        // Format date (Day, Month DD, YYYY)
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        clockDate.textContent = now.toLocaleDateString('en-US', options);
    }

    // Update immediately
    updateClock();

    // Update every second
    setInterval(updateClock, 1000);

    // Click on clock to open terminal
    if (digitalClock) {
        digitalClock.style.cursor = 'pointer';
        digitalClock.addEventListener('click', () => {
            openTerminal();
        });
    }
}

// ============ TERMINAL ============
function openTerminal() {
    const terminal = document.getElementById('terminal-overlay');
    const terminalInput = document.getElementById('terminal-input');

    if (terminal) {
        terminal.classList.remove('hidden');
        setTimeout(() => {
            terminalInput.focus();
        }, 100);
    }
}

function initTerminal() {
    const terminal = document.getElementById('terminal-overlay');
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    const terminalClose = document.getElementById('terminal-close');

    if (!terminal) return;

    // Command history
    const commandHistory = [];
    let historyIndex = -1;

    // Commands
    const commands = {
        help: () => {
            return `<span class="terminal-success">Available commands:</span>
  help             - Show this help message
  about            - Information about me
  skills           - List my technical skills
  projects         - View my projects
  contact          - Get my contact information
  theme [color]    - Change theme (green, blue, purple, orange, pink)
  clear            - Clear terminal
  whoami           - Display current user
  date             - Display current date
  time             - Display time with greeting
  quote            - Random developer quote
  status           - System status

<span class="terminal-success">Hidden commands (try to discover them!):</span>
  Type 'secret' for a hint... 🔍`;
        },

        about: () => {
            return `<span class="terminal-success">About Mamitiana Faneva</span>

  Fullstack Developer passionate about creating innovative web applications.
  Specializing in modern JavaScript frameworks and backend technologies.

  Focus: Building scalable and performant solutions
  Experience: React, Node.js, Spring Boot, Docker, and more

  "Code is poetry written in logic"`;
        },

        skills: () => {
            return `<span class="terminal-success">Technical Skills:</span>

  Frontend:  JavaScript, TypeScript, React, Next.js, Vue.js
  Backend:   Node.js, Express, Spring Boot, Java
  Database:  PostgreSQL, MongoDB
  DevOps:    Docker, Git, CI/CD

  Languages: Français (Native), English (Fluent), Malagasy (Native)`;
        },

        projects: () => {
            return `<span class="terminal-success">Featured Projects:</span>

  1. NodaJPA - TypeScript ORM for Node.js
     → https://github.com/Mamitiana2004/NodaJPA

  2. Clinic Management Platform - Spring Boot application
     → https://github.com/Mamitiana2004/eval3

  3. PDF Management System - React + Python full-stack
     → https://github.com/Mamitiana2004/gestion_pdf_front

  4. T-Rex Runner Game - Java Swing game
     → https://github.com/Mamitiana2004/t_rex_runner`;
        },

        contact: () => {
            return `<span class="terminal-success">Contact Information:</span>

  Email:    mamitianafaneva2004@gmail.com
  Phone:    +261 34 11 092 23
  GitHub:   github.com/Mamitiana2004
  LinkedIn: linkedin.com/in/faneva-mamitiana-andriaharimanana

  Feel free to reach out for collaborations or opportunities!`;
        },

        theme: (args) => {
            const validThemes = ['green', 'blue', 'purple', 'orange', 'pink'];
            const theme = args[0]?.toLowerCase();

            if (!theme) {
                return `<span class="terminal-error">Error:</span> Please specify a theme color.
Available themes: ${validThemes.join(', ')}`;
            }

            if (!validThemes.includes(theme)) {
                return `<span class="terminal-error">Error:</span> Invalid theme '${theme}'.
Available themes: ${validThemes.join(', ')}`;
            }

            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
            updateParticleColor(theme);

            return `<span class="terminal-success">Theme changed to ${theme}!</span>`;
        },

        clear: () => {
            terminalBody.innerHTML = '';
            return null;
        },

        whoami: () => {
            return `guest`;
        },

        date: () => {
            return new Date().toString();
        },

        matrix: () => {
            return `<span class="terminal-success">Wake up, Neo...</span>

  The Matrix has you...
  Follow the white rabbit.

  Knock, knock, Neo.

  🐇 🕳️`;
        },

        hack: () => {
            const hacks = [
                'Accessing mainframe...',
                'Bypassing firewall...',
                'Decrypting password hash...',
                'Injecting payload...',
                'Establishing backdoor...',
                'Access granted!'
            ];
            setTimeout(() => {
                hacks.forEach((hack, i) => {
                    setTimeout(() => {
                        addLine(`<span class="terminal-success">[${i + 1}/6]</span> ${hack}`);
                    }, i * 500);
                });
            }, 100);
            return `<span class="terminal-success">Initiating hack sequence...</span>`;
        },

        sudo: (args) => {
            const cmd = args.join(' ');
            return `<span class="terminal-error">[sudo]</span> Nice try! You're not root 😏
But I appreciate the confidence.`;
        },

        coffee: () => {
            return `<span class="terminal-success">Brewing coffee...</span>

      ( (
       ) )
    ........
    |      |]
    \\      /
     \`----'

  ☕ Coffee is ready! Take a break.`;
        },

        starwars: () => {
            return `<span class="terminal-success">A long time ago in a galaxy far, far away...</span>

  "Do or do not. There is no try." - Yoda

  "The Force will be with you. Always." - Obi-Wan

  May the Force be with you, young developer! 🌟`;
        },

        status: () => {
            const uptime = Math.floor(performance.now() / 1000);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = uptime % 60;

            return `<span class="terminal-success">SYSTEM STATUS:</span>

  Uptime:       ${hours}h ${minutes}m ${seconds}s
  CPU Usage:    ${Math.floor(Math.random() * 30 + 10)}%
  Memory:       ${Math.floor(Math.random() * 2048 + 1024)}MB / 8192MB
  Processes:    ${Math.floor(Math.random() * 50 + 150)}
  Network:      CONNECTED
  Firewall:     ACTIVE
  Mood:         EXCELLENT 😎`;
        },

        decrypt: () => {
            const encrypted = '4d616d697469616e612046616e657661';
            return `<span class="terminal-success">Decrypting message...</span>

  Encrypted: ${encrypted}
  Algorithm: AES-256
  Key found: ****************

  Decrypted message: "Mamitiana Faneva"

  🔓 Decryption successful!`;
        },

        konami: () => {
            return `<span class="terminal-success">🎮 KONAMI CODE ACTIVATED! 🎮</span>

  You've unlocked the legendary cheat code!

  ↑ ↑ ↓ ↓ ← → ← → B A

  +30 Lives
  +999 Skills Points
  Infinite Creativity Unlocked

  You're now in GOD MODE! 💪`;
        },

        time: () => {
            const now = new Date();
            const hour = now.getHours();
            let greeting = '';

            if (hour >= 5 && hour < 12) greeting = 'Good morning! ☀️';
            else if (hour >= 12 && hour < 18) greeting = 'Good afternoon! 🌤️';
            else if (hour >= 18 && hour < 22) greeting = 'Good evening! 🌆';
            else greeting = 'Working late? Get some rest! 🌙';

            return `${greeting}\n\nCurrent time: ${now.toLocaleTimeString()}`;
        },

        quote: () => {
            const quotes = [
                '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
                '"First, solve the problem. Then, write the code." - John Johnson',
                '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
                '"Simplicity is the soul of efficiency." - Austin Freeman',
                '"Make it work, make it right, make it fast." - Kent Beck'
            ];
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            return `<span class="terminal-success">Random Developer Quote:</span>\n\n${quote}`;
        },

        secret: () => {
            return `<span class="terminal-success">🎉 You found a secret command! 🎉</span>

  There are more secrets hidden in this terminal...
  Try different commands and see what you discover!

  Hint: Try classic cheat codes or programmer terms 😉`;
        },

        exit: () => {
            terminal.classList.add('hidden');
            return null;
        }
    };

    // Add command to terminal
    function addLine(content, isCommand = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';

        if (isCommand) {
            line.innerHTML = `<span class="terminal-prompt">guest@portfolio:~$</span> <span class="terminal-text">${content}</span>`;
        } else if (content) {
            line.innerHTML = `<span class="terminal-text">${content}</span>`;
        }

        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Process command
    function processCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) return;

        // Add to history
        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;

        // Display command
        addLine(trimmed, true);

        // Parse command
        const parts = trimmed.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Execute command
        if (commands[cmd]) {
            const output = commands[cmd](args);
            if (output !== null) {
                addLine(output);
            }
        } else {
            addLine(`<span class="terminal-error">Command not found:</span> ${cmd}. Type 'help' for available commands.`);
        }
    }

    // Handle input
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = terminalInput.value;
            processCommand(input);
            terminalInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const input = terminalInput.value.toLowerCase();
            const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));
            if (matches.length === 1) {
                terminalInput.value = matches[0];
            }
        }
    });

    // Close terminal
    terminalClose.addEventListener('click', () => {
        terminal.classList.add('hidden');
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !terminal.classList.contains('hidden')) {
            terminal.classList.add('hidden');
        }
    });

    // Click outside to close
    terminal.addEventListener('click', (e) => {
        if (e.target === terminal) {
            terminal.classList.add('hidden');
        }
    });
}

// ============ KONAMI CODE ============
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        if (key === konamiCode[konamiIndex] || e.code === konamiCode[konamiIndex]) {
            konamiIndex++;

            if (konamiIndex === konamiCode.length) {
                // Konami code activated!
                activateKonamiMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateKonamiMode() {
    // Mark god mode as active
    window.godModeActive = true;

    // Epic notification with power-up effect
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div id="god-mode-notification" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff0080 0%, #ff8c00 50%, #40e0d0 100%);
            color: white;
            padding: 50px 80px;
            border-radius: 30px;
            font-size: 42px;
            font-weight: 900;
            text-align: center;
            z-index: 20000;
            box-shadow: 0 30px 80px rgba(255, 0, 128, 0.6), 0 0 100px rgba(255, 140, 0, 0.4);
            animation: godModeEntry 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        ">
            ⚡ GOD MODE ACTIVATED ⚡<br>
            <span style="font-size: 20px; opacity: 0.95; display: block; margin-top: 20px; font-weight: 600; letter-spacing: 3px;">
                ∞ UNLIMITED POWER ∞
            </span>
            <div style="font-size: 14px; margin-top: 15px; opacity: 0.8; font-weight: 500;">
                Press SPACE for explosions • Click for effects
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Add animations
    if (!document.getElementById('god-mode-animations')) {
        const style = document.createElement('style');
        style.id = 'god-mode-animations';
        style.textContent = `
            @keyframes godModeEntry {
                0% {
                    transform: translate(-50%, -50%) scale(0) rotate(-360deg);
                    opacity: 0;
                    filter: blur(20px);
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.3) rotate(0deg);
                    filter: blur(0px);
                }
                100% {
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                    opacity: 1;
                    filter: blur(0px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add rainbow effect
    const rainbowInterval = setInterval(() => {
        const hue = Math.random() * 360;
        document.documentElement.style.setProperty('--primary-color', `hsl(${hue}, 70%, 60%)`);
        document.documentElement.style.setProperty('--glow-color', `hsl(${hue}, 70%, 60%)`);
    }, 150);

    // God mode powers
    enableGodModePowers();

    // Remove notification after 4 seconds but keep powers
    setTimeout(() => {
        const notif = document.getElementById('god-mode-notification');
        if (notif) {
            notif.style.animation = 'godModeEntry 0.5s ease reverse';
            setTimeout(() => notif.remove(), 500);
        }
    }, 4000);

    // Stop rainbow and restore theme after 10 seconds
    setTimeout(() => {
        clearInterval(rainbowInterval);
        const savedTheme = localStorage.getItem('portfolio-theme') || 'green';
        updateParticleColor(savedTheme);
        window.godModeActive = false;
    }, 10000);
}

function enableGodModePowers() {
    // Power 1: SPACE key creates explosions
    const spaceHandler = (e) => {
        if (e.code === 'Space' && window.godModeActive && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            createExplosion(window.innerWidth / 2, window.innerHeight / 2);
        }
    };

    // Power 2: Click anywhere creates ripples
    const clickHandler = (e) => {
        if (window.godModeActive) {
            createGodModeRipple(e.clientX, e.clientY);
        }
    };

    // Power 3: Mouse trail
    const mouseMoveHandler = (e) => {
        if (window.godModeActive) {
            createGodModeTrail(e.clientX, e.clientY);
        }
    };

    document.addEventListener('keydown', spaceHandler);
    document.addEventListener('click', clickHandler);
    document.addEventListener('mousemove', mouseMoveHandler);

    // Remove listeners after 10 seconds
    setTimeout(() => {
        document.removeEventListener('keydown', spaceHandler);
        document.removeEventListener('click', clickHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
    }, 10000);
}

function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 200 + Math.random() * 100;

        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '99999';
        particle.style.boxShadow = '0 0 10px currentColor';

        document.body.appendChild(particle);

        const moveX = Math.cos(angle) * velocity;
        const moveY = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${moveX}px, ${moveY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
        });

        setTimeout(() => particle.remove(), 1000);
    }
}

function createGodModeRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.border = '3px solid var(--primary-color)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '99998';

    document.body.appendChild(ripple);

    ripple.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(15)', opacity: 0 }
    ], {
        duration: 800,
        easing: 'ease-out'
    });

    setTimeout(() => ripple.remove(), 800);
}

function createGodModeTrail(x, y) {
    if (Math.random() > 0.7) return; // Only 30% chance

    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    trail.style.width = '8px';
    trail.style.height = '8px';
    trail.style.background = 'var(--primary-color)';
    trail.style.borderRadius = '50%';
    trail.style.transform = 'translate(-50%, -50%)';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '99997';
    trail.style.boxShadow = '0 0 10px var(--glow-color)';

    document.body.appendChild(trail);

    trail.animate([
        { opacity: 0.8, transform: 'translate(-50%, -50%) scale(1)' },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0)' }
    ], {
        duration: 500
    });

    setTimeout(() => trail.remove(), 500);
}

// ============ SKILL MODAL ============
function initSkillModal() {
    const skillTags = document.querySelectorAll('.skill-tag');
    const modal = document.getElementById('skill-modal');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    const modalClose = modal?.querySelector('.modal-close');
    const modalSkillName = document.getElementById('modal-skill-name');
    const modalProgress = document.getElementById('modal-progress');
    const modalPercentage = document.getElementById('modal-percentage');
    const modalFrameworksList = document.getElementById('modal-frameworks-list');

    if (!modal) return;

    // Open modal on skill tag click
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const skillName = tag.textContent.trim();
            const skillLevel = tag.getAttribute('data-level');
            const skillType = tag.getAttribute('data-type');
            const frameworksData = tag.getAttribute('data-frameworks');

            // Update modal content
            modalSkillName.textContent = skillName;

            // Animate progress bar
            modalProgress.style.width = '0%';
            modalPercentage.textContent = '0%';

            setTimeout(() => {
                modalProgress.style.width = skillLevel + '%';
                animateNumber(modalPercentage, 0, parseInt(skillLevel), 1000);
            }, 100);

            // Update frameworks list
            modalFrameworksList.innerHTML = '';
            if (frameworksData) {
                try {
                    const frameworks = JSON.parse(frameworksData);
                    frameworks.forEach(framework => {
                        const li = document.createElement('li');
                        li.textContent = framework;
                        modalFrameworksList.appendChild(li);
                    });
                } catch (e) {
                    console.error('Error parsing frameworks:', e);
                }
            } else if (skillType === 'language') {
                // For languages, show proficiency level
                const li = document.createElement('li');
                li.textContent = `Proficiency: ${skillLevel}%`;
                modalFrameworksList.appendChild(li);
            }

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============ SECTION NAVIGATION TIMELINE ============
function initSectionNavigation() {
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('.section');
    const mainContainer = document.getElementById('main-container');

    if (!mainContainer || navDots.length === 0) return;

    // Handle dot click navigation
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                mainContainer.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active dot on scroll
    mainContainer.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPosition = mainContainer.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            const dotSection = dot.getAttribute('data-section');
            if (dotSection === currentSection) {
                dot.classList.add('active');
            }
        });
    });
}

// ============ ADDITIONAL EASTER EGGS ============
function initEasterEggs() {
    // Easter Egg 1: Mouse Shake - Glitch Effect
    initMouseShake();

    // Easter Egg 2: Secret Word Typing - "neo" triggers Matrix effect
    initSecretWord();

    // Initialize all easter eggs
    initAllEasterEggs();
}

// Mouse Shake Detection - Rapid mouse movement triggers glitch
function initMouseShake() {
    let mouseVelocity = [];
    let lastX = 0, lastY = 0;
    let shakeActivated = false;

    document.addEventListener('mousemove', (e) => {
        if (shakeActivated) return;

        const velocityX = Math.abs(e.clientX - lastX);
        const velocityY = Math.abs(e.clientY - lastY);
        const velocity = velocityX + velocityY;

        mouseVelocity.push(velocity);
        if (mouseVelocity.length > 10) mouseVelocity.shift();

        const avgVelocity = mouseVelocity.reduce((a, b) => a + b, 0) / mouseVelocity.length;

        // Shake detected!
        if (avgVelocity > 50) {
            triggerGlitchEffect();
            shakeActivated = true;
            setTimeout(() => shakeActivated = false, 5000);
        }

        lastX = e.clientX;
        lastY = e.clientY;
    });
}

function triggerGlitchEffect() {
    const body = document.body;
    body.style.animation = 'glitchShake 0.5s ease';

    // Add glitch animation if it doesn't exist
    if (!document.getElementById('glitch-animation')) {
        const style = document.createElement('style');
        style.id = 'glitch-animation';
        style.textContent = `
            @keyframes glitchShake {
                0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
                10% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
                20% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
                30% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
                40% { transform: translate(5px, 5px); filter: hue-rotate(360deg); }
                50% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
                60% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
                70% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
                80% { transform: translate(5px, 5px); filter: hue-rotate(0deg); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        body.style.animation = '';
    }, 500);
}

// Secret Word Detection - Type "neo" anywhere
function initSecretWord() {
    let typedChars = [];
    const secretWord = 'neo';
    let activated = false;

    document.addEventListener('keydown', (e) => {
        if (activated) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        typedChars.push(e.key.toLowerCase());
        if (typedChars.length > secretWord.length) typedChars.shift();

        if (typedChars.join('') === secretWord) {
            triggerMatrixRain();
            activated = true;
            setTimeout(() => activated = false, 10000);
        }
    });
}

function triggerMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    showEasterEggNotification('🎭 WAKE UP, NEO...', 'The Matrix has you...');

    const interval = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 33);

    setTimeout(() => {
        clearInterval(interval);
        canvas.remove();
    }, 5000);
}

// Double-click logo for warp speed
function initLogoDoubleClick() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    heroTitle.style.cursor = 'pointer';
    heroTitle.title = 'Double-click me...';

    heroTitle.addEventListener('dblclick', () => {
        triggerWarpSpeed();
    });
}

function triggerWarpSpeed() {
    const scene = window.scene;
    if (!scene) return;

    showEasterEggNotification('🚀 ENGAGING WARP DRIVE!', 'Prepare for light speed...');

    // Accelerate background particles
    const originalSpeed = 0.05;
    let warpSpeed = originalSpeed;
    const warpInterval = setInterval(() => {
        warpSpeed += 0.5;
        // Update Three.js scene speed if possible
        if (window.dataParticles) {
            window.dataParticles.forEach(p => {
                p.position.y -= warpSpeed;
            });
        }
    }, 50);

    // Add warp lines effect
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('canvas-container')?.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const lines = [];

    for (let i = 0; i < 100; i++) {
        lines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 200 + 100,
            speed: Math.random() * 20 + 10
        });
    }

    const warpAnimation = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;

        lines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x, line.y + line.length);
            ctx.stroke();

            line.y += line.speed;
            line.speed += 0.5;

            if (line.y > canvas.height) {
                line.y = -line.length;
                line.x = Math.random() * canvas.width;
                line.speed = Math.random() * 20 + 10;
            }
        });
    }, 16);

    setTimeout(() => {
        clearInterval(warpInterval);
        clearInterval(warpAnimation);
        canvas.remove();
    }, 3000);
}

// Click all 4 corners in order
function initCornerClicks() {
    const cornerSequence = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
    let currentStep = 0;
    let lastClickTime = 0;
    const timeLimit = 5000; // 5 seconds to complete

    document.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastClickTime > timeLimit) {
            currentStep = 0;
        }

        const x = e.clientX;
        const y = e.clientY;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const margin = 100; // Corner detection margin

        let clickedCorner = null;

        if (x < margin && y < margin) clickedCorner = 'top-left';
        else if (x > w - margin && y < margin) clickedCorner = 'top-right';
        else if (x > w - margin && y > h - margin) clickedCorner = 'bottom-right';
        else if (x < margin && y > h - margin) clickedCorner = 'bottom-left';

        if (clickedCorner === cornerSequence[currentStep]) {
            currentStep++;
            lastClickTime = now;

            // Visual feedback
            createCornerPing(x, y);

            if (currentStep === cornerSequence.length) {
                unlockSecretMessage();
                currentStep = 0;
            }
        }
    });
}

function createCornerPing(x, y) {
    const ping = document.createElement('div');
    ping.style.position = 'fixed';
    ping.style.left = x + 'px';
    ping.style.top = y + 'px';
    ping.style.width = '20px';
    ping.style.height = '20px';
    ping.style.background = 'var(--primary-color)';
    ping.style.borderRadius = '50%';
    ping.style.transform = 'translate(-50%, -50%)';
    ping.style.pointerEvents = 'none';
    ping.style.zIndex = '99999';
    ping.style.animation = 'pingExpand 0.6s ease-out';

    if (!document.getElementById('ping-animation')) {
        const style = document.createElement('style');
        style.id = 'ping-animation';
        style.textContent = `
            @keyframes pingExpand {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(ping);
    setTimeout(() => ping.remove(), 600);
}

function unlockSecretMessage() {
    const messages = [
        '🔓 You found the secret path!',
        '🎯 Precision is key in coding',
        '🧩 Puzzle master detected!',
        '🌟 You\'re thinking like a developer',
        '🔐 Access to hidden knowledge granted'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showEasterEggNotification('✨ SECRET UNLOCKED!', randomMessage);

    // Trigger special effect
    document.body.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);

    if (!document.getElementById('pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); filter: brightness(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Unified notification system for easter eggs
function showEasterEggNotification(title, message) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 40, 0.95));
            border: 2px solid var(--primary-color);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-size: 16px;
            font-weight: 600;
            z-index: 99999;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px var(--glow-color);
            animation: slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 350px;
        ">
            <div style="font-size: 20px; margin-bottom: 8px;">${title}</div>
            <div style="font-size: 14px; opacity: 0.85; color: var(--primary-color);">${message}</div>
        </div>
    `;

    if (!document.getElementById('slide-animation')) {
        const style = document.createElement('style');
        style.id = 'slide-animation';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ============ 10 ADDITIONAL EASTER EGGS ============

// Easter Egg 5: Hold Shift + Alt + D for Developer Mode
function initDeveloperMode() {
    let shiftPressed = false;
    let altPressed = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') shiftPressed = true;
        if (e.key === 'Alt') altPressed = true;

        if (shiftPressed && altPressed && e.key.toLowerCase() === 'd') {
            triggerDeveloperMode();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') shiftPressed = false;
        if (e.key === 'Alt') altPressed = false;
    });
}

function triggerDeveloperMode() {
    showEasterEggNotification('👨‍💻 DEVELOPER MODE', 'All secrets revealed!');

    // Show hidden stats overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--primary-color);
        color: var(--primary-color);
        padding: 20px;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        z-index: 99999;
        max-width: 300px;
    `;

    const stats = `
        <div style="margin-bottom: 10px; font-size: 14px; font-weight: bold;">🔧 SYSTEM STATS</div>
        <div>📊 Easter Eggs Found: ${window.easterEggsFound || 0}/15</div>
        <div>⏱️ Session Time: ${Math.floor(Date.now() / 60000)} min</div>
        <div>🖱️ Mouse Speed: ${Math.floor(Math.random() * 100)}%</div>
        <div>🎨 Theme: ${localStorage.getItem('portfolio-theme') || 'green'}</div>
        <div>🌐 Browser: ${navigator.userAgent.split(' ').pop()}</div>
        <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">Press ESC to close</div>
    `;

    overlay.innerHTML = stats;
    document.body.appendChild(overlay);

    const closeHandler = (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', closeHandler);
        }
    };
    document.addEventListener('keydown', closeHandler);

    setTimeout(() => {
        overlay.remove();
        document.removeEventListener('keydown', closeHandler);
    }, 10000);
}

// Easter Egg 6: Triple-click anywhere for confetti
function initTripleClick() {
    let clickCount = 0;
    let clickTimer = null;

    document.addEventListener('click', (e) => {
        clickCount++;

        if (clickTimer) clearTimeout(clickTimer);

        clickTimer = setTimeout(() => {
            if (clickCount === 3) {
                launchConfetti(e.clientX, e.clientY);
            }
            clickCount = 0;
        }, 400);
    });
}

function launchConfetti(x, y) {
    const colors = ['#ff0080', '#00d4ff', '#9d4eed', '#ff6b35', '#50c878'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        const size = Math.random() * 10 + 5;

        confetti.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 99999;
        `;

        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 300 + 100;
        const rotation = Math.random() * 720 - 360;

        confetti.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity + 500}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: 2000,
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
        });

        setTimeout(() => confetti.remove(), 2000);
    }
}

// Easter Egg 7: Type "gravity" to enable gravity on elements
function initGravityEasterEgg() {
    let typedChars = [];
    const secretWord = 'gravity';

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        typedChars.push(e.key.toLowerCase());
        if (typedChars.length > secretWord.length) typedChars.shift();

        if (typedChars.join('') === secretWord) {
            activateGravity();
            typedChars = [];
        }
    });
}

function activateGravity() {
    showEasterEggNotification('🌍 GRAVITY ENABLED', 'Physics activated!');

    const elements = document.querySelectorAll('.skill-tag, .project-card, .service-card');

    elements.forEach((el, index) => {
        setTimeout(() => {
            const rect = el.getBoundingClientRect();
            const clone = el.cloneNode(true);

            clone.style.position = 'fixed';
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.width = rect.width + 'px';
            clone.style.zIndex = '99999';

            document.body.appendChild(clone);

            const fallDistance = window.innerHeight - rect.top;
            const duration = Math.sqrt(fallDistance) * 30;

            clone.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${fallDistance}px) rotate(${Math.random() * 360}deg)`, opacity: 0.5 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.5, 0, 1, 1)'
            });

            setTimeout(() => clone.remove(), duration);
        }, index * 100);
    });
}

// Easter Egg 8: Scroll super fast to trigger speed lines
function initSpeedScrollDetection() {
    let lastScrollTop = 0;
    let scrollSpeed = 0;
    let speedLinesActive = false;

    const mainContainer = document.getElementById('main-container');
    if (!mainContainer) return;

    mainContainer.addEventListener('scroll', () => {
        const currentScrollTop = mainContainer.scrollTop;
        scrollSpeed = Math.abs(currentScrollTop - lastScrollTop);
        lastScrollTop = currentScrollTop;

        if (scrollSpeed > 100 && !speedLinesActive) {
            triggerSpeedLines();
            speedLinesActive = true;
            setTimeout(() => speedLinesActive = false, 2000);
        }
    });
}

function triggerSpeedLines() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const lines = [];

    for (let i = 0; i < 30; i++) {
        lines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 100 + 50,
            speed: Math.random() * 15 + 10,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    let frameCount = 0;
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        lines.forEach(line => {
            ctx.strokeStyle = `rgba(var(--primary-color-rgb, 80, 200, 120), ${line.opacity})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x, line.y + line.length);
            ctx.stroke();

            line.y += line.speed;
            if (line.y > canvas.height) {
                line.y = -line.length;
                line.x = Math.random() * canvas.width;
            }
        });

        frameCount++;
        if (frameCount < 60) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    };

    animate();
}

// Easter Egg 9: Press F for "Pay Respects"
function initPayRespects() {
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'f' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                payRespects();
            }
        }
    });
}

function payRespects() {
    const respect = document.createElement('div');
    respect.textContent = 'F';
    respect.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 200px;
        font-weight: 900;
        color: var(--primary-color);
        opacity: 0;
        pointer-events: none;
        z-index: 99999;
        text-shadow: 0 0 30px var(--glow-color);
    `;

    document.body.appendChild(respect);

    respect.animate([
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(1.5)' }
    ], {
        duration: 1500,
        easing: 'ease-out'
    });

    setTimeout(() => respect.remove(), 1500);
}

// Easter Egg 10: Rotate device/window rapidly
function initRotationDetection() {
    let lastOrientation = window.orientation || 0;
    let rotationCount = 0;

    window.addEventListener('orientationchange', () => {
        rotationCount++;
        if (rotationCount >= 2) {
            triggerDizzyEffect();
            rotationCount = 0;
        }
    });

    // For desktop: detect window resize
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        if (Math.abs(window.innerWidth - lastWidth) > 200) {
            triggerDizzyEffect();
        }
        lastWidth = window.innerWidth;
    });
}

function triggerDizzyEffect() {
    showEasterEggNotification('😵 DIZZY MODE', 'Everything is spinning...');

    document.body.style.animation = 'spin360 2s ease-in-out';

    if (!document.getElementById('spin-animation')) {
        const style = document.createElement('style');
        style.id = 'spin-animation';
        style.textContent = `
            @keyframes spin360 {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

// Easter Egg 11: Hold mouse down for 3 seconds
function initLongPress() {
    let pressTimer = null;
    let pressX = 0;
    let pressY = 0;

    document.addEventListener('mousedown', (e) => {
        pressX = e.clientX;
        pressY = e.clientY;

        pressTimer = setTimeout(() => {
            triggerPowerCharge(pressX, pressY);
        }, 3000);
    });

    document.addEventListener('mouseup', () => {
        if (pressTimer) clearTimeout(pressTimer);
    });

    document.addEventListener('mousemove', (e) => {
        if (pressTimer && (Math.abs(e.clientX - pressX) > 10 || Math.abs(e.clientY - pressY) > 10)) {
            clearTimeout(pressTimer);
        }
    });
}

function triggerPowerCharge(x, y) {
    showEasterEggNotification('⚡ POWER CHARGED!', 'Energy released!');

    // Create expanding energy ring
    const ring = document.createElement('div');
    ring.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        border: 4px solid var(--primary-color);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 99999;
        box-shadow: 0 0 20px var(--glow-color), inset 0 0 20px var(--glow-color);
    `;

    document.body.appendChild(ring);

    ring.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(30)', opacity: 0 }
    ], {
        duration: 1500,
        easing: 'ease-out'
    });

    setTimeout(() => ring.remove(), 1500);
}

// Easter Egg 12: Type "disco" for disco mode
function initDiscoMode() {
    let typedChars = [];
    const secretWord = 'disco';

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        typedChars.push(e.key.toLowerCase());
        if (typedChars.length > secretWord.length) typedChars.shift();

        if (typedChars.join('') === secretWord) {
            activateDiscoMode();
            typedChars = [];
        }
    });
}

function activateDiscoMode() {
    showEasterEggNotification('🕺 DISCO MODE', 'Let\'s party!');

    const colors = ['#ff0080', '#00d4ff', '#9d4eed', '#ff6b35', '#50c878', '#ffd700'];
    let colorIndex = 0;

    const discoInterval = setInterval(() => {
        document.documentElement.style.setProperty('--primary-color', colors[colorIndex]);
        document.documentElement.style.setProperty('--glow-color', colors[colorIndex]);
        colorIndex = (colorIndex + 1) % colors.length;
    }, 200);

    // Add disco ball
    const discoBall = document.createElement('div');
    discoBall.textContent = '🪩';
    discoBall.style.cssText = `
        position: fixed;
        left: 50%;
        top: 20%;
        transform: translateX(-50%);
        font-size: 100px;
        z-index: 99999;
        animation: discoSpin 2s linear infinite;
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
    `;

    if (!document.getElementById('disco-spin-animation')) {
        const style = document.createElement('style');
        style.id = 'disco-spin-animation';
        style.textContent = `
            @keyframes discoSpin {
                from { transform: translateX(-50%) rotate(0deg); }
                to { transform: translateX(-50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(discoBall);

    setTimeout(() => {
        clearInterval(discoInterval);
        discoBall.remove();
        const savedTheme = localStorage.getItem('portfolio-theme') || 'green';
        updateParticleColor(savedTheme);
    }, 5000);
}

// Easter Egg 13: Press arrow keys in Tetris pattern
function initTetrisPattern() {
    const tetrisPattern = ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    let patternIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === tetrisPattern[patternIndex]) {
            patternIndex++;
            if (patternIndex === tetrisPattern.length) {
                triggerTetrisEffect();
                patternIndex = 0;
            }
        } else if (tetrisPattern.includes(e.key)) {
            patternIndex = 0;
        }
    });
}

function triggerTetrisEffect() {
    showEasterEggNotification('🎮 TETRIS MODE', 'Blocks are falling!');

    const shapes = ['▢', '▣', '◆', '◇', '▲', '▼'];
    const colors = ['#ff0080', '#00d4ff', '#9d4eed', '#ff6b35', '#50c878'];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const block = document.createElement('div');
            block.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            block.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: -50px;
                font-size: 40px;
                color: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                z-index: 99999;
            `;

            document.body.appendChild(block);

            const fallDuration = 2000 + Math.random() * 1000;
            block.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`, opacity: 0.5 }
            ], {
                duration: fallDuration,
                easing: 'linear'
            });

            setTimeout(() => block.remove(), fallDuration);
        }, i * 200);
    }
}

// Easter Egg 14: Hover on corners for 2 seconds each
function initCornerHover() {
    const corners = {
        'top-left': { hovered: false, timer: null },
        'top-right': { hovered: false, timer: null },
        'bottom-left': { hovered: false, timer: null },
        'bottom-right': { hovered: false, timer: null }
    };

    let allCornersHovered = false;

    document.addEventListener('mousemove', (e) => {
        if (allCornersHovered) return;

        const margin = 50;
        const x = e.clientX;
        const y = e.clientY;
        const w = window.innerWidth;
        const h = window.innerHeight;

        let currentCorner = null;

        if (x < margin && y < margin) currentCorner = 'top-left';
        else if (x > w - margin && y < margin) currentCorner = 'top-right';
        else if (x < margin && y > h - margin) currentCorner = 'bottom-left';
        else if (x > w - margin && y > h - margin) currentCorner = 'bottom-right';

        // Reset timers for corners not being hovered
        Object.keys(corners).forEach(corner => {
            if (corner !== currentCorner && corners[corner].timer) {
                clearTimeout(corners[corner].timer);
                corners[corner].timer = null;
            }
        });

        // Start timer for current corner
        if (currentCorner && !corners[currentCorner].hovered && !corners[currentCorner].timer) {
            corners[currentCorner].timer = setTimeout(() => {
                corners[currentCorner].hovered = true;

                // Check if all corners hovered
                if (Object.values(corners).every(c => c.hovered)) {
                    allCornersHovered = true;
                    unlockMasterSecret();
                }
            }, 2000);
        }
    });
}

function unlockMasterSecret() {
    showEasterEggNotification('🏆 MASTER UNLOCKED!', 'You\'ve discovered everything!');

    // Epic celebration
    document.body.style.animation = 'rainbow-pulse 2s ease-in-out';

    if (!document.getElementById('rainbow-pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'rainbow-pulse-animation';
        style.textContent = `
            @keyframes rainbow-pulse {
                0%, 100% { filter: hue-rotate(0deg) brightness(1); }
                25% { filter: hue-rotate(90deg) brightness(1.2); }
                50% { filter: hue-rotate(180deg) brightness(1.4); }
                75% { filter: hue-rotate(270deg) brightness(1.2); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

// ============ NEW DIRECTION PATTERN EASTER EGGS ============

// Easter Egg: Street Fighter Hadouken (↓↘→ + P)
function initStreetFighterPattern() {
    const hadoukenPattern = ['ArrowDown', 'ArrowDown', 'ArrowRight', 'p'];
    let patternIndex = 0;
    let lastKeyTime = 0;

    document.addEventListener('keydown', (e) => {
        const now = Date.now();

        // Reset if too much time between keys (>1 second)
        if (now - lastKeyTime > 1000) {
            patternIndex = 0;
        }

        if (e.key === hadoukenPattern[patternIndex] || e.code === hadoukenPattern[patternIndex]) {
            patternIndex++;
            lastKeyTime = now;

            if (patternIndex === hadoukenPattern.length) {
                triggerHadouken();
                patternIndex = 0;
            }
        } else if (hadoukenPattern.includes(e.key) || hadoukenPattern.includes(e.code)) {
            patternIndex = 0;
        }
    });
}

function triggerHadouken() {
    showEasterEggNotification('🔥 HADOUKEN!', 'Street Fighter combo activated!');

    // Create energy ball
    const energyBall = document.createElement('div');
    energyBall.textContent = '⚡';
    energyBall.style.cssText = `
        position: fixed;
        left: -50px;
        top: 50%;
        font-size: 80px;
        transform: translateY(-50%);
        pointer-events: none;
        z-index: 99999;
        filter: drop-shadow(0 0 30px var(--primary-color));
    `;

    document.body.appendChild(energyBall);

    energyBall.animate([
        { left: '-50px', transform: 'translateY(-50%) rotate(0deg) scale(0.5)' },
        { left: '50%', transform: 'translateY(-50%) rotate(360deg) scale(1.5)' },
        { left: '110%', transform: 'translateY(-50%) rotate(720deg) scale(0.5)' }
    ], {
        duration: 1500,
        easing: 'ease-in'
    });

    setTimeout(() => energyBall.remove(), 1500);
}

// Easter Egg: Mortal Kombat Fatality (↓↓→ + K)
function initMortalKombatPattern() {
    const fatalityPattern = ['ArrowDown', 'ArrowDown', 'ArrowRight', 'k'];
    let patternIndex = 0;
    let lastKeyTime = 0;

    document.addEventListener('keydown', (e) => {
        const now = Date.now();

        if (now - lastKeyTime > 1000) {
            patternIndex = 0;
        }

        if (e.key === fatalityPattern[patternIndex] || e.code === fatalityPattern[patternIndex]) {
            patternIndex++;
            lastKeyTime = now;

            if (patternIndex === fatalityPattern.length) {
                triggerFatality();
                patternIndex = 0;
            }
        } else if (fatalityPattern.includes(e.key) || fatalityPattern.includes(e.code)) {
            patternIndex = 0;
        }
    });
}

function triggerFatality() {
    showEasterEggNotification('💀 FATALITY!', 'Mortal Kombat combo!');

    // Screen flash red
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: red;
        opacity: 0;
        pointer-events: none;
        z-index: 99998;
    `;

    document.body.appendChild(flash);

    flash.animate([
        { opacity: 0 },
        { opacity: 0.7 },
        { opacity: 0 }
    ], {
        duration: 500,
        iterations: 3
    });

    // Add "FATALITY" text
    const text = document.createElement('div');
    text.textContent = 'FATALITY';
    text.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        font-size: 120px;
        font-weight: 900;
        color: red;
        text-shadow: 0 0 40px red, 0 0 80px red;
        pointer-events: none;
        z-index: 99999;
        letter-spacing: 10px;
    `;

    document.body.appendChild(text);

    text.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 }
    ], {
        duration: 2000,
        easing: 'ease-out'
    });

    setTimeout(() => {
        flash.remove();
        text.remove();
    }, 2000);
}

// Easter Egg: Left-Right Pattern (←←→→)
function initLeftRightPattern() {
    const pattern = ['ArrowLeft', 'ArrowLeft', 'ArrowRight', 'ArrowRight'];
    let patternIndex = 0;
    let lastKeyTime = 0;

    document.addEventListener('keydown', (e) => {
        const now = Date.now();

        if (now - lastKeyTime > 1000) {
            patternIndex = 0;
        }

        if (e.code === pattern[patternIndex]) {
            patternIndex++;
            lastKeyTime = now;

            if (patternIndex === pattern.length) {
                triggerDanceMode();
                patternIndex = 0;
            }
        } else if (pattern.includes(e.code)) {
            patternIndex = 0;
        }
    });
}

function triggerDanceMode() {
    showEasterEggNotification('💃 DANCE MODE!', 'Left right left right!');

    // Make elements dance
    const elements = document.querySelectorAll('.skill-tag, .service-card, h1, h2');

    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animation = 'dance 0.5s ease';

            if (!document.getElementById('dance-animation')) {
                const style = document.createElement('style');
                style.id = 'dance-animation';
                style.textContent = `
                    @keyframes dance {
                        0%, 100% { transform: translateX(0) rotate(0deg); }
                        25% { transform: translateX(-15px) rotate(-5deg); }
                        75% { transform: translateX(15px) rotate(5deg); }
                    }
                `;
                document.head.appendChild(style);
            }

            setTimeout(() => {
                el.style.animation = '';
            }, 500);
        }, index * 50);
    });
}

// Easter Egg: Circle Pattern (↑→↓←↑→↓←)
function initCirclePattern() {
    const circlePattern = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft',
                          'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
    let patternIndex = 0;
    let lastKeyTime = 0;

    document.addEventListener('keydown', (e) => {
        const now = Date.now();

        if (now - lastKeyTime > 800) {
            patternIndex = 0;
        }

        if (e.code === circlePattern[patternIndex]) {
            patternIndex++;
            lastKeyTime = now;

            if (patternIndex === circlePattern.length) {
                triggerVortex();
                patternIndex = 0;
            }
        } else if (circlePattern.includes(e.code)) {
            patternIndex = 0;
        }
    });
}

function triggerVortex() {
    showEasterEggNotification('🌀 VORTEX!', 'Circle pattern unlocked!');

    // Create spinning vortex
    document.body.style.animation = 'vortexSpin 2s ease-in-out';

    if (!document.getElementById('vortex-animation')) {
        const style = document.createElement('style');
        style.id = 'vortex-animation';
        style.textContent = `
            @keyframes vortexSpin {
                0% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg); }
                50% { transform: scale(0.95) rotate(180deg); filter: hue-rotate(180deg); }
                100% { transform: scale(1) rotate(360deg); filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

// ============ NEW SECRET WORD EASTER EGGS ============

// Easter Egg: Type "hack"
function initHackMode() {
    let typedChars = [];
    const secretWord = 'hack';

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        typedChars.push(e.key.toLowerCase());
        if (typedChars.length > secretWord.length) typedChars.shift();

        if (typedChars.join('') === secretWord) {
            activateHackMode();
            typedChars = [];
        }
    });
}

function activateHackMode() {
    showEasterEggNotification('💻 HACK MODE!', 'Access granted...');

    // Create falling binary
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const binary = '01';
    const fontSize = 20;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    let frameCount = 0;
    const animate = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'var(--primary-color)';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = binary[Math.floor(Math.random() * binary.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        frameCount++;
        if (frameCount < 180) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    };

    animate();
}

// Easter Egg: Type "matrix"
function initMatrixWord() {
    let typedChars = [];
    const secretWord = 'matrix';

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        typedChars.push(e.key.toLowerCase());
        if (typedChars.length > secretWord.length) typedChars.shift();

        if (typedChars.join('') === secretWord) {
            activateMatrixMode();
            typedChars = [];
        }
    });
}

function activateMatrixMode() {
    showEasterEggNotification('🔴 RED PILL TAKEN', 'Welcome to the real world...');

    // Green tint overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, transparent 40%, rgba(0, 255, 0, 0.2) 100%);
        pointer-events: none;
        z-index: 9997;
        animation: matrixPulse 2s ease-in-out;
    `;

    if (!document.getElementById('matrix-pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'matrix-pulse-animation';
        style.textContent = `
            @keyframes matrixPulse {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(overlay);

    setTimeout(() => overlay.remove(), 2000);
}

// Easter Egg: Type "god"
function initGodWord() {
    let typedChars = [];
    const secretWord = 'god';

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        typedChars.push(e.key.toLowerCase());
        if (typedChars.length > secretWord.length) typedChars.shift();

        if (typedChars.join('') === secretWord) {
            activateGodWord();
            typedChars = [];
        }
    });
}

function activateGodWord() {
    showEasterEggNotification('👁️ OMNISCIENCE', 'You see all...');

    // X-ray vision effect
    document.body.style.animation = 'xray 3s ease-in-out';

    if (!document.getElementById('xray-animation')) {
        const style = document.createElement('style');
        style.id = 'xray-animation';
        style.textContent = `
            @keyframes xray {
                0%, 100% { filter: invert(0) contrast(1); }
                50% { filter: invert(1) contrast(2); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);
}

// Easter Egg: Type "ninja"
function initNinjaMode() {
    let typedChars = [];
    const secretWord = 'ninja';

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        typedChars.push(e.key.toLowerCase());
        if (typedChars.length > secretWord.length) typedChars.shift();

        if (typedChars.join('') === secretWord) {
            activateNinjaMode();
            typedChars = [];
        }
    });
}

function activateNinjaMode() {
    showEasterEggNotification('🥷 NINJA MODE!', 'Silent but deadly...');

    // Create smoke effect
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.textContent = '💨';
            smoke.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                font-size: ${Math.random() * 60 + 40}px;
                pointer-events: none;
                z-index: 99999;
                opacity: 0.8;
            `;

            document.body.appendChild(smoke);

            smoke.animate([
                { opacity: 0.8, transform: 'scale(0.5) rotate(0deg)' },
                { opacity: 0, transform: 'scale(2) rotate(360deg)' }
            ], {
                duration: 2000,
                easing: 'ease-out'
            });

            setTimeout(() => smoke.remove(), 2000);
        }, i * 100);
    }
}

// Easter Egg: Type "portal"
function initPortalWord() {
    let typedChars = [];
    const secretWord = 'portal';

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        typedChars.push(e.key.toLowerCase());
        if (typedChars.length > secretWord.length) typedChars.shift();

        if (typedChars.join('') === secretWord) {
            activatePortal();
            typedChars = [];
        }
    });
}

function activatePortal() {
    showEasterEggNotification('🌀 PORTAL OPENED!', 'Entering another dimension...');

    // Create portal effect
    const portal = document.createElement('div');
    portal.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: conic-gradient(
            from 0deg,
            var(--primary-color),
            transparent,
            var(--primary-color)
        );
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 99999;
        animation: portalSpin 1s linear infinite;
        box-shadow: 0 0 100px var(--glow-color), inset 0 0 100px var(--glow-color);
    `;

    if (!document.getElementById('portal-animation')) {
        const style = document.createElement('style');
        style.id = 'portal-animation';
        style.textContent = `
            @keyframes portalSpin {
                from { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
                to { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(portal);

    // Zoom in effect
    setTimeout(() => {
        portal.animate([
            { transform: 'translate(-50%, -50%) scale(1)' },
            { transform: 'translate(-50%, -50%) scale(10)' }
        ], {
            duration: 500,
            easing: 'ease-in'
        });
    }, 1500);

    setTimeout(() => portal.remove(), 2000);
}

// Initialize all easter eggs
function initAllEasterEggs() {
    // Direction pattern easter eggs
    initTetrisPattern();         // ↓←→↓←→
    initStreetFighterPattern();  // ↓↘→ + P (Hadouken)
    initMortalKombatPattern();   // ↓↓→ + K (Fatality)
    initLeftRightPattern();      // ←←→→
    initCirclePattern();         // ↑→↓←↑→↓←

    // Secret word easter eggs
    initGravityEasterEgg();      // "gravity"
    initDiscoMode();             // "disco"
    initHackMode();              // "hack"
    initMatrixWord();            // "matrix"
    initGodWord();               // "god"
    initNinjaMode();             // "ninja"
    initPortalWord();            // "portal"

    // Other interaction easter eggs
    initDeveloperMode();         // Shift+Alt+D
    initSpeedScrollDetection();  // Fast scroll
    initPayRespects();           // F key
    initRotationDetection();     // Window rotation
}

console.log('✨ Futuristic Portfolio initialized!');
