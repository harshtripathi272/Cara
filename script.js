/* ═══════════════════════════════════════════════════════
   CARA — JavaScript Engine
   Powered by GSAP (ScrollTrigger) + Lenis Smooth Scroll
   ═══════════════════════════════════════════════════════ */

// ──────────────── UTILITY ────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ──────────────── LENIS SMOOTH SCROLL ────────────────
let lenis;

function initLenis() {
    if (prefersReducedMotion) return;

    // Optimized for Snappier Feel
    lenis = new Lenis({
        duration: 0.7, // Reduced from 1.2 for faster response
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential decay easing
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2, // Better touch responsiveness
        infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

// ──────────────── HEADER ────────────────
function initHeader() {
    const header = $('#header');
    if (!header) return;

    // Scroll shadow effect
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile navigation
    const bar = $('#bar');
    const navbar = $('#navbar');
    const closeBtn = $('#close');

    if (bar && navbar) {
        bar.addEventListener('click', () => {
            navbar.classList.add('active');
        });
    }

    if (closeBtn && navbar) {
        closeBtn.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    }

    // Close nav on link click (mobile)
    $$('#navbar li a').forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) navbar.classList.remove('active');
        });
    });
}

// ──────────────── HERO CAROUSEL ────────────────
let currentSlide = 0;
let heroInterval = null;
const HERO_INTERVAL_MS = 5000;

