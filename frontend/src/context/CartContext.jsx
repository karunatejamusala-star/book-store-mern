import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('bookstore_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookstore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.book === book._id);
      if (existing) {
        return prev.map((item) =>
          item.book === book._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        { book: book._id, title: book.title, price: book.price, coverImage: book.coverImage, quantity },
      ];
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item.book !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.book === bookId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};
