document.addEventListener("DOMContentLoaded", () => {

    // ── 1. Navbar scroll effect ──
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ── 2. GSAP Hero Animation（CSSと競合しないフェードイン） ──
    gsap.registerPlugin(ScrollTrigger);
    const heroTl = gsap.timeline();
    heroTl.fromTo(".sai-word.speed",
        { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
    )
    .fromTo(".sai-word.action",
        { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.5"
    )
    .fromTo(".sai-word.innovation",
        { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.5"
    )
    .from(".hero-ja", { scale: 0.95, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.3")
    .from(".hero-actions", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

    // ── 3. Canvas Particle Background（トンマナ紺） ──
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(25, 47, 97, 0.55)';
            ctx.fill();
        }
    }
    function initParticles() {
        particles = [];
        const count = Math.floor((width * height) / 15000);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(25,47,97,${(1 - dist/120) * 0.45})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    }
    window.addEventListener('resize', () => { resize(); initParticles(); });
    resize(); initParticles(); animate();

    // ── 4. Intersection Observer ──
    const targets = document.querySelectorAll('.js-fade, .js-fade-up, .js-fade-left, .js-fade-right');
    if (targets.length > 0) {
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
        targets.forEach(el => obs.observe(el));
    }

    // ── 5. ハンバーガーメニュー ──
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');

    if (hamburger && mobileMenu && overlay) {
        function openMenu() {
            hamburger.classList.add('is-open');
            mobileMenu.classList.add('is-open');
            overlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            hamburger.classList.remove('is-open');
            mobileMenu.classList.remove('is-open');
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
        });
        overlay.addEventListener('click', closeMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    }
});
