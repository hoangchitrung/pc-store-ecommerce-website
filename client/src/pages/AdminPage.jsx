import { useState, useEffect } from "react";
import { AdminLayout } from "./Adminlayout";
import { getProducts } from "../api/productApi";

const STATUS_STYLE = {
  Completed:  { bg: "#dcfce7", color: "#15803d" },
  Processing: { bg: "#fff7ed", color: "#c2410c" },
  Pending:    { bg: "#fef9c3", color: "#a16207" },
  Cancelled:  { bg: "#fee2e2", color: "#b91c1c" },
};

// Mock orders (chưa có order API)
const RECENT_ORDERS = [
  { id: "#ORD-4821", customer: "James Wilson",  product: "RTX 4090",        date: "Oct 24, 2023", amount: "$1,599", status: "Completed"  },
  { id: "#ORD-4820", customer: "Sarah Chen",    product: "i9-13900K",       date: "Oct 24, 2023", amount: "$589",   status: "Processing" },
  { id: "#ORD-4819", customer: "Mike Johnson",  product: "Samsung 990 Pro", date: "Oct 23, 2023", amount: "$169",   status: "Pending"    },
  { id: "#ORD-4818", customer: "Emma Davis",    product: "Corsair DDR5",    date: "Oct 23, 2023", amount: "$189",   status: "Completed"  },
  { id: "#ORD-4817", customer: "Alex Turner",   product: "RTX 4090",        date: "Oct 22, 2023", amount: "$1,599", status: "Cancelled"  },
];

