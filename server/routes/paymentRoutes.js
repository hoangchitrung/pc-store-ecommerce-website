const express = require("express");
const router = express.Router();
const { createPaymentLink } = require("../controllers/paymentController");

// POST http://localhost:5000/api/payment/create-link
router.post("/create-link", createPaymentLink);

module.exports = router;