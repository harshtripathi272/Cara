'use client';

import ProductCard from './ProductCard';
import { useScrollTriggerBatch } from '../hooks/useGSAP';

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

interface ProductGridProps {
    title: string;
    subtitle?: string;
    products: Product[];
    columns?: 3 | 4;
}

export default function ProductGrid({
    title,
    subtitle,
    products,
    columns = 4,
}: ProductGridProps) {
    // Batch reveal product cards on scroll
    useScrollTriggerBatch('.product-card', {
        from: { y: 24, opacity: 0, scale: 0.97 },
        stagger: 0.08,
        start: 'top 85%',
    });

    const gridCols =
        columns === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

    return (
        <section id="product-grid" className="py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-[clamp(2rem,4vw,2.875rem)] font-heading font-bold text-neutral-800">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-2 text-base font-body text-neutral-400">{subtitle}</p>
                )}
            </div>

            {/* Product Grid */}
            <div className={`grid ${gridCols} gap-6`} role="list" aria-label={title}>
                {products.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                ))}
            </div>
        </section>
    );
}
