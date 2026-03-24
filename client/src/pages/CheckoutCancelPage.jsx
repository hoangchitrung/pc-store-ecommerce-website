import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export function CheckoutCancelPage() {
    // Lấy mã đơn hàng từ trên thanh URL (do PayOS gắn vào)
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");

    useEffect(() => {
        if (orderCode) {
            axios.put(`http://localhost:5000/api/payment/cancel/${orderCode}`)
                .then(res => console.log("✅ Đã báo Backend hủy đơn thành công!"))
                .catch(err => console.error("❌ Lỗi khi báo hủy đơn:", err));
        }
    }, [orderCode]);

    return (
        <div className="container text-center mt-5 mb-5 p-5 bg-white shadow-sm rounded">
            <div className="text-danger mb-4">
                <i className="fa-solid fa-circle-xmark" style={{ fontSize: "5rem" }}></i>
            </div>
            <h2 className="fw-bold text-danger mb-3">Thanh toán thất bại hoặc đã bị hủy!</h2>
            {orderCode && (
                <p className="fs-5 text-muted mb-4">
                    Đơn hàng <strong className="text-dark">#{orderCode}</strong> của bạn chưa được thanh toán và đã chuyển sang trạng thái Hủy.
                </p>
            )}
            <Link to="/carts" className="btn btn-outline-danger px-4 py-2 me-3 fw-bold">
                <i className="fa-solid fa-cart-shopping me-2"></i> Quay lại giỏ hàng
            </Link>
            <Link to="/" className="btn btn-primary px-4 py-2 fw-bold">
                Về trang chủ
            </Link>
        </div>
    );
}