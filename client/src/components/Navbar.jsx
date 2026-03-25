import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function AuthButtons() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const readUser = () => {
            const raw = localStorage.getItem('user');
            if (raw) {
                try {
                    setUser(JSON.parse(raw));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        // initial read
        readUser();

        // listen for custom authChange events so components can react immediately
        window.addEventListener('authChange', readUser);
        return () => window.removeEventListener('authChange', readUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        // notify other components
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
    };

    if (user) {
        return (
            <div className="d-flex gap-2 align-items-center">
                <Link to="/profile" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
                    <i className="fa-solid fa-user fa-lg"></i>
                    <span className="fw-semibold">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm">Logout</button>
            </div>
        );
    }

    return (
        <div className="d-flex gap-2">
            <Link to="/signin" className="btn btn-outline-primary btn-sm">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
        </div>
    );
}

export function Navbar() {
    return (
        <nav className="d-flex flex-column navbar navbar-expand-lg navbar-light p-0 bg-white">
            <div className="container-fluid d-flex align-items-center justify-content-between py-2 border border-top-0 border-1">
                <span className="navbar-brand d-flex align-items-center gap-2">
                    <a href="/" className="text-decoration-none">
                        <img src={logo} alt="logo" width="54" height="54" style={{ objectFit: "contain" }} />
                        <span className="fw-bold fs-4 text-primary">TechForge</span>
                    </a>
                </span>
                <div className="input-group w-50 mx-4">
                    <input type="text" className="form-control border-primary border-3" placeholder="What are you looking for?..." />
                    <span className="input-group-text bg-primary border-primary text-white" style={{ cursor: "pointer" }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>

                <div className="d-flex gap-4 mx-3">
                    <a href="#" className="gap-2 text-decoration-none text-muted fw-semibold d-flex flex-column align-items-center">
                        <i className="fa-solid fa-computer fa-xl mb-1"></i>
                        <span className="large">Build PC</span>
                    </a>
                    <Link to="/carts" className="gap-2 text-decoration-none text-muted fw-semibold d-flex flex-column align-items-center">
                        <i className="fa-solid fa-cart-arrow-down fa-xl mb-1"></i>
                        <span className="large">Cart</span>
                    </Link>
                </div>

                <AuthButtons />
            </div>

            <div className="border border-top-0 w-100 shadow-sm">
                <div className="d-flex justify-content-center align-items-center gap-3 py-2 mt-2 mb-3">
                    <div className="dropdown">
                        <button className="btn dropdown-toggle text-decoration-none border-0 text-primary fw-semibold px-2" type="button" id="categoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">All Categories</button>
                        <span className="text-muted">|</span>

                        <ul className="dropdown-menu align-item-center" aria-labelledby="categoryDropdown">
                            <li>
                                <a href="#" className="dropdown-item">
                                    <span className="fw-semibold">
                                        CPU
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="dropdown-item">
                                    <span className="fw-semibold">
                                        GPU
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="dropdown-item">
                                    <span className="fw-semibold">
                                        RAM
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="dropdown-item">
                                    <span className="fw-semibold">
                                        Mainboard
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="dropdown-item">
                                    <span className="fw-semibold">
                                        SSD/HDD
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="dropdown-item">
                                    <span className="fw-semibold">
                                        Monitors
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="dropdown-item">
                                    <span className="fw-semibold">
                                        Cases
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="dropdown-item">
                                    <span className="fw-semibold">
                                        Cooling
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>

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
                </div>
            </div>
        </nav>
    )
}