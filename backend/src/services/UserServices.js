const connection = require("../config/db.js");

// Get all users
const getAllUsers = () => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * from users;";

            connection(sql, (err, result) => {
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

module.exports = { getAllUsers };