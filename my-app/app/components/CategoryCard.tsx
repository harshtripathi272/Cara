"use client";

import React from "react";
import Link from "next/link";

type CategoryCardProps = {
  title: string;
  subtitle?: string;
  href: string;
  bgColor?: string;
  imageUrl?: string;
};

export default function CategoryCard({
  title,
  subtitle,
  href,
  bgColor = "#1a1a2e",
  imageUrl,
}: CategoryCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className="category-card" style={{ background: bgColor }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="category-card__image"
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
            }}
          />
        )}
        <div className="category-card__overlay">
          <h3 className="category-card__title">{title}</h3>
          {subtitle && (
            <p className="category-card__subtitle">{subtitle}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
