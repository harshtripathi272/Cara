'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP, prefersReducedMotion } from '../hooks/useGSAP';

interface NewsletterProps {
    heading?: string;
    description?: string;
    highlightText?: string;
    onSubmit?: (email: string) => void;
}

export default function Newsletter({
    heading = 'Sign Up For Newsletters',
    description = 'Get email updates about our latest shop and',
    highlightText = 'Special Offers.',
    onSubmit,
}: NewsletterProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useGSAP(
        () => {
            if (prefersReducedMotion()) return;
            gsap.from('.newstext', {
                x: -30, opacity: 0, duration: 0.5, ease: 'power2.out',
                scrollTrigger: { trigger: '#newsletter', start: 'top 80%', once: true },
            });
            gsap.from('.newsletter-form', {
                x: 30, opacity: 0, duration: 0.5, delay: 0.15, ease: 'power2.out',
                scrollTrigger: { trigger: '#newsletter', start: 'top 80%', once: true },
            });
        },
        [],
        sectionRef
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        onSubmit?.(email);
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <section
            ref={sectionRef}
            id="newsletter"
            className="bg-secondary py-16 px-6 md:px-12 lg:px-20"
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="newstext text-center md:text-left">
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">{heading}</h3>
                    <p className="text-sm font-body text-neutral-300">
                        {description}{' '}
                        <span className="text-yellow-400 font-semibold">{highlightText}</span>
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="newsletter-form flex w-full md:w-auto gap-0"
                    aria-label="Newsletter signup"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        className="flex-1 md:w-72 px-5 py-3 bg-white/10 border border-white/20 text-white
              placeholder:text-white/50 text-sm font-body rounded-l-md focus:outline-none
              focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-body
              font-semibold rounded-r-md transition-colors duration-200 whitespace-nowrap"
                    >
                        Sign Up
                    </button>
                </form>

                {status === 'success' && (
                    <p className="text-success text-sm font-body" role="alert">
                        ✓ Subscribed successfully!
                    </p>
                )}
            </div>
        </section>
    );
}
