'use client';

import Link from 'next/link';

interface FooterColumn {
    title: string;
    links: { label: string; href: string }[];
}

const defaultColumns: FooterColumn[] = [
    {
        title: 'About Us',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Delivery Information', href: '/delivery' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms & Conditions', href: '/terms' },
            { label: 'Contact Us', href: '/contact' },
        ],
    },
    {
        title: 'My Account',
        links: [
            { label: 'Sign In', href: '/signin' },
            { label: 'View Cart', href: '/cart' },
            { label: 'My Wishlist', href: '/wishlist' },
            { label: 'Track My Order', href: '/track' },
            { label: 'Help', href: '/help' },
        ],
    },
];

const socialLinks = [
    {
        name: 'Facebook',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        name: 'Instagram',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
    },
    {
        name: 'Twitter',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        name: 'YouTube',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-neutral-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Contact Column */}
                    <div>
                        <Link href="/" className="text-2xl font-heading font-bold text-primary mb-4 block">
                            CARA
                        </Link>
                        <address className="not-italic text-sm font-body text-neutral-500 space-y-2">
                            <p className="font-semibold text-neutral-700">Contact</p>
                            <p>281 Shyam Nagar, Indore, India</p>
                            <p>Phone: +91 1234567890</p>
                            <p>Hours: 10:00 - 18:00, Mon - Sat</p>
                        </address>

                        <div className="flex gap-3 mt-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="text-neutral-400 hover:text-primary transition-colors duration-200"
                                    aria-label={`Follow us on ${social.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {defaultColumns.map((column) => (
                        <div key={column.title}>
                            <h4 className="font-heading font-semibold text-neutral-800 text-sm mb-4">
                                {column.title}
                            </h4>
                            <ul className="space-y-2">
                                {column.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-body text-neutral-500 hover:text-primary transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Install App Column */}
                    <div>
                        <h4 className="font-heading font-semibold text-neutral-800 text-sm mb-4">
                            Install App
                        </h4>
                        <p className="text-sm font-body text-neutral-500 mb-3">
                            From App Store or Google Play
                        </p>
                        <div className="flex gap-2">
                            <div className="bg-neutral-100 rounded-lg px-4 py-2 text-xs font-body text-neutral-600 flex items-center gap-2">
                                <span>App Store</span>
                            </div>
                            <div className="bg-neutral-100 rounded-lg px-4 py-2 text-xs font-body text-neutral-600 flex items-center gap-2">
                                <span>Google Play</span>
                            </div>
                        </div>

                        <p className="text-sm font-body text-neutral-500 mt-6 mb-2">
                            Secured Payment Gateways
                        </p>
                        <div className="flex gap-2">
                            <span className="text-xs bg-neutral-50 rounded px-2 py-1 text-neutral-400 border border-neutral-200">
                                Visa
                            </span>
                            <span className="text-xs bg-neutral-50 rounded px-2 py-1 text-neutral-400 border border-neutral-200">
                                MasterCard
                            </span>
                            <span className="text-xs bg-neutral-50 rounded px-2 py-1 text-neutral-400 border border-neutral-200">
                                PayPal
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 text-center">
                    <p className="text-xs font-body text-neutral-400">
                        © {new Date().getFullYear()} Cara. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
