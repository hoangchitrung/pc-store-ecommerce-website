const connection = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getAllUsers = (req, res) => {
    const sql = "SELECT * FROM users;";

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: `Database Error: ${err}` });
        }

        return res.json(results);
    });
};

exports.getUserById = (req, res) => {
    const { id } = req.params; // get id from params
    const sql = `SELECT * FROM users
                WHERE id = ?`;
    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: `Database error: ${err}` });
        }
        if (results.length === 0) { // 0 mean nothing return
            return res.status(404).json({ message: `This user is not exist` });
        }
        return res.json(results[0]);
    });
};

// register user and add user
exports.addUser = async (req, res) => {
    const { fullName, email, password, address } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "fullname, email, password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users(fullname, email, password, address) VALUES(?, ?, ?, ?);`;
        connection.query(sql, [fullName, email, hashedPassword, address], (err, results) => {
            if (err) {
                return res.status(500).json({ message: `Database error: ${err}` });
            }
            return res.status(201).json({ message: "User registered successfully", id: results.insertId });
        });
    } catch (error) {
        return res.status(500).json({ message: `Hash Error: ${err}` })
    }
};