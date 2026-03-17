import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";

// Nhận prop onAdd
export function ProductDetailsPage({ onAdd }) {
    const { id } = useParams();

    // Sửa giá trị khởi tạo từ [] thành null vì data trả về là 1 object
    const [product, setProduct] = useState(null) 

    useEffect(() => {
        // Đã sửa lại vị trí của array dependencies [id]
        getProductById(id).then((data) => setProduct(data))
    }, [id])

    if (!product) {
        return <h1>Loading or Product not found!</h1>
    }

    return (
        <div>
            <p>Name: {product.name}</p>
            <p>Price: {product.price}</p>
            <p>Stock: {product.stock_quantity}</p>
            
            {/* Thêm nút để gọi hàm onAdd */}
            <button onClick={() => onAdd(product)}>Thêm vào giỏ hàng</button>
        </div>
    )
}