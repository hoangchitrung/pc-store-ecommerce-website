import logo from "../assets/logo.png";

export function Navbar() {
    return (
        <nav className="d-flex flex-column navbar navbar-expand-lg navbar-light border">
            <div className="container-fluid justify-content-around">
                <span className="navbar-brand">
                    <img src={logo} alt="logo" width={"130px"}></img>
                </span>
                <div className="input-group w-50">
                    <input type="text" className="form-control border-primary border-3" placeholder="What are you looking for?..." />
                    <span className="input-group-text bg-primary text-white justify-content-center border-3 border-primary" style={{ cursor: "pointer" }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
                <div className="d-flex gap-3" >
                    <div className="d-flex flex-column align-items-center gap-3">
                        <i class="fa-solid fa-computer fa-lg"></i>
                        <a href="#" className="text-decoration-none text-muted fw-bold">Build PC</a>
                    </div>
                    <div className="d-flex flex-column align-items-center gap-3">
                        <i class="fa-solid fa-cart-arrow-down fa-lg"></i>
                        <a href="#" className="text-decoration-none text-muted fw-bold">Cart</a>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="bg-primary text-white rounded border-0 p-2 fw-bold" >Sign Up</button>
                    <button className="bg-primary text-white rounded border-0 p-2 fw-bold">Sign In</button>
                </div>
            </div>

            <div className="d-flex gap-3">
                <a href="#">All Categories</a>
                <a href="#">CPU</a>
                <a href="#">GPU</a>
                <a href="#">RAM</a>
            </div>
        </nav>
    )
}