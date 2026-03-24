const connection = require("../config/db");
const bcrypt = require("bcryptjs");

// get all users
function getAllUsers(req, res) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users;";

        connection.query(sql, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}


// get specific user
function getUserById(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users
                WHERE id = ?`;
        connection.query(sql, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) { // 0 mean nothing return
                return resolve(null);
            }
            return resolve(results[0]);
        });
    });
}


// add user | register
function addUser(fullName, email, password) {
    if (!fullName || !email || !password) {
        return Promise.reject(new Error("fullname, email, password are required!"));
    }

    return bcrypt.hash(password, 10).then((hashedPassword) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO users(fullname, email, password) VALUES (?, ?, ?)`;

            connection.query(sql, [fullName, email, hashedPassword], (err, result) => {
                if (err) {
                    return reject(err);
                }

                return resolve(result.insertId);
            });
        });
    });
}

// get user by email
function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE email = ?;";
        connection.query(sql, [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result[0] || null);
        });
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    getUserByEmail
};