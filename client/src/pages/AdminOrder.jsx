import { useState, useEffect } from "react";
import { AdminLayout } from "./Adminlayout";
import { getOrders, getOrderById, updateOrderStatus, cancelOrder } from "../api/orderApi";

const STATUS_TABS = ["All Orders", "pending", "processing", "delivered", "cancelled"];

const STATUS_STYLE = {
    processing: { bg: "#fff7ed", color: "#c2410c", dot: "#f97316", label: "Processing" },
    delivered: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e", label: "Delivered" },
    pending: { bg: "#fef9c3", color: "#a16207", dot: "#eab308", label: "Pending" },
    cancelled: { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444", label: "Cancelled" },
};

const AVATAR_COLORS = ["#3b82f6", "#6366f1", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
const PAGE_SIZE = 10;

function getInitials(name = "") {
    return (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(str) {
    if (!str) return "—";
    try { return new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return str; }
}

export function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setTab] = useState("All Orders");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDL] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateMsg, setUpdateMsg] = useState("");
    const [showStatusModal, setSSM] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    const fetchOrders = () => {
        setLoading(true); setError("");
        getOrders()
            .then(data => setOrders(Array.isArray(data) ? data : []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(); }, []);

    const selectOrder = async (order) => {
        setSelectedId(order.id); setDetail(null); setUpdateMsg(""); setDL(true);
        try {
            const data = await getOrderById(order.id);
            setDetail(data); setNewStatus(data.status);
        } catch { setDetail(order); setNewStatus(order.status); }
        finally { setDL(false); }
    };

    const filtered = orders.filter(o => {
        const matchTab = activeTab === "All Orders" || o.status === activeTab;
        const matchSearch = String(o.order_number || o.id).toLowerCase().includes(search.toLowerCase()) ||
            (o.customer_name || "").toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const pendingCount = orders.filter(o => o.status === "pending" || o.status === "processing").length;
    const deliveredCount = orders.filter(o => o.status === "delivered").length;

    const handleUpdateStatus = async () => {
        if (!detail || !newStatus) return;
        setUpdating(true); setUpdateMsg("");
        try {
            await updateOrderStatus(detail.id, newStatus);
            setUpdateMsg("✓ Status updated!");
            setSSM(false);
            fetchOrders();
            const updated = await getOrderById(detail.id);
            setDetail(updated);
        } catch (err) { setUpdateMsg(err.message); }
        finally { setUpdating(false); }
    };

    const handleCancel = async () => {
        if (!detail) return;
        // Khi không dùng window.confirm, cẩn thận nếu muốn UI confirm khác
        setUpdating(true);
        try {
            await cancelOrder(detail.id);
            fetchOrders();
            const updated = await getOrderById(detail.id);
            setDetail(updated);
        } catch (err) {
            console.error(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const ss = (status) => STATUS_STYLE[status?.toLowerCase()] || STATUS_STYLE["pending"];

    return (
        <AdminLayout>
            {/* Topbar */}
            <header style={{ background: "white", borderBottom: "1px solid #ebebeb", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
                    <i className="bi bi-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13 }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search order number, customer..."
                        style={{ width: "100%", padding: "7px 12px 7px 30px", background: "#f5f5f3", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none" }} />
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={fetchOrders} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 12, color: "#555", cursor: "pointer" }}>
                        <i className="bi bi-arrow-clockwise" /> Refresh
                    </button>
                    <div style={{ position: "relative", width: 34, height: 34, borderRadius: 8, border: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <i className="bi bi-bell" style={{ fontSize: 16, color: "#666" }} />
                        <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: "50%", position: "absolute", top: 5, right: 5, border: "1.5px solid white" }} />
                    </div>
                </div>
            </header>

            {/* Content */}
            <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>

                {/* Header */}
                <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Order Management</h4>
                    <p style={{ fontSize: 13, color: "#888", marginTop: 3, marginBottom: 0 }}>Track, manage, and fulfill customer orders.</p>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12, marginBottom: 20 }}>
                    {[
                        { label: "TOTAL ORDERS", value: loading ? "—" : totalOrders, icon: "bi-cart3", iconBg: "#eff6ff", iconColor: "#2563EB" },
                        { label: "TOTAL REVENUE", value: loading ? "—" : `$${totalRevenue.toLocaleString()}`, icon: "bi-currency-dollar", iconBg: "#eaf3de", iconColor: "#3b6d11" },
                        { label: "PENDING", value: loading ? "—" : pendingCount, icon: "bi-hourglass", iconBg: "#fef9c3", iconColor: "#a16207" },
                        { label: "DELIVERED", value: loading ? "—" : deliveredCount, icon: "bi-check-circle", iconBg: "#dcfce7", iconColor: "#15803d" },
                    ].map(s => (
                        <div key={s.label} style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <i className={`bi ${s.icon}`} style={{ fontSize: 18, color: s.iconColor }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase" }}>{s.label}</div>
                                <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{s.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div style={{ display: "flex", gap: 14, flex: 1, minHeight: 0 }}>

                    {/* Order list */}
                    <div style={{ flex: 1, background: "white", border: "1px solid #ebebeb", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

                        {/* Tabs */}
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                            {STATUS_TABS.map(tab => {
                                const active = activeTab === tab;
                                const label = tab === "All Orders" ? "All Orders" : (STATUS_STYLE[tab]?.label || tab);
                                return (
                                    <button key={tab} onClick={() => { setTab(tab); setPage(1); }}
                                        style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid", borderColor: active ? "#2563EB" : "#ebebeb", background: active ? "#2563EB" : "white", color: active ? "white" : "#555", fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer" }}>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {error && (
                            <div style={{ padding: "10px 16px", background: "#fee2e2", color: "#b91c1c", fontSize: 13 }}>
                                <i className="bi bi-exclamation-triangle-fill me-2" />{error}
                            </div>
                        )}

                        {/* Table */}
                        <div style={{ overflowY: "auto", flex: 1 }}>
                            {loading ? (
                                <div style={{ textAlign: "center", padding: "48px 0" }}>
                                    <div className="spinner-border" style={{ color: "#2563EB" }} />
                                    <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Loading orders...</p>
                                </div>
                            ) : (
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                    <thead style={{ position: "sticky", top: 0, background: "#fafaf8", zIndex: 1 }}>
                                        <tr>
                                            <th style={{ width: 40, padding: "10px 16px", borderBottom: "1px solid #f0f0f0" }} />
                                            {["ORDER NO.", "CUSTOMER", "DATE", "AMOUNT", "PAYMENT", "STATUS"].map(h => (
                                                <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.05em", padding: "10px 12px", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.length === 0 ? (
                                            <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "#888", fontSize: 13 }}>
                                                <i className="bi bi-inbox" style={{ fontSize: 32, display: "block", marginBottom: 8, color: "#ddd" }} />
                                                No orders found.
                                            </td></tr>
                                        ) : paginated.map(order => {
                                            const isSelected = selectedId === order.id;
                                            const style = ss(order.status);
                                            const avatarColor = AVATAR_COLORS[order.id % AVATAR_COLORS.length];
                                            return (
                                                <tr key={order.id} onClick={() => selectOrder(order)}
                                                    style={{ borderBottom: "1px solid #f5f5f3", cursor: "pointer", background: isSelected ? "#eff6ff" : "transparent", borderLeft: isSelected ? "3px solid #2563EB" : "3px solid transparent", transition: "background 0.1s" }}
                                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#fafaf8"; }}
                                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                                                    <td style={{ padding: "12px 16px" }}>
                                                        <input type="checkbox" checked={isSelected} onChange={() => selectOrder(order)} style={{ cursor: "pointer", accentColor: "#2563EB" }} />
                                                    </td>
                                                    <td style={{ padding: "12px 12px", fontWeight: 600, color: "#2563EB", fontFamily: "monospace", fontSize: 12 }}>
                                                        {order.order_number || `#${String(order.id).padStart(4, "0")}`}
                                                    </td>
                                                    <td style={{ padding: "12px 12px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>
                                                                {getInitials(order.customer_name)}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 500, fontSize: 13, color: "#1a1a1a" }}>{order.customer_name || "Unknown"}</div>
                                                                <div style={{ fontSize: 11, color: "#aaa" }}>{order.customer_email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "12px 12px", fontSize: 12, color: "#888" }}>{formatDate(order.created_at)}</td>
                                                    <td style={{ padding: "12px 12px", fontWeight: 600, color: "#1a1a1a" }}>
                                                        ${Number(order.total_amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td style={{ padding: "12px 12px" }}>
                                                        <div style={{ fontSize: 11, color: "#555", textTransform: "capitalize" }}>{order.payment_method}</div>
                                                        <div style={{ fontSize: 10, color: order.payment_status === "paid" ? "#15803d" : "#a16207", fontWeight: 500 }}>{order.payment_status}</div>
                                                    </td>
                                                    <td style={{ padding: "12px 12px" }}>
                                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: style.bg, color: style.color, fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 20 }}>
                                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: style.dot }} />
                                                            {style.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        <div style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, color: "#888" }}>
                                Showing {filtered.length === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of <strong>{filtered.length}</strong>
                            </span>
                            <div style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                    style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #ebebeb", background: "white", fontSize: 12, cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "#ccc" : "#555" }}>Prev</button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                                    <button key={n} onClick={() => setPage(n)}
                                        style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid", borderColor: page === n ? "#2563EB" : "#ebebeb", background: page === n ? "#2563EB" : "white", color: page === n ? "white" : "#555", fontSize: 12, cursor: "pointer", fontWeight: page === n ? 700 : 400 }}>{n}</button>
                                ))}
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #ebebeb", background: "white", fontSize: 12, cursor: page === totalPages ? "not-allowed" : "pointer", color: page === totalPages ? "#ccc" : "#555" }}>Next</button>
                            </div>
                        </div>
                    </div>

                    {/* Detail panel */}
                    {(detail || detailLoading) && (
                        <div style={{ width: 300, minWidth: 300, background: "white", border: "1px solid #ebebeb", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Order Details</div>
                                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                                        {detail?.order_number || `#${String(detail?.id || "").padStart(4, "0")}`} · {formatDate(detail?.created_at)}
                                    </div>
                                </div>
                                <button onClick={() => { setDetail(null); setSelectedId(null); }}
                                    style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ebebeb", background: "white", cursor: "pointer", fontSize: 16, color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                            </div>

                            {detailLoading ? (
                                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div className="spinner-border" style={{ color: "#2563EB" }} />
                                </div>
                            ) : detail && (
                                <div style={{ overflowY: "auto", flex: 1, padding: "14px 16px" }}>

                                    {/* Customer */}
                                    <div style={{ marginBottom: 14 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Customer</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: AVATAR_COLORS[detail.id % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
                                                {getInitials(detail.customer_name)}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{detail.customer_name || "Unknown"}</div>
                                                <div style={{ fontSize: 11, color: "#888" }}>{detail.customer_email}</div>
                                            </div>
                                        </div>
                                        {detail.customer_phone && (
                                            <div style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 6 }}>
                                                <i className="bi bi-telephone" style={{ color: "#aaa" }} /> {detail.customer_phone}
                                            </div>
                                        )}
                                    </div>

                                    {/* Shipping */}
                                    {detail.shipping_address && (
                                        <div style={{ marginBottom: 14 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Shipping Address</div>
                                            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, display: "flex", gap: 6 }}>
                                                <i className="bi bi-geo-alt" style={{ color: "#aaa", flexShrink: 0 }} />
                                                {detail.shipping_address}
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment */}
                                    <div style={{ marginBottom: 14, background: "#f8f8f6", borderRadius: 8, padding: "10px 12px" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Payment</div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                                            <span style={{ color: "#888" }}>Method</span>
                                            <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{detail.payment_method}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
                                            <span style={{ color: "#888" }}>Status</span>
                                            <span style={{ fontWeight: 500, color: detail.payment_status === "paid" ? "#15803d" : "#a16207", textTransform: "capitalize" }}>{detail.payment_status}</span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div style={{ marginBottom: 14 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Order Status</div>
                                        {(() => {
                                            const s = ss(detail.status); return (
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20 }}>
                                                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />{s.label}
                                                </span>
                                            );
                                        })()}
                                        {updateMsg && <div style={{ marginTop: 6, fontSize: 12, color: updateMsg.includes("✓") ? "#15803d" : "#b91c1c" }}>{updateMsg}</div>}
                                    </div>

                                    {/* Items */}
                                    {detail.items && detail.items.length > 0 && (
                                        <div style={{ marginBottom: 14 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                                                Items ({detail.items.length})
                                            </div>
                                            {detail.items.map((item, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f5f5f3" }}>
                                                    <div style={{ width: 36, height: 36, background: "#f0f0f0", borderRadius: 6, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        {item.product_image
                                                            ? <img src={item.product_image} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
                                                            : <i className="bi bi-cpu" style={{ fontSize: 16, color: "#aaa" }} />
                                                        }
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product_name}</div>
                                                        <div style={{ fontSize: 11, color: "#aaa" }}>Qty: {item.quantity} × ${Number(item.unit_price).toLocaleString()}</div>
                                                    </div>
                                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", flexShrink: 0 }}>
                                                        ${Number(item.subtotal).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Total */}
                                    <div style={{ background: "#f8f8f6", borderRadius: 8, padding: 12 }}>
                                        {detail.notes && (
                                            <div style={{ fontSize: 12, color: "#888", marginBottom: 8, fontStyle: "italic" }}>
                                                <i className="bi bi-chat-left-text me-1" />{detail.notes}
                                            </div>
                                        )}
                                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ebebeb", paddingTop: 8 }}>
                                            <span style={{ fontWeight: 700, color: "#1a1a1a" }}>Total</span>
                                            <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14 }}>
                                                ${Number(detail.total_amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            {detail && (
                                <div style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
                                    <button onClick={handleCancel}
                                        disabled={updating || ["cancelled", "delivered"].includes(detail.status)}
                                        style={{ flex: 1, padding: "8px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: updating || ["cancelled", "delivered"].includes(detail.status) ? "not-allowed" : "pointer", color: "#555", opacity: ["cancelled", "delivered"].includes(detail.status) ? 0.5 : 1 }}>
                                        Cancel
                                    </button>
                                    <button onClick={() => setSSM(true)} disabled={updating}
                                        style={{ flex: 1, padding: "8px", background: "#2563EB", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: updating ? "not-allowed" : "pointer", color: "white" }}>
                                        Update Status
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Update Status Modal */}
            {showStatusModal && detail && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                    <div style={{ background: "white", borderRadius: 14, width: "100%", maxWidth: 380, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                        <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Update Order Status</h5>
                        <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>{detail.order_number}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                            {["pending", "processing", "delivered", "cancelled"].map(s => {
                                const style = ss(s);
                                return (
                                    <label key={s} onClick={() => setNewStatus(s)}
                                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "1px solid", borderColor: newStatus === s ? "#2563EB" : "#ebebeb", cursor: "pointer", background: newStatus === s ? "#eff6ff" : "white" }}>
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: style.dot, flexShrink: 0 }} />
                                        <span style={{ fontSize: 13, fontWeight: newStatus === s ? 600 : 400, color: newStatus === s ? "#2563EB" : "#333", textTransform: "capitalize" }}>{style.label}</span>
                                        {newStatus === s && <i className="bi bi-check-circle-fill ms-auto" style={{ color: "#2563EB" }} />}
                                    </label>
                                );
                            })}
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setSSM(false)} style={{ flex: 1, padding: "9px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                            <button onClick={handleUpdateStatus} disabled={updating}
                                style={{ flex: 1, padding: "9px", background: updating ? "#93c5fd" : "#2563EB", border: "none", borderRadius: 8, fontSize: 13, color: "white", cursor: updating ? "not-allowed" : "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                {updating ? <><span className="spinner-border spinner-border-sm" />Saving...</> : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}