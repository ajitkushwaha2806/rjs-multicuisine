'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  ShoppingBag, 
  ArrowRight, 
  Utensils, 
  Bike, 
  Store, 
  AlertCircle,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Percent
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import VegNonVegBadge from './VegNonVegBadge';
import RESTAURANT_CONFIG from '../config/restaurantConfig';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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
    upiId,
    upiName,
    upiPayUri,
    upiQrCodeUrl,
    orderType,
    setOrderType,
    customerInfo,
    setCustomerInfo,
    updateQuantity,
    removeFromCart,
    clearCart,
    generateWhatsAppUrl,
  } = useCart();

  const [validationError, setValidationError] = useState('');
  const [showScanner, setShowScanner] = useState(true);
  const pathname = usePathname();

  // Hide cart drawer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError('');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validation
    if (!customerInfo.name || customerInfo.name.trim() === '') {
      setValidationError('Please enter your name to proceed with the order.');
      return;
    }

    if (!customerInfo.phone || customerInfo.phone.trim().length < 8) {
      setValidationError('Please enter a valid phone or mobile number.');
      return;
    }

    if (orderType === 'delivery' && (!customerInfo.address || customerInfo.address.trim() === '')) {
      setValidationError('Please enter your delivery address.');
      return;
    }

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const whatsappUrl = generateWhatsAppUrl();
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto">
        <div className="w-full sm:w-[440px] max-w-full bg-[#FAF7F2] shadow-2xl flex flex-col h-full border-l border-burgundy-900/10">

          {/* Header */}
          <div className="p-4 sm:p-5 bg-burgundy-950 text-white flex items-center justify-between border-b border-burgundy-800 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-burgundy-800 rounded-lg text-gold-400 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h2 className="font-serif font-bold text-base sm:text-lg text-cream-50 truncate">Your Order Cart</h2>
                <p className="text-xs text-gold-400/90">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-cream-300 hover:text-white hover:bg-burgundy-900 rounded-xl transition-colors shrink-0 ml-2"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-900 mb-4">
                  <Utensils className="w-9 h-9" />
                </div>
                <h3 className="font-serif text-lg font-bold text-burgundy-950 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-xs mb-6">
                  Explore our authentic multicuisine menu and treat your taste buds today.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-burgundy-800 hover:bg-burgundy-900 text-gold-300 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Order Type Toggle: Delivery vs Takeaway */}
                <div className="bg-white p-1 rounded-xl border border-stone-200 flex shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${orderType === 'delivery'
                        ? 'bg-burgundy-900 text-gold-300 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                      }`}
                  >
                    <Bike className="w-4 h-4 shrink-0" />
                    <span>Home Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${orderType === 'takeaway'
                        ? 'bg-burgundy-900 text-gold-300 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                      }`}
                  >
                    <Store className="w-4 h-4 shrink-0" />
                    <span>Takeaway / Pickup</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-wider font-semibold">
                    <span>Selected Dishes ({cart.length})</span>
                    <button
                      onClick={clearCart}
                      className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium capitalize"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-3 sm:p-3.5 rounded-xl border border-stone-200/90 shadow-sm space-y-2.5 transition-all"
                      >
                        {/* Top row: Veg Badge + Name + Remove Button */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <div className="mt-0.5 shrink-0">
                              <VegNonVegBadge isVeg={item.isVeg} size="sm" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-xs sm:text-sm text-stone-900 leading-snug break-words">
                                {item.name}
                              </h4>
                              {item.selectedVariant && (
                                <span className="inline-block text-[10px] text-burgundy-700 font-medium bg-burgundy-50 px-1.5 py-0.2 rounded mt-0.5">
                                  {item.selectedVariant}
                                </span>
                              )}
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                ₹{item.price} each
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 -mr-1 -mt-1 shrink-0 transition-colors"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Bottom row: Stepper + Total Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                          {/* Stepper controls */}
                          <div className="flex items-center bg-stone-100 rounded-lg border border-stone-200 shadow-inner">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-stone-200 active:scale-95 text-stone-700 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-stone-800 select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-stone-200 active:scale-95 text-stone-700 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-right font-serif font-bold text-sm sm:text-base text-burgundy-950">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                  <h4 className="font-serif font-bold text-sm text-burgundy-950 border-b border-stone-100 pb-2">
                    Customer & Delivery Details
                  </h4>

                  {validationError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-burgundy-600 focus:border-burgundy-600 bg-stone-50/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-burgundy-600 focus:border-burgundy-600 bg-stone-50/50"
                      required
                    />
                  </div>

                  {orderType === 'delivery' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Delivery Address <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          name="address"
                          rows={2}
                          placeholder="House/Flat number, Street name, Area"
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          className="w-full text-sm px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-burgundy-600 focus:border-burgundy-600 bg-stone-50/50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Nearby Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          name="landmark"
                          placeholder="e.g. Near Metro Pillar 124"
                          value={customerInfo.landmark}
                          onChange={handleInputChange}
                          className="w-full text-sm px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-burgundy-600 focus:border-burgundy-600 bg-stone-50/50"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Cooking / Special Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      name="instructions"
                      placeholder="e.g. Less spicy, extra green chutney, no onions"
                      value={customerInfo.instructions}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-burgundy-600 focus:border-burgundy-600 bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Detailed Bill Breakdown */}
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-sm space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Item Subtotal</span>
                    <span className="font-semibold text-stone-900">₹{subtotal}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between items-center text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                      <span className="flex items-center gap-1 font-semibold text-xs">
                        <Percent className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Discount ({discountPercent}% OFF)</span>
                      </span>
                      <span className="font-bold">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-700 font-semibold pt-1 border-t border-stone-100">
                    <span>Net Amount</span>
                    <span className="text-stone-900">₹{netAmount}</span>
                  </div>

                  <div className="flex justify-between text-stone-500 text-xs">
                    <span>CGST ({cgstPercent}%)</span>
                    <span className="font-medium text-stone-800">+₹{cgstAmount}</span>
                  </div>

                  <div className="flex justify-between text-stone-500 text-xs">
                    <span>GST / SGST ({gstPercent}%)</span>
                    <span className="font-medium text-stone-800">+₹{gstAmount}</span>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-stone-600 text-xs">
                      <span>Delivery Partner Fee</span>
                      {deliveryFee === 0 ? (
                        <span className="font-semibold text-emerald-600 uppercase text-xs">FREE</span>
                      ) : (
                        <span className="font-semibold text-stone-900">₹{deliveryFee}</span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600 text-xs">
                    <span>Eco Hygiene Packaging</span>
                    <span className="font-semibold text-stone-900">₹{packagingFee}</span>
                  </div>

                  {orderType === 'delivery' && subtotal < RESTAURANT_CONFIG.delivery.freeDeliveryThreshold && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      Add ₹{RESTAURANT_CONFIG.delivery.freeDeliveryThreshold - subtotal} more to unlock <strong>FREE Delivery</strong>!
                    </p>
                  )}

                  <div className="border-t border-stone-200 pt-2.5 flex justify-between items-center text-base sm:text-lg font-bold text-burgundy-950 font-serif">
                    <span>Total Amount</span>
                    <span className="text-emerald-800 text-xl">₹{finalAmount}</span>
                  </div>
                </div>

                {/* Instant UPI Payment Scanner (QR Code) */}
                <div className="bg-gradient-to-br from-emerald-950 to-stone-900 text-white p-3.5 sm:p-4 rounded-xl border border-emerald-800/80 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
                        <QrCode className="w-4 h-4 text-emerald-300" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-white">UPI Payment Scanner</h5>
                        <p className="text-[11px] text-emerald-300/90">Instant scan with any UPI App</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowScanner(!showScanner)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold transition-colors"
                    >
                      {showScanner ? 'Hide QR' : 'Show QR'}
                    </button>
                  </div>

                  {showScanner && (
                    <div className="bg-white text-stone-900 p-4 rounded-xl text-center space-y-3 shadow-lg">
                      <div className="w-44 h-44 mx-auto bg-stone-50 border border-stone-200 rounded-xl p-2 shadow-inner flex items-center justify-center">
                        <img
                          src={upiQrCodeUrl}
                          alt="UPI Payment QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Exact Payable Amount</p>
                        <div className="text-2xl font-black text-emerald-800 font-serif mt-0.5">₹{finalAmount}</div>
                      </div>
                      <div className="flex items-center justify-between bg-stone-100 p-2 rounded-lg border border-stone-200 text-xs">
                        <span className="font-mono text-stone-700 font-semibold truncate max-w-[190px] text-left">{upiId}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText(upiId);
                              setCopiedUpi(true);
                              setTimeout(() => setCopiedUpi(false), 2000);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold shrink-0 transition-colors flex items-center gap-1"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy UPI</span>
                            </>
                          )}
                        </button>
                      </div>
                      <a
                        href={upiPayUri}
                        className="inline-flex sm:hidden items-center justify-center gap-1.5 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        <span>Open Installed UPI App</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-stone-200 shadow-2xl space-y-2 shrink-0">
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2.5 transition-all text-sm sm:text-base cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                <span>Place Order on WhatsApp</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <p className="text-[11px] text-center text-stone-500">
                Opens official WhatsApp chat with your pre-filled bill. No login required!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
