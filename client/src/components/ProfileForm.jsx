import { useEffect, useState } from "react";

function ProfileForm() {
    const [user, setUser] = useState({
        fullname: "",
        email: "",
        phone: "",
        bio: ""
    });

    // GET user
    useEffect(() => {
        fetch("http://localhost:5000/api/users/1")
            .then(res => res.json())
            .then(data => setUser(data));
    }, []);

    // handle change
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    // UPDATE user
    const handleSubmit = () => {
        fetch("http://localhost:5000/api/users/1", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(() => console.log("Cập nhật thông tin thành công."));
    };

    return (
        <div className="profile-form">
            <h2>Personal Information</h2>

            <input
                name="fullname"
                value={user.fullname}
                onChange={handleChange}
                placeholder="Full Name"
            />

            <input
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
            />

            <input
                name="phone"
                value={user.phone}
                onChange={handleChange}
                placeholder="Phone"
            />

            <textarea
                name="bio"
                value={user.bio}
                onChange={handleChange}
                placeholder="Bio"
            />

            <button onClick={handleSubmit}>Save Changes</button>
        </div>
    );
}

export default ProfileForm;