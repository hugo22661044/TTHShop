import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";
import Layout from "./Layout";
import LaptopPage from "./LaptopPage";
import PCPage from "./PCPage";
import LinhKienPage from "./LinhKienPage";
import PhuKienPage from "./PhuKienPage";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ProductDetail from "./ProductDetail";
import AdminPage from "./components/AdminPage";
import AdminProductPage from "./components/AdminProductPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<LaptopPage />} />
            <Route path="laptop" element={<LaptopPage />} />
            <Route path="pc" element={<PCPage />} />
            <Route path="linhkien" element={<LinhKienPage />} />
            <Route path="phukien" element={<PhuKienPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="product/:id" element={<ProductDetail />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<div style={{ padding: "30px" }}><h2>Admin Dashboard</h2><p>Chọn chức năng từ menu bên trái</p></div>} />
            <Route path="products" element={<AdminProductPage />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={
            <div style={{ textAlign: "center", padding: "100px" }}>
              <h1>404 - Trang không tìm thấy</h1>
              <a href="/" style={{ color: "#b22d30" }}>Về trang chủ</a>
            </div>
          } />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);