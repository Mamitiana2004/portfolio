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

    // Matrix-style falling code
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');

    const columns = Math.floor(canvas.width / 20);
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height / 20;
    }

    // Scanning circles
    const circles = [];
    for (let i = 0; i < 5; i++) {
        circles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 0,
            maxRadius: 100 + Math.random() * 100,
            speed: 1 + Math.random() * 2
        });
    }

    // Glitch lines
    const glitchLines = [];

    function animate() {
        // Fade background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw matrix code
        ctx.fillStyle = 'rgba(80, 200, 120, 0.8)';
        ctx.font = '15px monospace';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(80, 200, 120, 0.8)';

        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * 20;
            const y = drops[i] * 20;

            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        // Draw scanning circles
        circles.forEach(circle => {
            ctx.strokeStyle = `rgba(80, 200, 120, ${1 - circle.radius / circle.maxRadius})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            ctx.stroke();

            circle.radius += circle.speed;

            if (circle.radius > circle.maxRadius) {
                circle.radius = 0;
                circle.x = Math.random() * canvas.width;
                circle.y = Math.random() * canvas.height;
            }
        });

        // Random glitch effect
        if (Math.random() > 0.95) {
            const glitchY = Math.random() * canvas.height;
            const glitchHeight = 2 + Math.random() * 10;
            ctx.fillStyle = 'rgba(80, 200, 120, 0.3)';
            ctx.fillRect(0, glitchY, canvas.width, glitchHeight);
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function animateLoader() {
    const loaderFill = document.getElementById('loader-fill');
    const loaderPercentage = document.getElementById('loader-percentage');
    const loaderStatus = document.getElementById('loader-status');
    const loader = document.getElementById('loader');
    const accessScreen = document.getElementById('access-screen');

    const statuses = [
        'Loading modules...',
        'Initializing components...',
        'Connecting to server...',
        'Loading assets...',
        'Preparing interface...',
        'Almost ready...',
        'Finalizing...'
    ];

    let progress = 0;
    const duration = 3000; // 3 seconds
    const interval = 30; // Update every 30ms
    const increment = (100 * interval) / duration;

    const progressInterval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            // Show access granted screen
            setTimeout(() => {
                loader.classList.add('hidden');
                accessScreen.classList.remove('hidden');

                // Hide access screen and show site
                setTimeout(() => {
                    accessScreen.classList.add('hidden');
                    initAll();
                }, 1500);
            }, 500);
        }

        // Update UI
        loaderFill.style.width = progress + '%';
        loaderPercentage.textContent = Math.floor(progress) + '%';

        // Update status text
        const statusIndex = Math.min(
            Math.floor((progress / 100) * statuses.length),
            statuses.length - 1
        );
        loaderStatus.textContent = statuses[statusIndex];
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

    // Create pulsing rings
    const rings = [];
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.RingGeometry(10 + i * 10, 10.5 + i * 10, 32);
        const material = new THREE.MeshBasicMaterial({
            color: window.currentThemeColor || 0x50c878,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -10;
        ring.userData = { baseOpacity: 0.2, pulseOffset: i * 0.5 };
        scene.add(ring);
        rings.push(ring);
    }

    // Create data lines (connection paths)
    const dataLines = [];
    for (let i = 0; i < 20; i++) {
        const points = [];
        const segments = 20;
        const startX = (Math.random() - 0.5) * 80;
        const startZ = -Math.random() * 80 - 20;

        for (let j = 0; j <= segments; j++) {
            points.push(new THREE.Vector3(
                startX + Math.sin(j * 0.5) * 5,
                Math.sin(j * 0.3) * 3,
                startZ + j * 3
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: window.currentThemeColor || 0x50c878,
            transparent: true,
            opacity: 0.3
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        dataLines.push({ line, points, offset: Math.random() * Math.PI * 2 });
    }

    // Store for theme updates
    window.threejsMaterials.grid = gridHelper;
    window.threejsMaterials.dataParticles = dataParticles;
    window.threejsMaterials.rings = rings;
    window.threejsMaterials.dataLines = dataLines;

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

        // Animate data particles
        dataParticles.forEach(particle => {
            particle.position.z += particle.userData.velocity;

            // Reset particle when it goes too far
            if (particle.position.z > 50) {
                particle.position.z = -100;
                particle.position.x = (Math.random() - 0.5) * 100;
                particle.position.y = Math.random() * 60 - 30;
            }

            // Pulse effect
            particle.scale.setScalar(1 + Math.sin(time * 3 + particle.position.x) * 0.5);
        });

        // Pulse rings
        rings.forEach((ring, index) => {
            const pulse = Math.sin(time * 2 + ring.userData.pulseOffset) * 0.5 + 0.5;
            ring.material.opacity = ring.userData.baseOpacity + pulse * 0.3;
            ring.scale.setScalar(1 + pulse * 0.1);
        });

        // Animate data lines
        dataLines.forEach(lineData => {
            const positions = lineData.line.geometry.attributes.position;
            for (let i = 0; i < lineData.points.length; i++) {
                const point = lineData.points[i];
                const wave = Math.sin(time * 2 + lineData.offset + i * 0.2);
                positions.setY(i, point.y + wave * 0.5);
            }
            positions.needsUpdate = true;
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

    // Update rings
    if (window.threejsMaterials.rings) {
        window.threejsMaterials.rings.forEach(ring => {
            ring.material.color.setHex(color);
        });
    }

    // Update data lines
    if (window.threejsMaterials.dataLines) {
        window.threejsMaterials.dataLines.forEach(lineData => {
            lineData.line.material.color.setHex(color);
        });
    }
}

// ============ DIGITAL CLOCK ============
function initDigitalClock() {
    const clockTime = document.getElementById('clock-time');
    const clockDate = document.getElementById('clock-date');

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
