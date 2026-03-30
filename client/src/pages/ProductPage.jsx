import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/productApi";

const formatVND = (value) => {
    const n = Number(value) || 0;
    return new Intl.NumberFormat("vi-VN").format(n) + " đ";
};

export function ProductPage() {
    const [sortBy, setSortBy] = useState("Most Popular");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();

    const category = searchParams.get("category") || "";
    const query = searchParams.get("search") || "";

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getProducts(category);
                if (!active) return;
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!active) return;
                setError(err.message || "Không thể tải sản phẩm");
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => { active = false; };
    }, [category]);

    const sortedProducts = useMemo(() => {
        const copy = [...products];
        if (sortBy === "Price: Low to High") {
            return copy.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        }
        if (sortBy === "Price: High to Low") {
            return copy.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        }
        if (sortBy === "Newest First") {
            return copy.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
        }
        return copy;
    }, [products, sortBy]);

    const filteredProducts = useMemo(() => {
        if (!query) return sortedProducts;
        const q = query.toLowerCase();
        return sortedProducts.filter((p) =>
            String(p.name || "").toLowerCase().includes(q) ||
            String(p.category || "").toLowerCase().includes(q) ||
            String(p.brand || "").toLowerCase().includes(q) ||
            String(p.description || "").toLowerCase().includes(q)
        );
    }, [sortedProducts, query]);

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
            <div
                className="text-white text-center py-2 fw-semibold"
                style={{ background: "#e53e3e", fontSize: 13, letterSpacing: "0.02em" }}
            >
                FLASH SALE: UP TO 50% OFF ON SELECTED MOTHERBOARDS — ENDS IN 2 HOURS
            </div>

            <div className="container-fluid py-3 px-3 px-md-4">
                <div className="row g-3">
                    <div className="col-12">
                        <nav className="mb-2" style={{ fontSize: 13 }}>
                            <span className="text-muted">Home</span>
                            <span className="text-muted mx-2">/</span>
                            <span className="text-dark fw-medium">PC Components</span>
                            {category && <><span className="text-muted mx-2">/</span><span className="text-dark fw-bold">{category}</span></>}
                        </nav>

                        <div className="d-flex align-items-start justify-content-between mb-3 flex-wrap gap-2">
                            <div>
                                <h4 className="fw-bold mb-1" style={{ fontSize: 22 }}>PC Components</h4>
                                {category || query ? (
                                    <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                                        {category ? `Category: ${category}` : ""}
                                        {category && query ? " • " : ""}
                                        {query ? `Search: ${query}` : ""}
                                    </p>
                                ) : (
                                    <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                                        Build your dream PC with our wide selection of parts.
                                    </p>
                                )}
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted" style={{ fontSize: 13 }}>Sort by:</span>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: "auto", fontSize: 13 }}
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                >
                                    <option>Most Popular</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                </select>
                            </div>
                        </div>

                        {loading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" />
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}

                        {!loading && !error && filteredProducts.length === 0 && (
                            <div className="alert alert-info">
                                Không tìm thấy sản phẩm {query ? `cho tìm kiếm "${query}"` : `cho danh mục ${category || "tất cả"}` }.
                            </div>
                        )}

                        {!loading && !error && filteredProducts.length > 0 && (
                            <div className="row g-3">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="col-12 col-md-6 col-lg-4">
                                        <div className="card h-100 shadow-sm">
                                            <img
                                                src={product.image_url || "https://placehold.co/300x200?text=No+Image"}
                                                className="card-img-top"
                                                alt={product.name}
                                                style={{ height: 180, objectFit: "cover" }}
                                            />
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title" style={{ fontSize: 16 }}>{product.name}</h5>
                                                <p className="text-muted mb-2" style={{ fontSize: 13 }}>{product.category}</p>
                                                <p className="fw-bold mb-2" style={{ fontSize: 16 }}>{formatVND(product.price)}</p>
                                                <p style={{ flex: 1, fontSize: 13, color: "#555" }} className="mb-2 text-truncate">{product.description || "Không có mô tả"}</p>
                                                <button className="btn btn-primary btn-sm mt-auto" disabled>
                                                    Chọn mua (coming soon)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
