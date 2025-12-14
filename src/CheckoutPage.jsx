import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./css/products.css";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    address: "",
    district: "",
    city: "",
    note: ""
  });

  // Kiểm tra đăng nhập
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        // Nếu chưa đăng nhập, chuyển đến trang login
        navigate("/login");
        return;
      }
      
      // Nếu đã đăng nhập, lấy thông tin profile để pre-fill form
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        setForm(prev => ({
          ...prev,
          fullname: profile.full_name || "",
          phone: profile.phone || "",
          address: profile.address || ""
        }));
      }
    };
    
    checkAuth();
  }, [navigate]);

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!user) {
      alert("Vui lòng đăng nhập để thanh toán!");
      navigate("/login");
      return;
    }
    
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Lưu đơn hàng vào database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            fullname: form.fullname,
            phone: form.phone,
            address: `${form.address}, ${form.district}, ${form.city}`,
            note: form.note,
            total_amount: total,
            status: "pending",
            items: cart.map(item => ({
              product_id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity || 1,
              subtotal: item.price * (item.quantity || 1)
            }))
          }
        ])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // 2. Cập nhật số lượng tồn kho (nếu có bảng products)
      for (const item of cart) {
        if (item.id) {
          await supabase.rpc('decrease_product_stock', {
            product_id: item.id,
            quantity: item.quantity || 1
          }).catch(console.error); // Ignore error if function doesn't exist
        }
      }
      
      // 3. Hiển thị thông báo thành công
      alert(`✅ Đặt hàng thành công!\nMã đơn hàng: #${order.id}\nTổng tiền: ${total.toLocaleString()}₫\nCảm ơn bạn đã mua hàng!`);
      
      // 4. Xóa giỏ hàng và chuyển hướng
      clearCart();
      navigate("/");
      
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert(`❌ Có lỗi xảy ra: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Nếu chưa đăng nhập, hiển thị loading
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>Đang kiểm tra đăng nhập...</h3>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Thanh toán</h2>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Giỏ hàng của bạn đang trống.</p>
          <button 
            onClick={() => navigate("/")}
            className="btn-add"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="checkout-wrapper">
          {/* Thông tin sản phẩm */}
          <div className="cart-summary">
            <h3>Đơn hàng của bạn ({cart.length} sản phẩm)</h3>
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="checkout-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Số lượng: {item.quantity || 1}</p>
                  </div>
                  <div className="item-price">
                    {(item.price * (item.quantity || 1)).toLocaleString()}₫
                  </div>
                </div>
              ))}
            </div>
            
            <div className="total-section">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{total.toLocaleString()}₫</span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển:</span>
                <span>30.000₫</span>
              </div>
              <div className="total-row grand-total">
                <strong>Tổng cộng:</strong>
                <strong>{(total + 30000).toLocaleString()}₫</strong>
              </div>
            </div>
          </div>
          
          {/* Form thông tin giao hàng */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Thông tin giao hàng</h3>
            
            <div className="user-info-note">
              <p>Xin chào <strong>{user.email}</strong></p>
            </div>
            
            <div className="form-group">
              <label>Họ và tên *</label>
              <input 
                type="text" 
                name="fullname" 
                value={form.fullname} 
                onChange={handleChange} 
                required 
                placeholder="Nguyễn Văn A"
              />
            </div>
            
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input 
                type="tel" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                required 
                placeholder="090xxxxxxx"
                pattern="[0-9]{10,11}"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Tỉnh/Thành phố *</label>
                <select name="city" value={form.city} onChange={handleChange} required>
                  <option value="">Chọn tỉnh/thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Quận/Huyện *</label>
                <input 
                  type="text" 
                  name="district" 
                  value={form.district} 
                  onChange={handleChange} 
                  required 
                  placeholder="Quận 1"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Địa chỉ cụ thể *</label>
              <input 
                type="text" 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                required 
                placeholder="Số nhà, tên đường"
              />
            </div>
            
            <div className="form-group">
              <label>Ghi chú (tùy chọn)</label>
              <textarea 
                name="note" 
                value={form.note} 
                onChange={handleChange} 
                placeholder="Ghi chú thêm về đơn hàng..."
                rows="3"
              />
            </div>
            
            <div className="payment-summary">
              <h4>Thông tin thanh toán</h4>
              <div className="payment-details">
                <p><strong>Phương thức:</strong> Thanh toán khi nhận hàng (COD)</p>
                <p><strong>Tổng đơn hàng:</strong> {(total + 30000).toLocaleString()}₫</p>
              </div>
            </div>
            
            <button 
              className="btn-add" 
              type="submit"
              disabled={loading}
              style={{ width: '100%', fontSize: '18px', padding: '15px' }}
            >
              {loading ? "Đang xử lý..." : `Xác nhận đặt hàng - ${(total + 30000).toLocaleString()}₫`}
            </button>
            
            <p className="order-note">
              ⚠️ Bạn sẽ thanh toán khi nhận được hàng. Nhân viên sẽ gọi điện xác nhận đơn hàng trong vòng 24h.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}