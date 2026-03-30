<<<<<<< HEAD
const app = require("./src/app.js")

const PORT = 5000;

// SERVER
=======
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());

// ── Routes ──────────────────────────────────────────────────
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/v1/users", userRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customers", customerRoutes);
// ── Start ────────────────────────────────────────────────────
>>>>>>> origin/Hao
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});