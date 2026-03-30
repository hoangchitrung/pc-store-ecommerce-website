import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { CartPage } from "./pages/CartPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { BuildPCPage } from "./pages/BuildPCPage.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";
import { Navbar } from "./components/Navbar.jsx";

function AppContent({ cart, setCart }) {
    const { pathname } = useLocation();

    const hideNavbar = pathname === "/signup" || pathname === "/signin";
    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/products" element={<ProductPage />}></Route>
                <Route path="/carts" element={<CartPage cart={cart} setCart={setCart} />}></Route>

                <Route path="/signup" element={<SignUpPage />}></Route>
                <Route path="/signin" element={<SignInPage />}></Route>

                <Route path="/admin" element={<AdminPage />}></Route>

                <Route path="/build" element={<BuildPCPage cart={cart} setCart={setCart} />}></Route>

                <Route path="/products/:id" element={<ProductDetailsPage />}></Route>
            </Routes>
        </>
    );
}

function App() {
    const [cart, setCart] = useState([]);

    return (
        <BrowserRouter>
            <AppContent cart={cart} setCart={setCart} />
        </BrowserRouter>
    );
}

export default App;
