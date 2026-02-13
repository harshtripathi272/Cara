'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useGSAP } from '../hooks/useGSAP';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NavItem {
    label: string;
    href: string;
}

interface HeaderProps {
    navItems?: NavItem[];
    cartCount?: number;
}

const defaultNavItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export default function Header({ navItems = defaultNavItems, cartCount = 0 }: HeaderProps) {
    const headerRef = useRef<HTMLElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Shadow on scroll
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            ref={headerRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-hero-bg ${isScrolled ? 'shadow-nav' : ''
                }`}
        >
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-heading font-bold text-primary tracking-tight">
                    CARA
                </Link>

                {/* Desktop Nav Links */}
                <ul className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="relative text-sm font-body text-neutral-700 hover:text-primary transition-colors duration-250
                  after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px]
                  after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Cart + Mobile Toggle */}
                <div className="flex items-center gap-4">
                    {/* Cart Icon */}
                    <Link href="/cart" className="relative p-2 text-neutral-700 hover:text-primary transition-colors" aria-label={`Cart with ${cartCount} items`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-2 text-neutral-700"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {isMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <>
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 bg-hero-bg border-t border-neutral-200 ${isMenuOpen ? 'max-h-80 py-4' : 'max-h-0'
                    }`}
            >
                <ul className="flex flex-col items-center gap-4">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="text-base font-body text-neutral-700 hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
