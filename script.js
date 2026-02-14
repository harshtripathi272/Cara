const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

<<<<<<< Updated upstream
if(bar){
    bar.addEventListener('click', () =>{
        nav.classList.add('active');
    })
}
if(close){
    close.addEventListener('click', () =>{
        nav.classList.remove('active');
    })
}
=======
// ──────────────── UTILITY ────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ──────────────── LENIS SMOOTH SCROLL ────────────────
let lenis;

function initLenis() {
    // Disabled - use native scroll for better performance and predictable behavior
    return;

    if (prefersReducedMotion) return;

    lenis = new Lenis({
        duration: 0.7,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

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

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const bar = $('#bar');
    const navbar = $('#navbar');
    const closeBtn = $('#close');

    if (bar && navbar) {
        bar.addEventListener('click', () => navbar.classList.add('active'));
    }
    if (closeBtn && navbar) {
        closeBtn.addEventListener('click', () => navbar.classList.remove('active'));
    }

    $$('#navbar li a').forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) navbar.classList.remove('active');
        });
    });
}

// ──────────────── 3D HERO CARD CAROUSEL ────────────────
let heroActiveIndex = 0;
let heroAutoplay = null;
const HERO_AUTOPLAY_MS = 4500;

function initHeroCards() {
    const cards = $$('.hero-card');
    const prevBtn = $('#heroPrev');
    const nextBtn = $('#heroNext');

    if (!cards.length) return;

    const total = cards.length;

    // Position cards
    function updatePositions() {
        cards.forEach((card, i) => {
            card.classList.remove('active');

            if (i === heroActiveIndex) {
                card.setAttribute('data-position', 'center');
                card.classList.add('active');
            } else if (i === (heroActiveIndex - 1 + total) % total) {
                card.setAttribute('data-position', 'left');
            } else if (i === (heroActiveIndex + 1) % total) {
                card.setAttribute('data-position', 'right');
            } else {
                card.setAttribute('data-position', 'hidden');
            }
        });
    }

    function goNext() {
        heroActiveIndex = (heroActiveIndex + 1) % total;
        updatePositions();
    }

    function goPrev() {
        heroActiveIndex = (heroActiveIndex - 1 + total) % total;
        updatePositions();
    }

    // Click on side cards to navigate
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            if (i === heroActiveIndex) return;
            heroActiveIndex = i;
            updatePositions();
            resetAutoplay();
        });
    });

    // Arrow navigation
    if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); resetAutoplay(); });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { goPrev(); resetAutoplay(); }
        if (e.key === 'ArrowRight') { goNext(); resetAutoplay(); }
    });

    // Autoplay
    function startAutoplay() {
        heroAutoplay = setInterval(goNext, HERO_AUTOPLAY_MS);
    }

    function resetAutoplay() {
        clearInterval(heroAutoplay);
        startAutoplay();
    }

    // Pause on hover
    const wrapper = $('#heroCards');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => clearInterval(heroAutoplay));
        wrapper.addEventListener('mouseleave', startAutoplay);
    }

    // Initialize
    updatePositions();

    // Force a re-render after initial positions are set
    setTimeout(() => {
        updatePositions();
        startAutoplay();
    }, 100);

    // No GSAP entrance animation - cards use CSS nth-child positioning
}

// ──────────────── HERO TEXT ENTRANCE ────────────────
function initHeroText() {
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('.hero-label', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    })
        .to('.hero-title .line-inner', {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out'
        }, '-=0.3')
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3')
        .to('.hero-cta', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.2');
}

// ──────────────── SCROLL ANIMATIONS ────────────────
function initScrollAnimations() {
    if (prefersReducedMotion) {
        $$('.fe-box, .pro, .blog-card').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    // Feature boxes
    const feBoxes = $$('.fe-box');
    if (feBoxes.length) {
        ScrollTrigger.batch(feBoxes, {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
                });
            },
            start: 'top 85%',
            once: true
        });
    }

    // Product cards
    const proCards = $$('.pro');
    if (proCards.length) {
        ScrollTrigger.batch(proCards, {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out'
                });
            },
            start: 'top 88%',
            once: true
        });
    }

    // Blog cards
    const blogCards = $$('.blog-card');
    if (blogCards.length) {
        ScrollTrigger.batch(blogCards, {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out'
                });
            },
            start: 'top 85%',
            once: true
        });
    }

    // Banner h2
    const bannerH2 = $('#banner h2');
    if (bannerH2) {
        gsap.from(bannerH2, {
            y: 40, opacity: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: '#banner', start: 'top 80%', once: true }
        });
    }

    // Small banner boxes
    $$('.banner-box').forEach((box, i) => {
        gsap.from(box, {
            x: i % 2 === 0 ? -40 : 40, opacity: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: box, start: 'top 85%', once: true }
        });
    });

    // Banner3 boxes
    const banner3Boxes = $$('.banner3-box');
    if (banner3Boxes.length) {
        ScrollTrigger.batch(banner3Boxes, {
            onEnter: (batch) => {
                gsap.from(batch, {
                    y: 30, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out'
                });
            },
            start: 'top 85%',
            once: true
        });
    }

    // Newsletter
    const newsText = $('.newstext');
    const newsForm = $('.newsletter-form');
    if (newsText) {
        gsap.from(newsText, {
            x: -30, opacity: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: '#newsletter', start: 'top 85%', once: true }
        });
    }
    if (newsForm) {
        gsap.from(newsForm, {
            x: 30, opacity: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: '#newsletter', start: 'top 85%', once: true }
        });
    }

    // Section headers
    $$('.section-header').forEach(header => {
        gsap.from(header, {
            y: 20, opacity: 0, duration: 0.5, ease: 'power2.out',
            scrollTrigger: { trigger: header, start: 'top 85%', once: true }
        });
    });

    // Page header parallax (inner pages)
    const pageHeader = $('#page-header');
    if (pageHeader) {
        gsap.to(pageHeader, {
            backgroundPositionY: '30%', ease: 'none',
            scrollTrigger: { trigger: pageHeader, start: 'top top', end: 'bottom top', scrub: true }
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
            if (!prefersReducedMotion) {
                gsap.to(mainImg, {
                    opacity: 0, duration: 0.2,
                    onComplete: () => {
                        mainImg.src = img.src;
                        gsap.to(mainImg, { opacity: 1, duration: 0.3 });
                    }
                });
            } else {
                mainImg.src = img.src;
            }

            $$('.small-img-col').forEach(col => col.classList.remove('active'));
            img.closest('.small-img-col')?.classList.add('active');
        });
    });

    $$('.small-img-col')[0]?.classList.add('active');
}

// ──────────────── MICRO-INTERACTIONS ────────────────
function initMicroInteractions() {
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

    $$('.cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!prefersReducedMotion) {
                gsap.fromTo(btn, { scale: 1 }, {
                    scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut'
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
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    initLenis();
    initHeader();
    initHeroCards();
    initHeroText();
    initScrollAnimations();
    initProductGallery();
    initMicroInteractions();
    initNewsletter();
});
>>>>>>> Stashed changes
