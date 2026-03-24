import { Link, useSearchParams } from "react-router-dom";

export function CheckoutCancelPage() {
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");

    return (
        <div className="container mt-5 mb-5 text-center">
            <div className="card shadow-sm border-0 py-5 mx-auto" style={{ maxWidth: "600px" }}>
                <div className="card-body">
                    {/* Icon dấu X thất bại */}
                    <i className="fa-solid fa-circle-xmark text-danger mb-3" style={{ fontSize: "80px" }}></i>
                    
                    <h2 className="fw-bold mt-2">Đã hủy thanh toán</h2>
                    <p className="text-muted fs-5 mt-3">Đơn hàng của bạn chưa được thanh toán và vẫn còn trong giỏ.</p>
                    
                    {orderCode && <p className="text-secondary">Mã đơn hàng bị hủy: #{orderCode}</p>}
                    
                    <div className="mt-4 pt-2">
                        <Link to="/carts" className="btn btn-danger px-4 py-2 me-3 rounded-pill shadow-sm fw-semibold">
                            Quay lại Giỏ hàng
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