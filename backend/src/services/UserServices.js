const connection = require("../config/db.js");

// Get all users
const getAllUsers = () => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "select * from users;";

            connection.query(sql, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    } catch (error) {
        console.error(error.message);
    }
};

// get user by id
const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `select * from users where id = ?;`;

        connection.query(sql, [id], (err, result) => {
            if (err) {
                return reject(err);
            }

            // Check if there is any data return
            if (result.length === 0) {
                return resolve(null);
            }

            return resolve(result[0]);
        });
    });
}

const removeUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'delete from users where id = ?';

        connection.query(sql, [id], (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.length === 0) {
                return resolve(null);
            }

            return resolve(result[0]);
        });
    });
}

// later
const updateUserById = (id, data) => {
    return new Promise((resolve, reject) => {
        const sql = 'update users set first_name = ?;';

        connection.query(sql, [name], (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.length === 0) {
                return resolve(null);
            }
            return resolve(result[0]);
        });
    });
}

module.exports = { getAllUsers, getUserById, updateUserById };