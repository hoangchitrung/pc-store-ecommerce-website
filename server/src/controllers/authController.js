const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const id = await userService.addUser(fullName, email, password);

        const token = jwt.sign({ sub: id, email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        });

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message: "Register successful",
            user: { id, fullName, email, role: "user" },
        });
    } catch (error) {
        res.status(500).json({ message: `Database error: ${error.message}` });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and Password are required for login" });
        }

        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 🔥 FIX ROLE
        const role = user.user_type || user.role;

        const token = jwt.sign(
            { sub: user.id, email: user.email, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                fullName: user.fullname || user.full_name || null,
                email: user.email,
                role: role ? role.toLowerCase() : null, // 🔥 FIX
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.sub);
        return res.status(200).json({
            user: {
                id: req.user.sub,
                email: req.user.email || null,
                fullName: user?.fullname || user?.full_name || null,
                role: (user?.user_type || user?.role || "user").toLowerCase(), // 🔥 FIX
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};