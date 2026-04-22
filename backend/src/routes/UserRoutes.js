const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// routes
router.get("/", userController.getAllUserController);

module.exports = router;