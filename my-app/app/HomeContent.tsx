"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Product } from "./lib/supabase";
import ProductCarousel from "./components/ProductCarousel";
import CategoryCard from "./components/CategoryCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type HomeContentProps = {
  featured: Product[];
  newArrivals: Product[];
  topProducts: Product[];
  categoryCounts: { category: string; count: number }[];
};

const categoryColors: Record<string, string> = {
  "Clothing, Shoes & Jewelry": "#1a1a2e",
  "Electronics": "#16213e",
  "Beauty & Personal Care": "#533483",
  "Home & Kitchen": "#2c3e50",
  "Sports & Outdoors": "#0f3460",
  "Health & Personal Care": "#1b4332",
};

const categoryImages: Record<string, string> = {};

export default function HomeContent({
  featured,
  newArrivals,
  topProducts,
  categoryCounts,
}: HomeContentProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-pattern" />
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="hero__label">New Season Collection</span>
          <h1 className="hero__title">
            Elevate Your
            <br />
            Every Day
          </h1>
          <p className="hero__subtitle">
            Discover thousands of premium products across fitness, electronics,
            beauty, and home. Curated for those who demand the best.
          </p>
          <Link href="/shop" className="hero__cta">
            Shop Now <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Featured Products Carousel */}
      {featured.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ProductCarousel
            title="Featured Products"
            products={featured}
            viewAllHref="/shop?sort=rating"
          />
        </motion.div>
      )}

      {/* Top 10 Bestsellers */}
      {topProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ProductCarousel
            title="Top 10 Bestsellers"
            products={topProducts}
            showRanks
            viewAllHref="/shop?sort=relevancy"
          />
        </motion.div>
      )}

      {/* Popular Categories */}
      {categoryCounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="category-grid__header">
            <h2 className="category-grid__title">Shop by Category</h2>
          </div>
          <div className="category-grid">
            {categoryCounts.slice(0, 4).map((cat) => (
              <CategoryCard
                key={cat.category}
                title={cat.category}
                subtitle={`${cat.count} products`}
                href={`/shop?category=${encodeURIComponent(cat.category)}`}
                bgColor={
                  categoryColors[cat.category] ||
                  `hsl(${Math.random() * 360}, 30%, 20%)`
                }
                imageUrl={categoryImages[cat.category]}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ProductCarousel
            title="New Arrivals"
            products={newArrivals}
            viewAllHref="/shop?sort=newest"
          />
        </motion.div>
      )}

      {/* How Do You Shop? - Activity Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="category-grid__header">
          <h2 className="category-grid__title">How Do You Shop?</h2>
        </div>
        <div className="category-grid">
          <CategoryCard
            title="Fitness & Sports"
            subtitle="Gear up for every workout"
            href="/shop?category=Sports and Outdoors"
            bgColor="#1b4332"
          />
          <CategoryCard
            title="Tech & Gadgets"
            subtitle="Latest in electronics"
            href="/shop?category=Electronics"
            bgColor="#16213e"
          />
          <CategoryCard
            title="Beauty & Care"
            subtitle="Look & feel your best"
            href="/shop?category=Beauty and Personal Care"
            bgColor="#533483"
          />
          <CategoryCard
            title="Home Essentials"
            subtitle="Upgrade your space"
            href="/shop?category=Home and Kitchen"
            bgColor="#2c3e50"
          />
        </div>
      </motion.div>

      {/* All Categories - Remaining */}
      {categoryCounts.length > 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="category-grid__header">
            <h2 className="category-grid__title">More to Explore</h2>
          </div>
          <div className="category-grid">
            {categoryCounts.slice(4).map((cat) => (
              <CategoryCard
                key={cat.category}
                title={cat.category}
                subtitle={`${cat.count} products`}
                href={`/shop?category=${encodeURIComponent(cat.category)}`}
                bgColor={`hsl(${
                  categoryCounts.indexOf(cat) * 60
                }, 25%, 22%)`}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Newsletter */}
      <section className="newsletter">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="newsletter__title">Stay in the Loop</h2>
          <p className="newsletter__subtitle">
            Sign up for exclusive deals, new arrivals, and insider-only
            discounts.
          </p>
          <form
            className="newsletter__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              className="newsletter__input"
              placeholder="Your email address"
            />
            <button type="submit" className="newsletter__submit">
              Sign Up
            </button>
          </form>
        </motion.div>
      </section>
    </>
  );
}
