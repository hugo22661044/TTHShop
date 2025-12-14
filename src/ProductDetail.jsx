import { useParams } from "react-router-dom";
import products from "./data/products";
import { useCart } from "./CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find(p => p.id === Number(id));
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  const handleAddToCart = () => {
    // Gọi hàm addToCart - NÓ SẼ TỰ KIỂM TRA ĐĂNG NHẬP
    const success = addToCart(product);
    
    if (success) {
      // Chỉ chạy vào đây nếu đã đăng nhập
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
    // Nếu chưa đăng nhập, addToCart đã tự chuyển đến /login
  };

  return (
    <div className="detail">
      <img src={product.image} alt={product.name} />

      <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <h3>{product.price.toLocaleString()}đ</h3>

        <button onClick={handleAddToCart} className="btn-add">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}