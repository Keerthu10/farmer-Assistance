import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductCard from "./ProductCard";

describe("ProductCard Component", () => {
  it("renders product name", () => {
    render(
      <ProductCard
        product={{
          productName: "Fresh Tomato",
        }}
      />
    );

    expect(screen.getByText("Fresh Tomato")).toBeInTheDocument();
  });

  it("renders price and category accurately", () => {
    render(
      <ProductCard
        product={{
          productName: "Organic Basmati Rice",
          crop_category: "Cereals",
          price_per_unit: 85,
          unit: "kg",
          quantity_available: 500,
        }}
      />
    );

    expect(screen.getByText("Organic Basmati Rice")).toBeInTheDocument();
    expect(screen.getByText("Cereals")).toBeInTheDocument();
    expect(screen.getByText("500 kg available")).toBeInTheDocument();
  });
});
