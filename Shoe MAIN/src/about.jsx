import React from "react";
import "./css/about.css";
import { Link } from "react-router-dom";

const scrollToTop = () => {
    window.scrollTo(0, 0);
};

const About = () => {
    return (
        <div className="about-us-wrapper">

            {/* Hero Section */}
            <section className="hero-section animate-fade">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>About Us</h1>
                        <p className="hero-subtext">Elevating sneaker culture, one drop at a time.</p>
                    </div>
                    <div className="hero-image">
                        <img src="https://i.pinimg.com/736x/f2/63/aa/f263aa164eb48553c26bf1b206395e46.jpg" alt="Sneaker Illustration" />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section animate-fade">
                <div className="feature-box">
                    <div className="icon">🔥</div>
                    <h3>Rare Kicks</h3>
                    <p>We bring you exclusive sneakers that define hype and heritage.</p>
                </div>
                <div className="feature-box">
                    <div className="icon">🚚</div>
                    <h3>Fast Delivery</h3>
                    <p>Swift shipping so you can flex your pair ASAP.</p>
                </div>
                <div className="feature-box">
                    <div className="icon">💬</div>
                    <h3>24/7 Support</h3>
                    <p>Have questions? Our sneakerheads are here to help you anytime.</p>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section animate-fade">
                <div className="stat-block">
                    <h2>7</h2>
                    <p>Years in the Game</p>
                </div>
                <div className="stat-block">
                    <h2>30+</h2>
                    <p>Exclusive Sneakers</p>
                </div>
                <div className="stat-block">
                    <h2>500+</h2>
                    <p>Happy Sneakerheads</p>
                </div>
                <div className="stat-block">
                    <h2>10K+</h2>
                    <p>Pairs Delivered</p>
                </div>
            </section>

            {/* Highlight */}
            <section className="about-highlight animate-fade">
                <div className="image sneaker-highlight-img"></div>
                <div className="text"> 
                    <h2>Our Vision</h2>
                    <h3>Where Streetwear Meets Culture</h3>
                    <p>
                        We’re more than a sneaker store — we’re a community. Whether you're into Jordans,
                        Air Force 1s, or luxury collabs, we curate heat for every collector.
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="benefit-section animate-fade">
                <h2>Why Choose Us</h2>
                <h3>The Hype Comes Standard</h3>
                <div className="benefits">
                    <div>
                        <div className="icon">💳</div>
                        <h4>Easy Checkout</h4>
                        <p>Secure and quick payments with all major options accepted.</p>
                    </div>
                    <div>
                        <div className="icon">🧢</div>
                        <h4>Verified Authenticity</h4>
                        <p>Every pair is 100% authentic, sourced directly from trusted drops.</p>
                    </div>
                    <div>
                        <div className="icon">🎯</div>
                        <h4>Exclusive Access</h4>
                        <p>Early access and deals for our loyal sneaker fam.</p>
                    </div>
                </div>
            </section>

            {/* Promo */}
            <section className="pastel-promo-section animate-fade">
                <div className="pastel-promo">
                    <div className="promo-left">
                        <h3>Limited Drop Alert</h3>
                        <p>Grab your grail sneakers now at <strong>10% OFF</strong></p>
                    </div>
                    <Link to="/products" className="promo-btn" onClick={scrollToTop}>Shop Now</Link>
                </div>
            </section>

        </div>
    );
};

export default About;
