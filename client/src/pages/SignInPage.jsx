import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

export function SignInPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await loginUser(form);

            console.log("LOGIN RESPONSE:", res);

            // 🔥 FIX: handle mọi kiểu response
            const user =
                res?.user ||
                res?.data?.user ||
                res?.data ||
                res;

            if (!user) {
                throw new Error("Không lấy được thông tin user");
            }

            console.log("USER:", user);

            // 🔥 FIX: đảm bảo role luôn có
            const role = user?.role?.toLowerCase();

            if (!role) {
                console.error("FULL RESPONSE:", res);
                throw new Error("User don't have a role");
            }

            // 🔥 Lưu user vào localStorage
            localStorage.setItem("user", JSON.stringify(user));

            // 🔥 Phân quyền
            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f8f8f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Segoe UI', sans-serif",
            padding: 24
        }}>
            <div style={{ width: "100%", maxWidth: 420 }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{
                        width: 44,
                        height: 44,
                        background: "#2563EB",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px"
                    }}>
                        <span style={{ color: "white", fontWeight: 800, fontSize: 18 }}>T</span>
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                        Welcome back
                    </h1>
                    <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                        Sign in to your TechForge account
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: "white",
                    border: "1px solid #ebebeb",
                    borderRadius: 14,
                    padding: "28px 28px 24px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
                }}>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: "#fee2e2",
                            border: "1px solid #fecaca",
                            borderRadius: 8,
                            padding: "10px 14px",
                            marginBottom: 16,
                            fontSize: 13,
                            color: "#b91c1c",
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}>
                            <i className="bi bi-exclamation-circle" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{
                                display: "block",
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#444",
                                marginBottom: 6
                            }}>
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    border: "1px solid #e5e5e3",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    outline: "none",
                                    background: "#fafaf8",
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 6
                            }}>
                                <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
                                    Password
                                </label>
                                <a href="#" style={{
                                    fontSize: 12,
                                    color: "#2563EB",
                                    textDecoration: "none"
                                }}>
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    border: "1px solid #e5e5e3",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    outline: "none",
                                    background: "#fafaf8",
                                }}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "10px",
                                background: loading ? "#93c5fd" : "#2563EB",
                                border: "none",
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 600,
                                color: "white",
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div style={{
                        textAlign: "center",
                        marginTop: 16,
                        fontSize: 13,
                        color: "#888"
                    }}>
                        Don't have an account?{" "}
                        <Link to="/signup" style={{
                            color: "#2563EB",
                            fontWeight: 500,
                            textDecoration: "none"
                        }}>
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}