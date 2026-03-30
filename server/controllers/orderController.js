const connection = require("../config/db");
const util = require("util");

const query = util.promisify(connection.query).bind(connection);

// Cache schema để khỏi gọi SHOW COLUMNS quá nhiều lần
let schemaCache = {
    users: null,
    products: null
};

async function getTableColumns(tableName) {
    if (schemaCache[tableName]) {
        return schemaCache[tableName];
    }

    const rows = await query(`SHOW COLUMNS FROM \`${tableName}\``);
    const columns = rows.map(row => row.Field);
    schemaCache[tableName] = columns;
    return columns;
}

function pickFirstExisting(columns, candidates) {
    return candidates.find(col => columns.includes(col)) || null;
}

function buildCustomerSelect(userCols) {
    const nameCol = pickFirstExisting(userCols, ["full_name", "name", "username"]);
    const emailCol = pickFirstExisting(userCols, ["email"]);
    const phoneCol = pickFirstExisting(userCols, ["phone_number", "phone", "phone_no"]);

    return {
        nameSelect: nameCol ? `u.\`${nameCol}\` AS customer_name` : `NULL AS customer_name`,
        emailSelect: emailCol ? `u.\`${emailCol}\` AS customer_email` : `NULL AS customer_email`,
        phoneSelect: phoneCol ? `u.\`${phoneCol}\` AS customer_phone` : `NULL AS customer_phone`
    };
}

function buildProductSelect(productCols) {
    const nameCol = pickFirstExisting(productCols, ["name", "product_name", "title"]);
    const imageCol = pickFirstExisting(productCols, ["image_url", "image", "thumbnail", "photo"]);
    const categoryCol = pickFirstExisting(productCols, ["category", "category_name", "type"]);

    return {
        nameSelect: nameCol ? `p.\`${nameCol}\` AS product_name` : `NULL AS product_name`,
        imageSelect: imageCol ? `p.\`${imageCol}\` AS product_image` : `NULL AS product_image`,
        categorySelect: categoryCol ? `p.\`${categoryCol}\` AS product_category` : `NULL AS product_category`
    };
}

// GET all orders
exports.getAllOrders = async (req, res) => {
    try {
        const { status, search } = req.query;

        const userCols = await getTableColumns("users");
        const customerSelect = buildCustomerSelect(userCols);

        let sql = `
            SELECT 
                o.id,
                o.order_number,
                o.status,
                o.total_amount,
                o.payment_method,
                o.payment_status,
                o.shipping_address,
                o.created_at,
                o.updated_at,
                ${customerSelect.nameSelect},
                ${customerSelect.emailSelect}
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
        `;

        const conditions = [];
        const params = [];

        if (status) {
            conditions.push("o.status = ?");
            params.push(status);
        }

        if (search) {
            conditions.push("(o.order_number LIKE ? OR o.shipping_address LIKE ?)");
            params.push(`%${search}%`, `%${search}%`);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " ORDER BY o.created_at DESC";

        const results = await query(sql, params);
        return res.status(200).json(results);
    } catch (err) {
        console.error("getAllOrders SQL error:", err.sqlMessage || err.message);
        console.error("SQL:", err.sql);
        return res.status(500).json({
            message: "Database Error",
            error: err.sqlMessage || err.message
        });
    }
};

// GET order by id
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const userCols = await getTableColumns("users");
        const productCols = await getTableColumns("products");

        const customerSelect = buildCustomerSelect(userCols);
        const productSelect = buildProductSelect(productCols);

        const orderSql = `
            SELECT 
                o.id,
                o.order_number,
                o.status,
                o.total_amount,
                o.payment_method,
                o.payment_status,
                o.shipping_address,
                o.notes,
                o.created_at,
                o.updated_at,
                ${customerSelect.nameSelect},
                ${customerSelect.emailSelect},
                ${customerSelect.phoneSelect}
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?;
        `;

        const itemsSql = `
            SELECT 
                oi.id,
                oi.quantity,
                oi.price,
                ${productSelect.nameSelect},
                ${productSelect.imageSelect},
                ${productSelect.categorySelect}
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?;
        `;

        const orders = await query(orderSql, [id]);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const items = await query(itemsSql, [id]);

        return res.status(200).json({
            ...orders[0],
            items
        });
    } catch (err) {
        console.error("getOrderById SQL error:", err.sqlMessage || err.message);
        console.error("SQL:", err.sql);
        return res.status(500).json({
            message: "Database Error",
            error: err.sqlMessage || err.message
        });
    }
};

// PUT update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatus = ["pending", "processing", "shipped", "delivered", "cancelled"];

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${allowedStatus.join(", ")}`
            });
        }

        const rows = await query("SELECT id, status FROM orders WHERE id = ?", [id]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const currentStatus = rows[0].status;

        if (currentStatus === "delivered" || currentStatus === "cancelled") {
            return res.status(400).json({
                message: "Cannot update completed or cancelled order"
            });
        }

        await query(
            `
            UPDATE orders
            SET status = ?, updated_at = NOW()
            WHERE id = ?
            `,
            [status, id]
        );

        return res.status(200).json({
            message: "Order status updated successfully"
        });
    } catch (err) {
        console.error("updateOrderStatus SQL error:", err.sqlMessage || err.message);
        console.error("SQL:", err.sql);
        return res.status(500).json({
            message: "Database Error",
            error: err.sqlMessage || err.message
        });
    }
};

// PUT cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const rows = await query("SELECT id, status FROM orders WHERE id = ?", [id]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const currentStatus = rows[0].status;

        if (currentStatus === "delivered" || currentStatus === "cancelled") {
            return res.status(400).json({
                message: "Cannot cancel this order"
            });
        }

        await query(
            `
            UPDATE orders
            SET status = 'cancelled', updated_at = NOW()
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            message: "Order cancelled successfully"
        });
    } catch (err) {
        console.error("cancelOrder SQL error:", err.sqlMessage || err.message);
        console.error("SQL:", err.sql);
        return res.status(500).json({
            message: "Database Error",
            error: err.sqlMessage || err.message
        });
    }
};