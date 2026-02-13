/**
 * Product Detail Page — /product/[slug]
 *
 * Dynamic product page with image gallery, details, and add-to-cart
 */
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useGSAP, prefersReducedMotion } from '../../hooks/useGSAP';
import { useLenis } from '../../hooks/useLenis';
import { gsap } from 'gsap';

// Sample product — replace with getStaticProps / server component data fetching
interface ProductDetail {
    slug: string;
    title: string;
    price: number;
    images: string[];
    description: string;
    sizes: string[];
    brand: string;
    alt: string;
}

const sampleProduct: ProductDetail = {
    slug: 'blue-floral-tshirt',
    title: "Men's Fashion T-Shirt",
    price: 139.0,
    images: ['/img/products/f1.jpg', '/img/products/f2.jpg', '/img/products/f3.jpg', '/img/products/f4.jpg'],
    description:
        'Made from 100% premium cotton with a comfortable relaxed fit. Features vibrant floral print that stays crisp wash after wash. Machine washable at 30°C. Available in multiple sizes.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    brand: 'adidas',
    alt: "Men's fashion t-shirt with blue floral design",
};

export default function ProductPage() {
    const sectionRef = useRef<HTMLElement>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const product = sampleProduct;

    useLenis();

    useGSAP(
        () => {
            if (prefersReducedMotion()) return;
            gsap.from('.main-product-image', { opacity: 0, scale: 0.98, duration: 0.5, ease: 'power2.out' });
            gsap.from('.thumbnail-image', { opacity: 0, y: 10, stagger: 0.08, duration: 0.4, delay: 0.3 });
            gsap.from('.product-details', { x: 30, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 });
        },
        [],
        sectionRef
    );

    const handleImageSwitch = (index: number) => {
        gsap.to('.main-product-image img', {
            opacity: 0,
            duration: 0.15,
            onComplete: () => {
                setSelectedImage(index);
                gsap.to('.main-product-image img', { opacity: 1, duration: 0.15 });
            },
        });
    };

    return (
        <>
            <Header />
            <main ref={sectionRef}>
                {/* Page Banner */}
                <div className="relative h-48 bg-neutral-800 flex items-center justify-center overflow-hidden mt-16">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
                    <div className="relative text-center text-white z-10">
                        <h1 className="text-5xl font-heading font-bold">#stayhome</h1>
                        <p className="mt-2 text-sm font-body opacity-80">
                            Save more with coupons up to 70% off!
                        </p>
                    </div>
                </div>

                {/* Product Detail */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div className="main-product-image aspect-square rounded-xl overflow-hidden bg-surface mb-4">
                            <Image
                                src={product.images[selectedImage]}
                                alt={product.alt}
                                width={600}
                                height={600}
                                className="w-full h-full object-cover"
                                priority
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleImageSwitch(i)}
                                    className={`thumbnail-image aspect-square rounded-lg overflow-hidden border-2 transition-all
                    ${i === selectedImage ? 'border-primary' : 'border-transparent hover:border-neutral-300'}`}
                                    aria-label={`View product image ${i + 1}`}
                                >
                                    <Image src={img} alt={`${product.title} view ${i + 1}`} width={150} height={150} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="product-details flex flex-col">
                        <nav className="text-sm font-body text-neutral-400 mb-4" aria-label="Breadcrumb">
                            <ol className="flex gap-1">
                                <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                                <li>/</li>
                                <li className="text-neutral-700">T-Shirts</li>
                            </ol>
                        </nav>

                        <h2 className="text-3xl font-heading font-bold text-neutral-800">{product.title}</h2>
                        <p className="text-2xl font-heading font-bold text-primary mt-3">${product.price.toFixed(2)}</p>

                        {/* Size Selector */}
                        <div className="mt-6">
                            <label className="text-sm font-body font-semibold text-neutral-700 block mb-2">Size</label>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 text-sm font-body border rounded-md transition-all
                      ${selectedSize === size
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mt-6">
                            <label htmlFor="quantity" className="text-sm font-body font-semibold text-neutral-700 block mb-2">
                                Quantity
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min={1}
                                max={99}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-20 px-3 py-2 text-sm font-body border border-neutral-300 rounded-md
                  focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center"
                            />
                        </div>

                        {/* Add to Cart */}
                        <button
                            className="mt-8 w-full sm:w-auto px-10 py-3.5 bg-primary hover:bg-primary-dark text-white
                font-body font-semibold text-sm rounded-button shadow-button_hover
                transition-all duration-250 hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            Add to Cart
                        </button>

                        {/* Description */}
                        <div className="mt-8 pt-6 border-t border-neutral-200">
                            <h3 className="text-sm font-heading font-semibold text-neutral-700 mb-2">Product Details</h3>
                            <p className="text-sm font-body text-neutral-500 leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
