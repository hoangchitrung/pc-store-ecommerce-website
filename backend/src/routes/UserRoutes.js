const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// routes
router.get("/", userController.getAllUserController);
router.get("/:id", userController.getUserByIdController);
router.post("/", userController.addUserController);
router.delete("/:id", userController.removeUserByIdController);
module.exports = router;