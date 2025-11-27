import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import './css/ProductDetails.css';

function ProductDetails() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();

  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  if (!state) {
    return <p>No product data available.</p>;
  }

  const images = state.images || [state.image];
  const sizes = state.sizes || [6, 7, 8, 9, 10, 11];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a shoe size.');
      return;
    }

    addToCart({ ...state, size: selectedSize });
    navigate('/shopping-cart');
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('⚠️ Please Sign In To Continue');
      navigate('/sign-in');
      return;
    }

    if (!selectedSize) {
      alert('Please select a shoe size.');
      return;
    }

    navigate('/checkout', {
      state: { product: { ...state, size: selectedSize } }
    });
  };

  return (
    <div className="product-details-wrapper">
      <div className="product-image-card">
        <img
          src={images[activeImage]}
          alt={`${state.title} image`}
          className="product-image"
        />
        {images.length > 1 && (
          <div className="thumbnail-row">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info-block">
        <h1>{state.title}</h1>
        <p className="description">{state.description}</p>
        <p className="price">₹{state.price}</p>

        <div className="size-selector">
          <p>Select Size:</p>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="size-dropdown"
          >
            <option value="" disabled>Select size</option>
            {sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="action-buttons">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
