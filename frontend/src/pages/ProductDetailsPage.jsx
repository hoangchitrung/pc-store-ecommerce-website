import { useParams } from "react-router-dom"
import { getProductById } from "../api/productApi.js";
import { useState, useEffect } from "react";

export function ProductDetailsPage() {
    const { id } = useParams();

    const [product, setProduct] = useState([])

    useEffect(() => {
        getProductById(id).then((data) => setProduct(data), [])
    })

    if (!product) {
        return <h1>Product not found!</h1>
    }

    return (
        <div>
            <p>Name: {product.name}</p>
            <p>Price: {product.price}</p>
            <p>Stock: {product.stock_quantity}</p>
        </div>
    )
}