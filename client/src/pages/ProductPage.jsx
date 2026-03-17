import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard.jsx";

// Thêm prop onAdd
export function ProductPage({ onAdd }) {
    const [products, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true)

        getProduct()
            .then((data) => {
                setProduct(data)
                setIsLoading(false)
            }).catch((err) => {
                setError(err.message)
                setIsLoading(false)
            })
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            {/* Truyền tiếp onAdd xuống ProductCard để làm nút "Thêm vào giỏ" */}
            <ProductCard products={products} onAdd={onAdd} />
        </div>
    )
}