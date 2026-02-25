import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductCard } from "./components/ProductCard.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";
import { useState } from "react";

function App() {
    const [cart, setCart] = useState([]);

    function handleAddToCart(product) {
        if (product.stock === 0) {
            alert(`Out of stock`);
            return;
        }
        product.stock -= 1;
        setCart([...cart, product]);
    }

    return (
        <BrowserRouter>
            <Navbar />
            <p>Cart: {cart.length}</p>
            <Routes>
                {/* Static route */}
                <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />}></Route>
                <Route path="/products" element={<ProductPage />}></Route>
                <Route path="/carts" element={<CartPage onCart={cart} />}></Route>

                {/* Dynamic route */}
                <Route path="products/:id" element={<ProductDetailsPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
