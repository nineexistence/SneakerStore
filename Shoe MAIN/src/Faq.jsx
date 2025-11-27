import React, { useState } from "react";
import "./css/Faq.css";

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Orders are processed within 1–2 business days and shipping takes 3–5 business days."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide. Shipping rates vary by location."
  },
  {
    question: "Can I return a product?",
    answer: "We offer a 14-day return policy for unopened products. Please review our return policy for more info."
  },
  {
    question: "How do I track my order?",
    answer: "You will receive a tracking link via email once your order ships."
  },
  {
    "question": "How do I track my order?",
    "answer": "You will receive a tracking link via email once your order ships."
  },
  {
    "question": "How do I return or exchange a pair of shoes?",
    "answer": "You can return or exchange unworn shoes within 30 days of delivery. Visit our Returns & Exchanges page for details and a prepaid return label."
  },
  {
    "question": "Can I cancel or change my order after placing it?",
    "answer": "Orders can only be changed or canceled within one hour of placing them. Please contact our customer service team as soon as possible."
  },
  {
    "question": "What if the shoes I want are out of stock?",
    "answer": "If an item is out of stock, you can sign up for restock notifications directly on the product page."
  },
  {
    "question": "Are your shoes true to size?",
    "answer": "Most of our shoes fit true to size. We recommend checking the sizing guide on each product page for specific fit details."
  },
  {
    "question": "How do I care for my shoes?",
    "answer": "Care instructions vary by material. Check the product description or visit our Shoe Care Guide for cleaning and storage tips."
  }
];

function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((item, index) => (
        <div className="faq-item" key={index}>
          <div className="faq-question" onClick={() => toggleIndex(index)}>
            <span className="arrow">{activeIndex === index ? "▾" : "▸"}</span>
            {item.question}
          </div>
          {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
        </div>
      ))}
    </div>
  );
}

export default Faq;
