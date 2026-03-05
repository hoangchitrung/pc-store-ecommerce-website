const mysql = require("mysql2");
require("dotenv").config();

// thêm dấu hoặc để chạy api
const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "techforge_database", 
});

connection.connect((err) => {
    if (err) {
        console.error(`Failed to connect MySQL: ${err}`);
        return;
    }

    console.log(process.env.DB_DATABASE);
    console.log("Database connected!");
});

module.exports = connection;
