const express = require("express");
const router  = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware  = require("../middlewares/authMiddleware");

// All order routes require authentication
router.use(authMiddleware);

router.get("/",          orderController.getAllOrders);
router.get("/:id",       orderController.getOrderById);
router.put("/:id/status", orderController.updateOrderStatus);
router.put("/:id/cancel", orderController.cancelOrder);

module.exports = router;