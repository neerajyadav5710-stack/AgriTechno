import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('agritechno_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('agritechno_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      const subsidyPercent = product.subsidyEligible ? (product.subsidyPercent || 0) : 0;
      const subsidyPerUnit = (effectivePrice * subsidyPercent) / 100;

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        return [
          ...prev,
          {
            _id: product._id,
            title: product.title,
            price: effectivePrice,
            originalPrice: product.price,
            unit: product.unit,
            imageUrl: product.imageUrl,
            subsidyPercent,
            subsidySaved: Math.round(subsidyPerUnit * qty),
            quantity: qty,
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const unitSubsidy = (item.price * item.subsidyPercent) / 100;
          return {
            ...item,
            quantity: newQty,
            subsidySaved: Math.round(unitSubsidy * newQty),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalSubsidy = cartItems.reduce((acc, item) => acc + item.subsidySaved, 0);
  const totalAmount = Math.max(0, subtotal - totalSubsidy);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalSubsidy,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
