import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// ── Mock Data ──────────────────────────────────────────────
const CATEGORIES = [
  { id: "cpu", label: "CPUs - Processors", icon: "bi-cpu", count: 124, sub: "Intel Core & AMD Ryzen" },
  { id: "motherboard", label: "Mainboards", icon: "bi-motherboard", count: 208, sub: "ATX, mATX, ITX" },
  { id: "ram", label: "RAM Memory", icon: "bi-memory", count: 89, sub: "DDR4, DDR5, rODIMM" },
  { id: "gpu", label: "VGA - Graphics Cards", icon: "bi-gpu-card", count: 340, sub: "RTX & Radeon" },
  { id: "storage", label: "SSD / eDD Storage", icon: "bi-device-hdd", count: 215, sub: "NVMe, eDD" },
  { id: "psu", label: "Power Supply", icon: "bi-lightning", count: 26, sub: "Modular, ATX 3.0" },
  { id: "case", label: "Cases", icon: "bi-box", count: 156, sub: "Mid Tower, Full Tower" },
  { id: "cooling", label: "Cooling Solutions", icon: "bi-fan", count: 240, sub: "AIO, Air Coolers" },
  { id: "monitor", label: "Monitors", icon: "bi-display", count: 32, sub: "Gaming, 4K" },
  { id: "peripheral", label: "Peripherals", icon: "bi-keyboard", count: 412, sub: "Keyboards, Mice" },
];

const POPULAR_BRANDS = ["Asus", "MSI", "Gigabyte", "Corsair", "Intel", "AMD"];

const GRID_CATEGORIES = [
  { id: "cpu", label: "Processors (CPUs)", icon: "bi-cpu", sub: "Intel Core & AMD Ryzen", count: 124, color: "#3b82f6" },
  { id: "motherboard", label: "Motherboards", icon: "bi-motherboard", sub: "ATX, mATX, ITX", count: 208, color: "#8b5cf6" },
  { id: "gpu", label: "Graphics Cards", icon: "bi-gpu-card", sub: "RTX & Radeon", count: 89, color: "#ef4444" },
  { id: "ram", label: "RAM Memory", icon: "bi-memory", sub: "DDR4, DDR5, rODIMM", count: 340, color: "#10b981" },
  { id: "storage", label: "Storage", icon: "bi-device-hdd", sub: "NVMe, eDD", count: 215, color: "#f59e0b" },
  { id: "psu", label: "Power Supply", icon: "bi-lightning", sub: "Modular, ATX 3.0", count: 26, color: "#6366f1" },
  { id: "case", label: "PC Cases", icon: "bi-box", sub: "Mid Tower, Full Tower", count: 156, color: "#0ea5e9" },
  { id: "cooling", label: "Cooling", icon: "bi-fan", sub: "AIO, Air Coolers", count: 240, color: "#14b8a6" },
  { id: "monitor", label: "Monitors", icon: "bi-display", sub: "Gaming, 4K", count: 32, color: "#f97316" },
  { id: "peripheral", label: "Peripherals", icon: "bi-keyboard", sub: "Keyboards, Mice", count: 412, color: "#a855f7" },
];

export function ProductPage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortBy, setSortBy] = useState("Most Popular");

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* ── Flash Banner ── */}
      <div
        className="text-white text-center py-2 fw-semibold"
        style={{ background: "#e53e3e", fontSize: 13, letterSpacing: "0.02em" }}
      >
         FLASH SALE: UP TO 50% OFF ON SELECTED MOTHERBOARDS — ENDS IN 2 HOURS
      </div>

      {/* ── Main Layout ── */}
      <div className="container-fluid py-3 px-3 px-md-4">
        <div className="row g-3">

          {/* ── Content ── */}
          <div className="col-12">

            {/* Breadcrumb */}
            <nav className="mb-2" style={{ fontSize: 13 }}>
              <span className="text-muted">Home</span>
              <span className="text-muted mx-2">/</span>
              <span className="text-dark fw-medium">PC Components</span>
            </nav>

            {/* Page Header */}
            <div className="d-flex align-items-start justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h4 className="fw-bold mb-1" style={{ fontSize: 22 }}>PC Components</h4>
                <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                  Build your dream PC with our wide selection of parts.
                </p>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted" style={{ fontSize: 13 }}>Sort by:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto", fontSize: 13 }}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {/* Các phần còn lại giữ nguyên */}
            {/* (Product Categories, PC Builder, Footer — không thay đổi) */}

          </div>

        </div>
      </div>

    </div>
  );
}