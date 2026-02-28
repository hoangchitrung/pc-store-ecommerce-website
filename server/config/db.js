const mysql = require("mysql2")
require("dotenv").config();

const connection = mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE })

connection.connect((err) => {
    if (err) {
        console.error(`Failed to connect MySQL: ${err}`);
        return
    }

    console.log(process.env.DB_DATABASE);
    console.log("Database connected!");
})

module.exports = connection