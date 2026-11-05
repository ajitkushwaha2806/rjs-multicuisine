'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  LogOut, 
  Search, 
  Save, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  UtensilsCrossed,
  RefreshCw,
  Mail,
  Percent,
  QrCode,
  Receipt,
  Sparkles,
  SlidersHorizontal,
  Copy,
  Store,
  ExternalLink
} from 'lucide-react';
import { usePrice } from '../context/PriceContext';
import VegNonVegBadge from '../components/VegNonVegBadge';

export const AdminAuthPage = () => {
  const { 
    prices, 
    menuItems, 
    categories, 
    loadingMenu, 
    getItemPrice, 
    updateItemPrice, 
    resetItemPrice, 
    fetchPrices, 
    fetchMenu,
    seedMenuToDb 
  } = usePrice();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('rjs_admin_token');
      if (token) setIsAuthenticated(true);
    }
  }, []);

  const [adminSection, setAdminSection] = useState('menu-prices'); // 'menu-prices' | 'billing-taxes'
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Form State
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });

  // Price Manager State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceInputs, setPriceInputs] = useState({});
  const [savingIds, setSavingIds] = useState({});
  const [successIds, setSuccessIds] = useState({});
  const [syncingMenu, setSyncingMenu] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Billing, Discount, GST & Scanner Settings State
  const [billingSettings, setBillingSettings] = useState({
    discountPercent: 0,
    cgstPercent: 2.5,
    gstPercent: 2.5,
    upiId: '8490065500@upi',
    upiName: "RJ's Multicuisine",
  });
  const [savingBilling, setSavingBilling] = useState(false);
  const [billingSaved, setBillingSaved] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Fetch billing settings from MongoDB
  const loadBillingSettings = async () => {
    try {
      const res = await fetch('/api/settings/billing');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setBillingSettings({
            discountPercent: Number(data.settings.discountPercent || 0),
            cgstPercent: Number(data.settings.cgstPercent ?? 2.5),
            gstPercent: Number(data.settings.gstPercent ?? 2.5),
            upiId: data.settings.upiId || '8490065500@upi',
            upiName: data.settings.upiName || "RJ's Multicuisine",
          });
        }
      }
    } catch (e) {
      console.warn('Could not load billing settings:', e);
    }
  };

  useEffect(() => {
    loadBillingSettings();
  }, []);

  // Initialize editable prices when dishes or custom prices change
  useEffect(() => {
    const initial = {};
    menuItems.forEach((item) => {
      initial[item.id] = prices[item.id] !== undefined ? prices[item.id] : item.price;
    });
    setPriceInputs(initial);
  }, [prices, menuItems]);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.identifier,
          username: loginForm.identifier,
          password: loginForm.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      localStorage.setItem('rjs_admin_token', data.token || 'admin-session');
      localStorage.setItem('rjs_admin_user', loginForm.identifier);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rjs_admin_token');
    localStorage.removeItem('rjs_admin_user');
    setIsAuthenticated(false);
  };

  // Price input change
  const handlePriceChange = (itemId, val) => {
    setPriceInputs((prev) => ({
      ...prev,
      [itemId]: val,
    }));
  };

  // Save single item price
  const handleSavePrice = async (item) => {
    const newPrice = Number(priceInputs[item.id]);
    if (isNaN(newPrice) || newPrice < 0) {
      alert('Please enter a valid price in Rupees (₹).');
      return;
    }

    setSavingIds((prev) => ({ ...prev, [item.id]: true }));
    try {
      await updateItemPrice(item.id, newPrice, item.name, item.price);
      setSuccessIds((prev) => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setSuccessIds((prev) => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
      }, 2500);
    } catch (err) {
      alert(`Could not save price: ${err.message}`);
    } finally {
      setSavingIds((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }
  };

  // Reset price to default
  const handleResetPrice = async (item) => {
    if (!window.confirm(`Reset "${item.name}" back to its original price of ₹${item.price}?`)) {
      return;
    }

    setSavingIds((prev) => ({ ...prev, [item.id]: true }));
    try {
      await resetItemPrice(item.id);
      setPriceInputs((prev) => ({
        ...prev,
        [item.id]: item.price,
      }));
    } catch (err) {
      alert(`Could not reset price: ${err.message}`);
    } finally {
      setSavingIds((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }
  };

  // Save Billing, Discount, GST & Scanner Settings to MongoDB
  const handleSaveBillingSettings = async (e) => {
    e.preventDefault();
    setSavingBilling(true);
    try {
      const res = await fetch('/api/settings/billing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billingSettings),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save billing settings');
      }

      setBillingSaved(true);
      setTimeout(() => setBillingSaved(false), 3000);
    } catch (err) {
      alert(`Could not save settings: ${err.message}`);
    } finally {
      setSavingBilling(false);
    }
  };

  // Filtered menu dishes for admin editing
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, menuItems]);

  const totalOverridden = Object.keys(prices).length;

  // Live calculation preview values based on a sample order of ₹1000
  const sampleGross = 1000;
  const sampleDiscount = Math.round((sampleGross * Number(billingSettings.discountPercent || 0)) / 100);
  const sampleNet = Math.max(0, sampleGross - sampleDiscount);
  const sampleCgst = Number(((sampleNet * Number(billingSettings.cgstPercent || 0)) / 100).toFixed(2));
  const sampleGst = Number(((sampleNet * Number(billingSettings.gstPercent || 0)) / 100).toFixed(2));
  const sampleFinal = Math.round(sampleNet + sampleCgst + sampleGst);

  const sampleUpiUrl = `upi://pay?pa=${billingSettings.upiId}&pn=${encodeURIComponent(billingSettings.upiName)}&am=${sampleFinal}&cu=INR&tn=Sample%20Bill`;
  const sampleQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sampleUpiUrl)}`;

  // -------------------------------------------------------------
  // VIEW 1: AUTHENTICATION FORM (When not logged in)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/80 p-6 sm:p-8 space-y-6">
          
          {/* Top Logo & Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-700/20 shadow-md">
              <img src="/logo.jpg" alt="RJ's Multicuisine" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">RJ's Multicuisine</h1>
            <p className="text-xs text-stone-500 font-medium">Restaurant Administration & Pricing</p>
          </div>

          {/* Form Header */}
          <div className="space-y-1 pt-1">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Admin Login</span>
            </h2>
            <p className="text-xs text-stone-500">
              Enter your credentials to manage menu prices, taxes, discounts, and payment scanner.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* 1. Email / Username */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Admin Email / Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="identifier"
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                  placeholder="admin@gmail.com"
                  required
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm bg-stone-50/50"
                />
              </div>
            </div>

            {/* 2. Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm bg-stone-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm mt-3 disabled:opacity-60"
            >
              <span>{authLoading ? 'Verifying...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-stone-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-800 font-medium transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Restaurant Website</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ADMIN PRICE & BILLING MANAGEMENT DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F4F1EA] pb-24">
      
      {/* Top Admin Header Bar */}
      <header className="bg-emerald-950 text-white border-b border-emerald-800/80 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
            
            {/* Top Row: Brand & Identity + Mobile Quick Action Buttons */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-emerald-600/50 bg-white shadow-sm shrink-0">
                  <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h1 className="font-bold text-sm sm:text-base text-white truncate">RJ's Multicuisine</h1>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700 shrink-0">
                      Admin
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-emerald-300 truncate hidden xs:block">
                    Live Menu Prices, Taxes, Discount & UPI
                  </p>
                </div>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="flex items-center gap-1.5 sm:hidden shrink-0">
                <Link
                  href="/menu"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/80 transition-colors"
                  title="View Restaurant Menu"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Store</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-xl text-xs font-semibold bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/80 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Section Switcher Tabs & Desktop Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              
              {/* Segmented Section Switcher */}
              <div className="bg-emerald-900/90 p-1 rounded-xl flex items-center border border-emerald-700/80 flex-1 sm:flex-initial">
                <button
                  type="button"
                  onClick={() => setAdminSection('menu-prices')}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    adminSection === 'menu-prices'
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Menu Prices</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSection('billing-taxes')}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    adminSection === 'billing-taxes'
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Discount & GST</span>
                </button>
              </div>

              {/* Refresh from Database */}
              <button
                onClick={() => {
                  fetchPrices();
                  fetchMenu();
                  loadBillingSettings();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/80 text-xs font-medium transition-colors shrink-0"
                title="Refresh from MongoDB database"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Refresh</span>
              </button>

              {/* Desktop View Site Link */}
              <Link
                href="/menu"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/80 text-xs font-medium transition-colors shrink-0"
                title="View Customer Menu"
              >
                <Store className="w-3.5 h-3.5" />
                <span>View Site</span>
              </Link>

              {/* Desktop Sign Out */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-5 sm:space-y-6">
        
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Total Menu Items</span>
            <p className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">{menuItems.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Active Menu Discount</span>
            <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">
              {billingSettings.discountPercent > 0 ? `${billingSettings.discountPercent}% OFF` : 'None (0%)'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">GST Rate</span>
            <p className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              {Number(billingSettings.cgstPercent || 0) + Number(billingSettings.gstPercent || 0)}%
              <span className="block text-[10px] text-stone-500 font-normal mt-0.5">
                {billingSettings.cgstPercent}% CGST + {billingSettings.gstPercent}% SGST
              </span>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 shadow-sm min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Scanner UPI ID</span>
            <p className="text-xs sm:text-sm font-bold text-stone-800 mt-1.5 truncate font-mono" title={billingSettings.upiId}>
              {billingSettings.upiId}
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------------
            SECTION 1: DISCOUNT, GST & UPI SCANNER CONFIGURATION
            ------------------------------------------------------------- */}
        {adminSection === 'billing-taxes' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-700" />
                  <span>Menu Discount, Taxes & Payment Scanner Settings</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Changes save to MongoDB and apply live across customer cart totals, bill breakdown, WhatsApp messages, and the UPI scanner.
                </p>
              </div>

              {billingSaved && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Saved to MongoDB!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveBillingSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left: Input Controls */}
                <div className="space-y-4">
                  
                  {/* 1. Entire Menu Discount % */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <Percent className="w-4 h-4 text-emerald-700" />
                        <span>Discount on Entire Menu (%)</span>
                      </label>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {billingSettings.discountPercent}% OFF
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={billingSettings.discountPercent}
                        onChange={(e) =>
                          setBillingSettings({ ...billingSettings, discountPercent: Number(e.target.value) })
                        }
                        placeholder="e.g. 10 (Set to 0 to disable discount)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-bold text-sm bg-white"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Applies a percentage discount to the gross dish subtotal. Set to <strong>0</strong> when no discount is active.
                    </p>
                  </div>

                  {/* 2. CGST % */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-800">
                      Central GST / CGST (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={billingSettings.cgstPercent}
                      onChange={(e) =>
                        setBillingSettings({ ...billingSettings, cgstPercent: Number(e.target.value) })
                      }
                      placeholder="e.g. 2.5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-bold text-sm bg-white"
                    />
                    <p className="text-[11px] text-stone-500">
                      Standard restaurant CGST rate (calculated on Net Amount after discount).
                    </p>
                  </div>

                  {/* 3. SGST / GST % */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-800">
                      State GST / SGST / GST (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={billingSettings.gstPercent}
                      onChange={(e) =>
                        setBillingSettings({ ...billingSettings, gstPercent: Number(e.target.value) })
                      }
                      placeholder="e.g. 2.5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-bold text-sm bg-white"
                    />
                    <p className="text-[11px] text-stone-500">
                      Standard restaurant SGST rate (calculated on Net Amount after discount).
                    </p>
                  </div>

                  {/* 4. Restaurant UPI ID for Scanner */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-700" />
                      <span>Restaurant UPI ID (for Cart Scanner)</span>
                    </label>
                    <input
                      type="text"
                      value={billingSettings.upiId}
                      onChange={(e) =>
                        setBillingSettings({ ...billingSettings, upiId: e.target.value })
                      }
                      placeholder="e.g. 8490065500@upi or rjs@okaxis"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-mono font-bold text-sm bg-white"
                    />
                    <p className="text-[11px] text-stone-500">
                      Used to generate the instant dynamic UPI payment QR Code on the customer's bill.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={savingBilling}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-60"
                  >
                    {savingBilling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : billingSaved ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved to MongoDB Successfully!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Tax, Discount & Scanner Settings</span>
                      </>
                    )}
                  </button>

                </div>

                {/* Right: Live Preview of Sample Customer Bill & Scanner */}
                <div className="bg-stone-50/90 rounded-2xl p-5 border border-stone-200/90 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                    <span className="text-xs uppercase tracking-wider font-bold text-stone-700 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-emerald-700" />
                      <span>Live Customer Bill Preview</span>
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                      Sample ₹1,000 Order
                    </span>
                  </div>

                  <div className="space-y-2 text-xs bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>Item Subtotal:</span>
                      <span className="font-semibold text-stone-900">₹{sampleGross}</span>
                    </div>

                    {sampleDiscount > 0 ? (
                      <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                        <span className="font-semibold">Discount ({billingSettings.discountPercent}% OFF):</span>
                        <span className="font-bold">-₹{sampleDiscount}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-stone-400">
                        <span>Discount (0%):</span>
                        <span>₹0</span>
                      </div>
                    )}

                    <div className="flex justify-between font-bold text-stone-800 pt-1 border-t border-stone-100">
                      <span>Net Amount:</span>
                      <span>₹{sampleNet}</span>
                    </div>

                    <div className="flex justify-between text-stone-500">
                      <span>CGST ({billingSettings.cgstPercent}%):</span>
                      <span className="font-medium text-stone-800">+₹{sampleCgst}</span>
                    </div>

                    <div className="flex justify-between text-stone-500">
                      <span>GST / SGST ({billingSettings.gstPercent}%):</span>
                      <span className="font-medium text-stone-800">+₹{sampleGst}</span>
                    </div>

                    <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-sm font-bold text-burgundy-950 font-serif">
                      <span>Final Total Amount:</span>
                      <span className="text-emerald-800 text-base">₹{sampleFinal}</span>
                    </div>
                  </div>

                  {/* Live UPI Scanner Preview */}
                  <div className="bg-gradient-to-br from-emerald-950 to-stone-900 text-white p-4 rounded-xl text-center space-y-3 shadow-md">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-300">
                      <QrCode className="w-4 h-4" />
                      <span>Live Scanner Preview</span>
                    </div>
                    <div className="w-36 h-36 mx-auto bg-white rounded-xl p-2 shadow-inner flex items-center justify-center">
                      <img
                        src={sampleQrCode}
                        alt="Sample QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs">
                      <span className="text-stone-300">Customer pays: </span>
                      <span className="font-bold text-white text-sm">₹{sampleFinal}</span>
                    </div>
                    <div className="bg-emerald-900/60 p-2 rounded-lg text-[11px] font-mono text-emerald-200 break-all border border-emerald-800">
                      {billingSettings.upiId}
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            SECTION 2: INDIVIDUAL DISH PRICE MANAGER
            ------------------------------------------------------------- */}
        {adminSection === 'menu-prices' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes (e.g. Paneer Tikka, Dal Makhani, Garlic Bread)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-stone-50/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="text-xs text-stone-500 shrink-0 font-medium">
                  Showing <strong>{filteredItems.length}</strong> of {menuItems.length} dishes
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All Categories ({menuItems.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dish List for Price Editing */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
              
              <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-stone-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-stone-900">Menu Price Editor</h2>
                  <p className="text-xs text-stone-500">Edit dish price directly below and click Save. Updates appear instantly on the live website.</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setSyncingMenu(true);
                      setSyncMessage('');
                      const res = await seedMenuToDb();
                      if (res && res.success) {
                        setSyncMessage('Synced!');
                        setTimeout(() => setSyncMessage(''), 3000);
                      } else {
                        setSyncMessage('Sync note received');
                        setTimeout(() => setSyncMessage(''), 3000);
                      }
                    } catch (e) {
                      setSyncMessage('Sync error');
                      setTimeout(() => setSyncMessage(''), 3000);
                    } finally {
                      setSyncingMenu(false);
                    }
                  }}
                  disabled={syncingMenu}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors disabled:opacity-50 self-start sm:self-auto shrink-0 shadow-sm"
                  title="Upsert all 156 items into MongoDB menu_items collection"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingMenu ? 'animate-spin' : ''}`} />
                  <span>{syncingMenu ? 'Syncing Dishes...' : syncMessage || 'Sync All Menu to MongoDB'}</span>
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {filteredItems.map((item) => {
                  const currentCustomPrice = prices[item.id];
                  const isModified = currentCustomPrice !== undefined && Number(currentCustomPrice) !== Number(item.price);
                  const inputVal = priceInputs[item.id] !== undefined ? priceInputs[item.id] : item.price;
                  const isSaving = savingIds[item.id];
                  const isSaved = successIds[item.id];

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-stone-50/70 transition-colors"
                    >
                      {/* Left: Dish Information */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative">
                          <img
                            src={item.image || '/placeholder-food.svg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-food.svg';
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <VegNonVegBadge isVeg={true} size="xs" />
                            <h3 className="font-bold text-sm sm:text-base text-stone-900 truncate">
                              {item.name}
                            </h3>
                            {isModified && (
                              <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                Custom Price
                              </span>
                            )}
                            {item.isChefSpecial && (
                              <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Chef Special
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 truncate">
                            <span className="font-medium text-stone-700">{item.categoryName}</span>
                            {item.subCategory && ` • ${item.subCategory}`}
                            <span className="ml-2 text-stone-400">Default: ₹{item.price}</span>
                          </p>
                        </div>
                      </div>

                      {/* Right: Price Edit Input and Save Action */}
                      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0">
                        
                        {/* Price Input - sized snugly to the price value */}
                        <div className="inline-flex items-center gap-1 bg-stone-50 hover:bg-white focus-within:bg-white px-2.5 py-1.5 rounded-xl border border-stone-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all shadow-inner">
                          <span className="text-xs font-bold text-stone-500 select-none">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={inputVal}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            style={{ width: `${Math.max(3, String(inputVal ?? '').length) + 0.5}ch` }}
                            className="min-w-[36px] max-w-[65px] text-sm font-bold text-stone-900 focus:outline-none bg-transparent text-left [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>

                        {/* Save Price Button */}
                        <button
                          onClick={() => handleSavePrice(item)}
                          disabled={isSaving}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                            isSaved
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white'
                          } disabled:opacity-60`}
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Price</span>
                            </>
                          )}
                        </button>

                        {/* Reset Button (Visible if custom price set) */}
                        {isModified && (
                          <button
                            onClick={() => handleResetPrice(item)}
                            disabled={isSaving}
                            className="p-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-200 transition-colors"
                            title="Reset to default original price"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>

              {filteredItems.length === 0 && (
                <div className="py-16 text-center text-stone-500 space-y-2">
                  <UtensilsCrossed className="w-8 h-8 mx-auto text-stone-400" />
                  <p className="font-semibold text-sm">No dishes matched "{searchQuery}"</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-xs text-emerald-800 font-bold underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default AdminAuthPage;
