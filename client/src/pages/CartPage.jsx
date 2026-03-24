import { useNavigate } from "react-router-dom";

export function CartPage({ cart = [] }) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cart.length === 0) return;
        // Chuyển hướng sang trang Checkout để gọi PayOS
        navigate("/checkout");
    };

    return (
        <div className="container mt-4 mb-5">
            <h2 className="mb-4 fw-bold">Giỏ hàng của bạn</h2>
            
            {cart.length === 0 ? (
                <div className="alert alert-info shadow-sm fs-5 text-center py-5 bg-white border-0">
                    Giỏ hàng của bạn đang trống. Hãy quay lại trang sản phẩm để mua sắm nhé!
                </div>
            ) : (
                <div className="row g-4">
                    {/* Cột hiển thị danh sách sản phẩm */}
                    <div className="col-lg-8">
                        {cart.map((product) => (
                            <div key={product.id} className="card mb-3 shadow-sm border-0">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="img-thumbnail border-0 me-3 bg-light"
                                            style={{ width: "90px", height: "90px", objectFit: "contain" }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/90?text=No+Image";
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-1 fw-semibold">{product.name}</h5>
                                            <p className="card-text text-danger fw-bold fs-5 mb-0">{product.price}$</p>
                                        </div>
                                        <div className="d-flex align-items-center bg-light px-3 py-2 rounded border">
                                            <span className="fw-bold text-secondary">
                                                Số lượng: {product.quantity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cột tính tổng tiền */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
                            <div className="card-body p-4">
                                <h4 className="card-title fw-bold mb-3">Tóm tắt đơn hàng</h4>
                                <div className="d-flex justify-content-between mb-2 text-muted">
                                    <span>Tạm tính ({cart.reduce((a,c) => a + c.quantity, 0)} sản phẩm)</span>
                                    <span>{total}$</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="fw-bold fs-5">Tổng cộng</span>
                                    <span className="fw-bold fs-3 text-danger">{total}$</span>
                                </div>
                                <button onClick={handleCheckout} className="btn btn-danger w-100 py-2 fs-5 fw-bold shadow">
                                    Tiến hành thanh toán
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}