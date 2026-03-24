const app = require("./src/app.js")

const PORT = 5000;

// SERVER
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
