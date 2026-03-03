import "./App.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { ProductCard } from "./components/ProductCard.jsx";
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

    const hideNavbar = pathname === "/signup" || pathname === "/signin";
    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                {/* Static route */}
                {/* User, Admin */}
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/products" element={<ProductPage />}></Route>
                <Route path="/carts" element={<CartPage />}></Route>

                {/* Auth routes */}
                <Route path="/signup" element={<SignUpPage />}></Route>
                <Route path="/signin" element={<SignInPage />}></Route>

                {/* Admin */}
                <Route path="/admin" element={<AdminPage />}></Route>

                {/* Dynamic route */}
                <Route path="products/:id" element={<ProductDetailsPage />}></Route>
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
