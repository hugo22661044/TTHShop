import React from "react";
import products from "./data/products";
import { useCart } from "./CartContext";
import "./css/products.css";

export default function PCPage() {
  const { addToCart } = useCart();
  const list = products.filter(p => p.category === "PC");

  return (
    <div>
      <h2>PC</h2>
      <div className="product-grid">
        {list.map(p => (
          <div key={p.id} className="product-card">
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>
            <div className="product-price">{p.price.toLocaleString()}₫</div>
            <button className="btn-add" onClick={() => addToCart(p)}>Thêm vào giỏ</button>
          </div>
        ))}
      </div>
    </div>
  );
}
