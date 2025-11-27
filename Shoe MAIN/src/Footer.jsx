import React from "react";
import "./css/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-column brand-column">
          <h2 className="brand">UrbanKicks</h2>
          <p className="tagline">Crafting elegant scents that define you.</p>
        </div>

        <div className="footer-column">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
          </ul>
        </div>
      </div> 

      <div className="footer-bottom">
        <p>© 2025 UrbanKicks. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
