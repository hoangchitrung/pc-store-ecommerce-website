```text
# PC Store Ecommerce Website

## Project structure

pc-store-ecommerce/
├── client/              # Toàn bộ code React (Vite)
│   ├── src/
│   │   ├── components/  # Các thành phần dùng chung (Header, Footer, Card)
│   │   ├── pages/       # Các trang chính (HomePage, ProductDetail, Admin)
│   │   ├── api/         # Nơi chứa các logic fetch dữ liệu
│   │   ├── assets/      # Static assets (images, icons)
│   │   └── App.jsx
└── server/              # Toàn bộ code Node.js + Express
    ├── config/          # Cấu hình Database (db.js)
    ├── routes/          # Định nghĩa các đường dẫn API
    ├── controllers/     # Logic xử lý dữ liệu (Query SQL ở đây)
    ├── middlewares/     # Custom middleware (authentication, etc.)
    ├── services/        # Reusable business logic
    ├── utils/           # Utility functions
    └── server.js        # File chạy chính
└── sql_scripts/         # Lưu lại các file .sql

## Prerequisites

- Node.js >= 16
- npm >= 8
- MySQL server (local hoặc remote) với database và user đã cấu hình

## 1. Clone source code

```bash
git clone https://github.com/hoangchitrung/pc-store-ecommerce-website.git
cd pc-store-ecommerce-website
```

## 2. Backend setup (server)

1. Vào thư mục server:

```bash
cd server
```

2. Cài dependencies:

```bash
npm install
```

3. Tạo file `.env` (hoặc copy từ `.env.example`) và cấu hình:

```text
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=pc_store
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key
```

- Nếu không dùng PayOS, bạn có thể mock/gọi API giả để test (hoặc bỏ phần `payment` tạm thời).

4. Tạo database & cấu trúc bảng (nếu chưa có) dùng file `sql_scripts/create_table.sql` và nạp dữ liệu mẫu `sql_scripts/insert.sql`.

5. Chạy server:

```bash
npm start
# hoặc
npm run dev
```

## 3. Frontend setup (client)

1. Mở terminal mới, vào thư mục client:

```bash
cd client
```

2. Cài dependencies:

```bash
npm install
```

3. Chạy frontend (Vite):

```bash
npm run dev
```

4. Mở trình duyệt tới `http://localhost:5173`.

## 4. Luồng test nhanh

- Đăng ký / đăng nhập (`/signup` & `/signin`)
- Xem sản phẩm (`/products`, chi tiết `/products/:id`)
- Thêm sản phẩm vào giỏ (`Add to cart`)
- Mở giỏ (`/carts`) và tiến hành thanh toán (`/checkout`)
- Tương tác chức năng cancel/success (`/checkout-cancel`, `/checkout-success`)

```
