import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { CartProvider, useCart } from "./CartContext";
import { MarketplaceProduct } from "../types";

const mockProduct: MarketplaceProduct = {
  id: 101,
  farmer_id: 1,
  farm_name: "Green Valley Farm",
  farmer_name: "Ramesh Kumar",
  farmer_avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80",
  farmer_verified: true,
  name: "Organic Vine Tomatoes",
  crop_category: "Vegetables",
  quantity_available: 50,
  unit: "kg",
  price_per_unit: 45,
  mandi_benchmark_price: 25,
  retail_supermarket_price: 65,
  harvest_date: "2026-09-10",
  freshness_label: "Harvested Today",
  is_organic: true,
  farm_location: {
    village: "Samrala",
    district: "Ludhiana",
    state: "Punjab",
    country: "India",
  },
  image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80",
  shelf_life_days: 7,
  min_order_qty: 1,
  batch_number: "BATCH-TOM-01",
  soil_type: "Alluvial",
  water_source: "Tube well",
  delivery_estimate_days: 1,
  description: "Freshly picked vine ripe tomatoes.",
  rating: 4.9,
  review_count: 24,
  in_stock: true,
  created_at: "2026-09-10T08:00:00Z",
};

describe("CartContext State Management", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with empty cart items", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.subtotalAmount).toBe(0);
  });

  it("adds produce item to cart and calculates subtotal & savings", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalCount).toBe(3);
    expect(result.current.subtotalAmount).toBe(3 * 45);
    expect(result.current.totalSavings).toBe(3 * (65 - 45)); // savings vs retail
  });

  it("updates quantity and removes item when requested", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });
    expect(result.current.totalCount).toBe(2);

    act(() => {
      result.current.updateQuantity(mockProduct.id, 5);
    });
    expect(result.current.totalCount).toBe(5);

    act(() => {
      result.current.removeFromCart(mockProduct.id);
    });
    expect(result.current.items.length).toBe(0);
    expect(result.current.totalCount).toBe(0);
  });
});
