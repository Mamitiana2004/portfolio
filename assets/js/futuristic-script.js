// ===================================
// FUTURISTIC MINIMAL PORTFOLIO - JS
// 3D Effects + Parallax + Interactions
// ===================================

// ============ LOADER ============
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        initAll();
    }, 2000);
});

// ============ INITIALIZATION ============
function initAll() {
    init3DBackground();
    initParallax();
    initScrollAnimations();
    initNavigation();
    init3DSkillsEffects();
    init3DProjectEffects();
    initContactForm();
}

// ============ 3D BACKGROUND WITH THREE.JS ============
function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
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
    camera.position.setZ(30);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x50c878,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create geometric shapes
    const shapes = [];
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0)
    ];

    for (let i = 0; i < 3; i++) {
        const geometry = geometries[i];
        const material = new THREE.MeshStandardMaterial({
            color: 0x50c878,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 30;
        mesh.position.y = (Math.random() - 0.5) * 30;
        mesh.position.z = (Math.random() - 0.5) * 30;

        shapes.push(mesh);
        scene.add(mesh);
    }

    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate particles slowly
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0003;

        // Rotate shapes
        shapes.forEach((shape, index) => {
            shape.rotation.x += 0.005 * (index + 1);
            shape.rotation.y += 0.005 * (index + 1);
        });

        // Camera follows mouse gently
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

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

// ============ NAVIGATION ============
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContainer = document.getElementById('main-container');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                mainContainer.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // CTA buttons
    document.querySelectorAll('.btn-primary[href^="#"], .btn-secondary[href^="#"]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                mainContainer.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============ 3D SKILLS EFFECTS ============
function init3DSkillsEffects() {
    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', (e) => {
            // Add 3D rotation on hover
            const rect = tag.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 5;
            const rotateY = -(x - centerX) / 5;

            gsap.to(tag, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        tag.addEventListener('mousemove', (e) => {
            const rect = tag.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 5;
            const rotateY = -(x - centerX) / 5;

            gsap.to(tag, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.1,
                ease: 'power2.out'
            });
        });

        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

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

console.log('✨ Futuristic Portfolio initialized!');
