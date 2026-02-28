import { useState } from "react";
import { getProduct } from "../hooks/productApi";
import { ProductCard } from "../components/ProductCard";
import { useEffect } from "react";

export function HomePage() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        getProduct().then((data) => setProducts(data), [])
    })

    return (
        <div>
            <ProductCard
                products={products}
            />
        </div>
    )
}