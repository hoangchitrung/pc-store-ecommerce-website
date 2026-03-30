import { Link } from "react-router-dom";
import { useState } from "react";

// Format number as Vietnamese đồng (VNĐ)
const formatVND = (value) => {
    const n = Number(value) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
};

export function CartPage({ cart = [], setCart }) {
    const safeCart = Array.isArray(cart) ? cart : [];

    // 1. Hàm tăng số lượng (+)
    const handleIncrease = (product) => {
        setCart(safeCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    // 2. Hàm giảm số lượng (-)
    const handleDecrease = (product) => {
        setCart(safeCart.map((item) =>
            // Chỉ giảm khi số lượng đang lớn hơn 1 (Không cho giảm xuống 0)
            item.id === product.id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ));
    };

    // 3. Hàm xóa hẳn sản phẩm khỏi giỏ (Thùng rác)
    const handleRemove = (product) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa ${product.name} khỏi giỏ hàng?`)) {
            // Lọc và giữ lại những item có id KHÁC với id của sản phẩm vừa bấm xóa
            setCart(safeCart.filter((item) => item.id !== product.id));
        }
    };

    // Tính tổng tiền của toàn bộ giỏ hàng
    const totalPrice = safeCart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

    // Giao diện khi giỏ hàng trống
    if (safeCart.length === 0) {
        return (
            <div className="container mt-5 mb-5 text-center py-5 bg-white shadow-sm rounded">
                <i className="fa-solid fa-cart-arrow-down text-muted mb-3" style={{ fontSize: "4rem" }}></i>
                <h3 className="mb-4 fw-bold">Giỏ hàng của bạn đang trống</h3>
                <p className="text-muted mb-4">Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ.</p>
                <Link to="/products" className="btn btn-primary px-4 py-2 fw-bold">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    // Giao diện chính của Giỏ hàng
    return (
        <div className="container mt-5 mb-5">
            <h2 className="fw-bold mb-4">Giỏ hàng của bạn</h2>
            <div className="row g-4">

                {/* Cột trái: Danh sách sản phẩm */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-0 table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="ps-4">Sản phẩm</th>
                                        <th scope="col" className="text-center">Đơn giá</th>
                                        <th scope="col" className="text-center">Số lượng</th>
                                        <th scope="col" className="text-center">Thành tiền</th>
                                        <th scope="col" className="text-center">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {safeCart.map((item) => (
                                        <tr key={item.id}>
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <ImageWithFallbackSmall src={item.image_url} alt={item.name} />
                                                    <span className="fw-semibold text-truncate" style={{ maxWidth: "250px" }} title={item.name}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-center text-muted fw-semibold">{formatVND(item.price)}</td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary px-2"
                                                        onClick={() => handleDecrease(item)}
                                                        disabled={item.quantity <= 1} // Mờ nút trừ nếu số lượng là 1
                                                    >
                                                        <i className="fa-solid fa-minus"></i>
                                                    </button>
                                                    <span className="mx-3 fw-bold fs-5">{item.quantity}</span>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary px-2"
                                                        onClick={() => handleIncrease(item)}
                                                    >
                                                        <i className="fa-solid fa-plus"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-center fw-bold text-danger">{formatVND(item.price * item.quantity)}</td>
                                            <td className="text-center">
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Khung thanh toán */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 bg-white">
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-4 border-bottom pb-3">Tổng cộng</h4>
                            <div className="d-flex justify-content-between mb-3 fs-5">
                                <span className="text-muted">Tạm tính:</span>
                                <span className="fw-bold">{formatVND(totalPrice)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4 fs-4">
                                <span className="fw-bold">Thành tiền:</span>
                                <span className="fw-bold text-danger">{formatVND(totalPrice)}</span>
                            </div>
                            <Link to="/checkout" className="btn btn-primary btn-lg w-100 fw-bold py-3 shadow-sm">
                                TIẾN HÀNH THANH TOÁN
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ImageWithFallbackSmall({ src, alt }) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className="d-flex align-items-center justify-content-center me-3 rounded bg-light border" style={{ width: 60, height: 60 }}>
                <i className="fa-solid fa-image text-secondary"></i>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            style={{ width: 60, height: 60, objectFit: 'contain' }}
            className="me-3 rounded bg-light border"
            onError={() => setError(true)}
        />
    );
}