# System Overview

**Mục tiêu:** Xây dựng hệ thống thương mại điện tử cho linh kiện máy tính, hỗ trợ người dùng tìm kiếm, xây dựng cấu hình (Build PC) và đặt hàng trực tuyến, tin tức mới về công nghệ.

## Functional Requirements

### Product Module

#### Display

- Hệ thống cho phép hiển thị sản phẩm với các thuộc tính như (Tên sản phẩm, Giá, RAM, Dung Lượng, CPU,...).

#### Filter

- Người dùng có thể lọc nhiều tiêu chí cùng nhau (VD: Mainboard + Hãng + Socket + Giá).

#### Compare

- Cho phép người dùng chọn 2-3 sản phẩm để so sánh thông số kỹ thuật.

#### Build PC

- Add to Cart: Cho phép thêm toàn bộ cấu hình vừa build vào trong giỏ hàng.
- Estimator(Tính công suất nguồn): Mỗi linh kiện đều có công sức tiêu thụ điện (TDP) và cộng lại.
- Compatibility Check: Kiểm tra tính tương thích (VD: CPU socket này phải dùng với main hỗ trợ socket này, và Máy này nên sử dụng PSU với công xuất như thế nào).

#### Order & Checkout

- Order Management: Quản lý giỏ hàng (Cập nhật số lượng, xóa, xác nhận thanh toán).
- Integrated: VNPay, PayOS.
- Email Verification: Gửi email xác nhận đơn hàng tự động (Invoice Generation).

#### Admin Dashboard

- Dashboard: Dashboard thống kê doanh thu theo ngày/tháng/năm, sản phẩm bán chạy, tồn kho
- Import Management: Quản lý kho, đồ công nghệ cần quản lí Serial Number/IMEI để bảo hành.

#### Non-Functional Requirements

- **Performance**
  - Chức năng Build PC phải cập nhật tổng giá cấu hình theo thời gian thực khi người dùng thêm hoặc xóa linh kiện.
- **Security**
  - Mật khẩu người dùng phải được mã hóa (hash) trước khi lưu trong cơ sở dữ liệu.
  - Hệ thống phải phân quyền rõ ràng giữa Admin và Customer, Staff.
  - Các giao dịch đặt hàng phải được bảo vệ khỏi truy cập trái phép.
  - Hệ thống phải ngăn chặn các tấn công phổ biến như SQL Injection và Cross-Site Scripting (XSS).
- **Reliability**
  - Hệ thống phải hoạt động ổn định 24/7, hạn chế tối đa lỗi hệ thống.
  - Dữ liệu đơn hàng và người dùng phải được lưu trữ chính xác và không bị mất.
  - Hệ thống phải có cơ chế sao lưu dữ liệu định kỳ.
- **Compatibility**
  - Hệ thống phải hoạt động tốt trên các trình duyệt phổ biến như Chrome, Edge, Firefox.
  - Giao diện phải tương thích với nhiều kích thước màn hình (desktop, tablet, mobile).
- **Accuracy**
  - Giá tiền hiển thị trong cấu hình Build PC phải chính xác và đồng bộ với giá trong CSDL sản phẩm.
  - Thông tin linh kiện phải luôn được cập nhật mới nhất.
- **Usability**
  - Giao diện Build PC phải trực quan, cho phép người dùng:
    - Chọn linh kiện theo từng bước
    - Xem cấu hình đã chọn ở một khu vực riêng
    - Người dùng có thể dễ dàng thay đổi linh kiện mà không cần xây dựng lại từ đầu.

### Technology

- **Frontend**: ReactJS
- **Backend**: NodeJS
- **Database**: MySQL
