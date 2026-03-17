import "./App.css";
import { useState } from "react"; // Đã thêm useState
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { CartPage } from "./pages/CartPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";

function AppContent() {
    const { pathname } = useLocation();

    // 1. Khai báo state và hàm onAdd ở đây
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

    const hideNavbar = pathname === "/signup" || pathname === "/signin";
    
    return (
        <>
            {/* 2. Truyền cartCount cho Navbar */}
            {!hideNavbar && <Navbar cartCount={cart.length} />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                
                {/* 3. Truyền onAdd xuống trang Sản phẩm */}
                <Route path="/products" element={<ProductPage onAdd={onAdd} />} />
                
                {/* 4. Truyền cart và setCart xuống trang Giỏ hàng */}
                <Route path="/carts" element={<CartPage cart={cart} setCart={setCart} />} />

                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/admin" element={<AdminPage />} />

                {/* 5. Truyền onAdd xuống trang Chi tiết */}
                <Route path="products/:id" element={<ProductDetailsPage onAdd={onAdd} />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;