import { Link } from "react-router-dom";
import products from "./data/products";

export default function Home() {
  return (
    <>
      <h2>🔥 Máy tính bán chạy</h2>

      <div className="product-grid">
        {products.map(p => (
          <div className="card" key={p.id}>
            <img src={p.image} />
            <h4>{p.name}</h4>
            <p>{p.price.toLocaleString()}đ</p>
            <Link to={`/products/${p.id}`}>Xem chi tiết</Link>
          </div>
        ))}
      </div>
    </>
  );
}
