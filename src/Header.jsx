import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./css/header.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user || null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">MyShop</Link>
      </div>

      <div className="header-actions">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button className="btn-orange" onClick={handleLogout}>
              Đăng xuất
            </button>
            <Link className="cart-icon" to="/cart">🛒</Link>
          </>
        ) : (
          <>
            <Link className="btn-orange" to="/login">Đăng nhập</Link>
            <Link className="btn-orange" to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </header>
  );
}
