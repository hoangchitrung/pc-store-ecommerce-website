const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

// USER ROUTES
const userRoutes = require("./routes/UserRoutes");
app.use("/api/users", userRoutes);

module.exports = app;