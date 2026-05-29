"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import FilterSidebar, { FilterState } from "../components/FilterSidebar";
import { getProducts, getCategories, getTopProducts } from "../lib/queries";
import ProductCarousel from "../components/ProductCarousel";
import type { Product } from "../lib/supabase";
import type { SortOption } from "../lib/queries";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialFilters: FilterState = {
    sort: searchParams.get("sort") || "relevancy",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
  };

  const searchQuery = searchParams.get("search") || "";

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 24;

  // Load categories once
  useEffect(() => {
    getCategories().then(setCategories);
    getTopProducts(undefined, 10).then(setTopProducts);
  }, []);

  // Fetch products when filters change
  const fetchProducts = useCallback(
    async (currentPage: number, append: boolean = false) => {
      setIsLoading(true);
      try {
        const { data, count } = await getProducts({
          category: filters.category || undefined,
          search: searchQuery || undefined,
          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
          minRating: filters.minRating
            ? Number(filters.minRating)
            : undefined,
          sort: filters.sort as SortOption,
          page: currentPage,
          limit: LIMIT,
        });

        if (append) {
          setProducts((prev) => [...prev, ...data]);
        } else {
          setProducts(data);
        }
        setTotalCount(count);
        setHasMore(data.length === LIMIT);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, searchQuery]
  );

  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.sort && newFilters.sort !== "relevancy")
      params.set("sort", newFilters.sort);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.minRating) params.set("minRating", newFilters.minRating);
    if (searchQuery) params.set("search", searchQuery);

    const paramString = params.toString();
    router.replace(`/shop${paramString ? `?${paramString}` : ""}`, {
      scroll: false,
    });
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  return (
    <>
      <Header />
      <main>
        {/* Top Products Carousel */}
        {!searchQuery && topProducts.length > 0 && (
          <div style={{ paddingTop: "var(--space-xl)" }}>
            <ProductCarousel
              title="Top 10 in Category"
              products={topProducts}
              showRanks
              viewAllHref="/shop?sort=relevancy"
            />
          </div>
        )}

        <div className="shop-layout">
          {/* Sidebar */}
          <div className="shop-layout__sidebar">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              resultCount={totalCount}
            />
          </div>

          {/* Main Content */}
          <div className="shop-layout__main">
            {/* Search Header */}
            {searchQuery && (
              <div style={{ marginBottom: "var(--space-xl)" }}>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                  Search results for
                </p>
                <h1
                  style={{
                    fontSize: "var(--text-2xl)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  &ldquo;{searchQuery}&rdquo;{" "}
                  <span
                    style={{
                      fontSize: "var(--text-md)",
                      fontWeight: 400,
                      color: "var(--color-text-secondary)",
                      textTransform: "none",
                    }}
                  >
                    {totalCount} Products
                  </span>
                </h1>
              </div>
            )}

            {!searchQuery && (
              <div style={{ marginBottom: "var(--space-xl)" }}>
                <h1
                  style={{
                    fontSize: "var(--text-2xl)",
                    fontWeight: 700,
                  }}
                >
                  {filters.category || "All Products"}
                </h1>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    marginTop: "4px",
                  }}
                >
                  {totalCount} products
                </p>
              </div>
            )}

            {/* Product Grid */}
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              {/* Skeleton Loaders */}
              {isLoading &&
                products.length === 0 &&
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`skel-${i}`}>
                    <div className="skeleton skeleton-card__image" />
                    <div
                      className="skeleton skeleton-card__title"
                      style={{ marginTop: 12 }}
                    />
                    <div className="skeleton skeleton-card__price" />
                  </div>
                ))}
            </div>

            {/* Load More */}
            {hasMore && !isLoading && products.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "var(--space-3xl) 0",
                }}
              >
                <button
                  onClick={loadMore}
                  style={{
                    padding: "var(--space-md) var(--space-2xl)",
                    border: "1px solid var(--color-border)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: "transparent",
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.background = "var(--color-black)";
                    (e.target as HTMLButtonElement).style.color = "var(--color-white)";
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.background = "transparent";
                    (e.target as HTMLButtonElement).style.color = "var(--color-black)";
                  }}
                >
                  Load More Products
                </button>
              </div>
            )}

            {isLoading && products.length > 0 && (
              <p
                style={{
                  textAlign: "center",
                  padding: "var(--space-2xl)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Loading more products...
              </p>
            )}

            {!isLoading && products.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "var(--space-5xl) 0",
                  color: "var(--color-text-secondary)",
                }}
              >
                <p
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  No products found
                </p>
                <p style={{ fontSize: "var(--text-sm)" }}>
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          Loading...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
