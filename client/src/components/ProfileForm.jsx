import { useEffect, useState } from "react";
import { getMe } from "../api/authApi";

function ProfileForm() {
    const initialUser = (() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    fullname: parsed.fullname || parsed.name || "",
                    email: parsed.email || "",
                    phone: parsed.phone || "",
                    bio: parsed.bio || ""
                };
            }
        } catch (err) {
            console.warn("Invalid localStorage user", err);
        }
        return {
            fullname: "",
            email: "",
            phone: "",
            bio: ""
        };
    })();

    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Load profile data from API after sign in
    useEffect(() => {
        getMe()
            .then((data) => {
                if (data) {
                    setUser((prev) => ({
                        ...prev,
                        fullname: data.fullname || data.name || prev.fullname,
                        email: data.email || prev.email,
                        phone: data.phone || prev.phone,
                        bio: data.bio || prev.bio
                    }));
                }
            })
            .catch((err) => {
                console.warn("Unable to fetch /auth/me", err);
                setError("Không thể tải thông tin người dùng");
            })
            .finally(() => setLoading(false));
    }, []);

    // handle change
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    // UPDATE user (localStorage + optional API writeback)
    const handleSubmit = () => {
        setMessage("");
        setError("");

        // Update local cache
        const newUser = {
            ...user,
            name: user.fullname,
            email: user.email,
        };
        localStorage.setItem("user", JSON.stringify(newUser));

        setMessage("Cập nhật thông tin thành công.");

        // Optional: nếu API update user tồn tại bạn có thể gọi ở đây.
        // fetch(`http://localhost:5000/api/users/${newUser.id || ""}`, ...)...
    };

    if (loading) {
        return (
            <div className="card h-100">
                <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: 220 }}>
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card h-100">
            <div className="card-body">
                <h4 className="card-title mb-4">Personal Information</h4>

                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        className="form-control"
                        name="fullname"
                        value={user.fullname}
                        onChange={handleChange}
                        placeholder="Full Name"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        className="form-control"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        className="form-control"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                        className="form-control"
                        name="bio"
                        value={user.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        rows={4}
                    />
                </div>

                <button className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>
            </div>
        </div>
    );
}

export default ProfileForm;