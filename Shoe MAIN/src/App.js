// App.js (updated)
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Login.jsx";
import Home from "./Home.jsx";
import ListOfProducts from "./ListOfProducts.jsx";
import ProductDetails from "./ProductDetails.jsx";
import ShoppingCart from "./ShoppingCart.jsx";
import About from "./about.jsx";
import Checkout from "./Checkout.jsx";
import OrderSuccess from "./OrderSuccess.jsx";
import MyOrder from "./MyOrder.jsx";
import ContactUs from "./ContactUs.jsx";
import FAQs from "./Faq.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import Footer from "./Footer";
import Header from "./header.jsx";
import "./css/App.css";

import { UserProvider, useUser } from "./UserContext.js";
import { CartProvider } from "./CartContext";

/**
 * Route-guard that lets *only* the authorised e-mail through.
 * Anybody else (or not logged-in) is sent to /sign-in.
 */
function RequireAdmin({ children }) {
  const { user } = useUser();

  if (!user || user.email !== "tejas.s.s.gowda13@gmail.com") {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
}

function AppContent() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/sign-in" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ListOfProducts />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders/:orderId" element={<MyOrder />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQs />} />

        {/* PROTECTED ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}
