import { Link } from "react-router-dom";

export function HomePage() {
    return (
        <div className="container mt-5">
            <div className="p-5 text-center bg-white rounded-4 shadow-sm border">
                <h1 className="display-4 fw-bold mb-3 text-dark">Chào mừng đến với PC STORE</h1>
                <p className="lead text-muted mb-4">
                    Nơi cung cấp các linh kiện và máy tính chất lượng nhất với giá cả phải chăng.
                </p>
                <Link to="/products" className="btn btn-primary btn-lg px-5 rounded-pill shadow">
                    Khám phá sản phẩm ngay
                </Link>
            </div>
        </div>
    );
}