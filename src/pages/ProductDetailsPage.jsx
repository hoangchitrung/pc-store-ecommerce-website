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
            <h1>ID: {product.id}</h1>
            <h1>Name: {product.name}</h1>
            <p>Desc: {product.desc}</p>
        </div>
    )
}