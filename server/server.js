const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// PRODUCT ROUTES
const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes)

// SERVER
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
