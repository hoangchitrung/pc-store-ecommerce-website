

export function CartPage({ onCart }) {

    return (
        <div>
            <h1>Your Cart</h1>
            <h1>Total: {onCart.reduce((total, item) => { return total + item.price }, 0)}$</h1>
            {onCart.map(product => {
                if (product.id)
                    return (
                        <div key={product.id} >
                            <p>Name: {product.name}</p>
                            <p>Price: {product.price}</p>
                            <p>Stock: {product.stock}</p>

                        </div>
                    )
            })}
        </div >
    )
}