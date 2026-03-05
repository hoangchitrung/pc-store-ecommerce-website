import { useParams, useOutletContext } from "react-router-dom"; // ← thêm useOutletContext
import { getProductById } from "../hooks/productApi";
import { useState, useEffect } from "react";

export function ProductDetailsPage() {
    const { id } = useParams();
    const { onAdd } = useOutletContext();   // ← lấy onAdd từ App

    const [product, setProduct] = useState(null);   // ← sửa: null thay vì []
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getProductById(id)
            .then((data) => {
                setProduct(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, [id]);   // ← quan trọng: thêm dependency [id]

    if (isLoading) return <p>Đang tải sản phẩm...</p>;
    if (!product) return <h1>Product not found!</h1>;

    return (
        <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>{product.name}</h1>
            <img 
                src={product.image_url || "https://via.placeholder.com/400"} 
                alt={product.name} 
                style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
            <p><strong>Giá:</strong> {product.price?.toLocaleString('vi-VN')} VND</p>
            <p><strong>Tồn kho:</strong> {product.stock_quantity}</p>
            <p>{product.description}</p>

            {/* Nút Add to Cart */}
            <button
                onClick={() => onAdd(product)}
                style={{
                    marginTop: "20px",
                    padding: "15px 30px",
                    fontSize: "18px",
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}
            >
                Thêm vào giỏ hàng
            </button>
        </div>
    );
}