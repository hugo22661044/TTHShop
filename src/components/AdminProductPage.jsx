import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../css/admin.css";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "laptop",
    image_url: "",
    stock: 0
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categories] = useState(["laptop", "pc", "linhkien", "phukien"]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error) setProducts(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        updated_at: new Date()
      };

      if (editingId) {
        // Update
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId);
        
        if (error) throw error;
        alert("✅ Cập nhật thành công!");
      } else {
        // Insert
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase
          .from("products")
          .insert([{
            ...productData,
            created_by: user?.id
          }]);
        
        if (error) throw error;
        alert("✅ Thêm sản phẩm thành công!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      alert("❌ Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "laptop",
      image_url: "",
      stock: 0
    });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "laptop",
      image_url: product.image_url || "",
      stock: product.stock || 0
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    
    if (error) {
      alert("Lỗi xóa: " + error.message);
      return;
    }
    
    alert("✅ Xóa thành công!");
    fetchProducts();
  };

  return (
    <div className="product-management">
      <div className="page-header">
        <h2>Quản lý sản phẩm</h2>
        <p>Thêm, sửa, xóa sản phẩm trong cửa hàng</p>
      </div>

      {/* Form */}
      <div className="form-section">
        <h3>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tên sản phẩm *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div className="form-group">
              <label>Giá (VNĐ) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                min="0"
                placeholder="25990000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Danh mục</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "laptop" ? "Laptop" : 
                     cat === "pc" ? "PC" :
                     cat === "linhkien" ? "Linh kiện" : "Phụ kiện"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Số lượng tồn</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
              placeholder="Mô tả chi tiết sản phẩm..."
            />
          </div>

          <div className="form-group">
            <label>URL hình ảnh</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image_url && (
              <div className="image-preview">
                <img src={formData.image_url} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Đang xử lý..." : (editingId ? "Cập nhật" : "Thêm sản phẩm")}
            </button>
            
            {editingId && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="table-section">
        <h3>Danh sách sản phẩm ({products.length})</h3>
        
        {products.length === 0 ? (
          <div className="empty-state">
            <p>📭 Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Danh mục</th>
                  <th>Tồn kho</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td>
                      <div className="product-cell">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="product-thumb" />
                        )}
                        <div>
                          <strong>{product.name}</strong>
                          {product.description && (
                            <p className="product-desc">{product.description.substring(0, 50)}...</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{parseInt(product.price).toLocaleString()}đ</td>
                    <td>
                      <span className={`category-badge ${product.category}`}>
                        {product.category}
                      </span>
                    </td>
                    <td>
                      <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                        {product.stock > 0 ? `${product.stock} cái` : 'Hết hàng'}
                      </span>
                    </td>
                    <td>{new Date(product.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="btn-edit"
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="btn-delete"
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}