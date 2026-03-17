import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

export async function registerUser(payload) {
    try {
        const response = await api.post("/auth/register", payload);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Register failed");

    }
}

export async function loginUser(payload) {
    try {
        const response = await api.post("/auth/login", payload);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Login failed");
    }
}

export async function getMe() {
    try {
        const response = await api.get("/auth/me");
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Unauthorized");
    }
}

export async function logoutUser() {
    try {
        const response = await api.post("/auth/logout");
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Logout failed");
    }
}