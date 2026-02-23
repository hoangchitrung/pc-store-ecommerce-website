import { Link } from "react-router-dom"
import "./ProductCard.css"

export function ProductCard({products}) {
    return (
        <>
            <h1>List Products</h1>
            {products.map((product) => (
                <div key={product.id}>
                    <p>Name: {product.name}</p>
                    <p>Price: {product.price}</p>
                    <p>Stock: {product.stock}</p>
                    <Link to={`/products/${product.id}`}>Details</Link>
                </div>
            ))}
        </>
    )
}