import { Link } from "react-router-dom"
import "./ProductCard.css"

export function ProductCard({ products, onAddToCart }) {
    return (
        <>
            <h1>List Products</h1>
            {products.map((product) => (
                <div key={product.id}>
                    <p>Name: {product.name}</p>
                    <p>Price: {product.price}</p>
                    <Link to={`/products/${product.id}`}>Details</Link>
                    <br />
                    <button onClick={() => onAddToCart(product)}>Add to Cart</button>
                </div>
            ))}
        </>
    )
}