const express = require("express");
const router = express.Router();
const { createPaymentLink, handleWebhook, cancelPayment } = require("../controllers/paymentController");

router.post("/create-link", createPaymentLink);
// For webhook signature verification we need the raw request body. Use express.raw only for this route.
router.post("/webhook", handleWebhook);
router.put("/cancel/:orderCode", cancelPayment);

module.exports = router;