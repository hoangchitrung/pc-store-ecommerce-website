const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProduct);
router.get("/:id", productController.getProductById);
router.post("/", productController.addProduct);
router.put("/:id", productController.updateProductById);
router.delete("/:id", productController.deleteProductById);

module.exports = router;