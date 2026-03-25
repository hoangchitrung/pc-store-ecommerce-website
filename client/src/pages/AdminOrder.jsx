import { useState } from "react";
import { AdminLayout } from "./Adminlayout";

const MOCK_ORDERS = [
  { id: "#ORD-7782", customer: "Alex Chen",    email: "alex.c@example.com", avatar: "AC", color: "#3b82f6",
    date: "Oct 24, 2023, 10:42 AM", total: 1499.00, status: "Processing",
    address: "123 Tech Boulevard, Suite 8B, San Francisco, CA 94107, United States",
    phone: "(555) 012-3456", totalOrders: 4,
    items: [
      { name: "NVIDIA GeForce RTX 4070 Ti", spec: "PNY • 12GB GDDR6X", price: 799.00 },
      { name: "Corsair Vengeance RGB 32GB",  spec: "DDR5 • 6000MHz",    price: 149.00 },
      { name: "Samsung 980 PRO 2TB",         spec: "NVMe M.2 SSD",      price: 169.00 },
    ],
    subtotal: 1117.00, shipping: 25.00, tax: 357.00,
  },
  { id: "#ORD-7781", customer: "John Smith",   email: "john.s@example.com",  avatar: "JS", color: "#6366f1",
    date: "Oct 23, 2023, 09:15 AM", total: 349.50,  status: "Shipped",
    address: "456 Oak Street, Austin, TX 78701, United States",
    phone: "(555) 987-6543", totalOrders: 2,
    items: [
      { name: "AMD Ryzen 5 7600X", spec: "6-Core Processor",  price: 229.00 },
      { name: "Cooler Master Hyper 212", spec: "CPU Cooler",   price: 120.50 },
    ],
    subtotal: 349.50, shipping: 0, tax: 0,
  },
  { id: "#ORD-7780", customer: "Emma Lee",     email: "emma.l@example.com",  avatar: "EL", color: "#ef4444",
    date: "Oct 23, 2023, 08:05 AM", total: 2100.00, status: "Delivered",
    address: "789 Pine Ave, New York, NY 10001, United States",
    phone: "(555) 246-8010", totalOrders: 7,
    items: [
      { name: "ASUS ROG Strix RTX 4080", spec: "16GB GDDR6X",      price: 1199.00 },
      { name: "Intel Core i7-13700K",    spec: "16-Core Processor", price: 409.00  },
      { name: "G.Skill Trident Z5 RGB",  spec: "32GB DDR5-6000",    price: 189.00  },
      { name: "Samsung 990 Pro 1TB",     spec: "PCIe 4.0 NVMe",     price: 109.00  },
    ],
    subtotal: 1906.00, shipping: 0, tax: 194.00,
  },
  { id: "#ORD-7779", customer: "Raj Jakhar",   email: "raj.j@example.com",   avatar: "RJ", color: "#10b981",
    date: "Oct 22, 2023, 14:30 PM", total: 89.99,  status: "Pending",
    address: "321 Maple Drive, Seattle, WA 98101, United States",
    phone: "(555) 135-7911", totalOrders: 1,
    items: [
      { name: "Arctic Freezer 34 eSports", spec: "CPU Air Cooler", price: 89.99 },
    ],
    subtotal: 89.99, shipping: 0, tax: 0,
  },
  { id: "#ORD-7778", customer: "Mia Wong",     email: "mia.w@example.com",   avatar: "MW", color: "#f59e0b",
    date: "Oct 22, 2023, 11:20 AM", total: 579.00, status: "Cancelled",
    address: "654 Elm Street, Chicago, IL 60601, United States",
    phone: "(555) 864-2097", totalOrders: 3,
    items: [
      { name: "MSI MAG B650 TOMAHAWK", spec: "AM5 Motherboard", price: 229.00 },
      { name: "Corsair RM750x",        spec: "750W 80+ Gold",   price: 124.99 },
      { name: "NZXT H7 Flow",          spec: "Mid-Tower Case",  price: 149.99 },
    ],
    subtotal: 503.98, shipping: 25.00, tax: 50.02,
  },
];

