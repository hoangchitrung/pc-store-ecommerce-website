require("dotenv").config();
const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // local vite server
    credentials: true
}));
app.use(cookieParser());

// PRODUCT ROUTES
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// USER ROUTES
const userRoutes = require("./routes/userRoutes");
app.use("/api/v1/users", userRoutes);

// AUTH ROUTES
const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);
// ORDER ROUTES
const orderRoutes = require("./routes/Orderroutes");
app.use("/api/orders", orderRoutes);
// SERVER
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
