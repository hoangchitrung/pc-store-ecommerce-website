import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
    baseURL: "http://localhost:5000/api",
=======
    baseURL: "http://localhost:5000/api/v1",
>>>>>>> origin/Hao
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Helper function to extract data from response
function extractData(response) {
    
    const data = response?.data;

    
    return data?.data || data;
}

// ================= AUTH =================

export async function registerUser(payload) {
    try {
        const res = await api.post("/auth/register", payload);
        return extractData(res);
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error?.message ||
            "Register failed"
        );
    }
}

export async function loginUser(payload) {
    try {
        const res = await api.post("/auth/login", payload);

        const data = extractData(res);

        console.log("LOGIN API DATA:", data);

        return data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error?.message ||
            "Login failed"
        );
    }
}

export async function getMe() {
    try {
        const res = await api.get("/auth/me");

        return extractData(res);
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error?.message ||
            "Unauthorized"
        );
    }
}

export async function logoutUser() {
    try {
        const res = await api.post("/auth/logout");
        return extractData(res);
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error?.message ||
            "Logout failed"
        );
    }
}