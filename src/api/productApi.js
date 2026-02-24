const BASE_URL = "https://699d839683e60a406a4691e5.mockapi.io"

export function getProduct() {
    return fetch(`${BASE_URL}/products`).then((res) => res.json());
}

export function getProductById(id) {
    return fetch(`${BASE_URL}/products/${id}`).then((res) => res.json());
}