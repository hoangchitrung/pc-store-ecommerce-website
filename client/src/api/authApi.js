import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

export async function registerUser(payload) {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, payload, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        throw new Error(error?.message || "Register failed");

    }
}