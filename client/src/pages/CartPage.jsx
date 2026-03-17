import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getProductById } from '../api/productApi';

export function CartPage() {
  const { cart: cartFromContext, setCart } = useOutletContext(); 

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartDetails = async () => {
      console.log('Fetching cart with:', cartFromContext); 
      if (!cartFromContext || cartFromContext.length === 0) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const promises = cartFromContext.map(item => getProductById(item.id));
        const results = await Promise.all(promises);

        const detailedItems = results.map((product, index) => ({
          ...product,
          quantity: cartFromContext[index].quantity || 1
        }));

        setCartItems(detailedItems);
      } catch (error) {
        console.error("Lỗi API:", error);
        alert("Có lỗi khi tải giỏ hàng. Vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartDetails();
  }, [cartFromContext]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartFromContext.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cartFromContext.filter(item => item.id !== itemId);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (isLoading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Đang kết nối API...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Giỏ Hàng Của Bạn</h2>
      
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống. Hãy quay lại cửa hàng để chọn đồ!</p>
      ) : (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '2', minWidth: '300px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #eee' }}>
                <img 
                  src={item.image_url || 'https://via.placeholder.com/100'} 
                  alt={item.name} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '20px' }} 
                />
                <div style={{ flex: '1' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                  <p style={{ color: '#d9534f', fontWeight: 'bold' }}>
                    {item.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      style={{ padding: '5px 10px', marginRight: '10px' }} 
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '14px', color: '#666', marginRight: '10px' }}>Số lượng: {item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      style={{ padding: '5px 10px', marginRight: '20px' }}
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      style={{ padding: '5px 10px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px' }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: '1', minWidth: '280px', padding: '25px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#f9f9f9', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0 }}>Thanh toán</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', fontSize: '18px' }}>
              <span>Tổng cộng:</span>
              <strong style={{ color: '#d9534f' }}>
                {calculateTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </strong>
            </div>
            <button style={{ width: '100%', padding: '15px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              TIẾN HÀNH ĐẶT HÀNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}