export function AdminPage() {
  const [search, setSearch]       = useState("");
  const [products, setProducts]   = useState([]);
  const [loadingProd, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Stats từ dữ liệu thật ──────────────────────────────
  const totalProducts  = products.length;
  const totalRevenue   = products.reduce((sum, p) => sum + Number(p.price || 0), 0);
  const lowStockCount  = products.filter((p) => p.stock_quantity <= 5).length;
  const outOfStock     = products.filter((p) => p.stock_quantity === 0).length;

  // Top 4 sản phẩm có stock cao nhất
  const topProducts = [...products]
    .sort((a, b) => b.stock_quantity - a.stock_quantity)
    .slice(0, 4);

  return (
    <AdminLayout>
      {/* ── Topbar ── */}
      <header style={{ background: "white", borderBottom: "1px solid #ebebeb", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 420 }}>
          <i className="bi bi-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13 }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders, products, or customers..."
            style={{ width: "100%", padding: "7px 12px 7px 30px", background: "#f5f5f3", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none" }} />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", width: 34, height: 34, borderRadius: 8, border: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <i className="bi bi-bell" style={{ fontSize: 16, color: "#666" }} />
            <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: "50%", position: "absolute", top: 5, right: 5, border: "1.5px solid white" }} />
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#f5f5f3", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 12, color: "#555", cursor: "pointer" }}>
            <i className="bi bi-download" style={{ fontSize: 13 }} /> Export Reports
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <div style={{ padding: "24px", flex: 1 }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Dashboard Overview</h4>
            <p style={{ fontSize: 13, color: "#888", marginTop: 3, marginBottom: 0 }}>Real-time metrics for your PC component store.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 12, color: "#555", background: "white" }}>
            <i className="bi bi-calendar3" style={{ fontSize: 13, color: "#2563EB" }} />
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — Today
            <i className="bi bi-chevron-down" style={{ fontSize: 11 }} />
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 18 }}>
          {[
            {
              label: "Total Products",
              value: loadingProd ? "—" : totalProducts.toLocaleString(),
              sub: `${outOfStock} out of stock`,
              change: loadingProd ? "..." : `${totalProducts} items`,
              iconBg: "#eff6ff", iconColor: "#2563EB", icon: "bi-box-seam", neutral: true,
            },
            {
              label: "Catalog Value",
              value: loadingProd ? "—" : `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
              sub: "Sum of all product prices",
              change: "+5.2%", up: true,
              iconBg: "#eaf3de", iconColor: "#3b6d11", icon: "bi-currency-dollar",
            },
            {
              label: "Low Stock Alerts",
              value: loadingProd ? "—" : lowStockCount,
              sub: "Items with stock ≤ 5",
              change: "Action Needed", warn: true,
              iconBg: "#fef9c3", iconColor: "#a16207", icon: "bi-exclamation-triangle",
            },
            {
              label: "Out of Stock",
              value: loadingProd ? "—" : outOfStock,
              sub: "Items need restocking",
              change: outOfStock > 0 ? "Urgent" : "All good", warn: outOfStock > 0,
              iconBg: "#fee2e2", iconColor: "#b91c1c", icon: "bi-x-circle",
            },
          ].map((card) => (
            <div key={card.label} style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`bi ${card.icon}`} style={{ fontSize: 16, color: card.iconColor }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: card.warn ? "#a16207" : card.up ? "#16a34a" : card.neutral ? "#2563EB" : "#dc2626" }}>
                  {card.warn || card.neutral ? card.change : (card.up ? "↑ " : "↓ ") + card.change}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
                {loadingProd ? (
                  <div style={{ width: 80, height: 28, background: "#f0f0f0", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
                ) : card.value}
              </div>
              <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Bottom row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 290px", gap: 14, marginBottom: 18 }}>

          {/* Recent Orders */}
          <div style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Recent Orders</span>
              <a href="/admin/orders" style={{ fontSize: 12, color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>View All</a>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr>
                  {["Order ID", "Customer", "Product", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0 8px 10px", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    style={{ borderBottom: "1px solid #f5f5f3", transition: "background 0.1s" }}>
                    <td style={{ padding: "10px 8px", fontFamily: "monospace", fontSize: 12, color: "#888" }}>{order.id}</td>
                    <td style={{ padding: "10px 8px", color: "#444" }}>{order.customer}</td>
                    <td style={{ padding: "10px 8px", color: "#1a1a1a", fontWeight: 500 }}>{order.product}</td>
                    <td style={{ padding: "10px 8px", color: "#aaa", fontSize: 12 }}>{order.date}</td>
                    <td style={{ padding: "10px 8px", color: "#1a1a1a", fontWeight: 600 }}>{order.amount}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <span style={{ display: "inline-block", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: STATUS_STYLE[order.status].bg, color: STATUS_STYLE[order.status].color }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Products — từ API thật */}
          <div style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Top Products</span>
              <a href="/admin/product" style={{ fontSize: 12, color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>View All</a>
            </div>

            {loadingProd ? (
              /* Skeleton */
              [...Array(4)].map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f5f5f3" }}>
                  <div style={{ width: 38, height: 38, background: "#f0f0f0", borderRadius: 8, flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 10, background: "#f0f0f0", borderRadius: 4, marginBottom: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, width: "60%", animation: "pulse 1.5s ease-in-out infinite" }} />
                  </div>
                </div>
              ))
            ) : topProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#aaa", fontSize: 13 }}>
                No products yet.
              </div>
            ) : (
              topProducts.map((p) => {
                const stockPct = Math.min((p.stock_quantity / 100) * 100, 100);
                const barColor = p.stock_quantity === 0 ? "#ef4444" : p.stock_quantity <= 5 ? "#f59e0b" : "#22c55e";
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f5f5f3" }}>
                    {/* Thumbnail */}
                    <div style={{ width: 38, height: 38, background: "#f5f5f3", borderRadius: 8, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
                      ) : (
                        <i className="bi bi-cpu" style={{ fontSize: 18, color: "#aaa" }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{p.category}</div>
                      <div style={{ height: 3, background: "#f0f0f0", borderRadius: 2, marginTop: 4 }}>
                        <div style={{ height: "100%", width: `${stockPct}%`, background: barColor, borderRadius: 2, transition: "width 0.3s" }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>${Number(p.price).toFixed(2)}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{p.stock_quantity} left</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Quick links ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
          {[
            { label: "Manage Products", sub: `${totalProducts} products in catalog`, icon: "bi-box-seam", color: "#2563EB", href: "/admin/product" },
            { label: "View Orders",     sub: "Track & manage orders",               icon: "bi-cart3",    color: "#7c3aed", href: "/admin/orders"  },
            { label: "Customers",       sub: "Manage customer accounts",            icon: "bi-people",   color: "#10b981", href: "/admin/customers"},
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.transform = ""; }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: item.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`bi ${item.icon}`} style={{ fontSize: 20, color: item.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{item.sub}</div>
                </div>
                <i className="bi bi-arrow-right" style={{ marginLeft: "auto", color: "#ccc", fontSize: 14 }} />
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