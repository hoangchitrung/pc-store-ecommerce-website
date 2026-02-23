import { Link } from "react-router-dom"

export function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/products">Product</Link>
            <Link to="/cart">Cart</Link>
        </nav>
    )
}