function initHeroCarousel() {
    const slides = $$('.hero-slide');
    const dots = $$('.hero-dot');
    if (!slides.length) return;

    // Show first slide immediately (no animation for first load)
    if (prefersReducedMotion) {
        slides.forEach((s, i) => {
            s.style.opacity = i === 0 ? '1' : '0';
            s.style.clipPath = 'none';
            s.classList.toggle('active', i === 0);
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === 0));
        return;
    }

    // Animate initial hero entrance
    const firstSlide = slides[0];
    firstSlide.classList.add('active');

    const tl = gsap.timeline({ delay: 0.3 });

    // Label animation
    tl.to('.hero-label', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    })
        // Title lines
        .to('.hero-title .line-inner', {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out'
        }, '-=0.3')
        // Subtitle
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3')
        // CTA button
        .to('.hero-cta', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.2')
        // First slide image reveal
        .to(firstSlide, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.8,
            ease: 'power3.inOut'
        }, 0.2)
        // Image entrance
        .from(firstSlide.querySelector('img'), {
            scale: 1.1,
            duration: 1,
            ease: 'power2.out'
        }, 0.4);

    // Dot click handlers
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            if (i !== currentSlide) {
                goToSlide(i, slides, dots);
            }
        });
    });

    // Auto-advance
    heroInterval = setInterval(() => {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next, slides, dots);
    }, HERO_INTERVAL_MS);

    // Pause on hover
    const hero = $('#hero');
    if (hero) {
        hero.addEventListener('mouseenter', () => clearInterval(heroInterval));
        hero.addEventListener('mouseleave', () => {
            heroInterval = setInterval(() => {
                const next = (currentSlide + 1) % slides.length;
                goToSlide(next, slides, dots);
            }, HERO_INTERVAL_MS);
        });
    }

    // Hero decoration breathing
    gsap.to('.hero-deco-1', {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.hero-deco-2', {
        y: 10,
        x: 8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.hero-deco-3', {
        y: -8,
        x: -5,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

function goToSlide(index, slides, dots) {
    const prevSlide = slides[currentSlide];
    const nextSlide = slides[index];

    const tl = gsap.timeline();

    // Fade out current
    tl.to(prevSlide, {
        clipPath: 'inset(0 0 0 100%)',
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
            prevSlide.classList.remove('active');
            gsap.set(prevSlide, { clipPath: 'inset(0 100% 0 0)' });
        }
    })
        // Reveal new slide
        .set(nextSlide, { opacity: 1 })
        .to(nextSlide, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.7,
            ease: 'power3.inOut',
            onStart: () => nextSlide.classList.add('active')
        }, '-=0.3')
        // Image entrance with subtle scale
        .from(nextSlide.querySelector('img'), {
            scale: 1.08,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.5');

    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[index]?.classList.add('active');

    currentSlide = index;
}

// ──────────────── SCROLL ANIMATIONS ────────────────
function initScrollAnimations() {
    if (prefersReducedMotion) {
        // Instantly show all elements
        $$('.fe-box, .pro, .blog-card').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    // Feature boxes stagger
    const feBoxes = $$('.fe-box');
    if (feBoxes.length) {
        ScrollTrigger.batch(feBoxes, {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            },
            start: 'top 85%',
            once: true
        });
    }

    // Product cards stagger
    const proCards = $$('.pro');
    if (proCards.length) {
        ScrollTrigger.batch(proCards, {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: 'power2.out'
                });
            },
            start: 'top 88%',
            once: true
        });
    }

    // Blog cards stagger
    const blogCards = $$('.blog-card');
    if (blogCards.length) {
        ScrollTrigger.batch(blogCards, {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.12,
                    ease: 'power2.out'
                });
            },
            start: 'top 85%',
            once: true
        });
    }

    // Banner slide-in
    const bannerH2 = $('#banner h2');
    if (bannerH2) {
        gsap.from(bannerH2, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#banner',
                start: 'top 80%',
                once: true
            }
        });
    }

    // Small banner boxes
    const bannerBoxes = $$('.banner-box');
    bannerBoxes.forEach((box, i) => {
        gsap.from(box, {
            x: i % 2 === 0 ? -40 : 40,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: box,
                start: 'top 85%',
                once: true
            }
        });
    });

    // Banner3 boxes
    const banner3Boxes = $$('.banner3-box');
    if (banner3Boxes.length) {
        ScrollTrigger.batch(banner3Boxes, {
            onEnter: (batch) => {
                gsap.from(batch, {
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.15,
                    ease: 'power2.out'
                });
            },
            start: 'top 85%',
            once: true
        });
    }

    // Newsletter slide-in from sides
    const newsText = $('.newstext');
    const newsForm = $('.newsletter-form');

    if (newsText) {
        gsap.from(newsText, {
            x: -30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#newsletter',
                start: 'top 85%',
                once: true
            }
        });
    }

    if (newsForm) {
        gsap.from(newsForm, {
            x: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#newsletter',
                start: 'top 85%',
                once: true
            }
        });
    }

    // Section headers
    $$('.section-header').forEach(header => {
        gsap.from(header, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                once: true
            }
        });
    });

    // Page header parallax (inner pages)
    const pageHeader = $('#page-header');
    if (pageHeader) {
        gsap.to(pageHeader, {
            backgroundPositionY: '30%',
            ease: 'none',
            scrollTrigger: {
                trigger: pageHeader,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

// ──────────────── PRODUCT DETAIL IMAGE GALLERY ────────────────
function initProductGallery() {
    const mainImg = $('#MainImg');
    const smallImgs = $$('.small-img');

    if (!mainImg || !smallImgs.length) return;

    smallImgs.forEach(img => {
        img.addEventListener('click', () => {
            // Animate crossfade
            if (!prefersReducedMotion) {
                gsap.to(mainImg, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                        mainImg.src = img.src;
                        gsap.to(mainImg, { opacity: 1, duration: 0.3 });
                    }
                });
            } else {
                mainImg.src = img.src;
            }

            // Update active state
            $$('.small-img-col').forEach(col => col.classList.remove('active'));
            img.closest('.small-img-col')?.classList.add('active');
        });
    });

    // Set first as active
    $$('.small-img-col')[0]?.classList.add('active');
}

// ──────────────── MICRO-INTERACTIONS ────────────────
function initMicroInteractions() {
    // Product card hover parallax
    $$('.pro').forEach(card => {
        const img = card.querySelector('img');
        if (!img || prefersReducedMotion) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
            gsap.to(img, { x, y, duration: 0.3, ease: 'power1.out' });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(img, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
        });
    });

    // Cart button pulse
    $$('.cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!prefersReducedMotion) {
                gsap.fromTo(btn, { scale: 1 }, {
                    scale: 1.3,
                    duration: 0.15,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power1.inOut'
                });
            }
        });
    });
}

// ──────────────── NEWSLETTER FORM ────────────────
function initNewsletter() {
    const form = $('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const button = form.querySelector('button');

        if (input && input.value.includes('@')) {
            button.textContent = '✓ Subscribed!';
            button.style.background = 'var(--success)';
            input.value = '';
            input.disabled = true;

            setTimeout(() => {
                button.textContent = 'Sign Up';
                button.style.background = '';
                input.disabled = false;
            }, 3000);
        }
    });
}

// ──────────────── STARTUP ────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize all modules
    initLenis();
    initHeader();
    initHeroCarousel();
    initScrollAnimations();
    initProductGallery();
    initMicroInteractions();
    initNewsletter();
});
