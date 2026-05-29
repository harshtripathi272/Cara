"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FilterState = {
  sort: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
};

type FilterSidebarProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  resultCount: number;
};

function FilterGroup({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="filter-group">
      <button
        className="filter-group__toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronDown
          size={14}
          className={`filter-group__toggle-icon ${
            isOpen ? "filter-group__toggle-icon--open" : ""
          }`}
        />
      </button>
      {isOpen && <div className="filter-group__options">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  categories,
  resultCount,
}: FilterSidebarProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFilterChange({
      sort: "relevancy",
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
    });
  };

  const sortOptions = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "relevancy", label: "Relevancy" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Top Rated" },
  ];

  const priceRanges = [
    { label: "Under $25", min: "0", max: "25" },
    { label: "$25 - $50", min: "25", max: "50" },
    { label: "$50 - $100", min: "50", max: "100" },
    { label: "$100 - $200", min: "100", max: "200" },
    { label: "Over $200", min: "200", max: "" },
  ];

  const ratingOptions = [
    { label: "4★ & above", value: "4" },
    { label: "3★ & above", value: "3" },
    { label: "2★ & above", value: "2" },
    { label: "1★ & above", value: "1" },
  ];

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__header">
        <h2 className="filter-sidebar__title">Filter & Sort</h2>
        <button className="filter-sidebar__clear" onClick={clearAll}>
          Clear All
        </button>
      </div>

      <FilterGroup title="Sort By">
        {sortOptions.map((opt) => (
          <label
            key={opt.value}
            className={`filter-option ${
              filters.sort === opt.value ? "filter-option--active" : ""
            }`}
          >
            <input
              type="radio"
              name="sort"
              value={opt.value}
              checked={filters.sort === opt.value}
              onChange={() => updateFilter("sort", opt.value)}
            />
            <span className="filter-option__label">{opt.label}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Category">
        <label
          className={`filter-option ${
            !filters.category ? "filter-option--active" : ""
          }`}
        >
          <input
            type="radio"
            name="category"
            value=""
            checked={!filters.category}
            onChange={() => updateFilter("category", "")}
          />
          <span className="filter-option__label">
            All Categories ({resultCount})
          </span>
        </label>
        {categories.map((cat) => (
          <label
            key={cat}
            className={`filter-option ${
              filters.category === cat ? "filter-option--active" : ""
            }`}
          >
            <input
              type="radio"
              name="category"
              value={cat}
              checked={filters.category === cat}
              onChange={() => updateFilter("category", cat)}
            />
            <span className="filter-option__label">{cat}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Price" defaultOpen={false}>
        <label
          className={`filter-option ${
            !filters.minPrice && !filters.maxPrice
              ? "filter-option--active"
              : ""
          }`}
        >
          <input
            type="radio"
            name="price"
            checked={!filters.minPrice && !filters.maxPrice}
            onChange={() => {
              onFilterChange({ ...filters, minPrice: "", maxPrice: "" });
            }}
          />
          <span className="filter-option__label">All Prices</span>
        </label>
        {priceRanges.map((range) => (
          <label
            key={range.label}
            className={`filter-option ${
              filters.minPrice === range.min && filters.maxPrice === range.max
                ? "filter-option--active"
                : ""
            }`}
          >
            <input
              type="radio"
              name="price"
              checked={
                filters.minPrice === range.min &&
                filters.maxPrice === range.max
              }
              onChange={() => {
                onFilterChange({
                  ...filters,
                  minPrice: range.min,
                  maxPrice: range.max,
                });
              }}
            />
            <span className="filter-option__label">{range.label}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Rating" defaultOpen={false}>
        <label
          className={`filter-option ${
            !filters.minRating ? "filter-option--active" : ""
          }`}
        >
          <input
            type="radio"
            name="rating"
            checked={!filters.minRating}
            onChange={() => updateFilter("minRating", "")}
          />
          <span className="filter-option__label">All Ratings</span>
        </label>
        {ratingOptions.map((opt) => (
          <label
            key={opt.value}
            className={`filter-option ${
              filters.minRating === opt.value ? "filter-option--active" : ""
            }`}
          >
            <input
              type="radio"
              name="rating"
              value={opt.value}
              checked={filters.minRating === opt.value}
              onChange={() => updateFilter("minRating", opt.value)}
            />
            <span className="filter-option__label">{opt.label}</span>
          </label>
        ))}
      </FilterGroup>
    </aside>
  );
}
