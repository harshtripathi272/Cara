'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP, prefersReducedMotion } from '../hooks/useGSAP';

interface HeroProps {
    headline?: string;
    accentLine?: string;
    subheadline?: string;
    cta?: { text: string; href: string };
    heroImage?: string;
    heroImageAlt?: string;
}

export default function Hero({
    headline = 'Super Value Deals',
    accentLine = 'On All Products',
    subheadline = 'Save more with coupons & up to 70% off!',
    cta = { text: 'Shop Now', href: '/shop' },
    heroImage = '/stitch_outputs/hero-model/hero-model-desktop.png',
    heroImageAlt = 'Fashion model in editorial pose',
}: HeroProps) {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            if (prefersReducedMotion()) {
                gsap.set('.hero-bg, .hero-title .line, .hero-subtitle, .hero-cta, .hero-model', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    clipPath: 'inset(0 0% 0 0)',
                });
                return;
            }

            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            tl.from('.hero-bg', { opacity: 0, duration: 0.6 })
                .from('.hero-label', { y: 10, opacity: 0, duration: 0.3 }, '-=0.3')
                .from(
                    '.hero-title .line',
                    { y: 30, opacity: 0, stagger: 0.12, duration: 0.6 },
                    '-=0.2'
                )
                .from('.hero-subtitle', { y: 15, opacity: 0, duration: 0.4 }, '-=0.2')
                .from('.hero-cta', {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.35,
                    ease: 'back.out(1.7)',
                })
                .from(
                    '.hero-model',
                    {
                        clipPath: 'inset(0 100% 0 0)',
                        duration: 0.9,
                        ease: 'power3.inOut',
                    },
                    '-=0.5'
                );

            // Breathing loop — pauses off-screen
            gsap.to('.hero-model', {
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
        },
        [],
        sectionRef
    );

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="hero-bg relative min-h-[90vh] flex items-center bg-gradient-to-b from-hero-bg to-white overflow-hidden pt-16"
        >
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 items-center">
                {/* Left — Text Content */}
                <div className="flex flex-col justify-center py-12">
                    <span className="hero-label text-xs font-body font-semibold tracking-[0.2em] uppercase text-primary mb-4">
                        Trade-in-offer
                    </span>

                    <h1 className="hero-title text-neutral-800 mb-4">
                        <span className="line block text-[clamp(2.5rem,5vw,3.5rem)] font-heading font-extrabold leading-[1.15]">
                            {headline}
                        </span>
                        <span className="line block text-[clamp(2rem,4vw,2.875rem)] font-heading font-bold leading-[1.2] text-primary mt-1">
                            {accentLine}
                        </span>
                    </h1>

                    <p className="hero-subtitle text-base font-body text-neutral-400 max-w-md mb-8 leading-relaxed">
                        {subheadline}
                    </p>

                    <Link
                        href={cta.href}
                        className="hero-cta inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white
              font-body font-semibold text-sm px-8 py-3.5 rounded-button shadow-button_hover
              transition-all duration-250 hover:-translate-y-0.5 w-fit"
                    >
                        {cta.text}
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Right — Model Image */}
                <div className="hero-model relative flex justify-center items-end will-change-transform">
                    {/* Decorative shapes */}
                    <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-primary/5 blur-xl" />
                    <div className="absolute bottom-1/3 left-1/4 w-32 h-32 rounded-full bg-accent/10 blur-lg" />

                    <Image
                        src={heroImage}
                        alt={heroImageAlt}
                        width={600}
                        height={700}
                        priority
                        className="relative z-10 object-contain max-h-[75vh]"
                    />
                </div>
            </div>
        </section>
    );
}
