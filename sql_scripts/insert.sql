-- Insert mock users
INSERT INTO users (fullname, email, password, address, phone, role) VALUES
('Nguyễn Văn A', 'customer1@techforge.com', '$2b$10$examplehashedpassword1', '123 Đường Nguyễn Huệ, TP.HCM', '0912345678', 'customer'),
('Trần Thị B', 'customer2@techforge.com', '$2b$10$examplehashedpassword2', '456 Đường Lê Lợi, Hà Nội', '0987654321', 'customer'),
('Lê Văn C', 'admin@techforge.com', '$2b$10$examplehashedpassword3', '789 Đường Trần Hưng Đạo, TP.HCM', '0901234567', 'admin'),
('Phạm Thị D', 'staff@techforge.com', '$2b$10$examplehashedpassword4', '321 Đường Cách Mạng Tháng 8, Hà Nội', '0923456789', 'staff');

-- Insert mock products (CPUs, Motherboards, RAM)
INSERT INTO products (name, description, category, brand, price, stock_quantity, tdp, image_url, specifications, serial_number_required, is_active) VALUES
('Intel Core i7-13700K', 'Processor Intel Core i7 thế hệ 13, socket LGA1700, 16 cores/24 threads', 'CPU', 'Intel', 7500000, 15, 125, '/images/cpu-i7.jpg', '{"cores": 16, "threads": 24, "socket": "LGA1700", "base_clock": "3.4GHz", "boost_clock": "5.4GHz"}', false, true),
('AMD Ryzen 5 7600X', 'Processor AMD Ryzen thế hệ 7, socket AM5, 6 cores/12 threads', 'CPU', 'AMD', 4500000, 12, 105, '/images/cpu-ryzen.jpg', '{"cores": 6, "threads": 12, "socket": "AM5", "base_clock": "4.7GHz", "boost_clock": "5.3GHz"}', false, true),
('MSI Z790-A PRO', 'Mainboard MSI Z790 chipset, socket LGA1700, hỗ trợ DDR5', 'Motherboard', 'MSI', 3500000, 8, 0, '/images/mobo-z790.jpg', '{"socket": "LGA1700", "chipset": "Z790", "memory_type": "DDR5", "form_factor": "ATX"}', false, true),
('ASUS ROG STRIX X870-E', 'Mainboard ASUS ROG X870-E chipset, socket AM5, hỗ trợ DDR5', 'Motherboard', 'ASUS', 4000000, 10, 0, '/images/mobo-x870.jpg', '{"socket": "AM5", "chipset": "X870-E", "memory_type": "DDR5", "form_factor": "ATX"}', false, true),
('Corsair Vengeance 32GB DDR5', 'RAM Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz', 'RAM', 'Corsair', 2500000, 20, 0, '/images/ram-corsair.jpg', '{"capacity": "32GB", "speed": "6000MHz", "type": "DDR5", "modules": 2}', false, true),
('Kingston Fury 32GB DDR5', 'RAM Kingston Fury DDR5 32GB (2x16GB) 5600MHz', 'RAM', 'Kingston', 2200000, 18, 0, '/images/ram-kingston.jpg', '{"capacity": "32GB", "speed": "5600MHz", "type": "DDR5", "modules": 2}', false, true);

-- Insert compatibility rules
INSERT INTO product_compatibility (product_id, compatible_product_id, compatibility_type, is_compatible, notes) VALUES
(1, 3, 'socket_type', true, 'Intel i7-13700K works with Z790 motherboard'),
(2, 4, 'socket_type', true, 'AMD Ryzen 5 7600X works with X870-E motherboard'),
(3, 5, 'memory_type', true, 'Z790 supports DDR5 RAM'),
(4, 6, 'memory_type', true, 'X870-E supports DDR5 RAM');

-- Insert shopping cart items
INSERT INTO shopping_cart (user_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 3, 1),
(2, 2, 1),
(2, 4, 2);

