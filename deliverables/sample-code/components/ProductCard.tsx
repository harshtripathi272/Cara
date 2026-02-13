'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../hooks/useGSAP';

interface Product {
    slug: string;
    image: string;
    altImage?: string;
    brand: string;
    title: string;
    rating: number;
    price: number;
    alt: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // Micro-parallax on mousemove
    const handleMouseMove = (e: React.MouseEvent) => {
        if (prefersReducedMotion() || !imgRef.current) return;
        const rect = cardRef.current!.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
        gsap.to(imgRef.current, { x, y, duration: 0.4, ease: 'power3' });
    };

    const handleMouseLeave = () => {
        if (!imgRef.current) return;
        gsap.to(imgRef.current, { x: 0, y: 0, duration: 0.4, ease: 'power3' });
    };

    // Cart button pulse on click
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        const btn = e.currentTarget;
        gsap.fromTo(btn, { scale: 1 }, { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1 });
        // TODO: Add to cart state management
    };

    // Star rating
    const stars = Array.from({ length: 5 }, (_, i) => (
        <svg
            key={i}
            className={`w-3.5 h-3.5 ${i < product.rating ? 'text-yellow-400' : 'text-neutral-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    ));

    return (
        <div
            ref={cardRef}
            className="product-card group bg-white rounded-card shadow-card hover:shadow-card-hover
        transition-shadow duration-300 overflow-hidden flex flex-col"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Product Image */}
            <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-surface">
                <Image
                    ref={imgRef as any}
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover will-change-transform transition-transform duration-300 group-hover:scale-[1.03]"
                />
            </Link>

            {/* Card Details */}
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs font-body text-neutral-400 uppercase tracking-wide">
                    {product.brand}
                </span>
                <h3 className="mt-1 text-sm font-heading font-semibold text-neutral-800 line-clamp-2 leading-snug">
                    {product.title}
                </h3>

                <div className="flex items-center gap-0.5 mt-2">{stars}</div>

                <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-lg font-heading font-bold text-primary">
                        ${product.price.toFixed(2)}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-success/10
              border border-success/30 text-success hover:bg-success hover:text-white
              transition-all duration-200"
                        aria-label={`Add ${product.title} to cart`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
