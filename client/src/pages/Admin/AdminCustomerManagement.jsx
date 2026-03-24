import { useState } from "react";
import { AdminLayout } from "./Adminlayout";

export default function AdminCustomerManagementPage() {
  const [customers] = useState([
    {
      id: 1,
      name: "Nguyen Van A",
      email: "a@gmail.com",
      orders: 5,
      total: 1200,
      status: "Active",
    },
    {
      id: 2,
      name: "Tran Thi B",
      email: "b@gmail.com",
      orders: 2,
      total: 500,
      status: "Suspended",
    },
    {
      id: 3,
      name: "Le Van C",
      email: "c@gmail.com",
      orders: 8,
      total: 2500,
      status: "Active",
    },
  ]);

  return (
    <AdminLayout>

      <div className="container-fluid p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Customer Management</h3>

          <button className="btn btn-primary">
            Add Customer
          </button>
        </div>

        {/* Card */}
        <div className="card shadow-sm">

          <div className="card-body">

            {/* Search */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search customer..."
            />

            {/* Table */}
            <table className="table table-bordered table-hover">

              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.orders}</td>
                    <td>${c.total}</td>
                    <td>
                      <span
                        className={
                          c.status === "Active"
                            ? "badge bg-success"
                            : "badge bg-secondary"
                        }
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}