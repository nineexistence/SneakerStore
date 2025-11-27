
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './css/OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, shippingAddress, totalPrice } = location.state || {};

  useEffect(() => {
    if (orderId) {
      localStorage.setItem("lastOrderId", orderId);
    }
  }, [orderId]);

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <h1 className="order-success-title">Order Successful!</h1>
        <p className="order-success-message">Thank you for your purchase. Your order is on its way!</p>

        <div className="order-summary">
          <div className="order-summary-item">
            <p>Order Number:</p>
            <span>#{orderId}</span>
          </div>
          <div className="order-summary-item">
            <p>Shipping Address:</p>
            <span>{`${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zip}, ${shippingAddress.country}`}</span>
          </div>
          <div className="order-summary-item">
            <p>Total Price:</p>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="order-success-actions">
          <button className="btn continue-shopping" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
          <button className="btn view-orders" onClick={() => navigate(`/my-orders/${orderId}`)}>
            View My Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
