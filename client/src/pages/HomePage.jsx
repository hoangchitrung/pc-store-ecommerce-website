import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useEffect } from "react";

export function HomePage() {
    const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     getProduct().then((data) => setProducts(data), [])
    // })

    return (
        <div>
            {/* <ProductCard
                products={products}
            /> */}
            <h1>Hello</h1>
        </div>
    )
}