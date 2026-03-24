import { useState, useEffect } from "react";
import axios from "axios";
import { ProductForm } from "../components/ProductForm.jsx";
import { ProductTable } from "../components/ProductTable.jsx";

export function AdminPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // State quản lý Form
    const [formData, setFormData] = useState({ 
        id: null, name: "", price: "", category: "", brand: "", stock_quantity: 0, image_url: "", specifications: "", description: ""
    });
    const [isEditing, setIsEditing] = useState(false);

    // [API] Tải danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/products");
            setProducts(res.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu", error);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    // [Logic] Xử lý khi gõ vào ô input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // [Logic] Khi bấm nút "Sửa" ở dưới Bảng
    const handleEditClick = (product) => {
        setIsEditing(true);
        setFormData({
            id: product.id, name: product.name || "", price: product.price || "", category: product.category || "", 
            brand: product.brand || "", stock_quantity: product.stock_quantity || 0, image_url: product.image_url || "", 
            specifications: product.specifications || "", description: product.description || ""
        });
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    };

    // [Logic] Khi bấm "Hủy" trên Form
    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ id: null, name: "", price: "", category: "", brand: "", stock_quantity: 0, image_url: "", specifications: "", description: "" });
    };

    // [API] Khi bấm "Lưu thay đổi" hoặc "Thêm vào kho"
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/products/${formData.id}`, formData);
                alert("Cập nhật thành công!");
            } else {
                await axios.post("http://localhost:5000/api/products", formData);
                alert("Thêm sản phẩm thành công!");
            }
            handleCancel(); 
            fetchProducts(); 
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Có lỗi xảy ra: " + (error.response?.data?.message || "Vui lòng kiểm tra lại thông tin"));
        }
        setIsLoading(false);
    };

    // [API] Khi bấm nút "Xóa" ở Bảng
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                alert("Đã xóa sản phẩm");
                fetchProducts();
            } catch (error) {
                alert("Lỗi khi xóa");
            }
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="fw-bold mb-4">Trang Quản Trị (Admin)</h2>

            {/* Gọi Component Form và truyền Props xuống */}
            <ProductForm 
                formData={formData} 
                isEditing={isEditing} 
                isLoading={isLoading} 
                onChange={handleChange} 
                onSubmit={handleSubmit} 
                onCancel={handleCancel} 
            />

            <h4 className="fw-bold mb-3 mt-5">Danh sách trong kho</h4>
            
            {/* Gọi Component Table và truyền Props xuống */}
            <ProductTable 
                products={products} 
                onEdit={handleEditClick} 
                onDelete={handleDelete} 
            />
            
        </div>
    );
}