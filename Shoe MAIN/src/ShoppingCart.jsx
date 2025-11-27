import React from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import "./css/ShoppingCart.css";
import { FaTrash } from "react-icons/fa";

function ShoppingCart() {
  const { cartItems, updateQuantity, removeFromCart, updateSize } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.15;
  const total = subtotal - discount;

  const sizeOptions = ['6', '7', '8', '9', '10', '11', '12', '13'];

  return (
    <div className="shopping-cart-layout">
      <div className="shopping-cart-panel">
        <h1>Shopping Cart</h1>
        <div className="cart-header">
          <span>Product</span>
          <span>Quantity</span>
          <span>Total</span>
          <span></span>
        </div>

        {cartItems.map((item) => (
          <div className="cart-item-row" key={item.id + '-' + item.size}>
            <div className="item-info">
              <img src={item.image} alt={item.title} />
              <div>
                <h4>{item.title}</h4>
                <p>Set: Colour: {item.color || "Default"}</p>
                <label>
                  Size:{" "}
                  <select
                    value={item.size || '9'}
                    onChange={(e) => updateSize(item.id, e.target.value)}
                    className="cart-size-dropdown"
                  >
                    {sizeOptions.map((size) => (
                      <option key={size} value={size}>US {size}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="item-qty">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>

            <div className="item-remove">
              <FaTrash onClick={() => removeFromCart(item.id)} />
            </div>
          </div>
        ))}
      </div>

      <div className="shopping-cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-breakdown">
          <p>Sub Total <span>{subtotal.toFixed(2)} INR</span></p>
          <p>Discount (15%) <span>-{discount.toFixed(2)} INR</span></p>
        </div>
        <hr />
        <div className="summary-total">
          <p>Total <span>₹{total.toFixed(2)} INR</span></p>
        </div>
        <div className="warranty">
          <label>
            90 Day Limited Warranty against manufacturer's defects{" "}
          </label>
        </div>
        <button
          className="checkout-btn"
          onClick={() => {
            if (!user) {
              alert("⚠️ Please Sign In To Continue ");
              navigate("/sign-in");
            } else {
              navigate("/checkout");
            }
          }}
        >
          Checkout Now
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