-- Insert PC builds
INSERT INTO pc_builds (user_id, name, description, total_price, total_tdp, is_saved) VALUES
(1, 'Gaming Build - Intel', 'High-end gaming PC với Intel i7-13700K', 13500000, 125, true),
(2, 'Streaming Build - AMD', 'PC dùng cho streaming và content creation', 10700000, 105, true);

-- Insert build items
INSERT INTO build_items (build_id, product_id, quantity, price_at_time) VALUES
(1, 1, 1, 7500000),
(1, 3, 1, 3500000),
(1, 5, 1, 2500000),
(2, 2, 1, 4500000),
(2, 4, 1, 4000000),
(2, 6, 1, 2200000);

-- Insert orders
INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, payment_status, shipping_address, notes) VALUES
(1, 'ORD20260213001', 11000000, 'delivered', 'vnpay', 'paid', '123 Đường Nguyễn Huệ, TP.HCM', 'Giao hàng thành công'),
(2, 'ORD20260213002', 8700000, 'processing', 'payos', 'paid', '456 Đường Lê Lợi, Hà Nội', 'Đang chuẩn bị hàng'),
(1, 'ORD20260212001', 5200000, 'pending', 'cash', 'pending', '123 Đường Nguyễn Huệ, TP.HCM', 'Chờ xác nhận từ khách hàng');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 1, 7500000, 7500000),
(1, 5, 1, 2500000, 2500000),
(1, 3, 1, 3500000, 3500000),
(2, 2, 1, 4500000, 4500000),
(2, 6, 1, 2200000, 2200000),
(2, 4, 1, 4000000, 4000000),
(3, 5, 2, 2500000, 5000000),
(3, 6, 1, 200000, 200000);

-- Insert payments
INSERT INTO payments (order_id, transaction_id, payment_method, amount, status, response_data) VALUES
(1, 'TXN20260213001', 'vnpay', 11000000, 'success', '{"vnpay_code": "00", "order_info": "Payment successful"}'),
(2, 'TXN20260213002', 'payos', 8700000, 'success', '{"payos_code": "00", "order_info": "Payment successful"}'),
(3, NULL, 'cash', 5200000, 'pending', '{"status": "Waiting for customer confirmation"}');

-- Insert product serial numbers (for warranty tracking)
INSERT INTO product_serial_numbers (product_id, order_item_id, serial_number, imei, warranty_start, warranty_end) VALUES
(1, 1, 'INTEL-I7-13700K-001', NULL, '2026-02-13', '2028-02-13'),
(5, 2, 'CORSAIR-RAM-32GB-001', NULL, '2026-02-13', '2031-02-13'),
(2, 5, 'AMD-RYZEN-7600X-001', NULL, '2026-02-13', '2028-02-13');

-- Insert news articles
INSERT INTO news_articles (title, slug, content, author_id, category, featured_image, is_published, published_at) VALUES
('Intel Core Ultra Series Ra Mắt', 'intel-core-ultra-series-2024', 'Intel vừa công bố dòng Core Ultra mới với hiệu năng tăng 20% so với thế hệ trước...', 3, 'CPU News', '/images/news-intel-ultra.jpg', true, '2026-02-13 10:30:00'),
('AMD Ryzen 9 7950X3D - Hiệu Năng Gaming Vô Đối', 'amd-ryzen-9-7950x3d-review', '3D V-Cache technology của AMD mang lại hiệu năng gaming tuyệt vời, đặc biệt ở 1440p...', 3, 'Processor Review', '/images/news-amd-7950x3d.jpg', true, '2026-02-12 14:15:00'),
('Hướng Dẫn Chọn Linh Kiện PC Phù Hợp', 'guide-pc-components-selection', 'Bài hướng dẫn chi tiết về cách chọn CPU, GPU, RAM, SSD cho máy tính phù hợp...', 4, 'Tutorial', '/images/news-guide.jpg', true, '2026-02-11 09:00:00');