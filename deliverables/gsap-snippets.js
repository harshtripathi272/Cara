/**
 * GSAP Snippets — Drop-in code for Cara Next.js skeleton
 * Reads gsap-timelines.json and wires GSAP + ScrollTrigger + Lenis
 * 
 * Dependencies: gsap, @gsap/react, lenis
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Lenis + ScrollTrigger Integration ─────────────────────────
export function initLenisScrollProxy(lenis) {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

// ─── Prefers Reduced Motion Check ──────────────────────────────
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── Hero Timeline ─────────────────────────────────────────────
export function createHeroTimeline(containerRef) {
    if (prefersReducedMotion()) {
        gsap.set('.hero-bg, .hero-title .line, .hero-subtitle, .hero-cta, #hero-model', {
            opacity: 1, y: 0, scale: 1, clipPath: 'inset(0 0% 0 0)',
        });
        return null;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.from('.hero-bg', { opacity: 0, duration: 0.6 })
        .from('.hero-title .line', { y: 30, opacity: 0, stagger: 0.12, duration: 0.6 }, '-=0.3')
        .from('.hero-subtitle', { y: 15, opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.hero-cta', { scale: 0.95, opacity: 0, duration: 0.35, ease: 'back.out(1.7)' })
        .from('#hero-model', {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.9,
            ease: 'power3.inOut',
        }, '-=0.5');

    // Breathing loop — pauses when hero leaves viewport
    gsap.to('#hero-model', {
        y: -3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        scrollTrigger: {
            trigger: '#hero',
            toggleActions: 'play pause resume pause',
        },
    });

    return tl;
}

// ─── Product Grid Batch Reveal ─────────────────────────────────
export function createProductGridReveal() {
    if (prefersReducedMotion()) {
        gsap.set('.product-card', { opacity: 1, y: 0, scale: 1 });
        return;
    }

    ScrollTrigger.batch('.product-card', {
        start: 'top 85%',
        onEnter: (batch) => {
            gsap.from(batch, {
                y: 24,
                opacity: 0,
                scale: 0.97,
                stagger: 0.08,
                duration: 0.6,
                ease: 'power2.out',
            });
        },
        once: true,
    });
}

// ─── Product Card Micro-Parallax ───────────────────────────────
export function initCardMicroParallax() {
    if (prefersReducedMotion() || 'ontouchstart' in window) return;

    document.querySelectorAll('.product-card').forEach((card) => {
        const img = card.querySelector('img');
        if (!img) return;

        const xTo = gsap.quickTo(img, 'x', { duration: 0.4, ease: 'power3' });
        const yTo = gsap.quickTo(img, 'y', { duration: 0.4, ease: 'power3' });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
            xTo(x);
            yTo(y);
        });

        card.addEventListener('mouseleave', () => {
            xTo(0);
            yTo(0);
        });
    });
}

// ─── Feature Boxes Reveal ──────────────────────────────────────
export function createFeatureBoxesReveal() {
    if (prefersReducedMotion()) return;

    gsap.from('.fe-box', {
        y: 20,
        opacity: 0,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#feature',
            start: 'top 80%',
            once: true,
        },
    });
}

// ─── Promo Banner Reveal ───────────────────────────────────────
export function createPromoBannerReveal() {
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#banner',
            start: 'top 75%',
            once: true,
        },
    });

    tl.from('#banner', {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.8,
        ease: 'power3.out',
    });

    // Discount pulse loop
    gsap.to('.discount-number', {
        scale: 1.08,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });
}

// ─── Newsletter Reveal ─────────────────────────────────────────
export function createNewsletterReveal() {
    if (prefersReducedMotion()) return;

    gsap.from('.newstext', {
        x: -30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#newsletter', start: 'top 80%', once: true },
    });

    gsap.from('.newsletter-form', {
        x: 30,
        opacity: 0,
        duration: 0.5,
        delay: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#newsletter', start: 'top 80%', once: true },
    });
}

// ─── Master Init (call from useGSAP hook) ──────────────────────
export function initAllAnimations() {
    createHeroTimeline();
    createProductGridReveal();
    initCardMicroParallax();
    createFeatureBoxesReveal();
    createPromoBannerReveal();
    createNewsletterReveal();
}
