import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

/**
 * useGSAP — Safe GSAP hook with automatic cleanup.
 * Wraps GSAP animations in a React-safe context scope.
 *
 * @param callback - Function receiving a gsap context scope
 * @param deps - React dependency array (default: empty)
 *
 * @example
 * useGSAP((ctx) => {
 *   gsap.from('.hero-title', { y: 30, opacity: 0, duration: 0.6 });
 * }, []);
 */
export function useGSAP(
    callback: (ctx: gsap.Context) => void,
    deps: React.DependencyList = [],
    scope?: React.RefObject<HTMLElement | null>
) {
    useEffect(() => {
        const ctx = gsap.context(() => {
            callback(ctx);
        }, scope?.current || undefined);

        return () => ctx.revert(); // auto-cleanup all animations
    }, deps);
}

/**
 * useScrollTriggerBatch — Batch-reveal elements on scroll.
 *
 * @param selector - CSS selector for batch targets
 * @param options - GSAP from-animation options
 */
export function useScrollTriggerBatch(
    selector: string,
    options: {
        from?: gsap.TweenVars;
        stagger?: number;
        start?: string;
    } = {}
) {
    useEffect(() => {
        if (prefersReducedMotion()) {
            gsap.set(selector, { opacity: 1, y: 0, scale: 1 });
            return;
        }

        const triggers = ScrollTrigger.batch(selector, {
            start: options.start || 'top 85%',
            onEnter: (batch) => {
                gsap.from(batch, {
                    y: 24,
                    opacity: 0,
                    scale: 0.97,
                    stagger: options.stagger || 0.08,
                    duration: 0.6,
                    ease: 'power2.out',
                    ...options.from,
                });
            },
            once: true,
        });

        return () => {
            triggers.forEach((t) => t.kill());
        };
    }, [selector]);
}

/** Check if user prefers reduced motion */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
