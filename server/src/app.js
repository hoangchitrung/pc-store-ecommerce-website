const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();

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
app.use("/api/users", userRoutes);

// AUTH ROUTES
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// PAYMENT ROUTES
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

module.exports = app;