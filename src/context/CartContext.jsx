import React, { createContext, useContext, useState, useEffect } from 'react';
import RESTAURANT_CONFIG from '../config/restaurantConfig';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('rjs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Could not load cart from storage', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'takeaway'
  const [customerInfo, setCustomerInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('rjs_customer_info');
      return saved ? JSON.parse(saved) : {
        name: '',
        phone: '',
        address: '',
        landmark: '',
        instructions: ''
      };
    } catch {
      return { name: '', phone: '', address: '', landmark: '', instructions: '' };
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rjs_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Could not save cart', e);
    }
  }, [cart]);

  // Sync customerInfo to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rjs_customer_info', JSON.stringify(customerInfo));
    } catch (e) {
      console.error('Could not save customer info', e);
    }
  }, [customerInfo]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (item, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
    showToast(`Added "${item.name}" to cart`);
  };

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    showToast("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemQuantity = (itemId) => {
    const found = cart.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Delivery charge rule
  const deliveryFee = orderType === 'takeaway' || subtotal === 0 
    ? 0 
    : subtotal >= RESTAURANT_CONFIG.delivery.freeDeliveryThreshold 
      ? 0 
      : RESTAURANT_CONFIG.delivery.standardDeliveryFee;

  // Packaging charge rule
  const packagingFee = subtotal > 0 ? RESTAURANT_CONFIG.delivery.packagingFee : 0;
  const total = subtotal + deliveryFee + packagingFee;

  /**
   * Generates official WhatsApp click-to-chat URL:
   * https://wa.me/WHATSAPP_NUMBER?text=ENCODED_MESSAGE
   */
  const generateWhatsAppUrl = () => {
    if (cart.length === 0) return null;

    const itemsText = cart
      .map((item, index) => `${index + 1}. ${item.name} x ${item.quantity} – ₹${item.price * item.quantity}`)
      .join('\n');

    const orderTypeName = orderType === 'delivery' ? 'Home Delivery' : 'Self Takeaway / Pickup';

    let message = `Hello ${RESTAURANT_CONFIG.name}!\n\nI would like to place an order.\n\n`;
    message += `Customer Name: ${customerInfo.name || 'Valued Customer'}\n`;
    if (customerInfo.phone) {
      message += `Customer Phone: ${customerInfo.phone}\n`;
    }
    message += `Order Type: ${orderTypeName}\n\n`;
    message += `--- Order Details ---\n`;
    message += `${itemsText}\n\n`;
    message += `Subtotal: ₹${subtotal}\n`;
    if (orderType === 'delivery') {
      message += `Delivery Fee: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}\n`;
    }
    message += `Packaging Fee: ₹${packagingFee}\n`;
    message += `Total Amount: ₹${total}\n\n`;

    if (orderType === 'delivery') {
      message += `Delivery Address:\n${customerInfo.address || 'Address not provided'}\n`;
      if (customerInfo.landmark) {
        message += `Landmark: ${customerInfo.landmark}\n`;
      }
      message += `\n`;
    }

    if (customerInfo.instructions && customerInfo.instructions.trim()) {
      message += `Special Instructions: ${customerInfo.instructions.trim()}\n\n`;
    }

    message += `Please confirm my order and let me know the preparation time. Thank you!`;

    const encodedText = encodeURIComponent(message);
    const cleanNumber = RESTAURANT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodedText}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        deliveryFee,
        packagingFee,
        total,
        isCartOpen,
        setIsCartOpen,
        orderType,
        setOrderType,
        customerInfo,
        setCustomerInfo,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        generateWhatsAppUrl,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
