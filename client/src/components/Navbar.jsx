import logo from "../assets/logo.png";

export function Navbar() {
    return (
        <nav className="d-flex flex-column navbar navbar-expand-lg navbar-light border-bottom shadow-sm p-0 bg-white">
            <div className="container-fluid d-flex align-items-center justify-content-between py-2">
                <span className="navbar-brand d-flex align-items-center gap-2">
                    <img src={logo} alt="logo" width="54" height="54" style={{ objectFit: "contain" }} />
                    <span className="fw-bold fs-4 text-primary">TECHFORGE</span>
                </span>
                <div className="input-group w-50 mx-4">
                    <input type="text" className="form-control border-primary border-3 shadow-none" placeholder="What are you looking for?..." />
                    <span className="input-group-text bg-primary text-white" style={{ cursor: "pointer" }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
                <div className="d-flex gap-4 mx-3">
                    <a href="#" className="text-decoration-none text-muted fw-semibold d-flex flex-column align-items-center">
                        <i className="fa-solid fa-computer fa-xl mb-1"></i>
                        <span className="small">Build PC</span>
                    </a>
                    <a href="#" className="text-decoration-none text-muted fw-semibold d-flex flex-column align-items-center">
                        <i className="fa-solid fa-cart-arrow-down fa-xl mb-1"></i>
                        <span className="small">Cart</span>
                    </a>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm">Sign Up</button>
                    <button className="btn btn-outline-primary fw-bold px-4 rounded-pill">Sign In</button>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-4 py-2 mt-2 mb-3 mx-2">
                <a href="#" className="text-decoration-none text-primary fw-semibold px-2">All Categories</a>
                <span className="text-muted">|</span>
                <a href="#" className="text-decoration-none text-dark px-2">CPU</a>
                <span className="text-muted">|</span>
                <a href="#" className="text-decoration-none text-dark px-2">GPU</a>
                <span className="text-muted">|</span>
                <a href="#" className="text-decoration-none text-dark px-2">RAM</a>
                <span className="text-muted">|</span>
                <a href="#" className="text-decoration-none text-dark px-2">Mainboard</a>
                <span className="text-muted">|</span>
                <a href="#" className="text-decoration-none text-dark px-2">SSD/HDD</a>
                <span className="text-muted">|</span>
                <a href="#" className="text-decoration-none text-dark px-2">Monitors</a>
                <span className="text-muted">|</span>
                <a href="#" className="text-decoration-none text-dark px-2">Cases</a>
                <span className="text-muted">|</span>
                <a href="#" className="text-decoration-none text-dark px-2">Cooling</a>
                {/* Add more categories as needed */}
            </div>
        </nav>
    )
}