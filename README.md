# PC Ecomerce Store

## 1. Introductions

- A PC e-commerce store wesbite that sells computer components and builds PCs. The goals of this project are focus on the user purchasing experience, display information clearly and strongly support for users who want to build specs, compare PC specifications easily.

## 2. Functional

- Product categories (GPU, CPU, RAM, SSD, v.v.).
- Product details with specifications and images.
- Cart and order process.
- UX/UI compatible with desktop and mobile devices.

## 3. Stakeholders

- Client
- Staff
- Admin

## 4. Goal Design

- Easy to understand and expandable: code and structure HTML, JS are clearly easy to maintain.
- Good accessibility (semantic HTML + ARIA).
- Designed for study and demonstration purposes.

## 5. Use Case Diagram Explanation

- You can see the all the diagrams in `diagrams/`.
- The system has 3 staksholders which are `Admin`, `Client`, `Staff`.
- **Client** can browse products, search/filter products, place order, cancel order,sign in/sign up, add to cart, add to wishlist.
- **Staff** handles the process of order and update order status.
- **Admin** can manage products, users, inventory.

### UseCase relationships

- `<<include>>` is used for mandatory sub-flows that are always executed.
  - Example: `Place Order` `<<include>>` `Checkout`
  - Example: `Checkout` `<<include>>` `Validate Cart`
  - Example: `Checkout` `<<include>>` `Payment Method`

- `<<extend>>` is used for optional or conditional behavior.
  - Example: `SignUp/SignIn` `<<extend>>` `Checkout` (only when the user is not authenticated)

## 6. Technology

- **Database:**: MariaDB
- **Frontend**: ReactJS
- **Backend**: NodeJS, Express

## 7. Access

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:5000>