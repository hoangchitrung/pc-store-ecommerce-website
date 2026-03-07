import { useState } from "react";

import "./Admin.css"

export function AdminPage() {

    // init value for product
    const initProduct = {
        name: "",
        description: "",
        category: "",
        brand: "",
        price: 0,
        tdp: 0,
        image_url: "",
        specifications: "",
        serial_number_required: true,
        is_active: false,
    };

    // init value for specifications
    const initSpecs = {
        cores: 0,
        threads: 0,
        socket: "",
        base_clock: "",
        boost_clock: "",
    };

    // useState for product
    const [product, setProduct] = useState(initProduct);

    // useState for specifications
    const [specs, setSpecs] = useState(initSpecs);

    // Handle product input change
    const handleProductChange = (e) => {
        const { name, value, type } = e.target;
        setProduct({
            ...product, [name]: type === "number" ? Number(value) : value
        });
    };

    // Handle spec change input product
    const handleSpecsChange = (e) => {
        const { name, value, type } = e.target;
        setSpecs({
            ...specs, [name]: type === "number" ? Number(value) : value
        });
    };

    // when submit, merge specs into product
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...product, specifications: JSON.stringify(specs)
        };
        // send payload to backend
        addProduct(payload).then((res) => {
            alert(`Add product successfully ${res.id}`);

            // reset input after add product
            setProduct(initProduct);
            setSpecs(initSpecsCPU);
        }).catch((err) => {
            alert(`Error when create product ${err}`)
        });
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="admin-form">
                <div className="form-row">
                    <label htmlFor="name">Name:</label>
                    <input name="name" value={product.name} onChange={handleProductChange} />
                </div>

                <div className="form-row">
                    <label htmlFor="description">Description:</label>
                    <input name="description" value={product.description} onChange={handleProductChange} />
                </div>

                <div className="form-row">
                    <label htmlFor="category">Category:</label>
                    <input name="category" value={product.category} onChange={handleProductChange} />
                </div>

                <div className="form-row">
                    <label htmlFor="brand">Brand:</label>
                    <input name="brand" value={product.brand} onChange={handleProductChange} />
                </div>

                <div className="form-row">
                    <label htmlFor="price">Price:</label>
                    <input type="number" name="price" value={product.price} onChange={handleProductChange} />
                </div>

                <div className="form-row">
                    <label htmlFor="tdp">TDP:</label>
                    <input type="number" name="tdp" value={product.tdp} onChange={handleProductChange} />
                </div>

                <div className="form-row">
                    <label htmlFor="image_url">image url:</label>
                    <input name="image_url" value={product.image_url} onChange={handleProductChange} />
                </div>

                <div className="specifications-group">
                    <label htmlFor="specifications">Specifications:</label>
                    <input type="number" name="cores" value={specs.cores} onChange={handleSpecsChange} placeholder="Cores" />
                    <input type="number" name="threads" value={specs.threads} onChange={handleSpecsChange} placeholder="Threads" />
                    <input name="socket" value={specs.socket} onChange={handleSpecsChange} placeholder="Socket" />
                    <input name="base_clock" value={specs.base_clock} onChange={handleSpecsChange} placeholder="Base Clock" />
                    <input name="boost_clock" value={specs.boost_clock} onChange={handleSpecsChange} placeholder="Boost Clock" />
                </div>

                <div className="form-row">
                    <label htmlFor="serial_number_required">Serial Number Required:</label>
                    <input type="checkbox" name="serial_number_required" checked={product.serial_number_required} onChange={e => setProduct({ ...product, serial_number_required: e.target.checked })} />
                </div>

                <div className="form-row">
                    <label htmlFor="is_active">is active:</label>
                    <input type="checkbox" name="is_active" checked={product.is_active} onChange={e => setProduct({ ...product, is_active: e.target.checked })} />
                </div>

                <button type="submit" onChange={handleSubmit}>Submit</button>
            </div>
        </form>
    );
}
