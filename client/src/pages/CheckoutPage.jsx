import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function CheckoutPage({ cart }) {
    const navigate = useNavigate();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const formatVND = (value) => {
        const n = Number(value) || 0;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
    };

    // Form state: Nếu bạn đã có thông tin User từ Database khi đăng nhập, 
    // bạn có thể truyền vào làm giá trị mặc định ở đây (ví dụ: name: currentUser.name)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    // Bắt sự kiện người dùng gõ vào form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm gọi API PayOS khi bấm thanh toán
    const handlePayment = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        setIsLoading(true);

        try {
            // Gọi xuống API Backend mà chúng ta đã viết hôm qua
            const response = await axios.post("http://localhost:5000/api/payment/create-link", {
                cartItems: cart,
                totalAmount: total,
                userInfo: formData
            });

            if (response.data.success) {
                // Chuyển hướng người dùng sang trang quét mã QR của PayOS
                window.location.href = response.data.checkoutUrl;
            }
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            alert("Có lỗi xảy ra khi tạo link thanh toán. Vui lòng thử lại!");
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                {/* Cột Form điền thông tin */}
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body p-4">
                            <h3 className="card-title fw-bold mb-4">Thông tin giao hàng</h3>
                            <form onSubmit={handlePayment}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Họ và tên</label>
                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required placeholder="Nhập họ tên của bạn" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Số điện thoại</label>
                                    <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Nhập số điện thoại" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Địa chỉ nhận hàng</label>
                                    <textarea className="form-control" name="address" rows="3" value={formData.address} onChange={handleChange} required placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã, quận/huyện)"></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 py-3 fs-5 fw-bold rounded-3 shadow" disabled={isLoading}>
                                    {isLoading ? (
                                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Đang tạo mã QR...</>
                                    ) : (
                                        "Thanh toán bằng PayOS"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Cột hiển thị lại giỏ hàng tóm tắt */}
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-4">Đơn hàng của bạn</h4>
                            {cart.map((item) => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                                    <div className="d-flex align-items-center">
                                        <img src={item.image_url} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "contain" }} className="me-3 bg-light rounded" />
                                        <div>
                                            <h6 className="mb-0 text-truncate" style={{ maxWidth: "150px" }}>{item.name}</h6>
                                            <small className="text-muted">x {item.quantity}</small>
                                        </div>
                                    </div>
                                    <span className="fw-semibold">{formatVND(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <span className="fw-bold fs-5">Tổng cộng</span>
                                <span className="fw-bold fs-3 text-danger">{formatVND(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}