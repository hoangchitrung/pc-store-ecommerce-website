import { useState, useEffect } from "react";
import { getProducts } from "../api/productApi";

export function BuildPCPage({ cart = [], setCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const buildSections = [
        { key: "CPU", label: "Bộ vi xử lý", icon: "fa-solid fa-microchip" },
        { key: "GPU", label: "Card màn hình", icon: "fa-solid fa-gpu" },
        { key: "RAM", label: "RAM", icon: "fa-solid fa-memory" },
        { key: "Motherboard", label: "Bo mạch chủ", icon: "fa-solid fa-plug-circle-bolt" },
        { key: "SSD/HDD", label: "Ổ cứng", icon: "fa-solid fa-hdd" },
        { key: "Case", label: "Case máy tính", icon: "fa-solid fa-box" },
        { key: "PSU", label: "Nguồn máy tính", icon: "fa-solid fa-bolt" },
        { key: "Cooling", label: "Tản nhiệt CPU", icon: "fa-solid fa-fan" },
    ];

    useEffect(() => {
        let isMounted = true;
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                if (isMounted) {
                    setProducts(Array.isArray(data) ? data : []);
                    setError("");
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Không thể tải sản phẩm");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProducts();
        return () => { isMounted = false; };
    }, []);

    const openSection = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCategory("");
    };

    const selectedProducts = products.filter((p) => (selectedCategory === "SSD/HDD" ? p.category === "SSD/HDD" : p.category === selectedCategory));

    const addToBuild = (product) => {
        if (!selectedItems.some((item) => item.id === product.id)) {
            setSelectedItems((prev) => [...prev, product]);
        }
    };

    const addAllSelectedToCart = () => {
        if (!setCart || typeof setCart !== "function") {
            console.warn("setCart không được cung cấp");
            return;
        }

        const merged = [...cart];

        selectedItems.forEach((item) => {
            const existing = merged.find((c) => c.id === item.id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                merged.push({ ...item, quantity: 1 });
            }
        });

        setCart(merged);
        setSelectedItems([]);
    };

    const removeFromBuild = (productId) => {
        setSelectedItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const clearAllSelected = () => {
        if (selectedItems.length > 0) {
            setSelectedItems([]);
        }
    };

    const selectedTotal = selectedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    return (
        <div className="container mt-5 mb-5">
            <h1 className="mb-4">Xây dựng PC của bạn</h1>
            <p className="text-muted mb-4">
                Chọn linh kiện, lắp ghép cấu hình phù hợp với nhu cầu chơi game, đồ họa hoặc làm việc.
            </p>


            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="card-title mb-3">Danh sách linh kiện cơ bản</h4>
                    <div className="list-group">
                        {buildSections.map((section) => {
                            const selectedItem = selectedItems.find((item) => item.category === section.key);

                            return (
                                <div key={section.key} className="list-group-item">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <i className={`${section.icon} fs-5`} style={{ width: 26 }}></i>
                                            <div>
                                                <div className="fw-bold">{section.label}</div>
                                                <small className="text-muted">Chọn {section.label} phù hợp</small>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-outline-primary btn-sm" onClick={() => openSection(section.key)}>
                                                Chọn
                                            </button>
                                        </div>
                                    </div>

                                    {selectedItem && (
                                        <div className="mt-2 border rounded p-2 bg-light d-flex align-items-center justify-content-between gap-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <img
                                                    src={selectedItem.image_url || "https://placehold.co/80x80?text=No+Image"}
                                                    alt={selectedItem.name}
                                                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
                                                />
                                                <div>
                                                    <div className="fw-semibold">Đã chọn:&nbsp;{selectedItem.name}</div>
                                                    <small className="text-muted">{Number(selectedItem.price).toLocaleString("vi-VN")} đ</small>
                                                </div>
                                            </div>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromBuild(selectedItem.id)}>
                                                Xóa
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mb-4 d-flex flex-column align-items-end">
                <div className="mb-2">
                    <strong>Tổng tiền linh kiện đã chọn: </strong>
                    <span className="text-danger">{Number(selectedTotal).toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-danger"
                        onClick={clearAllSelected}
                        disabled={selectedItems.length === 0}
                    >
                        Xóa tất cả
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={addAllSelectedToCart}
                        disabled={selectedItems.length === 0}
                    >
                        Thêm tất cả linh kiện đã chọn vào giỏ hàng
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <>
                    {/* Modal chọn sản phẩm theo category */}
                    {isModalOpen && (
                        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={closeModal}>
                            <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Danh sách {selectedCategory}</h5>
                                        <button type="button" className="btn-close" onClick={closeModal} />
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <strong>{selectedItems.length}</strong> linh kiện đã chọn cho build.
                                        </div>
                                        {selectedProducts.length <= 0 ? (
                                            <div className="alert alert-secondary">Không tìm thấy sản phẩm cho {selectedCategory}</div>
                                        ) : (
                                            <div className="row g-2">
                                                {selectedProducts.map((p) => (
                                                    <div key={p.id} className="col-12 col-md-6">
                                                        <div className="card">
                                                            <img
                                                                src={p.image_url || "https://placehold.co/300x200?text=No+Image"}
                                                                className="card-img-top"
                                                                alt={p.name}
                                                                style={{ height: 130, objectFit: "cover" }}
                                                            />
                                                            <div className="card-body">
                                                                <h6 className="card-title">{p.name}</h6>
                                                                <p className="mb-1" style={{ fontSize: 12, color: "#555" }}>
                                                                    {p.category} • {Number(p.price).toLocaleString("vi-VN")} đ
                                                                </p>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => addToBuild(p)}
                                                                    disabled={selectedItems.some((item) => item.id === p.id)}
                                                                >
                                                                    {selectedItems.some((item) => item.id === p.id) ? "Đã thêm" : "Thêm vào build"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" onClick={closeModal}>Đóng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
