import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { CartPage } from "./pages/CartPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { BuildPCPage } from "./pages/BuildPCPage.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { AdminOrderPage } from "./pages/AdminOrder.jsx";
import { AdminProductManagement } from "./pages/AdminProductManagement.jsx";
import { AdminInventory } from "./pages/AdminInventory.jsx";
import AdminCustomerManagementPage from "./pages/AdminCustomerManagement.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { ChatBubble } from "./components/ChatBubble.jsx";

function AppContent({ cart, setCart }) {
    const { pathname } = useLocation();

    const hideNavbar = pathname === "/signup" || pathname === "/signin" || pathname === "/admin";
    return (
        <>
            {!hideNavbar && <Navbar />}
            {!hideNavbar && <ChatBubble />}
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/products" element={<ProductPage />}></Route>
                <Route path="/carts" element={<CartPage cart={cart} setCart={setCart} />}></Route>

                <Route path="/signup" element={<SignUpPage />}></Route>
                <Route path="/signin" element={<SignInPage />}></Route>

                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>}></Route>
                <Route path="/admin/orders" element={<ProtectedRoute adminOnly={true}><AdminOrderPage /></ProtectedRoute>}></Route>
                <Route path="/admin/product" element={<ProtectedRoute adminOnly={true}><AdminProductManagement /></ProtectedRoute>}></Route>
                <Route path="/admin/products" element={<ProtectedRoute adminOnly={true}><AdminProductManagement /></ProtectedRoute>}></Route>
                <Route path="/admin/inventory" element={<ProtectedRoute adminOnly={true}><AdminInventory /></ProtectedRoute>}></Route>
                <Route path="/admin/customers" element={<ProtectedRoute adminOnly={true}><AdminCustomerManagementPage /></ProtectedRoute>}></Route>
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}></Route>

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
