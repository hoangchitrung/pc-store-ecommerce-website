import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx';
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/carts", element: <CartPage /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/products/:id", element: <ProductDetailsPage /> },
    ],
  },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/signin", element: <SignInPage /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);