"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { label: "Women", href: "/shop?category=Clothing, Shoes and Jewelry" },
  { label: "Men", href: "/shop?category=Sports and Outdoors" },
  { label: "Accessories", href: "/shop?category=Electronics" },
  { label: "Explore", href: "/shop" },
];

const promoMessages = [
  "Free standard shipping on orders over $75",
  "New customers get 10% off — use code WELCOME10",
  "Shop the latest collections — New arrivals daily",
  "Free returns within 30 days",
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { totalItems, openCart, isCartOpen, closeCart } = useCart();

  return (
    <>
      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-banner__track">
          {[...promoMessages, ...promoMessages, ...promoMessages].map(
            (msg, i) => (
              <span key={i} className="promo-banner__item">
                {msg}
              </span>
            )
          )}
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="header__main">
          {/* Left Nav */}
          <nav className="header__nav">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="header__nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="header__mobile-toggle"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Center Logo */}
          <Link href="/" className="header__logo">
            CARA
          </Link>

          {/* Right Actions */}
          <div className="header__actions">
            <button
              className="header__search-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={16} />
              <span>What are you looking for today?</span>
            </button>

            <button className="header__action-btn" aria-label="Wishlist">
              <Heart size={20} />
            </button>

            <button className="header__action-btn" aria-label="Account">
              <User size={20} />
            </button>

            <button
              className="header__action-btn"
              onClick={openCart}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="header__cart-count">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <SearchOverlay onClose={() => setIsSearchOpen(false)} />
      )}

      {/* Cart Drawer */}
      {isCartOpen && <CartDrawer onClose={closeCart} />}

      {/* Mobile Nav */}
      {isMobileNavOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav__header">
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                letterSpacing: "3px",
              }}
            >
              CARA
            </span>
            <button onClick={() => setIsMobileNavOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          <nav className="mobile-nav__links">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="mobile-nav__link"
                onClick={() => setIsMobileNavOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