const STATUS_TABS  = ["All Orders", "Processing", "Shipped", "Delivered", "Returns"];
const STATUS_STYLE = {
  Processing: { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  Shipped:    { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  Delivered:  { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  Pending:    { bg: "#fef9c3", color: "#a16207", dot: "#eab308" },
  Cancelled:  { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
};

const PAGE_SIZE = 10;

export function AdminOrderPage() {
  const [orders]              = useState(MOCK_ORDERS);
  const [activeTab, setTab]   = useState("All Orders");
  const [selected, setSelected] = useState([MOCK_ORDERS[0].id]);
  const [detailOrder, setDetail] = useState(MOCK_ORDERS[0]);
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  const filtered = orders.filter((o) => {
    const matchTab    = activeTab === "All Orders" || o.status === activeTab;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                        o.customer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id, order) => {
    setSelected([id]);
    setDetail(order);
  };

  return (
    <AdminLayout>
      {/* Topbar */}
      <header style={{ background: "white", borderBottom: "1px solid #ebebeb", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <i className="bi bi-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13 }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search orders, customers..."
            style={{ width: "100%", padding: "7px 12px 7px 30px", background: "#f5f5f3", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none" }} />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", width: 34, height: 34, borderRadius: 8, border: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <i className="bi bi-bell" style={{ fontSize: 16, color: "#666" }} />
            <span style={{ width: 8, height: 8, background: "#ef4444", borderRadius: "50%", position: "absolute", top: 5, right: 5, border: "1.5px solid white" }} />
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0, letterSpacing: "-0.3px" }}>Order Management</h4>
          <p style={{ fontSize: 13, color: "#888", marginTop: 3, marginBottom: 0 }}>Track, manage, and fulfill customer orders.</p>
        </div>

        {/* Body: list + detail panel */}
        <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0 }}>

          {/* ── Order List ── */}
          <div style={{ flex: 1, background: "white", border: "1px solid #ebebeb", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

            {/* Status tabs */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {STATUS_TABS.map((tab) => {
                const active = activeTab === tab;
                return (
                  <button key={tab} onClick={() => { setTab(tab); setPage(1); }}
                    style={{
                      padding: "6px 14px", borderRadius: 6, border: "1px solid",
                      borderColor: active ? "#2563EB" : "#ebebeb",
                      background: active ? "#2563EB" : "white",
                      color: active ? "white" : "#555",
                      fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer",
                    }}>{tab}</button>
                );
              })}
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "white", border: "1px solid #ebebeb", borderRadius: 6, fontSize: 12, color: "#555", cursor: "pointer" }}>
                  <i className="bi bi-funnel" /> Filter
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "white", border: "1px solid #ebebeb", borderRadius: 6, fontSize: 12, color: "#555", cursor: "pointer" }}>
                  <i className="bi bi-download" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ position: "sticky", top: 0, background: "#fafaf8", zIndex: 1 }}>
                  <tr>
                    <th style={{ width: 40, padding: "10px 16px", borderBottom: "1px solid #f0f0f0" }} />
                    {["ORDER ID", "CUSTOMER", "DATE", "TOTAL", "STATUS"].map((h) => (
                      <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.05em", padding: "10px 12px", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((order) => {
                    const isSelected = selected.includes(order.id);
                    const ss = STATUS_STYLE[order.status] || STATUS_STYLE["Pending"];
                    return (
                      <tr key={order.id}
                        onClick={() => toggleSelect(order.id, order)}
                        style={{
                          borderBottom: "1px solid #f5f5f3", cursor: "pointer",
                          background: isSelected ? "#eff6ff" : "transparent",
                          borderLeft: isSelected ? "3px solid #2563EB" : "3px solid transparent",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#fafaf8"; }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(order.id, order)}
                            style={{ cursor: "pointer", accentColor: "#2563EB" }} />
                        </td>
                        <td style={{ padding: "12px 12px", fontWeight: 600, color: "#2563EB", fontFamily: "monospace", fontSize: 12 }}>{order.id}</td>
                        <td style={{ padding: "12px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: order.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>
                              {order.avatar}
                            </div>
                            <div>
                              <div style={{ fontWeight: 500, fontSize: 13, color: "#1a1a1a" }}>{order.customer}</div>
                              <div style={{ fontSize: 11, color: "#aaa" }}>{order.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 12px", fontSize: 12, color: "#888" }}>{order.date.split(",")[0]}</td>
                        <td style={{ padding: "12px 12px", fontWeight: 600, color: "#1a1a1a" }}>${order.total.toFixed(2)}</td>
                        <td style={{ padding: "12px 12px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 20 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ss.dot }} />
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#888" }}>
                Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of <strong>{filtered.length}</strong> orders
              </span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                  style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #ebebeb", background: "white", fontSize: 12, cursor: page===1 ? "not-allowed" : "pointer", color: page===1 ? "#ccc" : "#555" }}>
                  Prev
                </button>
                {[1,2,3].map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid", borderColor: page===n ? "#2563EB" : "#ebebeb", background: page===n ? "#2563EB" : "white", color: page===n ? "white" : "#555", fontSize: 12, cursor: "pointer", fontWeight: page===n ? 700 : 400 }}>
                    {n}
                  </button>
                ))}
                <span style={{ fontSize: 12, color: "#aaa" }}>...</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                  style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #ebebeb", background: "white", fontSize: 12, cursor: page===totalPages ? "not-allowed" : "pointer", color: page===totalPages ? "#ccc" : "#555" }}>
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* ── Order Detail Panel ── */}
          {detailOrder && (
            <div style={{ width: 300, minWidth: 300, background: "white", border: "1px solid #ebebeb", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Detail header */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Order Details</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{detailOrder.id} · {detailOrder.date}</div>
                </div>
                <button onClick={() => setDetail(null)}
                  style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #ebebeb", background: "white", cursor: "pointer", fontSize: 14, color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ×
                </button>
              </div>

              <div style={{ overflowY: "auto", flex: 1, padding: "14px 16px" }}>

                {/* Customer */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase" }}>Customer</span>
                    <a href="#" style={{ fontSize: 11, color: "#2563EB", textDecoration: "none" }}>View Profile</a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: detailOrder.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
                      {detailOrder.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{detailOrder.customer}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{detailOrder.totalOrders} orders total</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, color: "#555", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <i className="bi bi-envelope" style={{ color: "#aaa", fontSize: 12 }} />
                      {detailOrder.email}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <i className="bi bi-telephone" style={{ color: "#aaa", fontSize: 12 }} />
                      {detailOrder.phone}
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Shipping Address</div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                    <i className="bi bi-geo-alt" style={{ color: "#aaa", fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                    <span>{detailOrder.address}</span>
                  </div>
                  {/* Map placeholder */}
                  <div style={{ marginTop: 10, height: 80, background: "#f0f4f8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ebebeb" }}>
                    <div style={{ textAlign: "center" }}>
                      <i className="bi bi-map" style={{ fontSize: 24, color: "#94a3b8" }} />
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{detailOrder.address.split(",").slice(-2).join(",").trim()}</div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                    Items ({detailOrder.items.length})
                  </div>
                  {detailOrder.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f5f5f3" }}>
                      <div style={{ width: 36, height: 36, background: "#f0f0f0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className="bi bi-cpu" style={{ fontSize: 16, color: "#888" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>{item.spec}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", flexShrink: 0 }}>${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ background: "#fafaf8", borderRadius: 8, padding: "12px", fontSize: 13 }}>
                  {[
                    { label: "Subtotal", value: detailOrder.subtotal },
                    { label: "Shipping", value: detailOrder.shipping },
                    { label: "Tax",      value: detailOrder.tax      },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#888", fontSize: 12 }}>{row.label}</span>
                      <span style={{ color: "#1a1a1a", fontWeight: 500 }}>${row.value.toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ebebeb", paddingTop: 8, marginTop: 4 }}>
                    <span style={{ fontWeight: 700, color: "#1a1a1a" }}>Total</span>
                    <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14 }}>${detailOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
                <button style={{ flex: 1, padding: "8px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", color: "#555" }}>
                  Cancel Order
                </button>
                <button style={{ flex: 1, padding: "8px", background: "#2563EB", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "white" }}>
                  Update Status
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}