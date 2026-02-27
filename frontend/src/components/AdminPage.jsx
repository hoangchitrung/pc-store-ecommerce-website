import "./App.css"

export function AdminPage() {
    
    return (
        <div className="admin-form">
            <div className="form-row">
                <label htmlFor="name">Name:</label>
                <input type="text" />
            </div>

            <div className="form-row">
                <label htmlFor="description">Description:</label>
                <input type="text" />
            </div>

            <div className="form-row">
                <label htmlFor="category">Category:</label>
                <input type="text" />
            </div>

            <div className="form-row">
                <label htmlFor="brand">Brand:</label>
                <input type="text" />
            </div>

            <div className="form-row">
                <label htmlFor="price">Price:</label>
                <input type="number" />
            </div>

            <div className="form-row">
                <label htmlFor="tdp">TDP:</label>
                <input type="text" />
            </div>

            <div className="form-row">
                <label htmlFor="image_url">image url:</label>
                <input type="text" />
            </div>

            <div className="specifications-group">
                <label htmlFor="specifications">Specifications:</label>
                <input type="number" name="cores" placeholder="Cores" />
                <input type="number" name="threads" placeholder="Threads" />
                <input type="number" name="socket" placeholder="Socket" />
                <input type="number" name="base_clock" placeholder="Base Clock" />
                <input type="number" name="boost_clock" placeholder="Boost Clock" />
            </div>

            <div className="form-row">
                <label htmlFor="serial_number_required">Serial Number Required:</label>
                <input type="checkbox" name="" id="" />
            </div>

            <div className="form-row">
                <label htmlFor="is_active">is active:</label>
                <input type="checkbox" name="" id="" />
            </div>

            <button type="submit">Submit</button>
        </div>
    );
}
