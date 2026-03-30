import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi";

// Helpers
const pad = (n) => String(n).padStart(2, "0");

const CATEGORY_META = {
    CPU: { label: "Processors", icon: "bi-cpu", color: "#3b82f6" },
    GPU: { label: "Graphics Cards", icon: "bi-gpu-card", color: "#8b5cf6" },
    RAM: { label: "RAM & Memory", icon: "bi-memory", color: "#10b981" },
    Storage: { label: "SSD Storage", icon: "bi-device-hdd", color: "#f59e0b" },
    Motherboard: { label: "Motherboards", icon: "bi-motherboard", color: "#ef4444" },
    Case: { label: "PC Cases", icon: "bi-box", color: "#6366f1" },
};

function deriveCategories(products) {
    const categories = Array.from(new Set((products || []).map((p) => p.category).filter(Boolean)));
    return categories.map((cat) => ({
        label: CATEGORY_META[cat]?.label || cat,
        icon: CATEGORY_META[cat]?.icon || "bi-tag",
        color: CATEGORY_META[cat]?.color || "#2563EB",
        filter: cat,
    }));
}

// Countdown
function useCountdown() {
    const [time, setTime] = useState({ h: 3, m: 0, s: 0 });
    useEffect(() => {
        const t = setInterval(() => {
            setTime((prev) => {
                const { h, m, s } = prev;
                if (s > 0) return { h, m, s: s - 1 };
                if (m > 0) return { h, m: m - 1, s: 59 };
                if (h > 0) return { h: h - 1, m: 59, s: 59 };
                clearInterval(t);
                return { h: 0, m: 0, s: 0 };
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);
    return time;
}

// Product Card
function ProductCard({ product, onClick }) {
    return (
        <div
            className="border rounded-2 p-2 h-100 bg-white"
            style={{ cursor: "pointer", transition: "box-shadow 0.15s" }}
            onClick={onClick}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ""}
        >
            <img
                src={product.image_url || "https://placehold.co/300x200/f5f5f5/888?text=No+Image"}
                alt={product.name}
                className="w-100 rounded mb-2"
                style={{ height: 130, objectFit: "cover" }}
                onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/f5f5f5/888?text=No+Image"; }}
            />
            <div style={{ fontSize: 10, color: "#2563EB", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em" }}>
                {product.brand} · {product.category}
            </div>
            <p className="mb-1 lh-sm" style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", height: 34, overflow: "hidden" }}>
                {product.name}
            </p>
            <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fw-bold" style={{ color: "#ef4444", fontSize: 14 }}>
                    ${Number(product.price).toFixed(2)}
                </span>
                {product.stock_quantity > 0 ? (
                    <span style={{ fontSize: 10, color: "#16a34a" }}>
                        <i className="bi bi-check-circle-fill me-1" />{product.stock_quantity} left
                    </span>
                ) : (
                    <span style={{ fontSize: 10, color: "#ef4444" }}>Out of stock</span>
                )}
            </div>
        </div>
    );
}

// Loading Skeleton
function SkeletonCard() {
    return (
        <div className="border rounded-2 p-2 bg-white" style={{ height: 220 }}>
            <div className="rounded mb-2" style={{ height: 130, background: "#f0f0f0", animation: "pulse 1.5s ease-in-out infinite" }} />
            <div className="rounded mb-1" style={{ height: 10, background: "#f0f0f0", width: "60%" }} />
            <div className="rounded mb-1" style={{ height: 10, background: "#f0f0f0", width: "90%" }} />
            <div className="rounded" style={{ height: 10, background: "#f0f0f0", width: "40%" }} />
        </div>
    );
}

// Main
export function HomePage() {
    const navigate = useNavigate();
    const countdown = useCountdown();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeCat, setActiveCat] = useState("All");

    const categories = useMemo(() => deriveCategories(products), [products]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        getProducts()
            .then((data) => {
                // data là array [] từ backend
                setProducts(Array.isArray(data) ? data : []);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Flash sale: 5 sản phẩm đầu
    const flashSale = products.slice(0, 5);

    // New arrivals: 5 sản phẩm id cao nhất
    const newArrivals = [...products].sort((a, b) => b.id - a.id).slice(0, 5);

    // Featured: lọc theo tab
    const featured = activeCat === "All"
        ? products.slice(0, 10)
        : products.filter((p) => p.category === activeCat).slice(0, 10);

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>

            {/* Hero */}
            <div className="container py-3">
                <div className="row g-3">

                    {/* Main banner */}
                    <div className="col-12 col-lg-8">
                        <div className="rounded-3 overflow-hidden position-relative d-flex align-items-center"
                            style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 60%, #1e1b4b 100%)", minHeight: 280, padding: "36px 40px" }}>
                            <div style={{ zIndex: 2, maxWidth: 340 }}>
                                <span className="badge mb-3 px-3 py-1 rounded-pill" style={{ background: "#ef4444", fontSize: 11 }}>
                                    🔥 HOT DEALS
                                </span>
                                <h2 className="fw-bold text-white mb-2" style={{ fontSize: 34, lineHeight: 1.2 }}>
                                    Build Your Dream PC<br />
                                    <span style={{ color: "#60a5fa" }}>with TechForge</span>
                                </h2>
                                <p className="mb-4" style={{ color: "#94a3b8", fontSize: 14 }}>
                                    Premium components. Competitive prices. Expert advice.
                                </p>
                                <div className="d-flex gap-2">
                                    <button className="btn px-4 py-2 text-white fw-semibold"
                                        style={{ background: "#2563EB", fontSize: 13 }}
                                        onClick={() => navigate("/products")}>
                                        Shop Now
                                    </button>
                                    <button className="btn px-4 py-2 fw-semibold"
                                        style={{ background: "rgba(255,255,255,0.1)", color: "white", fontSize: 13, border: "1px solid rgba(255,255,255,0.2)" }}
                                        onClick={() => navigate("/products")}>
                                        View All
                                    </button>
                                </div>
                            </div>
                            <div className="position-absolute end-0 top-50 translate-middle-y pe-5" style={{ opacity: 0.3 }}>
                                <i className="bi bi-gpu-card" style={{ fontSize: 140, color: "#818cf8" }} />
                            </div>
                        </div>
                    </div>

                    {/* Side promo cards */}
                    <div className="col-12 col-lg-4 d-flex flex-column gap-2">
                        {[
                            { title: "PC Builder", sub: "Build your dream machine", link: "Start Building →", color: "#2563EB", icon: "bi-cpu" },
                            { title: "Pre-Built PCs", sub: "Plug and Play Ready", link: "View Systems →", color: "#7c3aed", icon: "bi-pc-display" },
                            { title: "Hot Deals", sub: "Best prices guaranteed", link: "Grab Deals →", color: "#d97706", icon: "bi-tag" },
                        ].map((card) => (
                            <div key={card.title}
                                className="bg-white rounded-2 border d-flex align-items-center gap-3 px-3 py-2 flex-fill"
                                style={{ cursor: "pointer", minHeight: 82, transition: "all 0.15s" }}
                                onClick={() => navigate("/products")}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = "translateX(3px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.transform = ""; }}>
                                <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                                    style={{ width: 44, height: 44, background: card.color + "15" }}>
                                    <i className={`bi ${card.icon}`} style={{ fontSize: 22, color: card.color }} />
                                </div>
                                <div>
                                    <div className="fw-semibold" style={{ fontSize: 14, color: card.color }}>{card.title}</div>
                                    <div style={{ fontSize: 12, color: "#888" }}>{card.sub}</div>
                                    <div style={{ fontSize: 12, color: card.color, fontWeight: 500 }}>{card.link}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Flash Sale */}
            <div className="container mb-4">
                <div className="rounded-3 overflow-hidden border">
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between px-4 py-2"
                        style={{ background: "linear-gradient(90deg, #ef4444 0%, #f97316 100%)" }}>
                        <div className="d-flex align-items-center gap-3">
                            <span className="fw-bold text-white d-flex align-items-center gap-2" style={{ fontSize: 15 }}>
                                <i className="bi bi-lightning-fill" /> FLASH SALE
                            </span>
                            <span className="text-white" style={{ fontSize: 13, opacity: 0.95 }}>
                                Ends in:
                                <span className="badge bg-dark mx-1 px-2">{pad(countdown.h)}</span>:
                                <span className="badge bg-dark mx-1 px-2">{pad(countdown.m)}</span>:
                                <span className="badge bg-dark mx-1 px-2">{pad(countdown.s)}</span>
                            </span>
                        </div>
                        <span className="text-white fw-medium" style={{ fontSize: 13, cursor: "pointer" }}
                            onClick={() => navigate("/products")}>
                            View All <i className="bi bi-arrow-right" />
                        </span>
                    </div>

                    {/* Products */}
                    <div className="bg-white p-3">
                        {loading ? (
                            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                                {[...Array(5)].map((_, i) => <div key={i} className="col"><SkeletonCard /></div>)}
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger d-flex align-items-center gap-2 mb-0" style={{ fontSize: 13 }}>
                                <i className="bi bi-exclamation-triangle-fill" /> {error}
                            </div>
                        ) : (
                            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                                {flashSale.map((p) => (
                                    <div key={p.id} className="col">
                                        <div className="border rounded-2 p-2 h-100 bg-white position-relative"
                                            style={{ cursor: "pointer", transition: "box-shadow 0.15s" }}
                                            onClick={() => navigate(`/products/${p.id}`)}
                                            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
                                            onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
                                            <img
                                                src={p.image_url || "https://placehold.co/280x200/f5f5f5/888?text=No+Image"}
                                                alt={p.name}
                                                className="w-100 rounded mb-2"
                                                style={{ height: 110, objectFit: "cover" }}
                                                onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/280x200/f5f5f5/888?text=No+Image"; }}
                                            />
                                            <p className="mb-1 lh-sm" style={{ fontSize: 12, color: "#333", height: 32, overflow: "hidden" }}>{p.name}</p>
                                            <div className="fw-bold" style={{ color: "#ef4444", fontSize: 14 }}>${Number(p.price).toFixed(2)}</div>
                                            {p.stock_quantity === 0 && (
                                                <span className="badge mt-1" style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 10 }}>Out of Stock</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Categories */}
            <div className="container mb-4">
                <div className="bg-white rounded-3 border p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0" style={{ fontSize: 16 }}>Top Categories</h6>
                        <span className="fw-medium" style={{ color: "#2563EB", fontSize: 13, cursor: "pointer" }}
                            onClick={() => navigate("/products")}>
                            See All →
                        </span>
                    </div>
                    <div className="row row-cols-3 row-cols-md-6 g-2">
                        {(categories.length > 0 ? categories : [{ label: "No categories", icon: "bi-tag", color: "#94a3b8", filter: "" }]).map((cat) => (
                            <div key={cat.label} className="col">
                                <div className="text-center border rounded-2 py-3 px-2"
                                    style={{ cursor: cat.filter ? "pointer" : "default", transition: "all 0.15s" }}
                                    onClick={() => cat.filter && navigate(`/products?category=${encodeURIComponent(cat.filter)}`)}
                                    onMouseEnter={e => {
                                        if (cat.color) {
                                            e.currentTarget.style.borderColor = cat.color;
                                            e.currentTarget.style.background = cat.color + "08";
                                        }
                                    }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.background = ""; }}>
                                    <div className="d-flex align-items-center justify-content-center rounded-2 mx-auto mb-2"
                                        style={{ width: 52, height: 52, background: cat.color ? cat.color + "15" : "#f0f0f0" }}>
                                        <i className={`bi ${cat.icon}`} style={{ fontSize: 24, color: cat.color || "#64748b" }} />
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: "#333" }}>{cat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="container mb-4">
                <div className="bg-white rounded-3 border p-3">
                    <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ fontSize: 16 }}>
                            <span style={{ width: 4, height: 18, background: "#2563EB", borderRadius: 2, display: "inline-block" }} />
                            Featured Products
                        </h6>
                        {/* Filter tabs */}
                        <div className="d-flex gap-1 flex-wrap">
                            {["All", ...categories.map((c) => c.filter)].filter(Boolean).slice(0, 8).map((cat) => (
                                <button key={cat} onClick={() => setActiveCat(cat)}
                                    className="btn btn-sm px-3 rounded-pill"
                                    style={{
                                        fontSize: 11, fontWeight: activeCat === cat ? 600 : 400, border: "none",
                                        background: activeCat === cat ? "#2563EB" : "#f5f5f3",
                                        color: activeCat === cat ? "white" : "#555",
                                        transition: "all 0.15s",
                                    }}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                            {[...Array(5)].map((_, i) => <div key={i} className="col"><SkeletonCard /></div>)}
                        </div>
                    ) : featured.length === 0 ? (
                        <div className="text-center py-4">
                            <i className="bi bi-box-seam display-6 text-muted" />
                            <p className="text-muted mt-2 mb-0" style={{ fontSize: 13 }}>No products in this category.</p>
                        </div>
                    ) : (
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                            {featured.map((p) => (
                                <div key={p.id} className="col">
                                    <ProductCard product={p} onClick={() => navigate(`/products/${p.id}`)} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* New Arrivals */}
            <div className="container mb-4">
                <div className="bg-white rounded-3 border p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ fontSize: 16 }}>
                            <span style={{ width: 4, height: 18, background: "#ef4444", borderRadius: 2, display: "inline-block" }} />
                            New Arrivals
                        </h6>
                        <span className="fw-medium" style={{ color: "#2563EB", fontSize: 13, cursor: "pointer" }}
                            onClick={() => navigate("/products")}>
                            View All <i className="bi bi-arrow-right" />
                        </span>
                    </div>
                    {loading ? (
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                            {[...Array(5)].map((_, i) => <div key={i} className="col"><SkeletonCard /></div>)}
                        </div>
                    ) : (
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                            {newArrivals.map((p) => (
                                <div key={p.id} className="col">
                                    <ProductCard product={p} onClick={() => navigate(`/products/${p.id}`)} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            {/* Footer */}
            <footer className="bg-white border-top pt-5 pb-3">
                <div className="container">
                    <div className="row g-4 mb-4">
                        <div className="col-md-3">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <div className="d-flex align-items-center justify-content-center rounded-2 text-white fw-bold"
                                    style={{ width: 34, height: 34, background: "#2563EB", fontSize: 12 }}>TF</div>
                                <span className="fw-bold" style={{ fontSize: 15 }}>TechForge</span>
                            </div>
                            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                                The destination for PC enthusiasts. Quality parts, competitive prices.
                            </p>
                            <div className="d-flex gap-2 mt-3">
                                {["facebook", "youtube", "instagram"].map((s) => (
                                    <a key={s} href="#"
                                        className="d-flex align-items-center justify-content-center rounded-circle text-secondary border"
                                        style={{ width: 32, height: 32, fontSize: 14 }}>
                                        <i className={`bi bi-${s}`} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <h6 className="fw-semibold mb-3" style={{ fontSize: 14 }}>Customer Service</h6>
                            {["Help Center", "Track Order", "Returns & Warranty", "Contact Us"].map((l) => (
                                <a key={l} href="#" className="d-block text-decoration-none text-secondary mb-2" style={{ fontSize: 13 }}>{l}</a>
                            ))}
                        </div>
                        <div className="col-md-3">
                            <h6 className="fw-semibold mb-3" style={{ fontSize: 14 }}>Shop</h6>
                            {["Build Your PC", "Gaming Systems", "Laptops", "Components"].map((l) => (
                                <a key={l} href="#" className="d-block text-decoration-none text-secondary mb-2" style={{ fontSize: 13 }}>{l}</a>
                            ))}
                        </div>
                        <div className="col-md-3">
                            <h6 className="fw-semibold mb-3" style={{ fontSize: 14 }}>Newsletter</h6>
                            <p style={{ fontSize: 13, color: "#666" }}>Subscribe for latest deals and builds.</p>
                            <div className="input-group mt-2">
                                <input className="form-control form-control-sm" placeholder="Your email" style={{ fontSize: 13 }} />
                                <button className="btn btn-sm text-white" style={{ background: "#2563EB", borderColor: "#2563EB" }}>Join</button>
                            </div>
                        </div>
                    </div>
                    <div className="border-top pt-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <span style={{ fontSize: 12, color: "#999" }}>© 2024 TechForge Inc. All rights reserved.</span>
                        <div className="d-flex gap-3">
                            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                                <a key={l} href="#" className="text-decoration-none" style={{ fontSize: 12, color: "#999" }}>{l}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Pulse animation */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

        </div>
    );
}