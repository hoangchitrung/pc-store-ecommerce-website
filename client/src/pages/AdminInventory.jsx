import { useState, useEffect } from "react";
import { AdminLayout } from "./Adminlayout";
import { getProducts, updateProduct } from "../api/productApi";

const PAGE_SIZE = 8;

function getStatus(stock) {
    if (stock === 0) return { text: "Out of Stock", color: "#b91c1c", bg: "#fee2e2", dot: "#ef4444" };
    if (stock <= 5) return { text: "Low Stock", color: "#a16207", bg: "#fef9c3", dot: "#eab308" };
    if (stock <= 20) return { text: "Low Stock", color: "#a16207", bg: "#fef9c3", dot: "#eab308" };
    return { text: "In Stock", color: "#15803d", bg: "#dcfce7", dot: "#22c55e" };
}

export function AdminInventory() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCat] = useState("All");
    const [statusFilter, setStatus] = useState("All");
    const [page, setPage] = useState(1);

    // Adjust stock modal
    const [adjustItem, setAdjust] = useState(null);
    const [newStock, setNewStock] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    const fetchProducts = () => {
        setLoading(true);
        setError("");
        getProducts()
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchProducts(); }, []);

    // Stats
    const totalProducts = products.length;
    const totalValue = products.reduce((s, p) => s + Number(p.price || 0) * Number(p.stock_quantity || 0), 0);
    const lowStockItems = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 20).length;
    const outOfStockItems = products.filter((p) => p.stock_quantity === 0).length;

    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

    // Filter
    const filtered = products.filter((p) => {
        const mSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.brand || "").toLowerCase().includes(search.toLowerCase());
        const mCat = category === "All" || p.category === category;
        const status = getStatus(p.stock_quantity);
        const mStatus = statusFilter === "All" || status.text === statusFilter;
        return mSearch && mCat && mStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Adjust stock
    const openAdjust = (p) => {
        setAdjust(p);
        setNewStock(String(p.stock_quantity));
        setSaveMsg("");
    };

    const handleAdjust = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveMsg("");
        try {
            await updateProduct(adjustItem.id, { stock_quantity: Number(newStock) });
            setSaveMsg("Stock updated!");
            fetchProducts();
            setTimeout(() => { setAdjust(null); setSaveMsg(""); }, 1000);
        } catch (err) {
            setSaveMsg(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            { /* Topbar */}
            <header style={{ background: "white", borderBottom: "1px solid #ebebeb", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
                <nav style={{ fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
                    <a href="/admin" style={{ color: "#888", textDecoration: "none" }}>Dashboard</a>
                    <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
                    <span style={{ color: "#1a1a1a", fontWeight: 500 }}>Inventory</span>
                </nav>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ position: "relative", width: 34, height: 34, borderRadius: 8, border: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <i className="bi bi-bell" style={{ fontSize: 16, color: "#666" }} />
                        <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: "50%", position: "absolute", top: 5, right: 5, border: "1.5px solid white" }} />
                    </div>
                </div>
            </header>
            { /* Content */}
            <div style={{ padding: "24px", flex: 1 }}>

                {/* Page header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                        <h4 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Inventory Management</h4>
                        <p style={{ fontSize: 13, color: "#888", marginTop: 3, marginBottom: 0 }}>Monitor stock levels and adjust quantities.</p>
                    </div>
                    <button onClick={fetchProducts}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, color: "#555", cursor: "pointer" }}>
                        <i className="bi bi-arrow-clockwise" /> Refresh
                    </button>
                </div>
                { /* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 20 }}>
                    {[
                        { label: "TOTAL PRODUCTS", value: loading ? "—" : totalProducts, icon: "bi-box-seam", iconBg: "#eff6ff", iconColor: "#2563EB" },
                        { label: "INVENTORY VALUE", value: loading ? "—" : `$${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, icon: "bi-currency-dollar", iconBg: "#eaf3de", iconColor: "#3b6d11" },
                        { label: "LOW STOCK", value: loading ? "—" : lowStockItems, icon: "bi-exclamation-triangle", iconBg: "#fef9c3", iconColor: "#a16207" },
                        { label: "OUT OF STOCK", value: loading ? "—" : outOfStockItems, icon: "bi-x-circle", iconBg: "#fee2e2", iconColor: "#b91c1c" },
                    ].map((s) => (
                        <div key={s.label} style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <i className={`bi ${s.icon}`} style={{ fontSize: 18, color: s.iconColor }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase" }}>{s.label}</div>
                                <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
                                    {loading ? <div style={{ width: 60, height: 22, background: "#f0f0f0", borderRadius: 4 }} /> : s.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                { /* Table card */}
                <div style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, overflow: "hidden" }}>

                    {/* Filters */}
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        {/* Search */}
                        <div style={{ position: "relative", flex: 1, minWidth: 180, maxWidth: 280 }}>
                            <i className="bi bi-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13 }} />
                            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search product, brand..."
                                style={{ width: "100%", padding: "7px 12px 7px 30px", background: "#f5f5f3", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none" }} />
                        </div>

                        {/* Category */}
                        <select value={category} onChange={e => { setCat(e.target.value); setPage(1); }}
                            style={{ padding: "7px 12px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none", cursor: "pointer" }}>
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>

                        {/* Status filter */}
                        <div style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
                            {["All", "In Stock", "Low Stock", "Out of Stock"].map((tab) => (
                                <button key={tab} onClick={() => { setStatus(tab); setPage(1); }}
                                    style={{
                                        padding: "6px 12px", borderRadius: 6, border: "1px solid",
                                        borderColor: statusFilter === tab ? "#2563EB" : "#ebebeb",
                                        background: statusFilter === tab ? "#2563EB" : "white",
                                        color: statusFilter === tab ? "white" : "#555",
                                        fontSize: 12, fontWeight: statusFilter === tab ? 600 : 400, cursor: "pointer",
                                    }}>{tab}</button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#b91c1c", fontSize: 13 }}>
                            <i className="bi bi-exclamation-triangle-fill me-2" />{error}
                        </div>
                    )}

                    {/* Table */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "48px 0" }}>
                            <div className="spinner-border" style={{ color: "#2563EB" }} />
                            <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Loading inventory...</p>
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "#fafaf8" }}>
                                    {["PRODUCT", "CATEGORY", "BRAND", "PRICE", "STOCK QTY", "STATUS", "ACTION"].map(h => (
                                        <th key={h} style={{
                                            padding: "10px 14px", textAlign: ["PRICE", "STOCK QTY"].includes(h) ? "right" : "left",
                                            fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.05em",
                                            borderBottom: "1px solid #f0f0f0",
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "#888", fontSize: 13 }}>
                                            <i className="bi bi-inbox" style={{ fontSize: 32, display: "block", marginBottom: 8, color: "#ddd" }} />
                                            No products found.
                                        </td>
                                    </tr>
                                ) : paginated.map((p) => {
                                    const status = getStatus(p.stock_quantity);
                                    return (
                                        <tr key={p.id}
                                            style={{ borderBottom: "1px solid #f5f5f3", transition: "background 0.1s" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                                            {/* Product */}
                                            <td style={{ padding: "12px 14px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{ width: 40, height: 40, background: "#f0f0f0", borderRadius: 8, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        {p.image_url
                                                            ? <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
                                                            : <i className="bi bi-image" style={{ color: "#ccc", fontSize: 18 }} />
                                                        }
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: "#1a1a1a", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                                                        <div style={{ fontSize: 11, color: "#aaa" }}>ID: {p.id}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ padding: "12px 14px" }}>
                                                <span style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>{p.category}</span>
                                            </td>

                                            <td style={{ padding: "12px 14px", color: "#555" }}>{p.brand}</td>

                                            <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600, color: "#1a1a1a" }}>
                                                ${Number(p.price).toFixed(2)}
                                            </td>

                                            {/* Stock with mini bar */}
                                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
                                                <div style={{ fontWeight: 700, color: p.stock_quantity === 0 ? "#ef4444" : p.stock_quantity <= 20 ? "#f59e0b" : "#1a1a1a", marginBottom: 3 }}>
                                                    {p.stock_quantity}
                                                </div>
                                                <div style={{ height: 3, background: "#f0f0f0", borderRadius: 2, width: 60, marginLeft: "auto" }}>
                                                    <div style={{ height: "100%", width: `${Math.min((p.stock_quantity / 100) * 100, 100)}%`, background: status.dot, borderRadius: 2 }} />
                                                </div>
                                            </td>

                                            <td style={{ padding: "12px 14px" }}>
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: status.bg, color: status.color, fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 20 }}>
                                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: status.dot }} />
                                                    {status.text}
                                                </span>
                                            </td>

                                            <td style={{ padding: "12px 14px" }}>
                                                <button onClick={() => openAdjust(p)}
                                                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: "white", border: "1px solid #ebebeb", borderRadius: 6, fontSize: 12, cursor: "pointer", color: "#2563EB", fontWeight: 500 }}
                                                    onMouseEnter={e => e.currentTarget.style.borderColor = "#2563EB"}
                                                    onMouseLeave={e => e.currentTarget.style.borderColor = "#ebebeb"}>
                                                    <i className="bi bi-pencil-square" /> Adjust
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {!loading && filtered.length > PAGE_SIZE && (
                        <div style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, color: "#888" }}>
                                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of <strong>{filtered.length}</strong>
                            </span>
                            <div style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #ebebeb", background: "white", cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "#ccc" : "#555", fontSize: 12 }}>
                                    <i className="bi bi-chevron-left" />
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                                    <button key={n} onClick={() => setPage(n)}
                                        style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid", borderColor: page === n ? "#2563EB" : "#ebebeb", background: page === n ? "#2563EB" : "white", color: page === n ? "white" : "#555", fontSize: 12, cursor: "pointer", fontWeight: page === n ? 700 : 400 }}>
                                        {n}
                                    </button>
                                ))}
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #ebebeb", background: "white", cursor: page === totalPages ? "not-allowed" : "pointer", color: page === totalPages ? "#ccc" : "#555", fontSize: 12 }}>
                                    <i className="bi bi-chevron-right" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            { /* Adjust Stock Modal */}
            {adjustItem && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                    <div style={{ background: "white", borderRadius: 14, width: "100%", maxWidth: 400, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 38, height: 38, background: "#eff6ff", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bi bi-pencil-square" style={{ fontSize: 18, color: "#2563EB" }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Adjust Stock</div>
                                    <div style={{ fontSize: 12, color: "#aaa", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adjustItem.name}</div>
                                </div>
                            </div>
                            <button onClick={() => setAdjust(null)}
                                style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #ebebeb", background: "white", cursor: "pointer", fontSize: 18, color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>

                        {/* Current stock info */}
                        <div style={{ background: "#f8f8f6", borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 13, color: "#555" }}>Current stock</span>
                            <span style={{ fontSize: 16, fontWeight: 700, color: adjustItem.stock_quantity === 0 ? "#ef4444" : adjustItem.stock_quantity <= 20 ? "#f59e0b" : "#1a1a1a" }}>
                                {adjustItem.stock_quantity}
                            </span>
                        </div>

                        <form onSubmit={handleAdjust}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#444", marginBottom: 6 }}>
                                New Stock Quantity
                            </label>
                            <input
                                type="number" min={0} value={newStock}
                                onChange={e => setNewStock(e.target.value)}
                                required
                                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e5e3", borderRadius: 8, fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box" }}
                                onFocus={e => e.target.style.borderColor = "#2563EB"}
                                onBlur={e => e.target.style.borderColor = "#e5e5e3"}
                            />

                            {saveMsg && (
                                <div style={{
                                    padding: "8px 12px", borderRadius: 8, marginBottom: 12, fontSize: 13,
                                    background: saveMsg.includes("updated") ? "#dcfce7" : "#fee2e2",
                                    color: saveMsg.includes("updated") ? "#15803d" : "#b91c1c"
                                }}>
                                    {saveMsg}
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="button" onClick={() => setAdjust(null)}
                                    style={{ flex: 1, padding: "9px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#555" }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    style={{ flex: 1, padding: "9px", background: saving ? "#93c5fd" : "#2563EB", border: "none", borderRadius: 8, fontSize: 13, color: "white", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                    {saving ? <><span className="spinner-border spinner-border-sm" /> Saving...</> : "Update Stock"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}