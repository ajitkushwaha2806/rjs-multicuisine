'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import RESTAURANT_CONFIG from '../config/restaurantConfig';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart from localStorage safely
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'takeaway'
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    instructions: ''
  });
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  // Billing and Tax Settings (Discount, CGST, GST, UPI Scanner)
  const [billingSettings, setBillingSettings] = useState({
    discountPercent: 0,
    cgstPercent: 2.5,
    gstPercent: 2.5,
    upiId: '8490065500@upi',
    upiName: "RJ's Multicuisine",
  });

  const fetchBillingSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/billing');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setBillingSettings(data.settings);
        }
      }
    } catch (e) {
      console.warn('Could not load billing settings:', e);
    }
  }, []);

  useEffect(() => {
    fetchBillingSettings();
  }, [fetchBillingSettings]);

  // Initialize from localStorage on client mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('rjs_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedInfo = localStorage.getItem('rjs_customer_info');
        if (savedInfo) setCustomerInfo(JSON.parse(savedInfo));
      }
    } catch (e) {
      console.warn('Could not load cart from storage', e);
    } finally {
      setHasLoadedStorage(true);
    }
  }, []);

  const [toastMessage, setToastMessage] = useState(null);

  // Sync cart to localStorage after initial load
  useEffect(() => {
    if (!hasLoadedStorage) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rjs_cart', JSON.stringify(cart));
      }
    } catch (e) {
      console.error('Could not save cart', e);
    }
  }, [cart, hasLoadedStorage]);

  // Sync customerInfo to localStorage after initial load
  useEffect(() => {
    if (!hasLoadedStorage) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rjs_customer_info', JSON.stringify(customerInfo));
      }
    } catch (e) {
      console.error('Could not save customer info', e);
    }
  }, [customerInfo, hasLoadedStorage]);

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

  // --- Core Billing & Tax Calculations ---
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // 1. Discount on entire menu
  const discountPercent = Number(billingSettings.discountPercent || 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);

  // 2. Net Amount
  const netAmount = Math.max(0, subtotal - discountAmount);

  // 3. Taxes: CGST & SGST/GST on Net Amount
  const cgstPercent = Number(billingSettings.cgstPercent ?? 2.5);
  const cgstAmount = Number(((netAmount * cgstPercent) / 100).toFixed(2));

  const gstPercent = Number(billingSettings.gstPercent ?? 2.5);
  const gstAmount = Number(((netAmount * gstPercent) / 100).toFixed(2));

  // 4. Delivery charge rule
  const deliveryFee = orderType === 'takeaway' || subtotal === 0 
    ? 0 
    : subtotal >= RESTAURANT_CONFIG.delivery.freeDeliveryThreshold 
      ? 0 
      : RESTAURANT_CONFIG.delivery.standardDeliveryFee;

  // 5. Packaging charge rule
  const packagingFee = subtotal > 0 ? RESTAURANT_CONFIG.delivery.packagingFee : 0;

  // 6. Final Amount
  const finalAmount = Math.round(netAmount + cgstAmount + gstAmount + deliveryFee + packagingFee);
  const total = finalAmount;

  // 7. Dynamic UPI Payment Link & QR Scanner
  const upiId = billingSettings.upiId || '8490065500@upi';
  const upiName = billingSettings.upiName || "RJ's Multicuisine";
  const upiPayUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent("RJ's Multicuisine Order")}`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPayUri)}`;

  /**
   * Generates official WhatsApp click-to-chat URL with complete bill breakdown
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
    message += `--- Selected Dishes ---\n`;
    message += `${itemsText}\n\n`;

    message += `--- Bill Summary ---\n`;
    message += `Item Subtotal: ₹${subtotal}\n`;
    if (discountPercent > 0) {
      message += `Discount (${discountPercent}% OFF): -₹${discountAmount}\n`;
      message += `Net Amount: ₹${netAmount}\n`;
    }
    message += `CGST (${cgstPercent}%): ₹${cgstAmount}\n`;
    message += `GST / SGST (${gstPercent}%): ₹${gstAmount}\n`;
    if (orderType === 'delivery') {
      message += `Delivery Fee: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}\n`;
    }
    message += `Packaging Fee: ₹${packagingFee}\n`;
    message += `--------------------\n`;
    message += `Final Total Amount: ₹${finalAmount}\n\n`;

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

    message += `Payment UPI: ${upiId}\n\n`;
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
        discountPercent,
        discountAmount,
        netAmount,
        cgstPercent,
        cgstAmount,
        gstPercent,
        gstAmount,
        deliveryFee,
        packagingFee,
        total,
        finalAmount,
        billingSettings,
        fetchBillingSettings,
        upiId,
        upiName,
        upiPayUri,
        upiQrCodeUrl,
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
        toastMessage,
        generateWhatsAppUrl,
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

export default CartContext;
