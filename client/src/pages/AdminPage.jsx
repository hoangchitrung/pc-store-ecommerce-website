import { useState, useEffect } from "react";
import { AdminLayout } from "./Adminlayout";
import { getProducts } from "../api/productApi";
import { getOrders, getOrderById } from "../api/orderApi";

const STATUS_STYLE = {
    delivered: { bg: "#dcfce7", color: "#15803d" },
    processing: { bg: "#fff7ed", color: "#c2410c" },
    pending: { bg: "#fef9c3", color: "#a16207" },
    cancelled: { bg: "#fee2e2", color: "#b91c1c" },
};

function formatDate(value) {
    if (!value) return "—";
    try {
        return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return value;
    }
}

function formatMoney(value) {
    return `$${Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

function formatStatus(status = "") {
    if (!status) return "—";
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export function AdminPage() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingProd, setLoadingProd] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            setError("");
            setLoadingProd(true);
            setLoadingOrders(true);

            try {
                const [productData, orderData] = await Promise.all([
                    getProducts(),
                    getOrders(),
                ]);

                const productList = Array.isArray(productData) ? productData : [];
                const orderList = Array.isArray(orderData) ? orderData : [];

                setProducts(productList);
                setOrders(orderList);

                const latestOrders = [...orderList]
                    .sort(
                        (a, b) =>
                            new Date(b.created_at || 0).getTime() -
                            new Date(a.created_at || 0).getTime()
                    )
                    .slice(0, 5);

                const enrichedOrders = await Promise.all(
                    latestOrders.map(async (order) => {
                        try {
                            const detail = await getOrderById(order.id);
                            const firstItemName = detail?.items?.[0]?.product_name || "—";
                            return {
                                ...order,
                                product: firstItemName,
                            };
                        } catch {
                            return {
                                ...order,
                                product: "—",
                            };
                        }
                    })
                );

                setRecentOrders(enrichedOrders);
            } catch (err) {
                setError(err?.message || "Failed to load dashboard data.");
                setProducts([]);
                setOrders([]);
                setRecentOrders([]);
            } finally {
                setLoadingProd(false);
                setLoadingOrders(false);
            }
        };

        loadDashboard();
    }, []);

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
        (sum, o) => sum + Number(o.total_amount || 0),
        0
    );
    const pendingCount = orders.filter((o) => {
        const s = String(o.status || "").toLowerCase();
        return s === "pending" || s === "processing";
    }).length;
    const deliveredCount = orders.filter(
        (o) => String(o.status || "").toLowerCase() === "delivered"
    ).length;

    const lowStockCount = products.filter(
        (p) => Number(p.stock_quantity || 0) > 0 && Number(p.stock_quantity || 0) <= 5
    ).length;
    const outOfStock = products.filter(
        (p) => Number(p.stock_quantity || 0) === 0
    ).length;

    const topProducts = [...products]
        .sort(
            (a, b) =>
                Number(b.stock_quantity || 0) - Number(a.stock_quantity || 0)
        )
        .slice(0, 4);

    const filteredRecentOrders = recentOrders.filter((order) => {
        const q = search.toLowerCase();

        return (
            String(order.order_number || order.id).toLowerCase().includes(q) ||
            String(order.customer_name || "").toLowerCase().includes(q) ||
            String(order.customer_email || "").toLowerCase().includes(q) ||
            String(order.product || "").toLowerCase().includes(q) ||
            String(order.status || "").toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout>
            {/* Topbar */}
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
                <div style={{ position: "relative", flex: 1, maxWidth: 420 }}>
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
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search orders, products, or customers..."
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

                <div
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
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
                    <button
                        type="button"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 14px",
                            background: "#f5f5f3",
                            border: "1px solid #ebebeb",
                            borderRadius: 8,
                            fontSize: 12,
                            color: "#555",
                            cursor: "pointer",
                        }}
                    >
                        <i className="bi bi-download" style={{ fontSize: 13 }} /> Export Reports
                    </button>
                </div>
            </header>

            {/* Content */}
            <div style={{ padding: "24px", flex: 1 }}>
                {/* Page header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 20,
                    }}
                >
                    <div>
                        <h4
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: "#1a1a1a",
                                margin: 0,
                            }}
                        >
                            Dashboard Overview
                        </h4>
                        <p
                            style={{
                                fontSize: 13,
                                color: "#888",
                                marginTop: 3,
                                marginBottom: 0,
                            }}
                        >
                            Real-time metrics from products and orders.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 12px",
                            border: "1px solid #ebebeb",
                            borderRadius: 8,
                            fontSize: 12,
                            color: "#555",
                            background: "white",
                        }}
                    >
                        <i
                            className="bi bi-calendar3"
                            style={{ fontSize: 13, color: "#2563EB" }}
                        />
                        {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}{" "}
                        — Today
                        <i className="bi bi-chevron-down" style={{ fontSize: 11 }} />
                    </div>
                </div>

                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#b91c1c",
                            padding: "10px 12px",
                            borderRadius: 8,
                            marginBottom: 16,
                            fontSize: 13,
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Metric Cards */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0,1fr))",
                        gap: 12,
                        marginBottom: 18,
                    }}
                >
                    {[
                        {
                            label: "Total Products",
                            value: loadingProd ? "—" : totalProducts.toLocaleString(),
                            sub: `${lowStockCount} low stock | ${outOfStock} out of stock`,
                            change: loadingProd ? "..." : `${totalProducts} items`,
                            iconBg: "#eff6ff",
                            iconColor: "#2563EB",
                            icon: "bi-box-seam",
                            neutral: true,
                        },
                        {
                            label: "Total Orders",
                            value: loadingOrders ? "—" : totalOrders.toLocaleString(),
                            sub: `Delivered: ${deliveredCount}`,
                            change: loadingOrders ? "..." : `${totalOrders} orders`,
                            iconBg: "#eaf3de",
                            iconColor: "#3b6d11",
                            icon: "bi-cart3",
                            neutral: true,
                        },
                        {
                            label: "Revenue",
                            value: loadingOrders ? "—" : formatMoney(totalRevenue),
                            sub: "From all orders",
                            change: "+ orders",
                            iconBg: "#fef9c3",
                            iconColor: "#a16207",
                            icon: "bi-currency-dollar",
                            up: true,
                        },
                        {
                            label: "Pending Orders",
                            value: loadingOrders ? "—" : pendingCount.toLocaleString(),
                            sub: "Need attention",
                            change: loadingOrders ? "..." : `${pendingCount} pending`,
                            iconBg: "#fee2e2",
                            iconColor: "#b91c1c",
                            icon: "bi-hourglass",
                            warn: true,
                        },
                    ].map((card) => (
                        <div
                            key={card.label}
                            style={{
                                background: "white",
                                border: "1px solid #ebebeb",
                                borderRadius: 12,
                                padding: 16,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 10,
                                }}
                            >
                                <div
                                    style={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: 8,
                                        background: card.iconBg,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <i
                                        className={`bi ${card.icon}`}
                                        style={{ fontSize: 16, color: card.iconColor }}
                                    />
                                </div>
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: card.warn
                                            ? "#a16207"
                                            : card.up
                                                ? "#16a34a"
                                                : "#2563EB",
                                    }}
                                >
                                    {card.change}
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                                {card.label}
                            </div>
                            <div
                                style={{
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: "#1a1a1a",
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                {card.value}
                            </div>
                            <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>
                                {card.sub}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom row */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0,1fr) 290px",
                        gap: 14,
                        marginBottom: 18,
                    }}
                >
                    {/* Recent Orders */}
                    <div
                        style={{
                            background: "white",
                            border: "1px solid #ebebeb",
                            borderRadius: 12,
                            padding: 16,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 14,
                            }}
                        >
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                                Recent Orders
                            </span>
                            <a
                                href="/admin/orders"
                                style={{
                                    fontSize: 12,
                                    color: "#2563EB",
                                    textDecoration: "none",
                                    fontWeight: 500,
                                }}
                            >
                                View All
                            </a>
                        </div>

                        <table
                            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}
                        >
                            <thead>
                                <tr>
                                    {["Order ID", "Customer", "Product", "Date", "Amount", "Status"].map(
                                        (h) => (
                                            <th
                                                key={h}
                                                style={{
                                                    textAlign: "left",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: "#aaa",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.05em",
                                                    padding: "0 8px 10px",
                                                    borderBottom: "1px solid #f0f0f0",
                                                }}
                                            >
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {loadingOrders ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            style={{ textAlign: "center", padding: "28px 0", color: "#888" }}
                                        >
                                            <div className="spinner-border" role="status" />
                                            <div style={{ marginTop: 10 }}>Loading orders...</div>
                                        </td>
                                    </tr>
                                ) : filteredRecentOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            style={{ textAlign: "center", padding: "28px 0", color: "#aaa" }}
                                        >
                                            No recent orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecentOrders.map((order) => {
                                        const statusKey = String(order.status || "").toLowerCase();
                                        const style = STATUS_STYLE[statusKey] || STATUS_STYLE.pending;

                                        return (
                                            <tr
                                                key={order.id}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                style={{
                                                    borderBottom: "1px solid #f5f5f3",
                                                    transition: "background 0.1s",
                                                }}
                                            >
                                                <td
                                                    style={{
                                                        padding: "10px 8px",
                                                        fontFamily: "monospace",
                                                        fontSize: 12,
                                                        color: "#888",
                                                    }}
                                                >
                                                    {order.order_number || `#${order.id}`}
                                                </td>
                                                <td style={{ padding: "10px 8px", color: "#444" }}>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {order.customer_name || "Unknown"}
                                                    </div>
                                                    <div style={{ fontSize: 11, color: "#aaa" }}>
                                                        {order.customer_email || ""}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "10px 8px", color: "#1a1a1a", fontWeight: 500 }}>
                                                    {order.product || "—"}
                                                </td>
                                                <td style={{ padding: "10px 8px", color: "#aaa", fontSize: 12 }}>
                                                    {formatDate(order.created_at)}
                                                </td>
                                                <td style={{ padding: "10px 8px", color: "#1a1a1a", fontWeight: 600 }}>
                                                    {formatMoney(order.total_amount)}
                                                </td>
                                                <td style={{ padding: "10px 8px" }}>
                                                    <span
                                                        style={{
                                                            display: "inline-block",
                                                            fontSize: 11,
                                                            fontWeight: 500,
                                                            padding: "3px 10px",
                                                            borderRadius: 20,
                                                            background: style.bg,
                                                            color: style.color,
                                                        }}
                                                    >
                                                        {formatStatus(statusKey)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Top Products */}
                    <div
                        style={{
                            background: "white",
                            border: "1px solid #ebebeb",
                            borderRadius: 12,
                            padding: 14,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 12,
                            }}
                        >
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                                Top Products
                            </span>
                            <a
                                href="/admin/product"
                                style={{
                                    fontSize: 12,
                                    color: "#2563EB",
                                    textDecoration: "none",
                                    fontWeight: 500,
                                }}
                            >
                                View All
                            </a>
                        </div>

                        {loadingProd ? (
                            [...Array(4)].map((_, i) => (
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
                                            width: 38,
                                            height: 38,
                                            background: "#f0f0f0",
                                            borderRadius: 8,
                                            flexShrink: 0,
                                            animation: "pulse 1.5s ease-in-out infinite",
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                height: 10,
                                                background: "#f0f0f0",
                                                borderRadius: 4,
                                                marginBottom: 6,
                                                animation: "pulse 1.5s ease-in-out infinite",
                                            }}
                                        />
                                        <div
                                            style={{
                                                height: 8,
                                                background: "#f0f0f0",
                                                borderRadius: 4,
                                                width: "60%",
                                                animation: "pulse 1.5s ease-in-out infinite",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : topProducts.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "20px 0", color: "#aaa", fontSize: 13 }}>
                                No products yet.
                            </div>
                        ) : (
                            topProducts.map((p) => {
                                const stockQty = Number(p.stock_quantity || 0);
                                const stockPct = Math.min(stockQty, 100);
                                const barColor =
                                    stockQty === 0
                                        ? "#ef4444"
                                        : stockQty <= 5
                                            ? "#f59e0b"
                                            : "#22c55e";

                                return (
                                    <div
                                        key={p.id}
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
                                                width: 38,
                                                height: 38,
                                                background: "#f5f5f3",
                                                borderRadius: 8,
                                                overflow: "hidden",
                                                flexShrink: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {p.image_url ? (
                                                <img
                                                    src={p.image_url}
                                                    alt={p.name}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <i className="bi bi-cpu" style={{ fontSize: 18, color: "#aaa" }} />
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
                                                {p.name}
                                            </div>
                                            <div style={{ fontSize: 11, color: "#aaa" }}>{p.category}</div>
                                            <div
                                                style={{
                                                    height: 3,
                                                    background: "#f0f0f0",
                                                    borderRadius: 2,
                                                    marginTop: 4,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        height: "100%",
                                                        width: `${stockPct}%`,
                                                        background: barColor,
                                                        borderRadius: 2,
                                                        transition: "width 0.3s",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>
                                                {formatMoney(p.price)}
                                            </div>
                                            <div style={{ fontSize: 11, color: "#aaa" }}>{stockQty} left</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Quick links */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                        gap: 12,
                    }}
                >
                    {[
                        {
                            label: "Manage Products",
                            sub: `${totalProducts} products in catalog`,
                            icon: "bi-box-seam",
                            color: "#2563EB",
                            href: "/admin/product",
                        },
                        {
                            label: "View Orders",
                            sub: "Track & manage orders",
                            icon: "bi-cart3",
                            color: "#7c3aed",
                            href: "/admin/orders",
                        },
                        {
                            label: "Customers",
                            sub: "Manage customer accounts",
                            icon: "bi-people",
                            color: "#10b981",
                            href: "/admin/customers",
                        },
                    ].map((item) => (
                        <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                            <div
                                style={{
                                    background: "white",
                                    border: "1px solid #ebebeb",
                                    borderRadius: 12,
                                    padding: "16px 18px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = item.color;
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#ebebeb";
                                    e.currentTarget.style.transform = "";
                                }}
                            >
                                <div
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 10,
                                        background: item.color + "15",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <i className={`bi ${item.icon}`} style={{ fontSize: 20, color: item.color }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#888" }}>{item.sub}</div>
                                </div>
                                <i
                                    className="bi bi-arrow-right"
                                    style={{ marginLeft: "auto", color: "#ccc", fontSize: 14 }}
                                />
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
        </AdminLayout>
    );
}