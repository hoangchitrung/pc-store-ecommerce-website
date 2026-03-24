const express = require("express");
const router = express.Router();
const { createPaymentLink, handleWebhook, cancelPayment } = require("../controllers/paymentController");

router.post("/create-link", createPaymentLink);
router.post("/webhook", handleWebhook);
router.put("/cancel/:orderCode", cancelPayment); 

module.exports = router;