import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
    { label: "Dashboard", icon: "bi-grid-1x2-fill", path: "/admin" },
    { label: "Orders", icon: "bi-cart3", path: "/admin/orders", badge: 12 },
    { label: "Products", icon: "bi-box-seam", path: "/admin/product" },
    { label: "Inventory", icon: "bi-clipboard-data", path: "/admin/inventory" },
    { label: "Customers", icon: "bi-people", path: "/admin/customers" },

];

const SYS_ITEMS = [
    { label: "Settings", icon: "bi-gear" },
    { label: "Support", icon: "bi-headset" },
];

export function AdminLayout({ children }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isActive = (path) =>
        path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        navigate("/signin");
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f8f8f6", overflow: "hidden" }}>
{ /* Sidebar */ }
            <aside style={{ width: 210, minWidth: 210, background: "white", borderRight: "1px solid #ebebeb", display: "flex", flexDirection: "column" }}>

                {/* Logo */}
                <a href="/admin" style={{ textDecoration: "none", padding: "18px 16px 14px", display: "flex", alignItems: "center", gap: 9, borderBottom: "1px solid #ebebeb" }}>
                    <div style={{ width: 30, height: 30, background: "#2563EB", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>T</span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>TechForge</span>
                </a>

                {/* Nav */}
                <nav style={{ padding: "12px 10px 8px", flex: 1, overflowY: "auto" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>Main Menu</p>
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <a key={item.label} href={item.path} style={{
                                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px",
                                borderRadius: 8, fontSize: 13, marginBottom: 2, textDecoration: "none",
                                background: active ? "#eff6ff" : "transparent",
                                color: active ? "#2563EB" : "#555",
                                fontWeight: active ? 600 : 400, transition: "background 0.12s",
                            }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f5f5f3"; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                            >
                                <i className={`bi ${item.icon}`} style={{ fontSize: 15, width: 18, flexShrink: 0 }} />
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {item.badge && (
                                    <span style={{ background: "#ef4444", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 7px" }}>{item.badge}</span>
                                )}
                            </a>
                        );
                    })}

                    <p style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 8px 6px" }}>System</p>
                    {SYS_ITEMS.map((item) => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, fontSize: 13, color: "#555", marginBottom: 2, cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f5f5f3"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <i className={`bi ${item.icon}`} style={{ fontSize: 15, width: 18 }} />
                            {item.label}
                        </div>
                    ))}
                </nav>

                {/* User */}
                <div style={{ padding: "12px 10px", borderTop: "1px solid #ebebeb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>AU</div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>Admin User</div>
                            <div style={{ fontSize: 11, color: "#aaa" }}>admin@techforge.com</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ width: "100%", borderRadius: 8, border: "1px solid #ebebeb", background: "white", color: "#ef4444", padding: "8px 10px", fontWeight: 600, cursor: "pointer" }}
                    >
                        <i className="bi bi-box-arrow-right me-1" /> Logout
                    </button>
                </div>
            </aside>
{ /* Main content */ }
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 }}>
                {children}
            </div>
        </div>
    );
}