import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductById } from "../api/productApi.js";

// Format number as Vietnamese đồng (VNĐ)
const formatVND = (value) => {
    const n = Number(value) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
};

export function ProductDetailsPage({ onAdd }) {
    const { id } = useParams();
    const navigate = useNavigate(); // Dùng để làm nút "Quay lại"

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductById(id)
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
                setLoading(false);
            });
    }, [id]);

    let specsObj = {};
    if (product && product.specifications) {
        try {
            specsObj = typeof product.specifications === 'string'
                ? JSON.parse(product.specifications)
                : product.specifications;
        } catch (e) {
            console.error("Không thể đọc thông số kỹ thuật", e);
        }
    }

    // 1. Giao diện lúc đang tải dữ liệu
    if (loading) {
        return (
            <div className="container text-center py-5" style={{ minHeight: "60vh" }}>
                <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="mt-3 text-muted">Đang tải thông tin sản phẩm...</h5>
            </div>
        );
    }

    // 2. Giao diện khi ID sản phẩm không tồn tại
    if (!product) {
        return (
            <div className="container text-center py-5">
                <h3 className="text-danger">Không tìm thấy sản phẩm!</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/products")}>
                    Quay lại Cửa hàng
                </button>
            </div>
        );
    }

    // 3. Giao diện chính của trang Chi tiết
    return (
        <div className="container mt-5 mb-5">
            {/* Nút Quay lại */}
            <button className="btn btn-outline-secondary mb-4 shadow-sm" onClick={() => navigate(-1)}>
                &laquo; Quay lại
            </button>

            <div className="row g-5">
                {/* Cột trái: Hình ảnh sản phẩm */}
                <div className="col-md-5 text-center">
                    <div className="card border-0 shadow-sm p-4 bg-white rounded-4">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="img-fluid"
                            style={{ maxHeight: "400px", objectFit: "contain" }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400?text=No+Image";
                            }}
                        />
                    </div>
                </div>

                {/* Cột phải: Thông tin & Đặt hàng */}
                <div className="col-md-7">
                    <h2 className="fw-bold mb-3">{product.name}</h2>

                    {/* Các nhãn dán (Badges) */}
                    <div className="mb-3">
                        <span className="badge bg-dark fs-6 me-2 px-3 py-2">{product.brand}</span>
                        <span className="badge bg-secondary fs-6 px-3 py-2">{product.category}</span>
                    </div>

                    <h1 className="text-danger fw-bold mb-4">{formatVND(product.price)}</h1>

                    {/* Mô tả ngắn */}
                    <p className="text-muted fs-5 mb-4" style={{ lineHeight: "1.6" }}>
                        {product.description || "Chưa có bài viết mô tả chi tiết cho sản phẩm này."}
                    </p>

                    {/* Khung trạng thái kho */}
                    <div className="bg-light p-3 rounded-3 border mb-4">
                        <div className="d-flex align-items-center mb-2">
                            <span className="fw-semibold me-2">Tình trạng:</span>
                            {product.stock_quantity > 0 ? (
                                <span className="text-success fw-bold"><i className="fa-solid fa-check-circle me-1"></i> Còn hàng ({product.stock_quantity})</span>
                            ) : (
                                <span className="text-danger fw-bold"><i className="fa-solid fa-xmark-circle me-1"></i> Tạm hết hàng</span>
                            )}
                        </div>
                        {product.tdp && (
                            <div className="d-flex align-items-center text-muted">
                                <span className="fw-semibold me-2 text-dark">Điện năng tiêu thụ (TDP):</span> {product.tdp}W
                            </div>
                        )}
                    </div>

                    {/* Nút thêm vào giỏ */}
                    <button
                        className={`btn btn-lg w-100 py-3 fw-bold shadow-sm ${product.stock_quantity > 0 ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={() => {
                            if (typeof onAdd === 'function') {
                                onAdd(product);
                            } else {
                                console.warn('onAdd callback chưa được cung cấp cho ProductDetailsPage');
                            }
                        }}
                        disabled={product.stock_quantity <= 0}
                    >
                        {product.stock_quantity > 0 ? "THÊM VÀO GIỎ HÀNG" : "LIÊN HỆ ĐẶT HÀNG TRƯỚC"}
                    </button>
                </div>
            </div>

            {/* Phần dưới: Bảng thông số kỹ thuật (Chỉ hiện khi có dữ liệu specs) */}
            {Object.keys(specsObj).length > 0 && (
                <div className="row mt-5 pt-4 border-top">
                    <div className="col-lg-8">
                        <h4 className="fw-bold mb-4 text-uppercase">Thông số kỹ thuật chi tiết</h4>
                        <div className="table-responsive">
                            <table className="table table-striped table-hover border">
                                <tbody>
                                    {Object.entries(specsObj).map(([key, value]) => (
                                        <tr key={key}>
                                            <th className="w-25 bg-light text-capitalize">{key.replace(/_/g, ' ')}</th>
                                            <td>{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}