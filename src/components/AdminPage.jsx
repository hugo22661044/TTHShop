import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../css/admin.css";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra quyền admin
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      // Kiểm tra role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role_id !== 1) {
        navigate("/");
        return;
      }

      setUser(user);
      fetchStats();
    };

    checkAdmin();
  }, [navigate]);

  const fetchStats = async () => {
    // Lấy số lượng sản phẩm
    const { count: productCount } = await supabase
      .from("products")
      .select("*", { count: 'exact', head: true });

    // Lấy số lượng user
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: 'exact', head: true });

    setStats({
      totalProducts: productCount || 0,
      totalUsers: userCount || 0,
      totalOrders: 0,
      revenue: 0
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>TTHShop Admin</h2>
          <p>Xin chào, {user?.email}</p>
        </div>

        <nav className="admin-nav">
          <Link to="/admin" className="nav-item active">
            📊 Dashboard
          </Link>
          <Link to="/admin/products" className="nav-item">
            📦 Quản lý sản phẩm
          </Link>
          <Link to="/admin/orders" className="nav-item">
            📋 Đơn hàng
          </Link>
          <Link to="/admin/users" className="nav-item">
            👥 Quản lý người dùng
          </Link>
          <Link to="/admin/categories" className="nav-item">
            📁 Danh mục
          </Link>
        </nav>

        <div className="admin-footer">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Đăng xuất
          </button>
          <Link to="/" className="back-to-shop">
            ← Về cửa hàng
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Bảng điều khiển Admin</h1>
          <div className="admin-info">
            <span>Admin ID: {user?.id?.substring(0, 8)}...</span>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Sản phẩm</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Người dùng</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Đơn hàng</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{stats.revenue.toLocaleString()}đ</h3>
              <p>Doanh thu</p>
            </div>
          </div>
        </div>

        {/* Outlet cho các trang con */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}