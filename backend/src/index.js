const express = require("express")

const app = express()
const PORT = 3000

app.use(express.json())

const products = [
    { id: 1, name: "RTX 3050", price: 750, stock: 15 },
    { id: 2, name: "Intel i7", price: 350, stock: 10 },
    { id: 3, name: "RAM 32GB", price: 120, stock: 20 },
]

// GET all products
app.get("/products", (req, res) => {
    res.json(products)
})

app.get("/products/:id", (req, res) => {
    const { id } = req.params
    const product = products.find((p) => p.id === parseInt(id))

    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})