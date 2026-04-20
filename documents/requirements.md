# PC Store Ecommerce Website

## Requirements

- A PC Components Selling Website that allows users to browse and purchase computer components online. The website should provide a user-friendly interface, secure payment options, and efficient order processing.

## Stakeholders

- Client who browse products, purchase, find/search, add to cart, wishlist.
- Staff who delivery user order after confirm the payment and check if the product is out of stock or not.
- Admin who manage the whole systems manage products, users, staffs, inventory and payment.

### Functional Requirements

- User Registration and Authentication:
  - Sign Up/Sign In using JWT.
  - Password Hashed after signed-up.
  - User has 2 roles (Admin/Staff/Client).
  - Admin:
    - Manage (create, read, update, delete) and assign role for user (Staff/Client).
    - Manage (create, read, update, delete) for products.
    - Manage payments.
    - Manage inventory.
  - Staff:
    - Confirm user order after user confirm payment, update status.
    - Check product if it out of stock or not.
  - User:
    - Browse Products.
    - Find/Search/Filter Products.
    - Purchase Products.
    - Payments.

### Non-Functional Requirements

- Comfort smoothly UX/UI experiences.
- Sign Up/Sign In with Google.
- Security (JWT, Bcrypt, XSS).
- Role-based access control.
- Rate Limit.
- Responsive for mobile/desktop/website.
- Toast message notification.
- Announce sales product to user.
- Responsive Admin Dashboard.

### Technology

- **Frontend:** ReactJS, Tailwind
- **Backend:** NodeJS
- **Database:** MySQL/MariaDB
- **Cache:** Redis
