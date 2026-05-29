"use client";

import React from "react";
import { Heart, Star } from "lucide-react";
import type { Product } from "../lib/supabase";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
  rank?: number;
  onClick?: () => void;
  showBadge?: boolean;
};

export default function ProductCard({
  product,
  rank,
  onClick,
  showBadge = true,
}: ProductCardProps) {
  const hasDiscount = product.price && product.price > 20 && Math.random() > 0.7;
  const discountPercent = hasDiscount ? 30 : 0;
  const originalPrice = hasDiscount
    ? (product.price! / (1 - discountPercent / 100)).toFixed(2)
    : null;

  const badge = hasDiscount
    ? `${discountPercent}% OFF`
    : product.rating_count && product.rating_count > 500
    ? "BACK IN STOCK"
    : null;

  const content = (
    <div className="product-card" onClick={onClick}>
      <div className="product-card__image-wrap">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title || "Product image"}
            className="product-card__image"
            loading="lazy"
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
              fontSize: "var(--text-sm)",
            }}
          >
            No Image
          </div>
        )}

        <button
          className="product-card__wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Add to wishlist"
        >
          <Heart size={14} />
        </button>

        {rank && <div className="product-card__rank">{rank}</div>}

        {showBadge && badge && (
          <div
            className={`product-card__badge ${
              hasDiscount
                ? "product-card__badge--sale"
                : "product-card__badge--back"
            }`}
          >
            {badge}
          </div>
        )}
      </div>

      <div className="product-card__info">
        {product.average_rating && product.average_rating > 0 && (
          <div className="product-card__rating">
            <Star size={10} fill="currentColor" className="product-card__rating-star" />
            <span>{product.average_rating.toFixed(1)}</span>
          </div>
        )}

        <h3 className="product-card__title">{product.title || "Untitled"}</h3>

        <p className="product-card__category">{product.main_category}</p>

        <div className="product-card__price">
          {product.price ? (
            <>
              <span
                className={`product-card__price-current ${
                  hasDiscount ? "product-card__price-sale" : ""
                }`}
              >
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="product-card__price-original">
                  ${originalPrice}
                </span>
              )}
            </>
          ) : (
            <span className="product-card__price-current">Price unavailable</span>
          )}
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return content;
  }

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      {content}
    </Link>
  );
}
