export function ProductCard({ name, price }) {
    return (
        <div>
            <h2>Product with property</h2>
            <p>Name: {name}</p>
            <p>Price: {price} $</p>
        </div>
    )
}

export function ProductCardObject(product) {
    return (
        <div>
            <h2>Product With Props Object</h2>
            <p>name: {product.name}</p>
            <p>name: {product.price}</p>
        </div>
    )
}