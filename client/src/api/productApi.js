import axios from "axios";

const productApi = axios.create({
    baseURL: "http://localhost:3000/api/products",
    headers: { "Content-Type": "application/json" },
});

export async function getProducts() {
    try {
        const response = await productApi.get("/");
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot fetch products");
    }
}

export async function getProductById(id) {
    try {
        const response = await productApi.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot fetch product");
    }
}

export async function createProduct(payload) {
    try {
        const response = await productApi.post("/", payload);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot create product");
    }
}

export async function updateProduct(id, payload) {
    try {
        const response = await productApi.put(`/${id}`, payload);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot update product");
    }
}

export async function deleteProduct(id) {
    try {
        const response = await productApi.delete(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot delete product");
    }
}
