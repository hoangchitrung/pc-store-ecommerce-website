const mysql = require("mysql2");
require("dotenv").config();

// thêm dấu hoặc để chạy api
const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "techforge_database",
});

// Kết nối database
connection.connect((err) => {
    if (err) {
        console.error(" Failed to connect MySQL:");
        console.error(err.message);
        process.exit(1); // dừng server nếu DB lỗi
    }

    console.log(" Database connected!");
    console.log(" DB Info:", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
    });
});

module.exports = connection;