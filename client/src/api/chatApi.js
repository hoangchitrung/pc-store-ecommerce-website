import axios from "axios";

const BACKEND_BASE_URL = "http://localhost:5000";

export async function sendChatMessage(message) {
    if (!message || typeof message !== "string") {
        throw new Error("Message must be a non-empty string");
    }

    const response = await axios.post(`${BACKEND_BASE_URL}/api/chat`, { message });
    return response.data;
}
