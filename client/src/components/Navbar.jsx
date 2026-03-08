import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { getMe, logoutUser } from "../api/authApi";
import "./Navbar.css"

export function Navbar() {
    const navigate = useNavigate();
    const [isLogged, setIsLogged] = useState(false);

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
            navigate("/signin");
        }
    };

    return (
        <header className="navbar-wrapper">
            <div className="navbar-left">
                <Link to={"/"}>TechForge</Link>
            </div>
            <nav className="nav-links">
                <Link to={"/"}>Home</Link>
                <Link to={"/products"}>Product</Link>
                <Link to={"/carts"}>Cart</Link>
            </nav>

            <div className="navbar-center">
                <form className="search-form">
                    <input type="text" placeholder="Search products..." /> <button type="submit">Search</button>
                </form>
            </div>

            <div className="navbar-right">
                {/* guest buttons (show when not logged in) */}
                <div className={`auth-guest ${isLogged ? "is-hidden" : ""}`}>
                    <Link to={"/signin"}>Sign In</Link>
                    <Link to={"/signup"}>Sign Up</Link>
                </div>

                {/* user button (show when logged in ) */}
                <div className={`auth-user ${isLogged ? "" : "is-hidden"}`}>
                    <button type="button" aria-label="User menu">
                        <i className="fa-solid fa-user"></i>
                    </button>
                    <button type="button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </header>
    )
}