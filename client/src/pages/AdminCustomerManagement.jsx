import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "./Adminlayout";
import { getCustomers } from "../api/customerApi";

export default function AdminCustomerManagementPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCustomers();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load customers.");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return customers.filter((c) => {
      return (
        String(c.id || "").toLowerCase().includes(q) ||
        String(c.fullname || c.name || "").toLowerCase().includes(q) ||
        String(c.email || "").toLowerCase().includes(q) ||
        String(c.phone || "").toLowerCase().includes(q) ||
        String(c.role || "").toLowerCase().includes(q)
      );
    });
  }, [customers, search]);

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Customer Management</h3>
          <button className="btn btn-primary" type="button">
            Add Customer
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {error && (
              <div className="alert alert-danger py-2">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status" />
                <div className="mt-2 text-muted">Loading customers...</div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted">
                          No customers found.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => {
                        const name = c.fullname || c.name || "Unknown";
                        const ordersCount = c.orders_count ?? c.orders ?? 0;
                        const totalSpent = c.total_spent ?? c.total ?? 0;
                        const active = Number(c.is_active) === 1 || c.status === "Active";

                        return (
                          <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{name}</td>
                            <td>{c.email || "—"}</td>
                            <td>{c.phone || "—"}</td>
                            <td>{ordersCount}</td>
                            <td>${Number(totalSpent).toLocaleString()}</td>
                            <td>
                              <span className={active ? "badge bg-success" : "badge bg-secondary"}>
                                {active ? "Active" : "Inactive"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}