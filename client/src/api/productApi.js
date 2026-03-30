import axios from "axios";

// 1. Dùng Axios instance với Port 5000 theo đúng backend
const productApi = axios.create({
    baseURL: "http://localhost:5000/api/products", // Đã cập nhật port 5000
    headers: { "Content-Type": "application/json" },
});

// 2. Đổi tên hàm thành getProducts để đúng với import ở HomePage.jsx
export async function getProducts(category = "") {
    try {
        const response = await productApi.get("/", {
            params: category ? { category } : {},
        });
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot fetch products");
    }
}

// 3. Hàm lấy chi tiết sản phẩm theo ID
export async function getProductById(id) {
    try {
        const response = await productApi.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot fetch product");
    }
}

// 4. Giữ tên hàm addProduct() theo ý bạn (tương đương createProduct)
export async function addProduct(payload) {
    try {
        const response = await productApi.post("/", payload);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot create product");
    }
}

// Alias để tương thích với nơi import createProduct
export const createProduct = addProduct;

// 5. Giữ lại hàm update của bạn bè cho trang Admin
export async function updateProduct(id, payload) {
    try {
        const response = await productApi.put(`/${id}`, payload);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot update product");
    }
}

// 6. Giữ lại hàm delete của bạn bè cho trang Admin
export async function deleteProduct(id) {
    try {
        const response = await productApi.delete(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || "Cannot delete product");
    }
}