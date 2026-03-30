import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.jsx";
import { getProducts } from "../api/productApi.js";

export function ProductPage({ onAdd }) {
    const [products, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();
    const category = new URLSearchParams(location.search).get("category")?.trim() || "";

    useEffect(() => {
        setIsLoading(true);
        getProducts(category)
            .then((data) => {
                setProduct(data);
                setIsLoading(false);
            }).catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [category]);

    // Không dùng if (isLoading) return <Spinner/> ở ngoài cùng nữa
    // Trả về bộ khung cố định ngay từ đầu
    const heading = category ? `Danh mục: ${category}` : "Tất cả sản phẩm";

    return (
        <div className="container mt-4 mb-5">
            {/* Tiêu đề này luôn hiển thị cố định, giúp trang không bị đẩy giật */}
            <h2 className="mb-4 text-center fw-bold text-uppercase border-bottom pb-2">
                {heading}
            </h2>

            {/* Dùng toán tử ba ngôi để kiểm tra trạng thái bên trong khung */}
            {isLoading ? (
                <div className="text-center py-5" style={{ minHeight: "50vh" }}>
                    <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <h5 className="mt-3 text-muted">Đang tải danh sách sản phẩm...</h5>
                </div>
            ) : error ? (
                <div className="alert alert-danger shadow-sm" role="alert">
                    <strong>Lỗi kết nối:</strong> {error}
                </div>
            ) : (
                <ProductCard products={products} onAdd={onAdd} />
            )}
        </div>
    );
}