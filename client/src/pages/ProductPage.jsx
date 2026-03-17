import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";   // ← thêm dòng này
import { ProductCard } from "../components/ProductCard.jsx";
import { getProduct } from "../api/productApi.js";

export function ProductPage() {
    const { onAdd } = useOutletContext();   // ← lấy onAdd từ App

    const [products, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);

        getProduct()
            .then((data) => {
                setProduct(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <ProductCard products={products} onAdd={onAdd} />   {/* ← truyền onAdd xuống */}
        </div>
    );
}