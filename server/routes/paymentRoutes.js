const express = require("express");
const router = express.Router();

const { createPaymentLink, handleWebhook } = require("../controllers/paymentController");
// POST http://localhost:5000/api/payment/create-link
router.post("/create-link", createPaymentLink);
// POST http://localhost:5000/api/payment/webhook
router.post("/webhook", handleWebhook);
module.exports = router;

