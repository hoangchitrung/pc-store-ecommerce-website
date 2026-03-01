const connection = require("../config/db");

// get all products
exports.getAllProduct = (req, res) => {
    const sql = "SELECT * FROM products;";
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: `Database Error: ${err}` });
        }
        if (results.length === 0) {
            return res
                .status(404)
                .json({ message: "There are no product on the list" });
        }
        res.json(results);
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
    const sql = `INSERT INTO products(name, description, category, brand, price, stock_quantity, tdp, image_url, specifications, serial_number_required, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    connection.query(
        sql,
        [
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
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.price !== undefined) product.name = req.body.name;
    if (req.body.stock !== undefined) product.name = req.body.name;

    return res.json(products);
};

exports.deleteProductById = (req, res) => {
    const { id } = req.params;
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // assign array after filter
    products = products.filter((p) => p.id !== parseInt(id));

    return res.json(products);
}