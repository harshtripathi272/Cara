"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "../lib/supabase";
import ProductCard from "./ProductCard";
import Link from "next/link";

type ProductCarouselProps = {
  title: string;
  products: Product[];
  viewAllHref?: string;
  showRanks?: boolean;
};

export default function ProductCarousel({
  title,
  products,
  viewAllHref,
  showRanks = false,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const scrollAmount = trackRef.current.clientWidth * 0.6;
    trackRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="product-carousel">
      <div className="product-carousel__header">
        <h2 className="product-carousel__title">{title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {viewAllHref && (
            <Link href={viewAllHref} className="product-carousel__view-all">
              view all
            </Link>
          )}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="product-carousel__arrow"
              onClick={() => scroll("left")}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="product-carousel__arrow"
              onClick={() => scroll("right")}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="product-carousel__track" ref={trackRef}>
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            rank={showRanks ? idx + 1 : undefined}
          />
        ))}
      </div>
    </section>
  );
}
