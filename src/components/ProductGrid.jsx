import React from "react";
import products from "../data/products";

export default function ProductGrid({ title, category }) {
  const items = products.filter(
    (p) => p.category === category
  );

  return (
    <div>
      <h2>{title}</h2>

      <div className="product-grid">
        {items.map((p) => (
          <div key={p.id} className="product-card">
            <img
              src={p.image || "https://via.placeholder.com/300"}
              alt={p.name}
            />

            <h4>{p.name}</h4>

            <div className="product-price">
              {Number(p.price).toLocaleString()}₫
            </div>

            <button>Thêm vào giỏ</button>
          </div>
        ))}
      </div>
    </div>
  );
}
