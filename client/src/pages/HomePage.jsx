import { useState, useEffect } from "react";

// ── Mock Data ──────────────────────────────────────────────
const MOCK_PRODUCTS = [
  { id: 1, category: "CPU", brand: "Intel", name: "Intel Core i9-13900K Raptor Lake Processor", price: 549.99, oldPrice: 589, image_url: "https://placehold.co/280x200/1a1a2e/ffffff?text=i9-13900K", sold: 15, discount: 25 },
  { id: 2, category: "Peripherals", brand: "Logitech", name: "Logitech G915 TKL Lightspeed Wireless RGB", price: 195.00, oldPrice: 229, image_url: "https://placehold.co/280x200/0f3460/ffffff?text=G915+TKL", sold: 8, discount: 15 },
  { id: 3, category: "Storage", brand: "Samsung", name: "Samsung 980 PRO 2TB PCIe Gen 4.0 NVMe", price: 129.99, oldPrice: 219, image_url: "https://placehold.co/280x200/16213e/ffffff?text=980+PRO", sold: 42, discount: 40 },
  { id: 4, category: "Peripherals", brand: "SteelSeries", name: "SteelSeries Arctis Nova Pro Wireless", price: 314.00, oldPrice: 349, image_url: "https://placehold.co/280x200/1a1a2e/ffffff?text=Arctis+Nova", sold: 5, discount: 10 },
  { id: 5, category: "Case", brand: "NZXT", name: "NZXT H9 Flow Dual-Chamber Mid-Tower", price: 159.99, oldPrice: 179, image_url: "https://placehold.co/280x200/0d1117/ffffff?text=H9+Flow", sold: 12, discount: 12 },
  { id: 6, category: "CPU", brand: "AMD", name: "AMD Ryzen 9 7950X3D Desktop Processor", price: 699.00, image_url: "https://placehold.co/300x220/1a1a2e/ffffff?text=Ryzen+9+7950X3D", isNew: true },
  { id: 7, category: "GPU", brand: "ASUS", name: "ASUS ROG Strix GeForce RTX 4080 White OC Edition", price: 1249.99, image_url: "https://placehold.co/300x220/0f3460/ffffff?text=RTX+4080+White", isNew: true },
  { id: 8, category: "Case", brand: "Lian Li", name: "Lian Li O11 Dynamic EVO Mid-Tower Case - White", price: 169.99, image_url: "https://placehold.co/300x220/16213e/ffffff?text=O11+Dynamic", isNew: true },
  { id: 9, category: "Monitor", brand: "Alienware", name: "Alienware 34 Curved QD-OLED Gaming Monitor", price: 999.00, image_url: "https://placehold.co/300x220/1a1a2e/ffffff?text=AW34+OLED", isNew: true },
  { id: 10, category: "RAM", brand: "G.SKILL", name: "G.SKILL Trident Z5 RGB Series 32GB (2x16GB)", price: 114.99, image_url: "https://placehold.co/300x220/0d1117/ffffff?text=Trident+Z5", isNew: true },
];

const CATEGORIES = [
  { label: "Processors", icon: "bi-cpu", color: "#3b82f6" },
  { label: "Graphics Cards", icon: "bi-gpu-card", color: "#8b5cf6" },
  { label: "RAM & Memory", icon: "bi-memory", color: "#10b981" },
  { label: "SSD Storage", icon: "bi-device-hdd", color: "#f59e0b" },
  { label: "Monitors", icon: "bi-display", color: "#ef4444" },
  { label: "Accessories", icon: "bi-controller", color: "#6366f1" },
];

const BRANDS = ["NVIDIA", "AMD", "INTEL", "CORSAIR", "ASUS", "MSI", "GIGABYTE", "NZXT", "SAMSUNG", "LOGITECH"];

const pad = (n) => String(n).padStart(2, "0");

function useCountdown() {
  const [time, setTime] = useState({ h: 2, m: 45, s: 12 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        clearInterval(t);
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export function HomePage() {
  const [products] = useState(MOCK_PRODUCTS);
  const countdown = useCountdown();

  const flashSale = products.filter((p) => p.discount);
  const newArrivals = products.filter((p) => p.isNew);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f5f5f5" }}>

      {/* ── Hero ── */}
      <div className="container py-3">
        <div className="row g-3">

          <div className="col-12 col-xl-7">
            <div className="rounded-3 overflow-hidden position-relative d-flex align-items-center"
              style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 60%, #1e1b4b 100%)", minHeight: 280, padding: "36px 40px" }}>
              <div style={{ zIndex: 2, maxWidth: 340 }}>
                <span className="badge mb-3 px-3 py-1 rounded-pill" style={{ background: "#ef4444", fontSize: 11 }}>NEW ARRIVAL</span>
                <h2 className="fw-bold text-white mb-2" style={{ fontSize: 36, lineHeight: 1.2 }}>GeForce RTX 40-Series</h2>
                <p className="mb-4" style={{ color: "#94a3b8", fontSize: 14 }}>Beyond Fast. For Gamers and Creators.</p>
                <button className="btn px-4 py-2 text-white fw-semibold"
                  style={{ background: "#2563EB", fontSize: 13 }}>
                  Shop Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Flash Sale ── */}
      <div className="container mb-4">
        <div className="rounded-3 overflow-hidden border">
          <div className="d-flex align-items-center justify-content-between px-4 py-2"
            style={{ background: "linear-gradient(90deg, #ef4444 0%, #f97316 100%)" }}>
            <span className="fw-bold text-white" style={{ fontSize: 15 }}>
              FLASH SALE
            </span>
            <span className="text-white" style={{ fontSize: 13 }}>
              Ends in:
              <span className="badge bg-dark mx-1 px-2">{pad(countdown.h)}</span>:
              <span className="badge bg-dark mx-1 px-2">{pad(countdown.m)}</span>:
              <span className="badge bg-dark mx-1 px-2">{pad(countdown.s)}</span>
            </span>
          </div>

          <div className="bg-white p-3">
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
              {flashSale.map((p) => (
                <div key={p.id} className="col">
                  <div className="border rounded-2 p-2 h-100">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-100 rounded mb-2"
                      style={{ height: 110, objectFit: "cover" }}
                    />
                    <p style={{ fontSize: 12 }}>{p.name}</p>
                    <div className="fw-bold" style={{ color: "#ef4444" }}>
                      ${p.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}