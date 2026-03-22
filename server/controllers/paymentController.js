const PayOS = require("@payos/node");

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

const createPaymentLink = async (req, res) => {
  try {
    // 1. Nhận thông tin giỏ hàng và tổng tiền từ Frontend gửi lên
    const { cartItems, totalAmount, userInfo } = req.body;

    // TẠI ĐÂY: Bạn sẽ có logic lưu thông tin vào bảng Orders trong Database (trạng thái Pending)
    // Ví dụ: const newOrder = await Order.create({ userId, totalAmount, status: "Pending" });
    
    const orderCode = Number(String(Date.now()).slice(-6)); 

    // 3. Cấu hình dữ liệu gửi lên PayOS
    const requestData = {
      orderCode: orderCode, 
      amount: totalAmount, 
      description: "Thanh toan don hang PC STORE", 
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      returnUrl: `${process.env.YOUR_DOMAIN}/checkout-success`,
      cancelUrl: `${process.env.YOUR_DOMAIN}/checkout-cancel`,
    };

    const paymentLink = await payos.createPaymentLink(requestData);

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

module.exports = {
  createPaymentLink
};