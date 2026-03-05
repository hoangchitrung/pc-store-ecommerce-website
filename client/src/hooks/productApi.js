const BASE_URL = "http://localhost:5000/api"; // Đổi port 3000 -> 5000 và thêm /api

export function getProduct() {
    return fetch(`${BASE_URL}/products`).then((res) => res.json());
}

export function getProductById(id) {
    return fetch(`${BASE_URL}/products/${id}`).then((res) => res.json());
}

export function addProduct(product) {
    return fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    }).then(res => res.json());
}