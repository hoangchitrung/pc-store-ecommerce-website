const userService = require('../services/UserServices.js');

const getAllUserController = async (req, res) => {
    try {
        const res = await userService.getAllUsers();
        return res.json();
    } catch (error) {
        return res.status(500).json({ message: `Database error: ${error.message}` });
    }
}

module.exports = { getAllUserController };