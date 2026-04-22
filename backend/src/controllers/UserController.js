const userService = require('../services/UserServices.js');

const getAllUserController = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: `Database error: ${error.message}` });
    }
}

const getUserByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const users = await userService.getUserById(id);
        if (!users) {
            return res.status(404).json({ message: `Can not find user with id ${id}` });
        }
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: `Database error: ${error.message}` });
    }
}

const updateUserByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const data = { first_name, last_name, address, phone_number };
        const users = await userService.updateUserById(id, data);

        if (!users) {
            return res.status(404).json({ message: `Can not find user with ${id}` });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: `Database Error: ${error.message}` });
    }
}

module.exports = { getAllUserController, getUserByIdController };