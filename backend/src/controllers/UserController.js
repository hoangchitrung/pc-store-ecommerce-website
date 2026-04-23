const userService = require('../services/UserServices.js');

/**
 * Call from the user service function to get users list
 * @param {*} req 
 * @param {*} res 
 * @returns JSON response to client
 */
const getAllUserController = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: `Database error: ${error.message}` });
    }
}

/**
 * Call from the user service function to get a specific user
 * @param {*} req 
 * @param {*} res 
 * @returns JSON response with user base on the id
 */
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

/**
 * Call from the user service function to add new user with hashed password
 * @param {*} req 
 * @param {*} res 
 * @returns JSON response 
 */
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

/**
 * Update user with allowed fields
 * @param {*} req 
 * @param {*} res 
 * @returns a JSON response to the client.
 */
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

/**
 * Remove user by Id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
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

const getUserByEmailController = async (req, res) => {
    try {
        const email = req.params.email;
        const users = await userService.getUserByEmail(email);

        if (!users) {
            return res.status(404).json({ messag: "This user is not exist" });
        }

        return res.status(200).json({ message: "This user exist" });
    } catch (error) {
        res.status(500).json({ message: `Database error: ${error.message}` });
    }
}

module.exports = { getAllUserController, getUserByIdController, addUserController, updateUserByIdController, removeUserByIdController, getUserByEmailController };