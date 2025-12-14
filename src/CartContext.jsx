import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Theo dõi trạng thái đăng nhập
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = (product) => {
    // QUAN TRỌNG: Kiểm tra đăng nhập trước
    if (!user) {
      // Lưu sản phẩm vào localStorage để thêm sau khi đăng nhập
      localStorage.setItem('pendingCartItem', JSON.stringify(product));
      // Chuyển hướng đến trang đăng nhập
      navigate('/login');
      return false; // Không thêm vào giỏ
    }
    
    // Đã đăng nhập, thêm vào giỏ bình thường
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    return true; // Thêm thành công
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartCount,
      user // Export user để component khác dùng
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}