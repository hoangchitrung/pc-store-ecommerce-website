import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, getMe } from "../api/authApi";


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

            const data = await loginUser(payload);

            // If backend returned user/token directly, persist them
            if (data) {
                if (data.token) localStorage.setItem('token', data.token);
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
            }

            // If backend didn't return user info, try fetching /me
            if (!localStorage.getItem('user')) {
                try {
                    const me = await getMe();
                    if (me) localStorage.setItem('user', JSON.stringify(me));
                } catch (e) {
                    // ignore — UI will fallback
                }
            }

            // notify other components (Navbar) that auth state changed
            window.dispatchEvent(new Event('authChange'));

            setSuccess("Login success");
            setForm({ email: "", password: "" });

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
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: '100%' }}>
                <form onSubmit={onSubmit} autoComplete="off">
                    <h2 className="mb-4 text-center fw-bold">Sign In</h2>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input id="email" name="email" type="email" className="form-control form-control-lg" value={form.email} onChange={onChange} required autoFocus />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input id="password" name="password" type="password" className="form-control form-control-lg" value={form.password} onChange={onChange} required />
                    </div>

                    {error && <div className="alert alert-danger py-2 small mb-2">{error}</div>}
                    {success && <div className="alert alert-success py-2 small mb-2">{success}</div>}

                    <button className="btn btn-primary w-100 py-2 fw-bold rounded-pill shadow-sm mb-2" type="submit" disabled={loading} style={{ fontSize: '1.1rem' }}>
                        {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                    <div className="text-center mt-2">
                        <span className="text-muted small">Don't have an account? </span>
                        <Link to="/signup" className="fw-semibold text-decoration-none">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}