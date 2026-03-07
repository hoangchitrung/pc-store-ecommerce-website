const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// PRODUCT ROUTES
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// USER ROUTES
const userRoutes = require("./routes/userRoutes");
app.use("/api/v1/users", userRoutes);

// SERVER
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
