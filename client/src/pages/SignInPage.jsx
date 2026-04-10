import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";


export function SignInPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = await loginUser(form);

            if (!data || !data.user) {
                throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra email/password.");
            }

            localStorage.setItem("user", JSON.stringify(data.user));

            window.dispatchEvent(new Event("authChange"));

            setSuccess("Đăng nhập thành công.");
            setForm({ email: "", password: "" });

            // Phân quyền nếu có
            const role = (data.user.role || "").toLowerCase();
            if (role === "admin" || role === "staff") {
                navigate("/admin");
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
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h2 className="mb-4 text-center fw-bold">Sign In</h2>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input id="email" name="email" type="email" className="form-control form-control-lg" value={form.email} onChange={handleChange} required autoFocus />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input id="password" name="password" type="password" className="form-control form-control-lg" value={form.password} onChange={handleChange} required />
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