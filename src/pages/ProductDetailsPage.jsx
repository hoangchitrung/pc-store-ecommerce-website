import { useParams } from "react-router-dom"
import { data } from "../data/data.jsx";

export function ProductDetailsPage() {
    const { id } = useParams();
    const product = data.find((item) => item.id === parseInt(id));

    if (!product) {
        return <h1>Product not found!</h1>
    }

    return (
        <div>
            <p>Name: {product.name}</p>
            <p>Price: {product.price}</p>
            <p>Stock: {product.stock}</p>
        </div>
    )
}