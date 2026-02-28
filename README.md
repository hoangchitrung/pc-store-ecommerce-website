# Project Structure

pc-store-ecommerce/
├── client/              # Toàn bộ code React (Vite)
│   ├── src/
│   │   ├── components/  # Các thành phần dùng chung (Header, Footer, Card)
│   │   ├── pages/       # Các trang chính (HomePage, ProductDetail, Admin)
│   │   ├── hooks/       # Nơi chứa các logic fetch dữ liệu
│   │   └── App.jsx
├── server/              # Toàn bộ code Node.js + Express
│   ├── config/          # Cấu hình Database (db.js)
│   ├── routes/          # Định nghĩa các đường dẫn API
│   ├── controllers/     # Logic xử lý dữ liệu (Query SQL ở đây)
│   └── server.js        # File chạy chính
└── sql_scripts/         # Lưu lại các file .sql