import { useState } from "react";
import { AdminLayout } from "./Adminlayout";

const MOCK_PRODUCTS = [
  { id: 1, name: "NVIDIA GeForce RTX 4090",    sku: "NV-4090-FE-24G",  category: "GPU",         price: 1599.00, stock: 12,  status: "Active"       },
  { id: 2, name: "Intel Core i9-13900K",        sku: "INT-I9-13K",      category: "CPU",         price: 589.00,  stock: 0,   status: "Out of Stock" },
  { id: 3, name: "ASUS ROG Maximus Z790",       sku: "ASUS-Z790-HERO",  category: "Motherboard", price: 629.99,  stock: 3,   status: "Low Stock"    },
  { id: 4, name: "Corsair Vengeance RGB 32GB",  sku: "COR-DDR5-32G",    category: "RAM",         price: 129.99,  stock: 150, status: "Active"       },
  { id: 5, name: "Samsung 990 PRO 2TB",         sku: "SAM-NVME-2TB",    category: "Storage",     price: 179.99,  stock: 45,  status: "Draft"        },
  { id: 6, name: "AMD Ryzen 9 7950X3D",         sku: "AMD-R9-7950X3D",  category: "CPU",         price: 699.00,  stock: 28,  status: "Active"       },
  { id: 7, name: "Corsair RM1000x PSU",         sku: "COR-RM1000X",     category: "PSU",         price: 189.99,  stock: 0,   status: "Out of Stock" },
  { id: 8, name: "NZXT H9 Flow",               sku: "NZXT-H9-FLOW",    category: "Case",        price: 159.99,  stock: 67,  status: "Active"       },
  { id: 9, name: "be quiet! Dark Rock Pro 4",  sku: "BQ-DRP4",         category: "Cooling",     price: 89.99,   stock: 5,   status: "Low Stock"    },
  { id: 10, name: "LG 27GP950-B 4K Monitor",   sku: "LG-27GP950B",     category: "Monitor",     price: 799.99,  stock: 22,  status: "Active"       },
];

