import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "./Adminlayout";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../api/productApi";

// Constants
const PAGE_SIZE = 8;

const initForm = {
    name: "", description: "", category: "", brand: "",
    price: "", stock_quantity: "", tdp: "", image_url: "",
    specifications: "", serial_number_required: false, is_active: true,
};

// Status helper
function getStatus(p) {
    if (!p.is_active) return "Inactive";
    if (p.stock_quantity === 0) return "Out of Stock";
    if (p.stock_quantity <= 5) return "Low Stock";
    return "Active";
}

const STATUS_STYLE = {
    "Active": { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
    "Low Stock": { bg: "#fef9c3", color: "#a16207", dot: "#eab308" },
    "Out of Stock": { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
    "Inactive": { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
};

// Main Component
export function AdminProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEdit] = useState(null); // null = add, object = edit
    const [form, setForm] = useState(initForm);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [globalSearch, setGS] = useState("");

    const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))], [products]);

    // Fetch
    const fetchProducts = () => {
        setLoading(true);
        setError("");
        getProducts()
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchProducts(); }, []);

    // Filter + Paginate
    const filtered = products.filter((p) => {
        const mSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.brand || "").toLowerCase().includes(search.toLowerCase());
        const mCategory = category === "All" || p.category === category;
        return mSearch && mCategory;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Select
    const toggleAll = () =>
        setSelected(selected.length === paginated.length ? [] : paginated.map((p) => p.id));
    const toggleOne = (id) =>
        setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

    // Open Modal
    const openAdd = () => {
        setEdit(null);
        setForm(initForm);
        setSaveError("");
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEdit(p);
        setForm({
            name: p.name || "",
            description: p.description || "",
            category: p.category || "",
            brand: p.brand || "",
            price: p.price ?? "",
            stock_quantity: p.stock_quantity ?? "",
            tdp: p.tdp ?? "",
            image_url: p.image_url || "",
            specifications: typeof p.specifications === "object"
                ? JSON.stringify(p.specifications)
                : p.specifications || "",
            serial_number_required: !!p.serial_number_required,
            is_active: p.is_active !== undefined ? !!p.is_active : true,
        });
        setSaveError("");
        setShowModal(true);
    };

    // Form change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    // Save (Add / Edit)
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveError("");

        const payload = {
            ...form,
            price: Number(form.price),
            stock_quantity: Number(form.stock_quantity),
            tdp: form.tdp !== "" ? Number(form.tdp) : null,
        };

        try {
            if (editTarget) {
                await updateProduct(editTarget.id, payload);
            } else {
                await createProduct(payload);
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // Delete
    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteProduct(deleteId);
            setDeleteId(null);
            fetchProducts();
        } catch (err) {
            console.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    // Stats
    const totalProducts = products.length;
    const inStock = products.filter((p) => p.stock_quantity > 0).length;
    const lowStock = products.filter((p) => p.stock_quantity <= 5 && p.stock_quantity > 0).length;
    const outOfStock = products.filter((p) => p.stock_quantity === 0).length;

    const SectionLabel = ({ text }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase" }}>{text}</span>
        </div>
    );

    return (
        <AdminLayout>
{ /* Topbar */ }
            <header style={{ background: "white", borderBottom: "1px solid #ebebeb", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
                <nav style={{ fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
                    <a href="/admin" style={{ color: "#888", textDecoration: "none" }}>Dashboard</a>
                    <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
                    <span style={{ color: "#1a1a1a", fontWeight: 500 }}>Product Management</span>
                </nav>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ position: "relative" }}>
                        <i className="bi bi-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13 }} />
                        <input value={globalSearch} onChange={e => setGS(e.target.value)} placeholder="Global Search..."
                            style={{ padding: "7px 12px 7px 30px", background: "#f5f5f3", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none", width: 200 }} />
                    </div>
                    <div style={{ position: "relative", width: 34, height: 34, borderRadius: 8, border: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <i className="bi bi-bell" style={{ fontSize: 16, color: "#666" }} />
                        <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: "50%", position: "absolute", top: 5, right: 5, border: "1.5px solid white" }} />
                    </div>
                </div>
            </header>
{ /* Content */ }
            <div style={{ padding: "24px", flex: 1 }}>

                {/* Page header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                        <h4 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Product Inventory</h4>
                        <p style={{ fontSize: 13, color: "#888", marginTop: 3, marginBottom: 0 }}>
                            Manage your catalog, monitor stock levels, and update pricing.
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={fetchProducts}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, color: "#555", cursor: "pointer" }}>
                            <i className="bi bi-arrow-clockwise" /> Refresh
                        </button>
                        <button onClick={openAdd}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#2563EB", border: "none", borderRadius: 8, fontSize: 13, color: "white", cursor: "pointer", fontWeight: 600 }}>
                            <i className="bi bi-plus-lg" /> Add Product
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 20 }}>
                    {[
                        { label: "TOTAL", value: totalProducts, icon: "bi-box-seam", iconBg: "#eff6ff", iconColor: "#2563EB" },
                        { label: "IN STOCK", value: inStock, icon: "bi-check-circle", iconBg: "#dcfce7", iconColor: "#15803d" },
                        { label: "LOW STOCK", value: lowStock, icon: "bi-exclamation-triangle", iconBg: "#fef9c3", iconColor: "#a16207" },
                        { label: "OUT OF STOCK", value: outOfStock, icon: "bi-x-circle", iconBg: "#fee2e2", iconColor: "#b91c1c" },
                    ].map((s) => (
                        <div key={s.label} style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <i className={`bi ${s.icon}`} style={{ fontSize: 18, color: s.iconColor }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase" }}>{s.label}</div>
                                <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>{s.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table card */}
                <div style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, overflow: "hidden" }}>

                    {/* Filters */}
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 300 }}>
                            <i className="bi bi-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13 }} />
                            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search name, brand..."
                                style={{ width: "100%", padding: "7px 12px 7px 30px", background: "#f5f5f3", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none" }} />
                        </div>
                        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
                            style={{ padding: "7px 12px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none", cursor: "pointer" }}>
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                        {selected.length > 0 && (
                            <span style={{ fontSize: 12, color: "#2563EB", fontWeight: 500 }}>
                                {selected.length} selected
                            </span>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#b91c1c", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                            <i className="bi bi-exclamation-triangle-fill" /> {error}
                            <button onClick={fetchProducts} style={{ marginLeft: "auto", background: "none", border: "none", color: "#b91c1c", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Table */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "48px 0" }}>
                            <div className="spinner-border" style={{ color: "#2563EB" }} />
                            <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Loading products...</p>
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "#fafaf8" }}>
                                    <th style={{ padding: "10px 16px", width: 40 }}>
                                        <input type="checkbox"
                                            checked={selected.length === paginated.length && paginated.length > 0}
                                            onChange={toggleAll} style={{ cursor: "pointer" }} />
                                    </th>
                                    {["PRODUCT", "CATEGORY", "BRAND", "PRICE", "STOCK", "STATUS", "ACTIONS"].map(h => (
                                        <th key={h} style={{ padding: "10px 12px", textAlign: ["PRICE", "STOCK"].includes(h) ? "right" : "left", fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.05em", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} style={{ textAlign: "center", padding: "40px 0", color: "#888", fontSize: 13 }}>
                                            <i className="bi bi-box-seam" style={{ fontSize: 32, display: "block", marginBottom: 8, color: "#ddd" }} />
                                            No products found.
                                        </td>
                                    </tr>
                                ) : paginated.map((p) => {
                                    const status = getStatus(p);
                                    const ss = STATUS_STYLE[status];
                                    return (
                                        <tr key={p.id}
                                            style={{ borderBottom: "1px solid #f5f5f3", transition: "background 0.1s" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <td style={{ padding: "12px 16px" }}>
                                                <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)} style={{ cursor: "pointer" }} />
                                            </td>
                                            <td style={{ padding: "12px 12px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{ width: 42, height: 42, background: "#f0f0f0", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                                                        {p.image_url ? (
                                                            <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                                onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
                                                        ) : (
                                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                <i className="bi bi-image" style={{ color: "#ccc", fontSize: 18 }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: "#1a1a1a", fontSize: 13, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                                                        <div style={{ fontSize: 11, color: "#aaa" }}>ID: {p.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "12px 12px" }}>
                                                <span style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>{p.category}</span>
                                            </td>
                                            <td style={{ padding: "12px 12px", color: "#555", fontSize: 13 }}>{p.brand}</td>
                                            <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 600, color: "#1a1a1a" }}>
                                                ${Number(p.price).toFixed(2)}
                                            </td>
                                            <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 700, color: p.stock_quantity === 0 ? "#ef4444" : p.stock_quantity <= 5 ? "#f59e0b" : "#1a1a1a" }}>
                                                {p.stock_quantity}
                                            </td>
                                            <td style={{ padding: "12px 12px" }}>
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 20 }}>
                                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: ss.dot }} />
                                                    {status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 12px" }}>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button onClick={() => openEdit(p)}
                                                        title="Edit"
                                                        style={{ padding: "5px 10px", background: "white", border: "1px solid #ebebeb", borderRadius: 6, fontSize: 12, cursor: "pointer", color: "#2563EB" }}
                                                        onMouseEnter={e => e.currentTarget.style.borderColor = "#2563EB"}
                                                        onMouseLeave={e => e.currentTarget.style.borderColor = "#ebebeb"}>
                                                        <i className="bi bi-pencil" />
                                                    </button>
                                                    <button onClick={() => setDeleteId(p.id)}
                                                        title="Delete"
                                                        style={{ padding: "5px 10px", background: "white", border: "1px solid #ebebeb", borderRadius: 6, fontSize: 12, cursor: "pointer", color: "#ef4444" }}
                                                        onMouseEnter={e => e.currentTarget.style.borderColor = "#ef4444"}
                                                        onMouseLeave={e => e.currentTarget.style.borderColor = "#ebebeb"}>
                                                        <i className="bi bi-trash" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {!loading && filtered.length > 0 && (
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
{ /* Add / Edit Modal */ }
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                    <div style={{ background: "white", borderRadius: 14, width: "100%", maxWidth: 660, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

                        {/* Modal header */}
                        <div style={{ padding: "18px 24px", borderBottom: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 38, height: 38, background: "#2563EB", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className={`bi ${editTarget ? "bi-pencil" : "bi-plus-lg"}`} style={{ fontSize: 17, color: "white" }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{editTarget ? "Edit Product" : "Add New Product"}</div>
                                    <div style={{ fontSize: 12, color: "#aaa" }}>{editTarget ? `Editing: ${editTarget.name}` : "Fill in the details below"}</div>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)}
                                style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #ebebeb", background: "white", cursor: "pointer", fontSize: 18, color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>

                        {/* Modal body */}
                        <form onSubmit={handleSave}>
                            <div style={{ padding: "20px 24px" }}>

                                {saveError && (
                                    <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#b91c1c" }}>
                                        <i className="bi bi-exclamation-circle me-2" />{saveError}
                                    </div>
                                )}

                                <SectionLabel text="Basic Information" />
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium small">Product Name <span style={{ color: "#ef4444" }}>*</span></label>
                                        <input className="form-control form-control-sm" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Intel Core i9-13900K" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium small">Brand <span style={{ color: "#ef4444" }}>*</span></label>
                                        <input className="form-control form-control-sm" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Intel, AMD, NVIDIA" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium small">Category <span style={{ color: "#ef4444" }}>*</span></label>
                                        <select className="form-select form-select-sm" name="category" value={form.category} onChange={handleChange} required>
                                            <option value="">Select category...</option>
                                            {["CPU", "GPU", "RAM", "Storage", "Motherboard", "PSU", "Cooling", "Case", "Monitor", "Peripherals"].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium small">Image URL</label>
                                        <input className="form-control form-control-sm" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-medium small">Description</label>
                                        <textarea className="form-control form-control-sm" name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Describe the product..." />
                                    </div>
                                </div>

                                <hr className="my-3" />
                                <SectionLabel text="Pricing & Stock" />
                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <label className="form-label fw-medium small">Price (USD) <span style={{ color: "#ef4444" }}>*</span></label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text bg-light text-muted">$</span>
                                            <input className="form-control" type="number" name="price" value={form.price} onChange={handleChange} min={0} step="0.01" required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-medium small">Stock Quantity <span style={{ color: "#ef4444" }}>*</span></label>
                                        <input className="form-control form-control-sm" type="number" name="stock_quantity" value={form.stock_quantity} onChange={handleChange} min={0} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-medium small">TDP (Watts)</label>
                                        <div className="input-group input-group-sm">
                                            <input className="form-control" type="number" name="tdp" value={form.tdp} onChange={handleChange} min={0} />
                                            <span className="input-group-text bg-light text-muted">W</span>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-3" />
                                <SectionLabel text="Options" />
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {[
                                        { key: "serial_number_required", label: "Serial Number Required", sub: "Require serial number on purchase" },
                                        { key: "is_active", label: "Active Listing", sub: "Visible to customers on the store" },
                                    ].map(opt => (
                                        <div key={opt.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f8f8f6", borderRadius: 8, border: "1px solid #ebebeb" }}>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 500 }}>{opt.label}</div>
                                                <div style={{ fontSize: 12, color: "#aaa" }}>{opt.sub}</div>
                                            </div>
                                            <div className="form-check form-switch mb-0">
                                                <input className="form-check-input" type="checkbox" role="switch"
                                                    name={opt.key} checked={form[opt.key]} onChange={handleChange}
                                                    style={{ width: "2.5rem", height: "1.25rem", cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal footer */}
                            <div style={{ padding: "14px 24px", borderTop: "1px solid #ebebeb", display: "flex", justifyContent: "flex-end", gap: 10, position: "sticky", bottom: 0, background: "white" }}>
                                <button type="button" onClick={() => setShowModal(false)}
                                    style={{ padding: "8px 20px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#555" }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", background: saving ? "#93c5fd" : "#2563EB", border: "none", borderRadius: 8, fontSize: 13, color: "white", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600 }}>
                                    {saving
                                        ? <><span className="spinner-border spinner-border-sm" /> Saving...</>
                                        : <><i className={`bi ${editTarget ? "bi-check-lg" : "bi-plus-lg"}`} /> {editTarget ? "Save Changes" : "Add Product"}</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
{ /* Delete Confirm Modal */ }
            {deleteId && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                    <div style={{ background: "white", borderRadius: 14, width: "100%", maxWidth: 420, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                        <div style={{ width: 52, height: 52, background: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <i className="bi bi-trash" style={{ fontSize: 22, color: "#ef4444" }} />
                        </div>
                        <h5 style={{ textAlign: "center", fontSize: 17, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Delete Product?</h5>
                        <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginBottom: 24 }}>
                            This action cannot be undone. The product will be permanently removed from your catalog.
                        </p>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "9px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#555" }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={deleting}
                                style={{ flex: 1, padding: "9px", background: "#ef4444", border: "none", borderRadius: 8, fontSize: 13, color: "white", cursor: deleting ? "not-allowed" : "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                {deleting ? <><span className="spinner-border spinner-border-sm" /> Deleting...</> : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}