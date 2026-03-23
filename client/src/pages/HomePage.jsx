import { useState } from "react";
import { useEffect } from "react";
import { getProducts } from "../api/productApi";

export function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                setError(err.message || "Cannot load products");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const productsByCategory = products.reduce((groups, product) => {
        const category = product.category || "Other";
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(product);
        return groups;
    }, {});

    const orderedCategories = Object.keys(productsByCategory).sort((a, b) =>
        a.localeCompare(b),
    );

    return (
        <div className="home-page">
            <h1>Welcome to TechForge</h1>
            <p className="home-subtitle">Browse products by category.</p>

            {loading && <p>Loading products...</p>}
            {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
            {!loading && !error && products.length === 0 && <p>No products yet.</p>}

            {!loading && !error && orderedCategories.length > 0 && (
                <div className="category-sections">
                    {orderedCategories.map((category) => (
                        <section className="category-section" key={category}>
                            <h2 className="category-title">{category}</h2>
                            <ProductCard products={productsByCategory[category]} />
                        </section>
                    ))}
                </div>
            )}
        </div>
    )
}