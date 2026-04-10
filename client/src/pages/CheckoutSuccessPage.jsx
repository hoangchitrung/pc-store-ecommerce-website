import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function CheckoutSuccessPage({ setCart }) {
    // Lấy các tham số mà PayOS truyền về trên thanh URL
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");

    useEffect(() => {
        setCart([]);
    }, [setCart]);

    return (
        <div className="container mt-5 mb-5 text-center">
            <div className="card shadow-sm border-0 py-5 mx-auto" style={{ maxWidth: "600px" }}>
                <div className="card-body">
                    {/* Icon checkmark thành công */}
                    <i className="fa-solid fa-circle-check text-success mb-3" style={{ fontSize: "80px" }}></i>

                    <h2 className="fw-bold mt-2">Thanh toán thành công!</h2>
                    <p className="text-muted fs-5 mt-3">Cảm ơn bạn đã tin tưởng và mua sắm tại PC STORE.</p>

                    {orderCode && (
                        <div className="alert alert-success d-inline-block mt-2">
                            Mã đơn hàng của bạn: <strong>#{orderCode}</strong>
                        </div>
                    )}

                    <div className="mt-4 pt-2">
                        <Link to="/products" className="btn btn-primary px-4 py-2 me-3 rounded-pill shadow-sm fw-semibold">
                            Tiếp tục mua sắm
                        </Link>
                        <Link to="/" className="btn btn-outline-secondary px-4 py-2 rounded-pill shadow-sm fw-semibold">
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}