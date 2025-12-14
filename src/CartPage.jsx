import React from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./css/products.css";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p>Chưa có sản phẩm nào trong giỏ.</p>
      ) : (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()}₫</td>
                  <td>
                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Tổng: {total.toLocaleString()}₫</h3>
          <button className="btn-add" onClick={handleCheckout}>Thanh toán</button>
          <button className="btn-remove" onClick={clearCart} style={{marginLeft: "10px"}}>Xóa hết</button>
        </div>
      )}
    </div>
  );
}
