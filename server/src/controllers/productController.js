const connection = require("../config/db");

// get all products
exports.getAllProduct = (req, res) => {
    const { category } = req.query;
    let sql = "SELECT * FROM products";
    let params = [];

    if (category) {
        sql += " WHERE category = ?";
        params.push(category);
    }

    connection.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ message: `Database Error: ${err}` });
        }
        return res.status(200).json(results);
    });
};

// get product by id
exports.getProductById = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM products
                    WHERE id = ?;
        `;
    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: `Database Error: ${err}` });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: `Product not found` });
        }

        return res.json(results[0]);
    });
};

// add product
exports.addProduct = (req, res) => {
    const {
        name,
        description,
        category,
        brand,
        price,
        stock_quantity,
        tdp,
        image_url,
        specifications,
        serial_number_required,
        is_active,
    } = req.body;

    if (!name || !category || !brand || price === undefined) {
        return res.status(400).json({
            message: "name, category, brand, and price are required",
        });
    }

    const normalizedSpecifications =
        typeof specifications === "object" && specifications !== null
            ? JSON.stringify(specifications)
            : specifications;

    const sql = `INSERT INTO products(name, description, category, brand, price, stock_quantity, tdp, image_url, specifications, serial_number_required, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    connection.query(
        sql,
        [
            name,
            description,
            category,
            brand,
            price,
            stock_quantity ?? 0,
            tdp,
            image_url,
            normalizedSpecifications,
            serial_number_required ?? false,
            is_active ?? true,
        ],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: `Database Error: ${err}` });
            }
            return res.status(201).json({ message: "Product created", id: results.insertId });
        },
    );
};

// update product
exports.updateProductById = (req, res) => {
    const { id } = req.params;
    const allowedFields = [
        "name",
        "description",
        "category",
        "brand",
        "price",
        "stock_quantity",
        "tdp",
        "image_url",
        "specifications",
        "serial_number_required",
        "is_active",
    ];

    const updates = [];
    const values = [];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updates.push(`${field} = ?`);

            if (field === "specifications" && typeof req.body[field] === "object" && req.body[field] !== null) {
                values.push(JSON.stringify(req.body[field]));
            } else {
                values.push(req.body[field]);
            }
        }
    });

    if (updates.length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
    }

    const sql = `UPDATE products SET ${updates.join(", ")} WHERE id = ?;`;
    values.push(id);

    connection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: `Database Error: ${err}` });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product updated" });
    });
};

exports.deleteProductById = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM products WHERE id = ?;";
    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: `Database Error: ${err}` });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted" });
    });
};