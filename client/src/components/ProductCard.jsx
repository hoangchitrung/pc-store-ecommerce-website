import { useNavigate } from "react-router-dom"
import { useState } from "react";

export function ProductCard({ products, onAdd }) {
    return (
        <div className="row g-4">
            {products.map((product) => (
                <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 shadow-sm border-0 bg-white">
                        <Link to={`/products/${product.id}`} className="text-decoration-none text-dark text-center pt-3">
                            <img 
                                src={product.image_url} 
                                className="card-img-top p-2" 
                                alt={product.name}
                                style={{ height: "180px", objectFit: "contain" }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/180?text=No+Image";
                                }}
                            />
                            <div className="card-body">
                                <h6 className="card-title text-truncate mb-2" title={product.name}>{product.name}</h6>
                                <p className="card-text fw-bold text-danger fs-5">{product.price}$</p>
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