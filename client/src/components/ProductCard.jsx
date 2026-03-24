import { Link } from "react-router-dom";
import { useState } from "react";

// Format number as Vietnamese đồng (VNĐ)
const formatVND = (value) => {
    const n = Number(value) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
};

export function ProductCard({ products, onAdd }) {
    return (
        <div className="row g-4">
            {products.map((product) => (
                <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 shadow-sm border-0 bg-white">
                        <Link to={`/products/${product.id}`} className="text-decoration-none text-dark text-center pt-3">
                            <ImageWithFallback src={product.image_url} alt={product.name} />

                            <div className="card-body">
                                <h6 className="card-title text-truncate mb-2" title={product.name}>{product.name}</h6>
                                <p className="card-text fw-bold text-danger fs-5">{formatVND(product.price)}</p>
                            </div>
                        </Link>
                        <div className="card-footer bg-transparent border-top-0 pb-3 pt-0">
                            <button
                                className="btn btn-outline-primary w-100 fw-semibold"
                                onClick={() => onAdd(product)}
                            >
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ImageWithFallback({ src, alt }) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: 180 }}>
                <i className="fa-solid fa-image fa-3x text-secondary"></i>
            </div>
        );
    }

    return (
        <img
            src={src}
            className="card-img-top p-2"
            alt={alt}
            style={{ height: "180px", objectFit: "contain" }}
            onError={() => setError(true)}
        />
    );
}