import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    console.log("addToCart called with:", product);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id && item.size === product.size);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevItems.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevItems, { ...product, quantity: 1, size: product.size || '9' }];
      }
      console.log("Updated cart items:", updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter(item => item.id !== id);
      }
      return prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  const updateSize = (id, newSize) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, size: newSize } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      updateSize,
      removeFromCart,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};
