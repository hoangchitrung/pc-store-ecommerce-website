const { PayOS } = require("@payos/node"); // Bắt buộc phải có cặp ngoặc nhọn
const connection = require("../config/db");

// Khởi tạo PayOS chuẩn xác
const payos = new PayOS({
    clientId: process.env.PAYOS_CLIENT_ID,
    apiKey: process.env.PAYOS_API_KEY,
    checksumKey: process.env.PAYOS_CHECKSUM_KEY
});

const createPaymentLink = async (req, res) => {
    try {
        const { cartItems, totalAmount, userInfo } = req.body;
        const orderCode = Number(String(Date.now()).slice(-6));

        const userId = 1;
        const address = userInfo?.address || "Nhận tại cửa hàng";
        const phone = userInfo?.phone || "0000000000";
        const notes = userInfo?.notes || "Khách không để lại ghi chú";

        const sqlInsertOrder = "INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, payment_status, shipping_address, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(sqlInsertOrder, [userId, orderCode, totalAmount, 'pending', 'payos', 'pending', `${phone} - ${address}`, notes], async (err, orderResult) => {
            if (err) return res.status(500).json({ success: false, message: "Lỗi DB orders" });

            const orderId = orderResult.insertId;

            const orderItemsData = cartItems.map(item => [
                orderId,
                item.id || item.product_id,
                item.quantity,
                item.price,
                item.quantity * item.price
            ]);

            const sqlInsertItems = "INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES ?";
            connection.query(sqlInsertItems, [orderItemsData], async (errItems) => {
                if (errItems) return res.status(500).json({ success: false, message: "Lỗi lưu chi tiết đơn hàng." });

                const sqlInsertPayment = "INSERT INTO payments (order_id, transaction_id, payment_method, amount, status) VALUES (?, ?, ?, ?, ?)";
                connection.query(sqlInsertPayment, [orderId, orderCode, 'payos', totalAmount, 'pending'], async (errPayment) => {
                    if (errPayment) return res.status(500).json({ success: false, message: "Lỗi DB payments" });

                    try {
                        const requestData = {
                            orderCode: orderCode,
                            amount: Math.round(Number(totalAmount)),
                            description: "Thanh toan",
                            items: cartItems.map(item => ({
                                name: item.name.substring(0, 25),
                                quantity: Number(item.quantity),
                                price: Math.round(Number(item.price))
                            })),
                            returnUrl: `http://localhost:5173/checkout-success?orderCode=${orderCode}`,
                            cancelUrl: `http://localhost:5173/checkout-cancel?orderCode=${orderCode}`,
                        };

                        const paymentLink = await payos.paymentRequests.create(requestData);
                        return res.status(200).json({ success: true, checkoutUrl: paymentLink.checkoutUrl, orderCode: orderCode });
                    } catch (payosError) {
                        return res.status(500).json({ success: false, message: "Lỗi cổng thanh toán" });
                    }
                });
            });
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

const handleWebhook = async (req, res) => {
    console.log("-----------------------------------------");
    console.log("👉 ĐÃ NHẬN TIN NHẮN TỪ PAYOS!");

    try {
        const webhookData = await payos.webhooks.verify(req.body);

        console.log("👉 DỮ LIỆU GIẢI MÃ:", webhookData);

        const orderCode = webhookData.orderCode;

        if (orderCode) {
            const sqlUpdateOrder = "UPDATE orders SET payment_status = 'paid', status = 'processing' WHERE order_number = ?";
            connection.query(sqlUpdateOrder, [orderCode]);

            const responseData = JSON.stringify(webhookData);
            const sqlUpdatePayment = "UPDATE payments SET status = 'success', response_data = ? WHERE transaction_id = ?";

            connection.query(sqlUpdatePayment, [responseData, orderCode], (err) => {
                if (!err) {
                    console.log(`✅ CHỐT ĐƠN THÀNH CÔNG: Đơn ${orderCode} đã xanh DB!`);
                }
            });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ LỖI WEBHOOK:", error.message);
        return res.status(200).json({ success: true });
    }
};

const cancelPayment = (req, res) => {
    const { orderCode } = req.params;
    const sqlUpdateOrder = "UPDATE orders SET status = 'cancelled', payment_status = 'failed' WHERE order_number = ?";
    connection.query(sqlUpdateOrder, [orderCode]);

    const sqlUpdatePayment = "UPDATE payments SET status = 'failed' WHERE transaction_id = ?";
    connection.query(sqlUpdatePayment, [orderCode], (err) => {
        if (!err) return res.status(200).json({ success: true, message: "Đã cập nhật trạng thái Hủy" });
        return res.status(500).json({ success: false });
    });
};

module.exports = { createPaymentLink, handleWebhook, cancelPayment };