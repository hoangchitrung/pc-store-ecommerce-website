const express = require("express")
const cors = require("cors")
const connection = require("./db")

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

// GET all products
app.get("/products", (req, res) => {
    const sql = "SELECT * FROM products;"
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: `Database Error: ${err}` });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "There are no product on the list" });
        }
        res.json(results)
    });
});

app.get("/products/:id", (req, res) => {
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

        res.json(results[0]);
    });
});

app.put("/products/:id", (req, res) => {
    const { id } = req.params
    const product = products.find((p) => p.id === parseInt(id))

    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }

    if (req.body.name !== undefined) product.name = req.body.name
    if (req.body.price !== undefined) product.name = req.body.name
    if (req.body.stock !== undefined) product.name = req.body.name

    res.json(products)
})

app.delete("/products/:id", (req, res) => {
    const { id } = req.params
    const product = products.find((p) => p.id === parseInt(id))

    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }

    // assign array after filter
    products = products.filter((p) => p.id !== parseInt(id))

    res.json(products)
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})