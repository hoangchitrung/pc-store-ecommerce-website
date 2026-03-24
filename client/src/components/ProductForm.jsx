export function ProductForm({ formData, isEditing, isLoading, onChange, onSubmit, onCancel }) {
    return (
        <div className="card shadow-sm mb-5 border-0 bg-white">
            <div className="card-header bg-primary text-white fw-bold">
                {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </div>
            <div className="card-body">
                <form onSubmit={onSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Tên sản phẩm *</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={onChange} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold">Giá ($) *</label>
                        <input type="number" className="form-control" name="price" value={formData.price} onChange={onChange} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold">Tồn kho</label>
                        <input type="number" className="form-control" name="stock_quantity" value={formData.stock_quantity} onChange={onChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Danh mục *</label>
                        <input type="text" className="form-control" name="category" value={formData.category} onChange={onChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Thương hiệu (Brand) *</label>
                        <input type="text" className="form-control" name="brand" value={formData.brand} onChange={onChange} required />
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-semibold">Link Ảnh (Image URL)</label>
                        <input type="text" className="form-control" name="image_url" value={formData.image_url} onChange={onChange} />
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-semibold">Mô tả (Description)</label>
                        <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={onChange}></textarea>
                    </div>
                    <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-success px-4 me-2 fw-bold" disabled={isLoading}>
                            {isLoading ? "Đang xử lý..." : isEditing ? "Lưu thay đổi" : "Thêm vào kho"}
                        </button>
                        {isEditing && (
                            <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={onCancel}>
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}