const connection = require("../config/db");

const getAllOrders = (req, res) => {
    const sqlOrders = `
        SELECT o.*, u.fullname as customer, u.email, u.phone 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
    `;

    connection.query(sqlOrders, (err, orders) => {
        if (err) return res.status(500).json({ success: false, message: "Lỗi DB orders" });
        if (orders.length === 0) return res.status(200).json({ success: true, orders: [] });

        const sqlItems = `
            SELECT oi.order_id, oi.quantity, oi.unit_price, p.name 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id
        `;

        connection.query(sqlItems, (errItems, items) => {
            if (errItems) return res.status(500).json({ success: false, message: "Lỗi DB items" });

            // Ghép mảng items vào đúng đơn hàng của nó
            const fullOrders = orders.map(order => {
                return {
                    ...order,
                    items: items.filter(item => item.order_id === order.id)
                };
            });

            res.status(200).json({ success: true, orders: fullOrders });
        });
    });
};

// 2. Cập nhật trạng thái đơn hàng (Dành cho Admin bấm nút)
const updateOrderStatus = (req, res) => {
    const { orderCode } = req.params;
    const { status } = req.body;

    const sqlUpdate = "UPDATE orders SET status = ? WHERE order_number = ?";
    connection.query(sqlUpdate, [status, orderCode], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Lỗi cập nhật" });
        res.status(200).json({ success: true, message: "Cập nhật thành công" });
    });
};

module.exports = { getAllOrders, updateOrderStatus };
