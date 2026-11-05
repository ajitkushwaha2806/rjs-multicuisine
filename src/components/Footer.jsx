'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, MessageCircle, Heart, ShieldCheck, Award } from 'lucide-react';
import RESTAURANT_CONFIG from '../config/restaurantConfig';

export const Footer = () => {
  const pathname = usePathname();

  // Hide customer footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const quickWhatsAppUrl = `https://wa.me/${RESTAURANT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello ${RESTAURANT_CONFIG.name}! I would like to place an order or ask a question.`
  )}`;

  return (
    <footer className="bg-burgundy-950 text-cream-200 border-t-2 border-gold-500/30">
      {/* Top Banner - Assurance Badges */}
      <div className="border-b border-burgundy-900/80 bg-burgundy-900/40">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Award className="w-8 h-8 text-gold-400 mb-2" />
            <h4 className="font-serif font-bold text-white text-base">Master Chefs</h4>
            <p className="text-xs text-cream-300/80 mt-1">Authentic recipes passed through generations</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-gold-400 mb-2" />
            <h4 className="font-serif font-bold text-white text-base">FSSAI Certified</h4>
            <p className="text-xs text-cream-300/80 mt-1">Highest safety, hygiene & sanitized prep</p>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-8 h-8 text-gold-400 mb-2" />
            <h4 className="font-serif font-bold text-white text-base">Prompt Delivery</h4>
            <p className="text-xs text-cream-300/80 mt-1">Freshly cooked & hot to your doorstep</p>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="w-8 h-8 text-emerald-400 mb-2" />
            <h4 className="font-serif font-bold text-white text-base">WhatsApp Ordering</h4>
            <p className="text-xs text-cream-300/80 mt-1">Seamless order & instant confirmation</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="RJ's Multicuisine Restaurant Logo"
              className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-emerald-400 bg-white shrink-0"
            />
            <div>
              <span className="font-bold text-xl text-white block">RJ's Multicuisine</span>
              <span className="text-[10px] tracking-widest uppercase text-emerald-300">Pure Veg Restaurant</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
            {RESTAURANT_CONFIG.tagline} We celebrate the rich culinary diversity of Indian, Chinese, Tandoori, Continental, and gourmet delicacies, crafted with royal passion.
          </p>
          <div className="pt-2">
            <a
              href={quickWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Direct WhatsApp Order</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-serif text-base font-bold text-gold-400 tracking-wider uppercase mb-4 pb-1 border-b border-burgundy-800 inline-block">
            Explore
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-cream-300 hover:text-gold-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/menu" className="text-cream-300 hover:text-gold-400 transition-colors">
                Complete Digital Menu
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-cream-300 hover:text-gold-400 transition-colors">
                Table Reservation & Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Cuisines Showcase */}
        <div>
          <h3 className="font-serif text-base font-bold text-gold-400 tracking-wider uppercase mb-4 pb-1 border-b border-burgundy-800 inline-block">
            Our Specialties
          </h3>
          <ul className="space-y-2 text-sm text-cream-300">
            <li>North Indian & Paneer Sabji</li>
            <li>Charcoal Tandoori & Starters</li>
            <li>Authentic Indo-Chinese Delights</li>
            <li>Handi Dum Biryani & Khichdi</li>
            <li>Artisanal Gourmet Pizza & Pasta</li>
            <li>RJ's Special Kathiyawadi Sabji</li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div>
          <h3 className="font-serif text-base font-bold text-gold-400 tracking-wider uppercase mb-4 pb-1 border-b border-burgundy-800 inline-block">
            Visit & Contact
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-cream-300">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>{RESTAURANT_CONFIG.address.street}, {RESTAURANT_CONFIG.address.area}, {RESTAURANT_CONFIG.address.city} - {RESTAURANT_CONFIG.address.pincode}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <a href={`tel:${RESTAURANT_CONFIG.phone}`} className="hover:text-gold-400 transition-colors">
                {RESTAURANT_CONFIG.phone}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{RESTAURANT_CONFIG.email}</span>
            </p>
            <div className="pt-2 border-t border-burgundy-900/60 text-xs">
              <p className="text-gold-300 font-medium">Opening Hours:</p>
              <p className="mt-0.5">{RESTAURANT_CONFIG.timings.weekday} (All 7 Days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="bg-[#061C11] py-4 border-t border-burgundy-900/60 text-xs text-cream-400/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {RESTAURANT_CONFIG.name}. All Rights Reserved.</p>
          <p className="text-cream-400/60">
            Crafted for exceptional dining & multicuisine excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