const CATEGORIES  = ["All Categories","CPU","GPU","RAM","Storage","Motherboard","PSU","Cooling","Case","Monitor","Peripherals"];
const STATUS_TABS = ["All", "Active", "Draft", "Archived"];
const STATUS_STYLE = {
  "Active":       { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  "Out of Stock": { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
  "Low Stock":    { bg: "#fef9c3", color: "#a16207", dot: "#eab308" },
  "Draft":        { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
};

const initProduct = { name:"", description:"", category:"", brand:"", price:0, tdp:0, image_url:"", serial_number_required:true, is_active:false };
const initSpecs   = { cores:0, threads:0, socket:"", base_clock:"", boost_clock:"" };
const PAGE_SIZE   = 5;

export function AdminProductManagement() {
  const [products]          = useState(MOCK_PRODUCTS);
  const [search, setSearch]  = useState("");
  const [category, setCat]   = useState("All Categories");
  const [statusTab, setTab]  = useState("All");
  const [page, setPage]      = useState(1);
  const [selected, setSel]   = useState([]);
  const [showModal, setModal] = useState(false);
  const [product, setProd]   = useState(initProduct);
  const [specs, setSpecs]    = useState(initSpecs);
  const [loading, setLoad]   = useState(false);
  const [globalSearch, setGS] = useState("");

  const filtered = products.filter((p) => {
    const mSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const mCat    = category === "All Categories" || p.category === category;
    const mTab    = statusTab === "All" || p.status === statusTab;
    return mSearch && mCat && mTab;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const toggleAll = () => setSel(selected.length === paginated.length ? [] : paginated.map(p => p.id));
  const toggleOne = (id) => setSel(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

  const handleProductChange = (e) => {
    const { name, value, type } = e.target;
    setProd({ ...product, [name]: type === "number" ? Number(value) : value });
  };
  const handleSpecsChange = (e) => {
    const { name, value, type } = e.target;
    setSpecs({ ...specs, [name]: type === "number" ? Number(value) : value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    setTimeout(() => {
      alert(`Product "${product.name}" added (demo)`);
      setProd(initProduct); setSpecs(initSpecs); setModal(false); setLoad(false);
    }, 800);
  };

  const SectionLabel = ({ text }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase" }}>{text}</span>
    </div>
  );

  return (
    <AdminLayout>
      {/* Topbar */}
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

      {/* Content */}
      <div style={{ padding: "24px", flex: 1 }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0, letterSpacing: "-0.3px" }}>Product Inventory</h4>
            <p style={{ fontSize: 13, color: "#888", marginTop: 3, marginBottom: 0 }}>Manage your catalog, monitor stock levels, and update pricing.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, color: "#555", cursor: "pointer", fontWeight: 500 }}>
              <i className="bi bi-download" /> Export
            </button>
            <button onClick={() => setModal(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#2563EB", border: "none", borderRadius: 8, fontSize: 13, color: "white", cursor: "pointer", fontWeight: 600 }}>
              <i className="bi bi-plus-lg" /> Add New Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: "TOTAL PRODUCTS", value: products.length,                                              icon: "bi-box-seam",             iconBg: "#eff6ff", iconColor: "#2563EB" },
            { label: "IN STOCK",       value: products.filter(p => p.stock > 0).length,                    icon: "bi-check-circle",         iconBg: "#dcfce7", iconColor: "#15803d" },
            { label: "LOW STOCK",      value: products.filter(p => ["Low Stock","Out of Stock"].includes(p.status)).length, icon: "bi-exclamation-triangle", iconBg: "#fef9c3", iconColor: "#a16207" },
            { label: "CATEGORIES",     value: new Set(products.map(p => p.category)).size,                 icon: "bi-grid",                 iconBg: "#f3e8ff", iconColor: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`bi ${s.icon}`} style={{ fontSize: 18, color: s.iconColor }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div style={{ background: "white", border: "1px solid #ebebeb", borderRadius: 12, overflow: "hidden" }}>

          {/* Filters */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
              <i className="bi bi-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13 }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, SKU..."
                style={{ width: "100%", padding: "7px 12px 7px 30px", background: "#f5f5f3", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none" }} />
            </div>
            <select value={category} onChange={e => { setCat(e.target.value); setPage(1); }}
              style={{ padding: "7px 28px 7px 10px", background: "white", border: "1px solid #ebebeb", borderRadius: 8, fontSize: 13, outline: "none", cursor: "pointer", minWidth: 150 }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <div style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
              {STATUS_TABS.map((tab) => (
                <button key={tab} onClick={() => { setTab(tab); setPage(1); }}
                  style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid", borderColor: statusTab===tab ? "#2563EB" : "#ebebeb", background: statusTab===tab ? "#2563EB" : "white", color: statusTab===tab ? "white" : "#555", fontSize: 12, fontWeight: statusTab===tab ? 600 : 400, cursor: "pointer" }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#fafaf8" }}>
                <th style={{ padding: "10px 16px", width: 40 }}>
                  <input type="checkbox" checked={selected.length===paginated.length && paginated.length>0} onChange={toggleAll} style={{ cursor: "pointer" }} />
                </th>
                {["PRODUCT NAME & SKU","CATEGORY","PRICE","STOCK","STATUS","ACTIONS"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: ["PRICE","STOCK"].includes(h) ? "right" : "left", fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.05em", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => {
                const ss = STATUS_STYLE[p.status] || STATUS_STYLE["Draft"];
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f3" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px" }}>
                      <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)} style={{ cursor: "pointer" }} />
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, background: "#f0f0f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <i className="bi bi-cpu" style={{ fontSize: 18, color: "#888" }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>SKU: {p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>{p.category}</span>
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 600, color: "#1a1a1a" }}>${p.price.toFixed(2)}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 700, color: p.stock===0 ? "#ef4444" : p.stock<=5 ? "#f59e0b" : "#1a1a1a" }}>{p.stock}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 20 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: ss.dot }} />
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ padding: "4px 10px", background: "white", border: "1px solid #ebebeb", borderRadius: 6, fontSize: 11, cursor: "pointer", color: "#555" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor="#2563EB"}
                          onMouseLeave={e => e.currentTarget.style.borderColor="#ebebeb"}>
                          <i className="bi bi-pencil" />
                        </button>
                        <button style={{ padding: "4px 10px", background: "white", border: "1px solid #ebebeb", borderRadius: 6, fontSize: 11, cursor: "pointer", color: "#ef4444" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor="#ef4444"}
                          onMouseLeave={e => e.currentTarget.style.borderColor="#ebebeb"}>
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#888" }}>
              Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)} to {Math.min(page*PAGE_SIZE, filtered.length)} of <strong>{filtered.length}</strong> results
            </span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                style={{ width:30, height:30, borderRadius:6, border:"1px solid #ebebeb", background:"white", cursor:page===1?"not-allowed":"pointer", color:page===1?"#ccc":"#555", fontSize:12 }}>
                <i className="bi bi-chevron-left" />
              </button>
              {Array.from({ length: Math.min(totalPages,5) }, (_,i)=>i+1).map(n=>(
                <button key={n} onClick={()=>setPage(n)}
                  style={{ width:30, height:30, borderRadius:6, border:"1px solid", borderColor:page===n?"#2563EB":"#ebebeb", background:page===n?"#2563EB":"white", color:page===n?"white":"#555", fontSize:12, cursor:"pointer", fontWeight:page===n?700:400 }}>
                  {n}
                </button>
              ))}
              {totalPages>5 && <span style={{ fontSize:13, color:"#aaa" }}>...</span>}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                style={{ width:30, height:30, borderRadius:6, border:"1px solid #ebebeb", background:"white", cursor:page===totalPages?"not-allowed":"pointer", color:page===totalPages?"#ccc":"#555", fontSize:12 }}>
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Product Modal ── */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"white", borderRadius:14, width:"100%", maxWidth:680, maxHeight:"90vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ padding:"18px 24px", borderBottom:"1px solid #ebebeb", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38, height:38, background:"#2563EB", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <i className="bi bi-box-seam" style={{ fontSize:18, color:"white" }} />
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#1a1a1a" }}>Add New Product</div>
                  <div style={{ fontSize:12, color:"#aaa" }}>Fill in the details to add a new component</div>
                </div>
              </div>
              <button onClick={() => setModal(false)} style={{ width:32, height:32, borderRadius:8, border:"1px solid #ebebeb", background:"white", cursor:"pointer", fontSize:18, color:"#888" }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ padding:"20px 24px" }}>
                <SectionLabel text="Basic Information" />
                <div className="row g-3 mb-4">
                  <div className="col-md-6"><label className="form-label fw-medium small">Product Name</label><input className="form-control form-control-sm" name="name" value={product.name} onChange={handleProductChange} placeholder="e.g. Intel Core i9-13900K" required /></div>
                  <div className="col-md-6"><label className="form-label fw-medium small">Brand</label><input className="form-control form-control-sm" name="brand" value={product.brand} onChange={handleProductChange} placeholder="e.g. Intel, AMD" /></div>
                  <div className="col-md-6"><label className="form-label fw-medium small">Category</label>
                    <select className="form-select form-select-sm" name="category" value={product.category} onChange={handleProductChange}>
                      <option value="">Select...</option>
                      {["CPU","GPU","RAM","Storage","Motherboard","PSU","Cooling","Case","Monitor","Peripherals"].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6"><label className="form-label fw-medium small">Image URL</label><input className="form-control form-control-sm" name="image_url" value={product.image_url} onChange={handleProductChange} placeholder="https://..." /></div>
                  <div className="col-12"><label className="form-label fw-medium small">Description</label><textarea className="form-control form-control-sm" name="description" value={product.description} onChange={handleProductChange} rows={2} placeholder="Describe the product..." /></div>
                </div>
                <hr className="my-3" />
                <SectionLabel text="Pricing & Power" />
                <div className="row g-3 mb-4">
                  <div className="col-md-6"><label className="form-label fw-medium small">Price (USD)</label><div className="input-group input-group-sm"><span className="input-group-text bg-light text-muted">$</span><input className="form-control" type="number" name="price" value={product.price} onChange={handleProductChange} min={0} /></div></div>
                  <div className="col-md-6"><label className="form-label fw-medium small">TDP (Watts)</label><div className="input-group input-group-sm"><input className="form-control" type="number" name="tdp" value={product.tdp} onChange={handleProductChange} min={0} /><span className="input-group-text bg-light text-muted">W</span></div></div>
                </div>
                <hr className="my-3" />
                <SectionLabel text="Specifications" />
                <div className="row g-3 mb-4">
                  <div className="col-md-4"><label className="form-label fw-medium small">Cores</label><input className="form-control form-control-sm" type="number" name="cores" value={specs.cores} onChange={handleSpecsChange} min={0} /></div>
                  <div className="col-md-4"><label className="form-label fw-medium small">Threads</label><input className="form-control form-control-sm" type="number" name="threads" value={specs.threads} onChange={handleSpecsChange} min={0} /></div>
                  <div className="col-md-4"><label className="form-label fw-medium small">Socket</label><input className="form-control form-control-sm" name="socket" value={specs.socket} onChange={handleSpecsChange} placeholder="e.g. LGA1700" /></div>
                  <div className="col-md-6"><label className="form-label fw-medium small">Base Clock</label><input className="form-control form-control-sm" name="base_clock" value={specs.base_clock} onChange={handleSpecsChange} placeholder="e.g. 3.0 GHz" /></div>
                  <div className="col-md-6"><label className="form-label fw-medium small">Boost Clock</label><input className="form-control form-control-sm" name="boost_clock" value={specs.boost_clock} onChange={handleSpecsChange} placeholder="e.g. 5.8 GHz" /></div>
                </div>
                <hr className="my-3" />
                <SectionLabel text="Options" />
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[{key:"serial_number_required",label:"Serial Number Required",sub:"Require serial number on purchase"},{key:"is_active",label:"Active Listing",sub:"Visible to customers on the store"}].map(opt=>(
                    <div key={opt.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"#f8f8f6", borderRadius:8, border:"1px solid #ebebeb" }}>
                      <div><div style={{ fontSize:13, fontWeight:500 }}>{opt.label}</div><div style={{ fontSize:12, color:"#aaa" }}>{opt.sub}</div></div>
                      <div className="form-check form-switch mb-0"><input className="form-check-input" type="checkbox" role="switch" checked={product[opt.key]} onChange={e=>setProd({...product,[opt.key]:e.target.checked})} style={{ width:"2.5rem", height:"1.25rem", cursor:"pointer" }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding:"14px 24px", borderTop:"1px solid #ebebeb", display:"flex", justifyContent:"flex-end", gap:10 }}>
                <button type="button" onClick={()=>setModal(false)} style={{ padding:"8px 20px", background:"white", border:"1px solid #ebebeb", borderRadius:8, fontSize:13, cursor:"pointer", color:"#555" }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 20px", background:"#2563EB", border:"none", borderRadius:8, fontSize:13, color:"white", cursor:"pointer", fontWeight:600, opacity:loading?0.7:1 }}>
                  {loading?<><span className="spinner-border spinner-border-sm"/>Saving...</>:<><i className="bi bi-plus-lg"/>Add Product</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}