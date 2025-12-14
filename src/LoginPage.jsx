import React, { useState } from "react";
import { supabase } from "./supabaseClient"; 
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      setErrorMsg("Sai tài khoản hoặc mật khẩu.");
      return;
    }

    // KIỂM TRA VÀ THÊM SẢN PHẨM PENDING
    const pendingItem = localStorage.getItem('pendingCartItem');
    if (pendingItem) {
      try {
        const product = JSON.parse(pendingItem);
        addToCart(product);
        alert(`Đã tự động thêm "${product.name}" vào giỏ hàng!`);
        localStorage.removeItem('pendingCartItem');
      } catch (err) {
        console.error("Lỗi khi thêm sản phẩm pending:", err);
      }
    }

    // Lấy role và điều hướng
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role_id")
      .eq("id", data.user.id)
      .single();

    if (userProfile?.role_id === 1) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Đăng nhập</h2>
        <p className="auth-subtitle">Nhập thông tin tài khoản của bạn</p>
        {errorMsg && <div className="auth-error">{errorMsg}</div>}
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-auth">
            Đăng nhập
          </button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản?{" "}
          <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}