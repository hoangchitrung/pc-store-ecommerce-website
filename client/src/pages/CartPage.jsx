import { useState } from "react";

function CartItemImage({ src, alt }) {
    const [hasError, setHasError] = useState(false);
    const showFallback = !src || hasError;

    if (showFallback) {
        return (
            <div style={{ width: 72, height: 72, borderRadius: 10, background: "#f1f5f9", display: "grid", placeItems: "center", color: "#64748b" }}>
                <i className="fa-solid fa-image"></i>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            width={72}
            height={72}
            style={{ borderRadius: 10, objectFit: "cover" }}
            onError={() => setHasError(true)}
        />
    );
}

// Nhận cart thay vì onCart
export function CartPage({ cart = [], setCart }) {

    return (
        <div>
            <h1>Your Cart</h1>
            {/* Cập nhật tính tổng tiền: Giá * Số lượng */}
            <h1>Total: {cart.reduce((total, item) => total + (item.price * item.quantity), 0)}$</h1>
            
            {cart.map(product => {
                if (product.id)
                    return (
                        <div key={product.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            <CartItemImage src={product.image_url} alt={product.name} />
                            <p>Name: {product.name}</p>
                            <p>Price: {product.price}$</p>
                            <p>Quantity: {product.quantity}</p> {/* Đổi từ Stock sang Quantity */}
                        </div>
                    )
            })}
        </div >
    )
}