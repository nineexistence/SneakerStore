import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import "./css/MyOrder.css";

const MyOrder = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/orders/user/${user.email}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchOrders();
  }, [user]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:9000/orders/invoice/${orderId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Failed to download invoice. Please try again later.");
    }
  };

  if (loading) return <p className="center">Loading your orders...</p>;
  if (orders.length === 0) return <p className="center">No orders found.</p>;

  return (
    <div className="order-container">
      <h2>My Orders</h2>
      {orders.map((order, index) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <span
              className={`status-dot ${
                order.status === "Preparing" ? "blink-green" : "gray"
              }`}
            ></span>
            <span className="order-status">
              {order.status === "Delivered"
                ? `Delivered on ${new Date(order.updatedAt).toLocaleDateString()}`
                : "Preparing"}
            </span>
          </div>

          <div className="order-body">
            <div className="item-list">
              {order.items.slice(0, 2).map((item, i) => (
                <div key={i} className="order-item">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <p>{item.title}</p>
                    <small>₹{item.price} × {item.quantity}</small>
                  </div>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="extra-count">+{order.items.length - 2}</div>
              )}
            </div>

            <div className="order-actions">
              <button onClick={() => handleDownloadInvoice(order._id)}>Get invoice</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrder;
