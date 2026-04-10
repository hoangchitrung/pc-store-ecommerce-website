import axios from "axios";

const orderApi = axios.create({
    baseURL: "http://localhost:5000/api/orders",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

export async function getOrders() {
    try {
        const res = await orderApi.get("/");
        return res.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot fetch orders");
    }
}

export async function getOrderById(id) {
    try {
        const res = await orderApi.get(`/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot fetch order");
    }
}

export async function updateOrderStatus(id, status) {
    try {
        const res = await orderApi.put(`/${id}/status`, { status });
        return res.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot update status");
    }
}

export async function cancelOrder(id) {
    try {
        const res = await orderApi.put(`/${id}/cancel`);
        return res.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot cancel order");
    }
}