-- TABLES

CREATE TABLE users (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone_number VARCHAR(20),
    role ENUM('client', 'admin', 'staff'),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    UNIQUE KEY uq_users_phone_number (phone_number),
    INDEX idx_email (email),
    INDEX idx_phone_number (phone_number)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    image VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_product_name (name),
    INDEX idx_product_brand (brand),
    INDEX idx_product_brand_price (brand, price)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE wishlist_items (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE carts (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE cart_items (
    id INT NOT NULL AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    Foreign Key (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
    Foreign Key (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE orders (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_code VARCHAR(255) NOT NULL,
    status ENUM(
        'COMPLETED',
        'PENDING',
        'CANCELED'
    ),
    payment_status ENUM('UNPAID', 'PENDING', 'PAID') DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    Foreign Key (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY uq_order_code (order_code),
    INDEX idx_order_user_id (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_payment_status (payment_status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE payments (
    id INT NOT NULL AUTO_INCREMENT,
    order_id INT NOT NULL,
    transaction_id VARCHAR(255),
    provider VARCHAR(255) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('UNPAID', 'PENDING', 'PAID'),
    reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    Foreign Key (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    UNIQUE KEY uq_payments_provider_transaction (provider, transaction_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- SEED DATA (sample inserts for testing)

-- Users (5)
INSERT INTO
    users (
        first_name,
        last_name,
        hashed_password,
        email,
        address,
        phone_number,
        role
    )
VALUES (
        'John',
        'Doe',
        'hashed_pw_1',
        'john.doe@example.com',
        '123 Main St, Hanoi',
        '0123456789',
        'client'
    ),
    (
        'Jane',
        'Smith',
        'hashed_pw_2',
        'jane.smith@example.com',
        '456 Market St, HCM',
        '0987654321',
        'client'
    ),
    (
        'Alice',
        'Nguyen',
        'hashed_pw_3',
        'alice.nguyen@example.com',
        '789 Tran Phu, Danang',
        '0912345678',
        'client'
    ),
    (
        'Bob',
        'Tran',
        'hashed_pw_4',
        'bob.tran@example.com',
        '101 Nguyen Trai, Hue',
        '0901234567',
        'staff'
    ),
    (
        'Admin',
        'User',
        'hashed_pw_5',
        'admin@example.com',
        '1 Admin St, HN',
        '0999888777',
        'admin'
    );

-- Products (5)
-- Products (5)
INSERT INTO
    products (
        name,
        brand,
        price,
        quantity,
        image
    )
VALUES (
        'Gaming Laptop GL502',
        'Asus',
        1500.00,
        5,
        'https://example.com/images/products/gl502.jpg'
    ),
    (
        'Ultrabook Z',
        'Dell',
        1200.00,
        10,
        'https://example.com/images/products/ultrabook_z.jpg'
    ),
    (
        'Mechanical Keyboard',
        'Keychron',
        99.99,
        50,
        'https://example.com/images/products/keychron_keyboard.jpg'
    ),
    (
        'Wireless Mouse',
        'Logitech',
        49.99,
        100,
        'https://example.com/images/products/logitech_mouse.jpg'
    ),
    (
        'USB-C Cable',
        'Anker',
        9.99,
        200,
        'https://example.com/images/products/usb_c_anker.jpg'
    );

-- Carts (for user 1 and 2)
INSERT INTO carts (user_id) VALUES (1), (2);

-- Cart items
INSERT INTO
    cart_items (
        cart_id,
        product_id,
        quantity,
        unit_price,
        total_price
    )
VALUES (1, 3, 1, 99.99, 99.99),
    (1, 4, 2, 49.99, 99.98),
    (2, 5, 3, 9.99, 29.97);

-- Wishlist items
INSERT INTO
    wishlist_items (user_id, product_id)
VALUES (1, 1),
    (1, 3),
    (2, 4);

-- Orders (5)
INSERT INTO
    orders (
        user_id,
        order_code,
        status,
        payment_status,
        total_amount
    )
VALUES (
        1,
        'ORD-20260421-0001',
        'PENDING',
        'UNPAID',
        1600.00
    ),
    (
        2,
        'ORD-20260421-0002',
        'COMPLETED',
        'PAID',
        29.97
    ),
    (
        3,
        'ORD-20260421-0003',
        'COMPLETED',
        'PAID',
        99.99
    ),
    (
        1,
        'ORD-20260421-0004',
        'CANCELED',
        'UNPAID',
        9.99
    ),
    (
        4,
        'ORD-20260421-0005',
        'PENDING',
        'PENDING',
        1200.00
    );

-- Payments (linked to some orders)
INSERT INTO
    payments (
        order_id,
        transaction_id,
        provider,
        payment_method,
        amount,
        status,
        reason
    )
VALUES (
        1,
        'TXN0001',
        'Stripe',
        'card',
        1600.00,
        'PENDING',
        NULL
    ),
    (
        2,
        'TXN123456',
        'VNPay',
        'qr',
        29.97,
        'PAID',
        NULL
    ),
    (
        3,
        'TXN123457',
        'PayPal',
        'paypal',
        99.99,
        'PAID',
        NULL
    ),
    (
        5,
        NULL,
        'COD',
        'cash',
        1200.00,
        'UNPAID',
        'Cash on delivery'
    );