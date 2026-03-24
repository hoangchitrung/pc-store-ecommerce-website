import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { CartPage } from "./pages/CartPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/Product/ProductPage.jsx";
import { ProductDetailsPage } from "./pages/Product/ProductDetailsPage.jsx";

import { AdminPage } from "./pages/Admin/AdminPage.jsx";
import { AdminOrderPage } from "./pages/Admin/AdminOrder.jsx";
import { AdminProductManagement } from "./pages/Admin/AdminProductManagement.jsx";
import { AdminInventory } from "./pages/Admin/AdminInventory.jsx";
import AdminCustomerManagementPage from "./pages/Admin/AdminCustomerManagement.jsx";

import { SignUpPage } from "./pages/SignUpPage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AppContent() {
  const { pathname } = useLocation();
  const hideNavbar = pathname.startsWith("/admin") || pathname === "/signin" || pathname === "/signup";

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/carts" element={<CartPage />} />

        {/* Auth */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/orders" element={<AdminOrderPage />} />
        <Route path="/admin/product" element={<AdminProductManagement />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/customers" element={<AdminCustomerManagementPage />} />

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