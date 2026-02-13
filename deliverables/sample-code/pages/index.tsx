/**
 * Home Page — Cara Next.js Skeleton
 *
 * Composes: Header, Hero, ProductGrid, Newsletter, Footer
 * Initializes Lenis smooth scrolling and GSAP animations
 */
'use client';

import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { useLenis } from '../hooks/useLenis';

// Sample product data — replace with actual data fetching (getStaticProps / server component)
const featuredProducts = [
    { slug: 'cartoon-astronauts-tshirt', image: '/img/products/f1.jpg', brand: 'adidas', title: 'Cartoon Astronauts T-Shirt', rating: 5, price: 78, alt: 'Gray t-shirt with cartoon astronaut illustration' },
    { slug: 'flower-tshirt', image: '/img/products/f2.jpg', brand: 'adidas', title: 'Flower T-Shirt', rating: 4, price: 85, alt: 'White t-shirt with colorful floral print' },
    { slug: 'red-rose-tshirt', image: '/img/products/f3.jpg', brand: 'adidas', title: 'Red Rose T-Shirt', rating: 5, price: 92, alt: 'Dark t-shirt with red rose graphic design' },
    { slug: 'red-lily-tshirt', image: '/img/products/f4.jpg', brand: 'adidas', title: 'Red Lily T-Shirt', rating: 4, price: 65, alt: 'Black t-shirt with red lily artwork' },
    { slug: 'purple-blossom-tshirt', image: '/img/products/f5.jpg', brand: 'adidas', title: 'Purple Blossom T-Shirt', rating: 5, price: 78, alt: 'Light t-shirt with purple blossom print' },
    { slug: 'duo-color-shirt', image: '/img/products/f6.jpg', brand: 'adidas', title: 'Duo Color Shirt', rating: 4, price: 95, alt: 'Two-tone casual button-up shirt' },
    { slug: 'modern-style-pants', image: '/img/products/f7.jpg', brand: 'adidas', title: 'Modern Style Pants', rating: 4, price: 110, alt: 'Contemporary casual trousers' },
    { slug: 'designed-top-women', image: '/img/products/f8.jpg', brand: 'adidas', title: 'Designed Top for Women', rating: 5, price: 88, alt: 'Fashionable women blouse with pattern' },
];

export default function HomePage() {
    // Initialize Lenis smooth scrolling
    const lenisRef = useLenis();

    return (
        <>
            <Header cartCount={2} />
            <main>
                <Hero />
                <ProductGrid
                    title="Featured Products"
                    subtitle="Summer Collection New Modern Design"
                    products={featuredProducts}
                    columns={4}
                />
                {/* TODO: FeatureBoxes component */}
                {/* TODO: PromoBanner component */}
                {/* TODO: New Arrivals ProductGrid */}
                {/* TODO: SmallBannerGrid component */}
                <Newsletter />
            </main>
            <Footer />
        </>
    );
}
