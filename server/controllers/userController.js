const bcrypt = require("bcryptjs");

// services
const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

// controlelr for get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.json(users);
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Database Error: ${error.message}` });
    }
};

// controller for get specific user
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "This user is not exist" });
        }
        return res.json(user);
    } catch (error) {
        return res.json(500).json({ message: `Database Error: ${error.message}` });
    }
};

// register user and add user
exports.addUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const id = await userService.addUser(fullName, email, password);

        const token = jwt.sign({ sub: id, email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        });
        return res
            .status(201)
            .json({ message: "User registered successfully", user: { id, fullName, email }, token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({ message: "Email and Password are required for login" });
        }

        const user = await userService.getUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { sub: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        return res.json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}