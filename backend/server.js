const connection = require('./src/config/db.js');
const app = require('./src/app.js');

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running at ${port}`);

    // check if it connect or not
    connection.connect((err) => {
        if (err) {
            console.error(`Failed to connect to MySQL/MariaDB ${err.message}`);
            return;
        }
        console.log("Database connected");
    });

});
