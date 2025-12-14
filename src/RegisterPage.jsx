import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Thêm state cho username
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // 1. Đăng ký với Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            username: username.trim() || email.split('@')[0] // Thêm metadata
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      console.log("Đăng ký thành công, User ID:", data.user?.id);

      // 2. Tạo profile trong bảng profiles
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            email: email.trim(),
            username: username.trim() || email.split('@')[0], // QUAN TRỌNG: Thêm username
            role_id: 2, // Mặc định là user
          },
        ]);

      if (insertError) {
        console.error("Lỗi khi tạo profile:", insertError);
        
        // Nếu lỗi vì username đã tồn tại, thử với tên khác
        if (insertError.code === '23505') {
          const { error: retryError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                email: email.trim(),
                username: `${username.trim()}_${Date.now()}`,
                role_id: 2,
              },
            ]);
          
          if (retryError) {
            setErrorMsg("Lỗi khi tạo tài khoản. Vui lòng thử lại.");
            return;
          }
        } else {
          setErrorMsg("Lỗi khi tạo tài khoản: " + insertError.message);
          return;
        }
      }

      setSuccessMsg("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      
      // Tự động chuyển hướng sau 3 giây
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setErrorMsg("Đã xảy ra lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Đăng ký</h2>
        <p className="auth-subtitle">Tạo tài khoản mới</p>
        
        {successMsg && <div className="auth-success">{successMsg}</div>}
        {errorMsg && <div className="auth-error">{errorMsg}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Email *</label>
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
            <label>Tên người dùng (username)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Để trống sẽ tự tạo từ email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Mật khẩu *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ít nhất 6 ký tự"
              minLength="6"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        
        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}