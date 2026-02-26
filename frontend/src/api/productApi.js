const BASE_URL = "http://localhost:3000"

export function getProduct() {
    return fetch(`${BASE_URL}/products`).then((res) => res.json());
}

export function getProductById(id) {
    return fetch(`${BASE_URL}/products/${id}`).then((res) => res.json());
}