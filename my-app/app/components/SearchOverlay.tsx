"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { searchProducts } from "../lib/queries";
import type { Product } from "../lib/supabase";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";

const trendingSearches = [
  "Wireless Headphones",
  "Running Shoes",
  "Skincare Set",
  "Kitchen Gadgets",
  "Fitness Tracker",
  "Yoga Mat",
];

type SearchOverlayProps = {
  onClose: () => void;
};

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const doSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await searchProducts(searchQuery, 15);
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    doSearch(term);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="search-overlay">
      <form className="search-overlay__top" onSubmit={handleSubmit}>
        <div className="search-overlay__input-wrap">
          <Search size={18} className="search-overlay__input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-overlay__input"
            placeholder="What are you looking for today?"
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          className="search-overlay__close"
          onClick={onClose}
          aria-label="Close search"
        >
          <X size={28} />
        </button>
      </form>

      <div className="search-overlay__body">
        {hasSearched ? (
          <div className="search-results">
            <div className="search-results__header">
              <p className="search-results__query">
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    Search results for &quot;<strong>{query}</strong>&quot;{" "}
                    {results.length} Products
                  </>
                )}
              </p>
            </div>
            <div className="search-results__grid">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => {
                    onClose();
                    router.push(`/product/${product.id}`);
                  }}
                />
              ))}
            </div>
            {!isLoading && results.length === 0 && (
              <p style={{ color: "var(--color-text-secondary)", textAlign: "center", padding: "48px 0" }}>
                No products found. Try a different search term.
              </p>
            )}
          </div>
        ) : (
          <div className="search-overlay__content">
            <div>
              <h3 className="search-overlay__section-title">
                Trending Searches
              </h3>
              <div className="search-overlay__trending-list">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    className="search-overlay__trending-item"
                    onClick={() => handleTrendingClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="search-overlay__section-title">
                Popular Categories
              </h3>
              <div className="search-overlay__recent-grid">
                {[
                  { label: "Clothing & Jewelry", query: "clothing" },
                  { label: "Electronics", query: "electronics" },
                  { label: "Beauty & Care", query: "beauty" },
                  { label: "Home & Kitchen", query: "kitchen" },
                  { label: "Sports & Outdoors", query: "sports" },
                  { label: "Health & Wellness", query: "health" },
                ].map((cat) => (
                  <button
                    key={cat.label}
                    className="search-overlay__recent-card"
                    onClick={() => handleTrendingClick(cat.query)}
                  >
                    <div
                      className="search-overlay__recent-images"
                      style={{
                        background: "var(--color-bg-secondary)",
                        aspectRatio: "3/1.5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                      }}
                    >
                      <Search size={24} style={{ opacity: 0.3 }} />
                    </div>
                    <p className="search-overlay__recent-label">{cat.label}</p>
                    <p className="search-overlay__recent-sublabel">
                      Browse collection
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
