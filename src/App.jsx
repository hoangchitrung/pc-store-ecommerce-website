import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductCard } from "./components/ProductCard.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";
import { data } from "./data/data.jsx";
import { useState } from "react";
function App() {

    const [cart, setCart] = useState([]);

    function handleAddToCart(product) {

        const findData = data.find((item) => item.id === product.id)

        if (!findData) {
            alert("Product isnt exist");
        }

        if (data.stock === 0) {
            alert("Out of stock");
        }
        // set cart number on header
        setCart([...cart, data]);
        console.log("clicked");

    }

    return (
        <BrowserRouter>
            <Navbar />
            <div>
                <p>Cart Number: {cart.length}</p>
            </div>
            <Routes>
                {/* Static route */}
                <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />}></Route>
                <Route path="/products" element={<ProductPage />}></Route>
                <Route path="/carts" element={<CartPage />}></Route>

                {/* Dynamic route */}
                <Route path="products/:id" element={<ProductDetailsPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
