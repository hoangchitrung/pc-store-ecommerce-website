import { useState } from "react";
import { AdminLayout } from "./Adminlayout";

const PRODUCTS = [
  {
    id: 1,
    name: "Intel Core i9-13900K",
    category: "Processors",
    location: "Warehouse A, Aisle 4",
    stock: 142,
    reorder: 20,
    date: "Oct 24, 2023",
  },
  {
    id: 2,
    name: "NVIDIA GeForce RTX 4090",
    category: "Graphics Cards",
    location: "Warehouse B, Secure 2",
    stock: 5,
    reorder: 10,
    date: "Sep 15, 2023",
  },
  {
    id: 3,
    name: "Corsair DDR5 32GB",
    category: "Memory",
    location: "Warehouse A, Aisle 1",
    stock: 289,
    reorder: 50,
    date: "Oct 28, 2023",
  },
  {
    id: 4,
    name: "Samsung 980 Pro 2TB",
    category: "Storage",
    location: "Warehouse A, Aisle 6",
    stock: 0,
    reorder: 25,
    date: "Aug 10, 2023",
  },
];

function getStatus(stock) {
  if (stock === 0) return { text: "Out of Stock", color: "#dc2626", bg: "#fee2e2" };
  if (stock < 10) return { text: "Low Stock", color: "#b45309", bg: "#fef3c7" };
  return { text: "In Stock", color: "#15803d", bg: "#dcfce7" };
}

export function AdminInventory() {
  const [search, setSearch] = useState("");

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700 }}>Inventory Management</h4>
          <p style={{ color: "#888", fontSize: 13 }}>Admin / Inventory</p>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20
        }}>
          {[
            { title: "Total Products", value: "1,240" },
            { title: "Total Value", value: "$450,230" },
            { title: "Low Stock", value: "12 items" },
            { title: "Out of Stock", value: "3 items" },
          ].map((item) => (
            <div key={item.title} style={{
              background: "white",
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 16
            }}>
              <p style={{ fontSize: 12, color: "#999" }}>{item.title}</p>
              <h5 style={{ fontWeight: 700 }}>{item.value}</h5>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12
        }}>
          <input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #ddd",
              width: 250
            }}
          />

          <button style={{
            background: "#2563EB",
            color: "white",
            border: "none",
            padding: "6px 14px",
            borderRadius: 6
          }}>
            Adjust Stock
          </button>
        </div>

        {/* Table */}
        <div style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: 10,
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", fontSize: 13 }}>
            <thead style={{ background: "#f9f9f9" }}>
              <tr>
                <th style={{ padding: 10 }}>Product</th>
                <th>Category</th>
                <th>Location</th>
                <th>Stock</th>
                <th>Reorder</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {PRODUCTS.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
              ).map((p) => {
                const status = getStatus(p.stock);

                return (
                  <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ padding: 10 }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.location}</td>
                    <td>{p.stock}</td>
                    <td>{p.reorder}</td>
                    <td>{p.date}</td>
                    <td>
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        background: status.bg,
                        color: status.color
                      }}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}