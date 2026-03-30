const connection = require("../config/db");

function getUserSelectExpr(callback) {
    const sql = `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'users'
    `;

    connection.query(sql, (err, rows) => {
        if (err) return callback(err);

        const cols = new Set(rows.map(r => r.COLUMN_NAME));

        let customerNameExpr = "NULL";
        if (cols.has("full_name")) {
            customerNameExpr = "u.full_name";
        } else if (cols.has("name")) {
            customerNameExpr = "u.name";
        } else if (cols.has("username")) {
            customerNameExpr = "u.username";
        } else if (cols.has("customer_name")) {
            customerNameExpr = "u.customer_name";
        } else if (cols.has("first_name") && cols.has("last_name")) {
            customerNameExpr = "CONCAT(u.first_name, ' ', u.last_name)";
        }

        const customerEmailExpr = cols.has("email") ? "u.email" : "NULL";
        const customerPhoneExpr =
            cols.has("phone_number") ? "u.phone_number" :
            cols.has("phone") ? "u.phone" :
            cols.has("mobile") ? "u.mobile" :
            "NULL";

        callback(null, {
            customerNameExpr,
            customerEmailExpr,
            customerPhoneExpr
        });
    });
}

// GET all orders
exports.getAllOrders = (req, res) => {
    getUserSelectExpr((err, userCols) => {
        if (err) {
            return res.status(500).json({ message: `Database Error: ${err.message}` });
        }

        const sql = `
            SELECT 
                o.id,
                o.order_number,
                o.total_amount,
                o.status,
                o.payment_method,
                o.payment_status,
                o.shipping_address,
                o.notes,
                o.created_at,
                ${userCols.customerNameExpr} AS customer_name,
                ${userCols.customerEmailExpr} AS customer_email,
                ${userCols.customerPhoneExpr} AS customer_phone
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC;
        `;

        connection.query(sql, (err2, results) => {
            if (err2) return res.status(500).json({ message: `Database Error: ${err2.message}` });
            return res.status(200).json(results);
        });
    });
};

// GET order by id with items
exports.getOrderById = (req, res) => {
    const { id } = req.params;

    getUserSelectExpr((err, userCols) => {
        if (err) {
            return res.status(500).json({ message: `Database Error: ${err.message}` });
        }

        const orderSql = `
            SELECT 
                o.id,
                o.order_number,
                o.total_amount,
                o.status,
                o.payment_method,
                o.payment_status,
                o.shipping_address,
                o.notes,
                o.created_at,
                ${userCols.customerNameExpr} AS customer_name,
                ${userCols.customerEmailExpr} AS customer_email,
                ${userCols.customerPhoneExpr} AS customer_phone
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?;
        `;

        const itemsSql = `
            SELECT 
                oi.id,
                oi.quantity,
                oi.unit_price,
                oi.subtotal,
                p.name      AS product_name,
                p.image_url AS product_image,
                p.category  AS product_category,
                p.brand     AS product_brand
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?;
        `;

        connection.query(orderSql, [id], (err2, orders) => {
            if (err2) return res.status(500).json({ message: `Database Error: ${err2.message}` });
            if (orders.length === 0) return res.status(404).json({ message: "Order not found" });

            connection.query(itemsSql, [id], (err3, items) => {
                if (err3) return res.status(500).json({ message: `Database Error: ${err3.message}` });
                return res.status(200).json({ ...orders[0], items });
            });
        });
    });
};

// PUT update order status
exports.updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "processing", "delivered", "cancelled"];
    if (!allowed.includes(status?.toLowerCase())) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${allowed.join(", ")}` });
    }

    const sql = "UPDATE orders SET status = ? WHERE id = ?;";
    connection.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: `Database Error: ${err.message}` });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });
        return res.status(200).json({ message: "Order status updated" });
    });
};

// PUT cancel order
exports.cancelOrder = (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE orders 
        SET status = 'cancelled' 
        WHERE id = ? AND status NOT IN ('delivered', 'cancelled');
    `;

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: `Database Error: ${err.message}` });
        if (result.affectedRows === 0) return res.status(400).json({ message: "Cannot cancel this order" });
        return res.status(200).json({ message: "Order cancelled" });
    });
};