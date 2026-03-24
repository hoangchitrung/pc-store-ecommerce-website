import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { CartPage } from "./pages/CartPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";
import { CheckoutPage } from "./pages/CheckoutPage.jsx";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage.jsx";
import { CheckoutCancelPage } from "./pages/CheckoutCancelPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";

function AppContent() {
    const { pathname } = useLocation();

    // Logic Giỏ hàng
    const [cart, setCart] = useState([]);

    const onAdd = (product) => {
        const exist = cart.find((x) => x.id === product.id);
        if (exist) {
            setCart(
                cart.map((x) =>
                    x.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : x
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    // Ẩn thanh Navbar ở các trang đăng nhập/đăng ký
    const hideNavbar = pathname === "/signup" || pathname === "/signin";
    
    // Tính tổng số lượng item để hiển thị lên icon giỏ hàng
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="bg-light min-vh-100"> {/* Thêm background sáng cho toàn app */}
            {!hideNavbar && <Navbar cartCount={totalItems} />}
            
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductPage onAdd={onAdd} />} />
                <Route path="/carts" element={<CartPage cart={cart} />} />
                <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
                <Route path="/checkout-success" element={<CheckoutSuccessPage setCart={setCart} />} />
                <Route path="/checkout-cancel" element={<CheckoutCancelPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage onAdd={onAdd} />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}