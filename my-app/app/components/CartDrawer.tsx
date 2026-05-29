"use client";

import React from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

type CartDrawerProps = {
  onClose: () => void;
};

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <AnimatePresence>
      <motion.div
        key="cart-overlay"
        className="cart-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        key="cart-drawer-panel"
        className="cart-drawer"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Your Bag ({totalItems})</h2>
          <button onClick={onClose} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        <div className="cart-drawer__items">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <p style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "8px" }}>
                Your bag is empty
              </p>
              <p style={{ fontSize: "var(--text-sm)" }}>
                Looks like you haven&apos;t added anything yet.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="cart-drawer__item">
                <div className="cart-drawer__item-image">
                  {item.product.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.title || "Product"}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="cart-drawer__item-info">
                  <h4 className="cart-drawer__item-title">
                    {item.product.title}
                  </h4>
                  <p className="cart-drawer__item-category">
                    {item.product.main_category}
                  </p>
                  <div className="cart-drawer__item-quantity">
                    <button
                      className="cart-drawer__qty-btn"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 size={12} />
                      ) : (
                        <Minus size={12} />
                      )}
                    </button>
                    <span style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>
                      {item.quantity}
                    </span>
                    <button
                      className="cart-drawer__qty-btn"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      style={{ marginLeft: "auto", opacity: 0.5 }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className="cart-drawer__item-price">
                    ${((item.product.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="cart-drawer__checkout">Checkout</button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
