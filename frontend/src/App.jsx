import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductCard } from "./components/ProductCard.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";
import { useState } from "react";
import { useEffect } from "react";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Static route */}
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/products" element={<ProductPage />}></Route>
                <Route path="/carts" element={<CartPage />}></Route>

                {/* Dynamic route */}
                <Route path="products/:id" element={<ProductDetailsPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
