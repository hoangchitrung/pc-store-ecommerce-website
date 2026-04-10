import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, adminOnly = false }) {
    const rawUser = localStorage.getItem("user");

    // ❌ chưa login
    if (!rawUser) {
        return <Navigate to="/signin" />;
    }

    let user;

    try {
        user = JSON.parse(rawUser);
    } catch {
        // dữ liệu lỗi → clear luôn
        localStorage.removeItem("user");
        return <Navigate to="/signin" />;
    }

    const role = user?.role?.toLowerCase();


    if (!role) {
        localStorage.removeItem("user");
        return <Navigate to="/signin" />;
    }


    if (adminOnly && role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
}