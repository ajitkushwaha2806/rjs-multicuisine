'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu as MenuIcon, X, Phone, MessageCircle, Clock, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import RESTAURANT_CONFIG from '../config/restaurantConfig';

export const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide the store navbar on admin pages to prevent duplicate headers
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Digital Menu', path: '/menu' },
    { name: 'Table Reservation & Contact', path: '/contact' },
  ];

  const quickWhatsAppUrl = `https://wa.me/${RESTAURANT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello ${RESTAURANT_CONFIG.name}! I would like to inquire about your menu and table reservation.`
  )}`;

  return (
    <>
      {/* Top Notification Strip */}
      <div className="bg-burgundy-950 text-gold-300 text-xs py-1.5 px-4 hidden sm:block border-b border-burgundy-900/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wide">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>Open Daily: {RESTAURANT_CONFIG.timings.weekday}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span>{RESTAURANT_CONFIG.address.area}, {RESTAURANT_CONFIG.address.city}</span>
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <a
              href={`tel:${RESTAURANT_CONFIG.phone}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>{RESTAURANT_CONFIG.phone}</span>
            </a>
            <span className="text-burgundy-700">|</span>
            <span className="text-white font-medium bg-burgundy-800/80 px-2.5 py-0.5 rounded-full border border-gold-500/30 text-[11px]">
              Free Delivery above ₹{RESTAURANT_CONFIG.delivery.freeDeliveryThreshold}
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-burgundy-900/95 backdrop-blur-md shadow-lg border-b border-gold-500/20 py-2.5'
            : 'bg-burgundy-900 border-b border-burgundy-800 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Official Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.jpg"
              alt="RJ's Multicuisine Restaurant Logo"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-md border-2 border-emerald-400/80 bg-white transition-transform duration-300 group-hover:scale-105 shrink-0"
            />
            <div>
              <span className="block font-bold text-lg sm:text-xl text-white tracking-wide leading-none group-hover:text-emerald-300 transition-colors">
                RJ's Multicuisine
              </span>
              <span className="block text-[10px] sm:text-xs tracking-[0.18em] uppercase text-emerald-300/90 font-medium mt-1">
                Pure Veg Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-gold-400 bg-burgundy-950/70 border border-gold-500/30 font-semibold'
                      : 'text-cream-200 hover:text-white hover:bg-burgundy-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick WhatsApp Order Button */}
            <a
              href={quickWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all duration-200 transform hover:-translate-y-0.5"
              title="Chat or Order via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Order</span>
            </a>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-3.5 sm:py-2 rounded-lg bg-burgundy-950 hover:bg-burgundy-800 text-gold-400 hover:text-gold-300 border border-gold-500/30 flex items-center gap-2 transition-all duration-200 shadow-sm"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <span className="hidden sm:inline font-medium text-xs sm:text-sm text-cream-100">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 sm:static bg-gold-500 text-burgundy-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-cream-200 hover:text-white hover:bg-burgundy-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-burgundy-950 border-b border-burgundy-800 px-4 pt-4 pb-6 space-y-2 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-burgundy-800 text-gold-400 font-semibold'
                      : 'text-cream-200 hover:bg-burgundy-900 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-burgundy-800 flex flex-col gap-2.5">
              <a
                href={quickWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order on WhatsApp</span>
              </a>
              <Link
                to="/menu"
                className="w-full text-center bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold py-2.5 rounded-lg text-sm"
              >
                Explore Full Menu
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
