import { useState } from "react";

export function ProductPage() {
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