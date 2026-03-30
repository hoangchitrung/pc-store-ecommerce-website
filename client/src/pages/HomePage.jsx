import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import Footer from "../components/Footer.jsx";
import { ChatBubble } from "../components/ChatBubble.jsx";
import { ProductCard } from "../components/ProductCard.jsx";

export function HomePage({ onAdd }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                if (isMounted) setIsLoading(true);
                const data = await getProducts();
                if (isMounted) {
                    setProducts(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchProducts();
        return () => {
            isMounted = false;
        };
    }, []);

    // Use a full-height flex column so Footer stays at the bottom when content is short
    return (
        <div className="d-flex flex-column min-vh-100">
            <header className="container py-5">
                <h1 className="display-6 fw-bold">Welcome to TechForge</h1>
                <p className="lead text-muted">Find the best PC parts and curated builds.</p>
            </header>

            <main className="container flex-grow-1">
                <section className="py-4">
                    <h2 className="h4">Products</h2>
                    {isLoading ? (
                        <div className="text-center py-5" style={{ minHeight: "20vh" }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p className="mt-3 text-muted">Đang tải danh sách sản phẩm...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger shadow-sm" role="alert">
                            <strong>Lỗi:</strong> {error}
                        </div>
                    ) : products.length > 0 ? (
                        <ProductCard products={products} onAdd={onAdd || (() => { })} />
                    ) : (
                        <p className="text-muted">Hiện chưa có sản phẩm nào.</p>
                    )}
                </section>
            </main>

            <Footer />
            <ChatBubble />
        </div>
    );
}