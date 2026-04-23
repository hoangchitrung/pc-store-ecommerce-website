const userService = require('../services/UserServices.js');

// User Controllers are calling from User Service

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

const addUserController = async (req, res) => {
    try {
        const { first_name, last_name, email, hashed_password, address = null, phone_number = null, role = 'client' } = req.body;

        if (!first_name || !last_name || !email || !hashed_password)
            return res.status(400).json({ message: "Please fill all the fields" });

        const users = await userService.addUser(req.body);

        if (!users) {
            return res.status(409).json({ message: "Can not add user" });
        }

        return res.status(200).json({ message: "Added new user" });
    } catch (error) {
        return res.status(500).json({ message: `Database error: ${error.message}` });
    }
}
const updateUserByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const { first_name, last_name, address, phone_number } = req.body;
        const users = await userService.updateUserById(id, req.body);

        if (!users) {
            return res.status(404).json({ message: `Can not find user with ${id} to update` });
        }

        return res.status(200).json({ message: `Updated user with id ${id}` });
    } catch (error) {
        return res.status(500).json({ message: `Database Error: ${error.message}` });
    }
}

const removeUserByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const users = await userService.removeUserById(id);

        if (users) {
            return res.status(404).json({ message: `Can not remove user with id ${id}` });
        }

        return res.status(200).json({ message: `Deleted user with id ${id}` });
    } catch (error) {
        return res.status(500).json({ message: `Database error: ${error.message}` });
    }
}

module.exports = { getAllUserController, getUserByIdController, addUserController, updateUserByIdController, removeUserByIdController };