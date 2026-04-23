const connection = require("../config/db.js");
const bcrypt = require("bcryptjs");

/**
 * Get all users
 * @returns an array object
 */
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

/**
 * Find a spefific user
 * @param {*} id 
 * @returns an object
 */
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

/**
 * Remove a specific user
 * @param {*} id 
 * @returns 
 */
const removeUserById = async (id) => {
    return new Promise(async (resolve, reject) => {
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
/**
 * Add users with allowed fields
 * @param {*} data 
 * @returns a new object
 */
const addUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { first_name, last_name, email, hashed_password, address = null, phone_number = null, role = 'client' } = data;

            // hashed password
            const hash = await bcrypt.hash(hashed_password, 10);

            const sql = `INSERT INTO users (first_name, last_name, hashed_password, email, address, phone_number, role) VALUES (?, ?, ?, ?, ?, ?, ?);`;
            const params = [first_name, last_name, hash, email, address, phone_number, role];

            connection.query(sql, params, (err, result) => {
                if (err) return reject(err);

                return resolve(result);
            })
        } catch (error) {
            return reject(error);
        }
    });
}

/**
 * Update object properties by finding id and update the allowed fields
 * @param {*} id 
 * @param {*} data 
 * @returns an object with updated properties
 */
const updateUserById = (id, data) => {
    return new Promise((resolve, reject) => {
        // update only these fields
        const { first_name, last_name, email, address, phone_number, role } = data;

        const sql = `
            UPDATE users
            SET first_name = ?,
                last_name = ?,
                email = ?,
                address = ?,
                phone_number = ?,
                role = ?
                WHERE id = ?;
        `;

        const params = [first_name, last_name, email, address, phone_number, role, id];

        connection.query(sql, params, (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return resolve(null); // no user found
            return resolve(result);
        });
    });
}

module.exports = { getAllUsers, getUserById, addUser, updateUserById, removeUserById };