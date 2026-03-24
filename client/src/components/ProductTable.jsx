export function ProductTable({ products, onEdit, onDelete }) {
    if (products.length === 0) {
        return <div className="alert alert-info text-center">Kho hàng đang trống.</div>;
    }

    return (
        <div className="table-responsive shadow-sm">
            <table className="table table-hover align-middle bg-white border">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Thương hiệu</th>
                        <th>Giá</th>
                        <th>Tồn kho</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td style={{ maxWidth: "250px" }} className="text-truncate" title={product.name}>
                                {product.name}
                            </td>
                            <td>{product.brand}</td>
                            <td className="text-danger fw-bold">{product.price}$</td>
                            <td>
                                {product.stock_quantity > 0 ? (
                                    <span className="badge bg-success">{product.stock_quantity}</span>
                                ) : (
                                    <span className="badge bg-danger">Hết hàng</span>
                                )}
                            </td>
                            <td className="text-center">
                                <button onClick={() => onEdit(product)} className="btn btn-sm btn-outline-primary me-2">Sửa</button>
                                <button onClick={() => onDelete(product.id)} className="btn btn-sm btn-outline-danger">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}