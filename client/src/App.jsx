import "./App.css";
import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom"; 

import { Navbar } from "./components/Navbar.jsx";

export default function App() { 
  const { pathname } = useLocation();
  
  const [cart, setCart] = useState([]);

  // Hàm thêm sản phẩm vào giỏ
  const onAdd = (product) => {
    const exist = cart.find((x) => x.id === product.id);
    if (exist) {
      setCart(
        cart.map((x) =>
          x.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const hideNavbar = pathname === "/signup" || pathname === "/signin";
  
  return (
    <>
      {/* Truyền số lượng vào Navbar để hiển thị icon giỏ hàng */}
      {!hideNavbar && <Navbar cartCount={cart.length} />} 
      
      {/* Render các route con qua Outlet, truyền props nếu cần */}
      <Outlet context={{ onAdd, cart, setCart }} /> 
    </>
  );
}