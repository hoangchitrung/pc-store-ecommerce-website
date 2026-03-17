import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import "./SignInPage.css";

export function SignInPage() {
    const navigate = useNavigate();
    // receive information from the input field
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    // connection state
    const [loading, setLoading] = useState(false);
    // display errors
    const [error, setError] = useState("");
    // display success
    const [success, setSuccess] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);

            // send only fields that backend expect
            const payload = {
                email: form.email,
                password: form.password
            };

            await loginUser(payload);
            setSuccess("Login success");
            setForm({ email: "", password: "" });

            navigate("/"); // redirect homepage
        } catch (error) {
            setError(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="sign-in-form" onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="input-form">
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
            </div>
            <div className="input-form">
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" value={form.password} onChange={onChange} required />
            </div>

            {error && <p style={{ color: "crimson" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <button className="sign-in-button" type="submit" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
        </form>
    );
}