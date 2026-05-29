"use client";

import React from "react";
import { Star, ShoppingBag, Heart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

type Props = {
  product: Product;
};

export default function ProductDetailContent({ product }: Props) {
  const { addItem } = useCart();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < Math.round(rating) ? "currentColor" : "none"}
        strokeWidth={i < Math.round(rating) ? 0 : 1.5}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Breadcrumb */}
      <div
        className="container"
        style={{
          padding: "var(--space-lg) var(--container-padding)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
        }}
      >
        <Link href="/" style={{ transition: "opacity 0.2s" }}>
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/shop?category=${encodeURIComponent(
            product.main_category || ""
          )}`}
          style={{ transition: "opacity 0.2s" }}
        >
          {product.main_category}
        </Link>
        <ChevronRight size={12} />
        <span style={{ color: "var(--color-text-primary)" }}>
          {product.title}
        </span>
      </div>

      <div className="product-detail">
        {/* Gallery */}
        <div className="product-detail__gallery">
          <motion.div
            className="product-detail__main-image"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title || "Product"}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-tertiary)",
                }}
              >
                No Image Available
              </div>
            )}
          </motion.div>
        </div>

        {/* Info */}
        <motion.div
          className="product-detail__info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="product-detail__category">
            {product.main_category}
          </p>

          <h1 className="product-detail__title">{product.title}</h1>

          {product.average_rating !== null && product.average_rating > 0 && (
            <div className="product-detail__rating">
              <div className="product-detail__rating-stars">
                {renderStars(product.average_rating)}
              </div>
              <span>{product.average_rating.toFixed(1)}</span>
              {product.rating_count && (
                <span className="product-detail__rating-count">
                  ({product.rating_count.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          <div className="product-detail__price">
            {product.price ? (
              <span>${product.price.toFixed(2)}</span>
            ) : (
              <span style={{ color: "var(--color-text-secondary)" }}>
                Price unavailable
              </span>
            )}
          </div>

          {product.description && (
            <div className="product-detail__description">
              {product.description}
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <div className="product-detail__features">
              <h3 className="product-detail__features-title">Features</h3>
              <div className="product-detail__features-list">
                {product.features.slice(0, 8).map((feature, idx) => (
                  <div key={idx} className="product-detail__feature-item">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-xl)" }}>
            <button
              className="product-detail__add-to-cart"
              onClick={() => addItem(product)}
              style={{ flex: 1 }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <ShoppingBag size={18} />
                Add to Bag
              </span>
            </button>

            <button
              style={{
                width: 52,
                height: 52,
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Add to wishlist"
            >
              <Heart size={20} />
            </button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              marginTop: "var(--space-2xl)",
              paddingTop: "var(--space-xl)",
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-md)",
            }}
          >
            {[
              "Free shipping on orders over $75",
              "Free returns within 30 days",
              "Secure checkout",
            ].map((text) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-sm)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <span style={{ color: "var(--color-success)" }}>✓</span>
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
