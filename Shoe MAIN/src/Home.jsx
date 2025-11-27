import React from 'react';
import './css/home.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from "./CartContext";
import { SampleData } from './sampleData'; // This should now contain food items

function Home() {
  const navigate = useNavigate();
  const cart = useCart();

  if (!cart) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        ❌ Error: Cart context not available. Check if CartProvider is wrapping your app.
      </div>
    );
  }

  const { addToCart } = cart;

  const bestSellers = [...SampleData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5); // Top 5 dishes by rating

  const handleShopNow = () => {
    navigate('/products'); // Updated route to product page
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <h1>Fresh Flavors Delivered Fast</h1>
          <p className="subtext">
            From local favorites to gourmet meals,<br />
            satisfy your cravings in minutes.
          </p>
        </div>
        <div className="hero-center">
          <img
            className="main-bottle"
            src="https://i.pinimg.com/736x/1d/05/89/1d05891a227b694a056aa268ae67f6a5.jpg"
            alt="Featured Dish"
          />
        </div>
        <div className="hero-right">
          <h3>Your Favorite Meals<br />Just a Tap Away</h3>
          <p>Order now and enjoy fast delivery</p>
          <button className="shop-now-small" onClick={handleShopNow}>
            Browse Now
          </button>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="best-sellers">
        <h2>Best Selling Dishes</h2>
        <div className="product-row">
          {bestSellers.map((food) => (
            <div className="product-card" key={food.id}>
              <img src={food.image} alt={food.title} />
              <div className="product-info">
                <h4>{food.title}</h4>
                <p>₹{(food.price / 100).toFixed(2)}</p>
                <button
                  className="add-btn"
                  onClick={() => {
                    addToCart({
                      id: food.id,
                      title: food.title, // ✅ Send 'title' not 'name'
                      price: food.price / 100,
                      image: food.image,
                    });
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <h3>🔥 Flat 10% Off</h3>
        <p>On All First Orders</p>
        <button className="explore-btn" onClick={handleShopNow}>
          Explore Dishes
        </button>
      </section>
    </div>
  );
}

export default Home;
