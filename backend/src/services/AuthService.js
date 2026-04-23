const userService = require('./UserServices');
const jwt = require('jsonwebtoken');

/**
 * Reuse the addUser function.
 * @param {*} data 
 * @returns jwt token with 1 hour durations
 */
const registerService = async (data) => {
    try {
        // Reuse the addUser function from user service
        const result = await userService.addUser(data);

        if (!result) throw new Error("Error while registering");

        // After create a user successful
        const token = jwt.sign({
            email: data.email,
            role: data.role || 'client'
        }, process.env.JWT_SECRET, { expiresIn: '1h' })

        return { token };
    } catch (error) {
        throw error;
    }
}

const loginService = async (data) => {
    try {
        const result = await userService.getUserByEmail(data.email);

        // Check if email is valid
        if (!user) throw new Error("Invalid email or password");

        // compare hash
        const isMatch = await bcrypt.compare(data.password, user.hashed_password);

        if (!isMatch) throw new Error("Invalid email or password");

        // after login generate a new jwt to mantain the session
        const token = jwt.sign({ emai: data.email, role: data.role || 'client' }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return { token };
    } catch (error) {
        throw error;
    }
}

module.exports = { registerService };