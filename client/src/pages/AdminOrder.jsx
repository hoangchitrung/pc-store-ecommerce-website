import { useState, useEffect } from "react";
import { AdminLayout } from "./Adminlayout";
import { getOrders, getOrderById, updateOrderStatus, cancelOrder } from "../api/Orderapi";

const STATUS_TABS = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_STYLE = {
  pending:    { bg: "#fef9c3", color: "#a16207", dot: "#eab308" },
  processing: { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  shipped:    { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  delivered:  { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  cancelled:  { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
};

const AVATAR_COLORS = ["#3b82f6", "#6366f1", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
const PAGE_SIZE = 10;

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

function formatStatusLabel(status) {
  const s = normalizeStatus(status);
  if (!s) return "Unknown";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getInitials(name) {
  if (!name || typeof name !== "string") return "N/A";

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "N/A";

  return parts
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchOrders = () => {
    setLoading(true);
    setError("");

    getOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const selectOrder = async (order) => {
    if (!order) return;

    setSelectedId(order.id);
    setDetail(null);
    setUpdateMsg("");
    setDetailLoading(true);

    try {
      const data = await getOrderById(order.id);
      setDetail(data);
      setNewStatus(normalizeStatus(data?.status));
    } catch {
      setDetail(order);
      setNewStatus(normalizeStatus(order?.status));
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const orderStatus = normalizeStatus(o.status);
    const tabMatch = activeTab === "all" || orderStatus === activeTab;

    const idText = String(o.id ?? "");
    const orderNumberText = String(o.order_number ?? "");
    const customerNameText = String(o.customer_name ?? "").toLowerCase();
    const customerEmailText = String(o.customer_email ?? "").toLowerCase();
    const searchText = search.toLowerCase();

    const searchMatch =
      idText.includes(search) ||
      orderNumberText.toLowerCase().includes(searchText) ||
      customerNameText.includes(searchText) ||
      customerEmailText.includes(searchText);

    return tabMatch && searchMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingCount = orders.filter((o) => {
    const s = normalizeStatus(o.status);
    return s === "pending" || s === "processing";
  }).length;
  const deliveredCount = orders.filter((o) => normalizeStatus(o.status) === "delivered").length;

  const handleUpdateStatus = async () => {
    if (!detail || !newStatus) return;

    setUpdating(true);
    setUpdateMsg("");

    try {
      await updateOrderStatus(detail.id, newStatus);
      setUpdateMsg("Status updated!");
      setShowStatusModal(false);
      fetchOrders();

      const updated = await getOrderById(detail.id);
      setDetail(updated);
      setNewStatus(normalizeStatus(updated?.status));
    } catch (err) {
      setUpdateMsg(err?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!detail) return;
    if (!window.confirm("Cancel this order?")) return;

    setUpdating(true);
    try {
      await cancelOrder(detail.id);
      fetchOrders();

      const updated = await getOrderById(detail.id);
      setDetail(updated);
      setNewStatus(normalizeStatus(updated?.status));
    } catch (err) {
      alert(err?.message || "Cancel failed");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout>
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #ebebeb",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <i
            className="bi bi-search"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa",
              fontSize: 13,
            }}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search order ID, customer..."
            style={{
              width: "100%",
              padding: "7px 12px 7px 30px",
              background: "#f5f5f3",
              border: "1px solid #ebebeb",
              borderRadius: 8,
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={fetchOrders}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              background: "white",
              border: "1px solid #ebebeb",
              borderRadius: 8,
              fontSize: 12,
              color: "#555",
              cursor: "pointer",
            }}
          >
            <i className="bi bi-arrow-clockwise" /> Refresh
          </button>

          <div
            style={{
              position: "relative",
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid #ebebeb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <i className="bi bi-bell" style={{ fontSize: 16, color: "#666" }} />
            <span
              style={{
                width: 8,
                height: 8,
                background: "#ef4444",
                borderRadius: "50%",
                position: "absolute",
                top: 5,
                right: 5,
                border: "1.5px solid white",
              }}
            />
          </div>
        </div>
      </header>

      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
            Order Management
          </h4>
          <p style={{ fontSize: 13, color: "#888", marginTop: 3, marginBottom: 0 }}>
            Track, manage, and fulfill customer orders.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "TOTAL ORDERS",
              value: loading ? "—" : totalOrders,
              icon: "bi-cart3",
              iconBg: "#eff6ff",
              iconColor: "#2563EB",
            },
            {
              label: "TOTAL REVENUE",
              value: loading ? "—" : `$${totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
              icon: "bi-currency-dollar",
              iconBg: "#eaf3de",
              iconColor: "#3b6d11",
            },
            {
              label: "PENDING",
              value: loading ? "—" : pendingCount,
              icon: "bi-hourglass",
              iconBg: "#fef9c3",
              iconColor: "#a16207",
            },
            {
              label: "DELIVERED",
              value: loading ? "—" : deliveredCount,
              icon: "bi-check-circle",
              iconBg: "#dcfce7",
              iconColor: "#15803d",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "white",
                border: "1px solid #ebebeb",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: s.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i className={`bi ${s.icon}`} style={{ fontSize: 18, color: s.iconColor }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#aaa",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, flex: 1, minHeight: 0 }}>
          <div
            style={{
              flex: 1,
              background: "white",
              border: "1px solid #ebebeb",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              {STATUS_TABS.map((tab) => {
                const active = activeTab === tab.value;

                return (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setActiveTab(tab.value);
                      setPage(1);
                    }}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: "1px solid",
                      borderColor: active ? "#2563EB" : "#ebebeb",
                      background: active ? "#2563EB" : "white",
                      color: active ? "white" : "#555",
                      fontSize: 12,
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {error && (
              <div style={{ padding: "10px 16px", background: "#fee2e2", color: "#b91c1c", fontSize: 13 }}>
                <i className="bi bi-exclamation-triangle-fill me-2" />
                {error}
              </div>
            )}

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
                      {["ORDER ID", "CUSTOMER", "DATE", "TOTAL", "STATUS"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#aaa",
                            letterSpacing: "0.05em",
                            padding: "10px 12px",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: "center",
                            padding: "40px 0",
                            color: "#888",
                            fontSize: 13,
                          }}
                        >
                          <i
                            className="bi bi-inbox"
                            style={{ fontSize: 32, display: "block", marginBottom: 8, color: "#ddd" }}
                          />
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      paginated.map((order) => {
                        const isSelected = selectedId === order.id;
                        const orderStatus = normalizeStatus(order.status);
                        const ss = STATUS_STYLE[orderStatus] || STATUS_STYLE.pending;
                        const avatarColor =
                          AVATAR_COLORS[Math.abs(Number(order.id) || 0) % AVATAR_COLORS.length];

                        return (
                          <tr
                            key={order.id}
                            onClick={() => selectOrder(order)}
                            style={{
                              borderBottom: "1px solid #f5f5f3",
                              cursor: "pointer",
                              background: isSelected ? "#eff6ff" : "transparent",
                              borderLeft: isSelected ? "3px solid #2563EB" : "3px solid transparent",
                              transition: "background 0.1s",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.background = "#fafaf8";
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <td style={{ padding: "12px 16px" }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => selectOrder(order)}
                                style={{ cursor: "pointer", accentColor: "#2563EB" }}
                              />
                            </td>

                            <td
                              style={{
                                padding: "12px 12px",
                                fontWeight: 600,
                                color: "#2563EB",
                                fontFamily: "monospace",
                                fontSize: 12,
                              }}
                            >
                              #{String(order.id).padStart(4, "0")}
                            </td>

                            <td style={{ padding: "12px 12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    background: avatarColor,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "white",
                                    flexShrink: 0,
                                  }}
                                >
                                  {getInitials(order.customer_name || order.customer_email || "Unknown")}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 500, fontSize: 13, color: "#1a1a1a" }}>
                                    {order.customer_name || "Unknown"}
                                  </div>
                                  <div style={{ fontSize: 11, color: "#aaa" }}>
                                    {order.customer_email || "—"}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: "12px 12px", fontSize: 12, color: "#888" }}>
                              {formatDate(order.created_at)}
                            </td>

                            <td style={{ padding: "12px 12px", fontWeight: 600, color: "#1a1a1a" }}>
                              ${Number(order.total_amount || 0).toFixed(2)}
                            </td>

                            <td style={{ padding: "12px 12px" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  background: ss.bg,
                                  color: ss.color,
                                  fontSize: 11,
                                  fontWeight: 500,
                                  padding: "4px 10px",
                                  borderRadius: 20,
                                  textTransform: "capitalize",
                                }}
                              >
                                <span
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: ss.dot,
                                  }}
                                />
                                {formatStatusLabel(order.status)}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 12, color: "#888" }}>
                Showing{" "}
                {filtered.length === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of <strong>{filtered.length}</strong>
              </span>

              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1px solid #ebebeb",
                    background: "white",
                    fontSize: 12,
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    color: page === 1 ? "#ccc" : "#555",
                  }}
                >
                  Prev
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: "1px solid",
                      borderColor: page === n ? "#2563EB" : "#ebebeb",
                      background: page === n ? "#2563EB" : "white",
                      color: page === n ? "white" : "#555",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: page === n ? 700 : 400,
                    }}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1px solid #ebebeb",
                    background: "white",
                    fontSize: 12,
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    color: page === totalPages ? "#ccc" : "#555",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {(detail || detailLoading) && (
            <div
              style={{
                width: 300,
                minWidth: 300,
                background: "white",
                border: "1px solid #ebebeb",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>
                    Order Details
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                    #{detail ? String(detail.id).padStart(4, "0") : "—"} ·{" "}
                    {detail ? formatDate(detail.created_at) : ""}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDetail(null);
                    setSelectedId(null);
                  }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: "1px solid #ebebeb",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#888",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>

              {detailLoading ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="spinner-border" style={{ color: "#2563EB" }} />
                </div>
              ) : (
                detail && (
                  <div style={{ overflowY: "auto", flex: 1, padding: "14px 16px" }}>
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#bbb",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        Customer
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: AVATAR_COLORS[Math.abs(Number(detail.id) || 0) % AVATAR_COLORS.length],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(detail.customer_name || detail.customer_email || "Unknown")}
                        </div>

                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                            {detail.customer_name || "Unknown"}
                          </div>
                          <div style={{ fontSize: 11, color: "#888" }}>
                            {detail.customer_email || "—"}
                          </div>
                        </div>
                      </div>

                      {detail.customer_phone && (
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 12,
                            color: "#555",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <i className="bi bi-telephone" style={{ color: "#aaa" }} />
                          {detail.customer_phone}
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#bbb",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        Status
                      </div>

                      {(() => {
                        const ss = STATUS_STYLE[normalizeStatus(detail.status)] || STATUS_STYLE.pending;
                        return (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              background: ss.bg,
                              color: ss.color,
                              fontSize: 12,
                              fontWeight: 600,
                              padding: "5px 12px",
                              borderRadius: 20,
                              textTransform: "capitalize",
                            }}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: ss.dot,
                              }}
                            />
                            {formatStatusLabel(detail.status)}
                          </span>
                        );
                      })()}

                      {updateMsg && (
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 12,
                            color: updateMsg.toLowerCase().includes("updated") ? "#15803d" : "#b91c1c",
                          }}
                        >
                          {updateMsg}
                        </div>
                      )}
                    </div>

                    {detail.items && detail.items.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#bbb",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          Items ({detail.items.length})
                        </div>

                        {detail.items.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "8px 0",
                              borderBottom: "1px solid #f5f5f3",
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                background: "#f0f0f0",
                                borderRadius: 6,
                                overflow: "hidden",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name || "Product"}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <i className="bi bi-cpu" style={{ fontSize: 16, color: "#aaa" }} />
                              )}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "#1a1a1a",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.product_name || "Unknown product"}
                              </div>
                              <div style={{ fontSize: 11, color: "#aaa" }}>Qty: {item.quantity}</div>
                            </div>

                            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", flexShrink: 0 }}>
                              ${Number(item.price || 0).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ background: "#fafaf8", borderRadius: 8, padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ebebeb", paddingTop: 8 }}>
                        <span style={{ fontWeight: 700, color: "#1a1a1a" }}>Total</span>
                        <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14 }}>
                          ${Number(detail.total_amount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}

              {detail && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderTop: "1px solid #f0f0f0",
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={handleCancel}
                    disabled={updating || ["cancelled", "delivered"].includes(normalizeStatus(detail.status))}
                    style={{
                      flex: 1,
                      padding: "8px",
                      background: "white",
                      border: "1px solid #ebebeb",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor:
                        updating || ["cancelled", "delivered"].includes(normalizeStatus(detail.status))
                          ? "not-allowed"
                          : "pointer",
                      color: "#555",
                      opacity: ["cancelled", "delivered"].includes(normalizeStatus(detail.status)) ? 0.5 : 1,
                    }}
                  >
                    Cancel Order
                  </button>

                  <button
                    onClick={() => {
                      setNewStatus(normalizeStatus(detail.status));
                      setShowStatusModal(true);
                    }}
                    disabled={updating}
                    style={{
                      flex: 1,
                      padding: "8px",
                      background: "#2563EB",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: updating ? "not-allowed" : "pointer",
                      color: "white",
                    }}
                  >
                    Update Status
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showStatusModal && detail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 14,
              width: "100%",
              maxWidth: 380,
              padding: 24,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Update Order Status</h5>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
              Order #{String(detail.id).padStart(4, "0")}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => {
                const ss = STATUS_STYLE[s];
                const active = newStatus === s;

                return (
                  <label
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: active ? "#2563EB" : "#ebebeb",
                      cursor: "pointer",
                      background: active ? "#eff6ff" : "white",
                    }}
                    onClick={() => setNewStatus(s)}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: ss.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#2563EB" : "#333" }}>
                      {formatStatusLabel(s)}
                    </span>
                    {active && <i className="bi bi-check-circle-fill ms-auto" style={{ color: "#2563EB" }} />}
                  </label>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{
                  flex: 1,
                  padding: "9px",
                  background: "white",
                  border: "1px solid #ebebeb",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                style={{
                  flex: 1,
                  padding: "9px",
                  background: updating ? "#93c5fd" : "#2563EB",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "white",
                  cursor: updating ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" /> Saving...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}