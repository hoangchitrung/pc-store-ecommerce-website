import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"
import { getMe, logoutUser } from "../api/authApi";
import "./Navbar.css"

export function Navbar() {
    const navigate = useNavigate();
    const [isLogged, setIsLogged] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                await getMe();
                setIsLogged(true);
            } catch {
                setIsLogged(false);
            }
        };

        checkSession();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
        } finally {
            setIsLogged(false);
            setMenuOpen(false);
            navigate("/signin");
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    const handleCloseMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="navbar-wrapper">
            <div className="navbar-left">
                <Link to={"/"} className="brand-link" onClick={handleCloseMenu}>
                    <span className="brand-badge">T</span>
                    <span>TechForge</span>
                </Link>
            </div>

            <button
                type="button"
                className="menu-toggle"
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                <i className="fa-solid fa-bars"></i>
            </button>

            <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
                <NavLink to={"/"} onClick={handleCloseMenu}>Home</NavLink>
                <NavLink to={"/products"} onClick={handleCloseMenu}>Products</NavLink>
                <NavLink to={"/carts"} onClick={handleCloseMenu}>Cart</NavLink>
            </nav>

            <div className="navbar-center">
                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <input type="text" placeholder="Search products..." />
                    <button type="submit" aria-label="Search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>
            </div>

            <div className="navbar-right">
                {/* guest buttons (show when not logged in) */}
                <div className={`auth-guest ${isLogged ? "is-hidden" : ""}`}>
                    <Link to={"/signin"} className="btn btn-ghost" onClick={handleCloseMenu}>Sign In</Link>
                    <Link to={"/signup"} className="btn btn-primary" onClick={handleCloseMenu}>Sign Up</Link>
                </div>

                {/* user button (show when logged in ) */}
                <div className={`auth-user ${isLogged ? "" : "is-hidden"}`}>
                    <button type="button" className="icon-btn" aria-label="User menu">
                        <i className="fa-solid fa-user"></i>
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </header>
    )
}