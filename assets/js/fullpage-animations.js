// ===================================
// FULLPAGE PORTFOLIO - JAVASCRIPT
// Scroll Snap & 3D Animations
// ===================================

// ============ LOADER ============
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const progress = document.querySelector('.loader-progress');
    const percentage = document.querySelector('.loader-percentage');

    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);

            setTimeout(() => {
                loader.classList.add('hidden');
                initAll();
            }, 500);
        }

        progress.style.width = loadProgress + '%';
        percentage.textContent = Math.floor(loadProgress) + '%';
    }, 100);
});

// ============ INITIALIZATION ============
function initAll() {
    initThreeJS();
    initTypingEffect();
    initScrollHandling();
    initNavigationDots();
    initContactForm();
    observeSections();
}

// ============ THREE.JS 3D BACKGROUND ============
function initThreeJS() {
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

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x50c878,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Geometric shapes
    const shapes = [];
    const geometries = [
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.IcosahedronGeometry(1, 0)
    ];

    for (let i = 0; i < 4; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? 0x50c878 : 0x00d4ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 50;
        mesh.position.y = (Math.random() - 0.5) * 50;
        mesh.position.z = (Math.random() - 0.5) * 50;

        shapes.push(mesh);
        scene.add(mesh);
    }

    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
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

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        shapes.forEach((shape, index) => {
            shape.rotation.x += 0.01 * (index + 1) * 0.1;
            shape.rotation.y += 0.01 * (index + 1) * 0.1;
        });

        camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
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

// ============ TYPING EFFECT ============
function initTypingEffect() {
    const typedElement = document.querySelector('.typed-text');
    if (!typedElement) return;

    const texts = [
        'Fullstack Developer',
        'Java Developer',
        'Javascript Developer',
        'Problem Solver',
        'Creative Thinker'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typedElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// ============ SCROLL HANDLING ============
function initScrollHandling() {
    const container = document.getElementById('fullpage-container');
    const sections = document.querySelectorAll('.fullpage-section');
    let currentSection = 0;
    let isScrolling = false;

    // Update active section on scroll
    container.addEventListener('scroll', () => {
        if (isScrolling) return;

        const scrollPosition = container.scrollTop;
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop - windowHeight / 2 &&
                scrollPosition < sectionBottom - windowHeight / 2) {
                if (currentSection !== index) {
                    currentSection = index;
                    updateActiveDot(index);
                    animateSection(section);
                }
            }
        });
    });

    // Scroll buttons
    document.querySelectorAll('.scroll-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = parseInt(btn.getAttribute('data-target'));
            scrollToSection(targetSection);
        });
    });

    function scrollToSection(index) {
        isScrolling = true;
        const section = sections[index];

        container.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth'
        });

        currentSection = index;
        updateActiveDot(index);

        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    function animateSection(section) {
        // Add entrance animations
        const elements = section.querySelectorAll('.section-header, .about-grid > *, .timeline-item, .project-card, .skill-item');

        elements.forEach((el, index) => {
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
            }, 10);
        });
    }
}

// ============ NAVIGATION DOTS ============
function initNavigationDots() {
    const dots = document.querySelectorAll('.dot');
    const container = document.getElementById('fullpage-container');
    const sections = document.querySelectorAll('.fullpage-section');

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionIndex = parseInt(dot.getAttribute('data-section'));
            const section = sections[sectionIndex];

            container.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth'
            });

            updateActiveDot(sectionIndex);
        });
    });
}

function updateActiveDot(index) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

// ============ SECTION OBSERVER ============
function observeSections() {
    const sections = document.querySelectorAll('.fullpage-section');

    const observerOptions = {
        root: document.getElementById('fullpage-container'),
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const sectionIndex = parseInt(section.getAttribute('data-section'));

                // Animate elements in the section
                const animatedElements = section.querySelectorAll('.hero-text > *, .about-image, .about-content, .timeline-item, .skill-item, .project-card, .contact-card');

                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ============ CONTACT FORM ============
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    emailjs.init("stx4pVofchydMFDhJ");

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        emailjs.send('service_portfolio', 'template_contact', formData)
            .then(function(response) {
                showNotification('Message sent successfully!', 'success');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, function(error) {
                showNotification('Failed to send message. Please try again.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #50c878, #00d4ff)' : 'linear-gradient(135deg, #ff3c78, #f5576c)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============ GSAP ANIMATIONS (Enhanced) ============
if (typeof gsap !== 'undefined') {
    // Animate elements on scroll
    const container = document.getElementById('fullpage-container');

    container.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.fullpage-section');
        const scrollTop = container.scrollTop;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const scrollProgress = (scrollTop - sectionTop) / sectionHeight;

            if (scrollProgress >= -0.5 && scrollProgress <= 1.5) {
                // Parallax effect for section content
                const content = section.querySelector('.section-content');
                if (content) {
                    const offset = scrollProgress * 50;
                    content.style.transform = `translateY(${offset}px)`;
                }
            }
        });
    });
}

// ============ SMOOTH SECTION TRANSITIONS ============
document.addEventListener('DOMContentLoaded', () => {
    // Add transition classes to all sections
    const sections = document.querySelectorAll('.fullpage-section');
    sections.forEach((section, index) => {
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// ============ KEYBOARD NAVIGATION ============
document.addEventListener('keydown', (e) => {
    const container = document.getElementById('fullpage-container');
    const sections = document.querySelectorAll('.fullpage-section');
    const currentScroll = container.scrollTop;
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
            container.scrollTo({
                top: sections[currentIndex + 1].offsetTop,
                behavior: 'smooth'
            });
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentIndex > 0) {
            container.scrollTo({
                top: sections[currentIndex - 1].offsetTop,
                behavior: 'smooth'
            });
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else if (e.key === 'End') {
        e.preventDefault();
        container.scrollTo({
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
        const container = document.getElementById('fullpage-container');
        const sections = document.querySelectorAll('.fullpage-section');
        const currentScroll = container.scrollTop;
        const windowHeight = window.innerHeight;

        let currentIndex = 0;
        sections.forEach((section, index) => {
            if (Math.abs(section.offsetTop - currentScroll) < windowHeight / 2) {
                currentIndex = index;
            }
        });

        if (diff > 0 && currentIndex < sections.length - 1) {
            // Swipe up
            container.scrollTo({
                top: sections[currentIndex + 1].offsetTop,
                behavior: 'smooth'
            });
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe down
            container.scrollTo({
                top: sections[currentIndex - 1].offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

console.log('🚀 Fullpage Portfolio initialized!');
