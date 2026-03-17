import { Link } from "react-router-dom";

export function Navbar({ cartCount }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4 sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-4 text-primary" to="/">💻 PC STORE</Link>
                <div className="d-flex align-items-center">
                    <Link className="nav-link text-white me-4 fw-semibold" to="/products">Sản phẩm</Link>
                    <Link className="nav-link text-white position-relative" to="/carts">
                        <i className="fa-solid fa-cart-shopping fs-5"></i> Giỏ hàng
                        {cartCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}