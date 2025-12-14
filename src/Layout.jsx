import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext"; // ./ là cùng thư mục src/
import { supabase } from "./supabaseClient"; // ./ là cùng thư mục src/
import ChatBot from "./ChatBot"; // ./ là cùng thư mục src/
import "./css/layout.css";

export default function Layout() {
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) checkIfAdmin(data.user);
    });
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) checkIfAdmin(currentUser);
      else setIsAdmin(false);
    });
    
    return () => listener.subscription.unsubscribe();
  }, []);

  const checkIfAdmin = async (user) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", user.id)
        .single();
      
      setIsAdmin(profile?.role_id === 1);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/?search=${keyword}`);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <Link to="/">TTHShop</Link>
        </div>

        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        <div className="header-actions">
          {user ? (
            <>
              <span className="welcome">Xin chào, {user.email}</span>
              
              {isAdmin && (
                <button 
                  onClick={() => navigate('/admin')}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Quản trị
                </button>
              )}
              
              <button onClick={handleLogout} style={{
                background: '#ff6600',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          )}

          <Link to="/cart" className="cart">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <h3>Danh mục</h3>
          <ul>
            <li><Link to="/laptop">Laptop</Link></li>
            <li><Link to="/pc">PC</Link></li>
            <li><Link to="/linhkien">Linh kiện</Link></li>
            <li><Link to="/phukien">Phụ kiện</Link></li>
            
            {isAdmin && (
              <>
                <li style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                  <strong style={{ color: '#b22d30' }}>Quản trị</strong>
                </li>
                <li>
                  <Link to="/admin" style={{ color: '#28a745', fontWeight: 'bold' }}>
                    ⚙️ Bảng điều khiển
                  </Link>
                </li>
                <li>
                  <Link to="/admin/products" style={{ color: '#28a745' }}>
                    📦 Quản lý sản phẩm
                  </Link>
                </li>
              </>
            )}
          </ul>
        </aside>

        <section className="content">
          <Outlet />
        </section>
      </div>

      <ChatBot />
    </div>
  );
}