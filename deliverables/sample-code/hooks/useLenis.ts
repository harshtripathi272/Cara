import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useLenis — Initialize Lenis smooth scrolling with GSAP ScrollTrigger sync.
 *
 * Lenis provides native-feeling smooth scroll with momentum.
 * This hook integrates it with GSAP's ticker for frame-perfect ScrollTrigger sync.
 *
 * @returns Lenis instance ref for external control (e.g., lenis.scrollTo())
 *
 * @example
 * const lenisRef = useLenis();
 * // Later: lenisRef.current?.scrollTo('#section');
 */
export function useLenis() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        // Sync Lenis scroll position with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Drive Lenis from GSAP's ticker for perfect frame sync
        const tickerCallback = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return lenisRef;
}
