import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import "./SignUpPage.css";

export function SignUpPage() {
    const navigate = useNavigate();
    // receive information from the input field
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    // connection state
    const [loading, setLoading] = useState(false);
    // display errors
    const [error, setError] = useState("");
    // display success notifications
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

            // send only fields that backend expect
            const payload = {
                fullName: form.fullName,
                email: form.email,
                password: form.password,
            };

            await registerUser(payload);
            setSuccess("Register successful");
            setForm({ fullName: "", email: "", password: "" });
            navigate("/"); // redirect to homepage
        } catch (error) {
            setError(error.message || "Register successful");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="sign-up-form" onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="input-field">
                <label htmlFor="fullname">Full Name:</label>
                <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={onChange} required />
            </div>

            <div className="input-field">
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
            </div>

            <div className="input-field">
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" value={form.password} onChange={onChange} required />
            </div>

            {error && <p style={{ color: "crimson" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <button className="sign-up-button" type="submit" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
            <p className="sign-in-hint">
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </form>
    );
}
