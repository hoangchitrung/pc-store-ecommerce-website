
import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";

export function SignUpPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);

            await registerUser(form);

            setSuccess("Register successful!");
            setForm({ fullName: "", email: "", password: "" });

            setTimeout(() => navigate("/signin"), 1000);
        } catch (err) {
            setError(err.message || "Register failed");
        } finally {
            setLoading(false);
        }
    };

    return (
<<<<<<< HEAD
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: '100%' }}>
                <form className="" onSubmit={onSubmit} autoComplete="off">
                    <h2 className="mb-4 text-center fw-bold">Sign Up</h2>

                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Full Name</label>
                        <input id="fullName" name="fullName" type="text" className="form-control form-control-lg" value={form.fullName} onChange={onChange} required autoFocus />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input id="email" name="email" type="email" className="form-control form-control-lg" value={form.email} onChange={onChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input id="password" name="password" type="password" className="form-control form-control-lg" value={form.password} onChange={onChange} required />
                    </div>

                    {error && <div className="alert alert-danger py-2 small mb-2">{error}</div>}
                    {success && <div className="alert alert-success py-2 small mb-2">{success}</div>}

                    <button className="btn btn-primary w-100 py-2 fw-bold rounded-pill shadow-sm mb-2" type="submit" disabled={loading} style={{ fontSize: '1.1rem' }}>
                        {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                    <div className="text-center mt-2">
                        <span className="text-muted small">Already have an account? </span>
                        <Link to="/signin" className="fw-semibold text-decoration-none">Sign In</Link>
                    </div>
                </form>
=======
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-3">Create Account</h3>

                <form onSubmit={onSubmit}>
                    {/* Full Name */}
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="fullName"
                            value={form.fullName}
                            onChange={onChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    {/* Error / Success */}
                    {error && (
                        <div className="alert alert-danger p-2">{error}</div>
                    )}
                    {success && (
                        <div className="alert alert-success p-2">{success}</div>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-3 mb-0">
                    Already have an account?{" "}
                    <Link to="/signin">Sign In</Link>
                </p>
>>>>>>> origin/Hao
            </div>
        </div>
    );
}