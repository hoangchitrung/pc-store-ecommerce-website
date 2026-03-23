import { useEffect, useState } from "react";

export function ProductPage() {
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
    }, []) // [] empty = one time run

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <ProductCard products={products} />
        </div>
    )
}