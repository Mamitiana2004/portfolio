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
  date             - Display current date and time
  matrix           - Easter egg 😉
  exit             - Close terminal`;
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

console.log('✨ Futuristic Portfolio initialized!');
