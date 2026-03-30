const express = require("express");
const router = express.Router();

// Lấy 2 hàm xử lý đơn hàng từ controller vào
const { getAllOrders, updateOrderStatus } = require("../controllers/orderController");

// Mở cửa cho React gọi
router.get("/", getAllOrders);
router.put("/:orderCode/status", updateOrderStatus);

module.exports = router;