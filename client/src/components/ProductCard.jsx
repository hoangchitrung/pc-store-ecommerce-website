import { useNavigate } from "react-router-dom"
import { useState } from "react";
import "./ProductCard.css"

function ProductImage({ src, alt }) {
    const [hasError, setHasError] = useState(false);
    const showFallback = !src || hasError;

    return (
        <div className="product-image-wrap" aria-label={showFallback ? "Image unavailable" : alt}>
            {showFallback ? (
                <div className="product-image-fallback">
                    <i className="fa-solid fa-image"></i>
                </div>
            ) : (
                <img
                    className="product-image"
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onError={() => setHasError(true)}
                />
            )}
        </div>
    );
}

export function ProductCard({ products, onAddToCart }) {
    const navigate = useNavigate();

    return (
        <div className="product-grid">
            {products.map((product) => (
                <article
                    className="product-card"
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/products/${product.id}`);
                        }
                    }}
                >
                    <ProductImage src={product.image_url} alt={product.name} />
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">${Number(product.price).toLocaleString()}</p>
                    <div className="product-actions">
                        {typeof onAddToCart === "function" && (
                            <button
                                className="cart-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(product);
                                }}
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>
                </article>
            ))}
        </div>
    )
}