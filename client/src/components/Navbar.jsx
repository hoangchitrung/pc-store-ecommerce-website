import logo from "../assets/logo.png";

export function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light border">
            <div className="container-fluid justify-content-between">
                <span className="navbar-brand">
                    <img src={logo} alt="logo" width={"130px"}></img>
                </span>
                <div className="input-group w-50">
                    <input type="text" className="form-control border-primary border-3 rounded-start" placeholder="What are you looking for?..." />
                    <span className="input-group-text bg-primary text-white p-2 justify-content-center rounded-end" style={{ cursor: "pointer" }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
                <div className="d-flex gap-2">
                    <a href="#">Build PC</a>
                    <a href="#">Cart</a>
                </div>
                <div className="d-flex gap-1">
                    <button>Sign Up</button>
                    <button>Sign In</button>
                </div>
            </div>
        </nav>
    )
}