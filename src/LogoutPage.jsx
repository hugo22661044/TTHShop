import React, { useState } from "react";
import { supabase } from "./supabaseClient"; 
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1. Đăng nhập với Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setErrorMsg(error.message || "Sai tài khoản hoặc mật khẩu.");
        return;
      }

      if (!data?.user) {
        setErrorMsg("Không tìm thấy người dùng.");
        return;
      }

      console.log("Đăng nhập thành công, User ID:", data.user.id);

      // 2. Lấy thông tin profile với role
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select(`
          *,
          tbl_roles (*)
        `)
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("Lỗi khi lấy profile:", profileError);
        // Vẫn cho đăng nhập nhưng không có role
        navigate("/");
        return;
      }

      console.log("Profile:", userProfile);

      // 3. Điều hướng dựa trên role
      if (userProfile?.tbl_roles?.role_name === "admin" || userProfile?.role_id === 1) {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setErrorMsg("Đã xảy ra lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Đăng nhập</h2>
        <p className="auth-subtitle">Nhập thông tin tài khoản của bạn</p>
        
        {errorMsg && <div className="auth-error">{errorMsg}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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