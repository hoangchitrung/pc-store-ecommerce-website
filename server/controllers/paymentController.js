// Thay đổi 1: Thêm ngoặc nhọn để import đúng chuẩn
const { PayOS } = require("@payos/node");

// Thay đổi 2: Truyền tham số dưới dạng một Object
const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY
});

const createPaymentLink = async (req, res) => {
  try {
    const { cartItems, totalAmount, userInfo } = req.body;

    const orderCode = Number(String(Date.now()).slice(-6)); 

    // Cập nhật lại phần requestData trong file paymentController.js
const requestData = {
    orderCode: orderCode,
    amount: Math.round(Number(totalAmount)), 
    description: "Thanh toan don hang",
    items: cartItems.map(item => ({
        name: item.name,
        quantity: Number(item.quantity),
        price: Math.round(Number(item.price)) 
    })),
    returnUrl: `${process.env.YOUR_DOMAIN}/checkout-success`,
    cancelUrl: `${process.env.YOUR_DOMAIN}/checkout-cancel`,
};

    // Thay đổi 3: Gọi hàm tạo link theo cú pháp mới của PayOS
    const paymentLink = await payos.paymentRequests.create(requestData);

    res.status(200).json({
      success: true,
      checkoutUrl: paymentLink.checkoutUrl,
      orderCode: orderCode
    });

  } catch (error) {
    console.error("Lỗi tạo link thanh toán:", error);
    res.status(500).json({ success: false, message: "Không thể tạo link thanh toán" });
  }
};

const handleWebhook = async (req, res) => {
  try {
    // Thay đổi 4: Xác thực webhook bằng cú pháp mới
    const webhookData = payos.webhooks.verify(req.body);

    if (webhookData.code === "00") {
      const orderCode = webhookData.orderCode;
      console.log(`Đơn hàng ${orderCode} đã thanh toán thành công qua Webhook!`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ success: false });
  }
};

module.exports = {
  createPaymentLink,
  handleWebhook
};