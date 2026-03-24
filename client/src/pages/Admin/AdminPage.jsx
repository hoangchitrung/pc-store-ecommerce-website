import { useState } from "react";
import { AdminLayout } from "./Adminlayout";

const TOP_PRODUCTS = [
  { name: "GeForce RTX 4090",      category: "GPU",     price: "$1,599", stock: 45,  max: 100, color: "#3b82f6" },
  { name: "Intel Core i9-13900K",  category: "CPU",     price: "$589",   stock: 12,  max: 100, color: "#f59e0b" },
  { name: "Samsung 990 PRO ...",   category: "Storage", price: "$169",   stock: 150, max: 200, color: "#22c55e" },
  { name: "Corsair Dominator ...", category: "Memory",  price: "$189",   stock: 89,  max: 150, color: "#3b82f6" },
];

const RECENT_ORDERS = [
  { id: "#ORD-4821", customer: "James Wilson",  product: "RTX 4090",        date: "Oct 24, 2023", amount: "$1,599", status: "Completed"  },
  { id: "#ORD-4820", customer: "Sarah Chen",    product: "i9-13900K",       date: "Oct 24, 2023", amount: "$589",   status: "Processing" },
  { id: "#ORD-4819", customer: "Mike Johnson",  product: "Samsung 990 Pro", date: "Oct 23, 2023", amount: "$169",   status: "Pending"    },
  { id: "#ORD-4818", customer: "Emma Davis",    product: "Corsair DDR5",    date: "Oct 23, 2023", amount: "$189",   status: "Completed"  },
  { id: "#ORD-4817", customer: "Alex Turner",   product: "RTX 4090",        date: "Oct 22, 2023", amount: "$1,599", status: "Cancelled"  },
  { id: "#ORD-4816", customer: "Lisa Park",     product: "Ryzen 9 7950X",   date: "Oct 22, 2023", amount: "$699",   status: "Completed"  },
];

const STATUS_STYLE = {
  Completed:  { bg: "#dcfce7", color: "#15803d" },
  Processing: { bg: "#fff7ed", color: "#c2410c" },
  Pending:    { bg: "#fef9c3", color: "#a16207" },
  Cancelled:  { bg: "#fee2e2", color: "#b91c1c" },
};

export function AdminPage() {
  const [search, setSearch] = useState("");

  return (
    <AdminLayout>
      {/* Topbar */}
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

      {/* Content */}
      <div style={{ padding: "24px", flex: 1 }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0, letterSpacing: "-0.3px" }}>Dashboard Overview</h4>
            <p style={{ fontSize: 13, color: "#888", marginTop: 3, marginBottom: 0 }}>Real-time metrics for your PC component store.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 12, color: "#555", background: "white" }}>
            <i className="bi bi-calendar3" style={{ fontSize: 13, color: "#2563EB" }} />
            Oct 24, 2023 — Today
            <i className="bi bi-chevron-down" style={{ fontSize: 11 }} />
          </div>
        </div>

        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 18 }}>
          {[
            { label: "Total Revenue",    value: "$124,592", sub: "+$14,200 from last month",     change: "+12.5%", up: true,  iconBg: "#eaf3de", iconColor: "#3b6d11", icon: "bi-currency-dollar" },
            { label: "Total Orders",     value: "1,450",    sub: "+120 orders from last month",  change: "+5.2%",  up: true,  iconBg: "#eff6ff", iconColor: "#2563EB", icon: "bi-bag" },
            { label: "Active Users",     value: "8,902",    sub: "Active in the last 30 days",   change: "-2.1%",  up: false, iconBg: "#f3e8ff", iconColor: "#7c3aed", icon: "bi-people" },
            { label: "Low Stock Alerts", value: "12",       sub: "Items below safety threshold", change: "Action Needed", warn: true, iconBg: "#fef9c3", iconColor: "#a16207", icon: "bi-exclamation-triangle" },
          ].map((card) => (
            <div key={card.label} style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`bi ${card.icon}`} style={{ fontSize: 16, color: card.iconColor }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: card.warn ? "#a16207" : card.up ? "#16a34a" : "#dc2626" }}>
                  {card.warn ? card.change : (card.up ? "↑ " : "↓ ") + card.change}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>{card.value}</div>
              <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: 14, marginBottom: 18 }}>

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
                    style={{ borderBottom: "1px solid #f5f5f3" }}>
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

          {/* Top Products */}
          <div style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Top Products</span>
              <a href="/admin/product" style={{ fontSize: 12, color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>View All</a>
            </div>
            {TOP_PRODUCTS.map((p) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f5f5f3" }}>
                <div style={{ width: 38, height: 38, background: "#f5f5f3", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="bi bi-cpu" style={{ fontSize: 18, color: "#888" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{p.category}</div>
                  <div style={{ height: 3, background: "#f0f0f0", borderRadius: 2, marginTop: 4 }}>
                    <div style={{ height: "100%", width: `${(p.stock / p.max) * 100}%`, background: p.color, borderRadius: 2 }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{p.price}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{p.stock} left</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}