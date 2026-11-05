'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Users,
  MessageCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import RESTAURANT_CONFIG from '../config/restaurantConfig';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '2',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '07:30 PM (Dinner)',
    occasion: 'Casual Dining',
    notes: '',
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();

    // Prepare WhatsApp reservation message
    const message = `Hello ${RESTAURANT_CONFIG.name}!\n\nI would like to book a table reservation.\n\n` +
      `Guest Name: ${formData.name}\n` +
      `Contact Phone: ${formData.phone}\n` +
      `Number of Guests: ${formData.guests} Persons\n` +
      `Reservation Date: ${formData.date}\n` +
      `Preferred Time Slot: ${formData.timeSlot}\n` +
      `Occasion: ${formData.occasion}\n` +
      (formData.notes ? `Special Request: ${formData.notes}\n` : '') +
      `\nPlease confirm table availability for us. Thank you!`;

    const cleanNumber = RESTAURANT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    setBookingSuccess(true);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const faqs = [
    {
      q: 'Do you offer Pure Vegetarian and Jain food options?',
      a: 'Yes, absolutely. We have a dedicated section for Pure Vegetarian dishes and our chefs happily prepare customized Jain food (strictly without onion, garlic, or root vegetables) upon request.'
    },
    {
      q: 'Can we book a table or private hall for birthdays and anniversaries?',
      a: 'Yes! We host intimate private celebrations, birthday bashes, and corporate dinners. You can reserve directly through our table booking form or message us on WhatsApp with your party size.'
    },
    {
      q: 'How does WhatsApp ordering work?',
      a: 'Browse our menu, add dishes to your cart, and click "Place Order on WhatsApp". Your order with total prices and address details will open directly in WhatsApp so our manager can confirm and dispatch immediately.'
    },
    {
      q: 'Is parking available at the restaurant?',
      a: 'Yes, we provide dedicated complimentary valet parking and spacious parking bays directly outside our premises.'
    },
    {
      q: 'What is your home delivery radius and minimum order?',
      a: 'We deliver within an 8 km radius. Minimum order value is ₹200, and all orders above ₹499 enjoy FREE doorstep delivery.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">

      {/* Header Banner */}
      <div className="bg-burgundy-950 text-white py-14 sm:py-20 px-4 border-b border-gold-500/30">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy-900 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect & Dine</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Table Reservation & Contact
          </h1>
          <p className="text-xs sm:text-base text-cream-200 max-w-2xl mx-auto leading-relaxed">
            Reserve your table in advance or connect with our team for home delivery, catering inquiries, and banquet celebrations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-16">

        {/* Main Grid: Reservation Form & Contact Cards */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Reservation Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200/80">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-burgundy-700 font-bold block mb-1">
                Instant Confirmation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
                Book a Table
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Fill the details below to reserve your table. Your request will open seamlessly on WhatsApp for fast confirmation.
              </p>
            </div>

            {bookingSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Thank you! Your booking message has been drafted. Please send it on WhatsApp to complete confirmation.
                </span>
              </div>
            )}

            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-burgundy-600 focus:border-burgundy-600 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-burgundy-600 focus:border-burgundy-600 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Guests *
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-burgundy-600 bg-stone-50"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4">4 Persons</option>
                    <option value="5-8">5 to 8 Persons</option>
                    <option value="9+">Large Party (9+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-burgundy-600 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Time Slot *
                  </label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-burgundy-600 bg-stone-50"
                  >
                    <option value="12:30 PM (Lunch)">12:30 PM (Lunch)</option>
                    <option value="01:30 PM (Lunch)">01:30 PM (Lunch)</option>
                    <option value="02:30 PM (Lunch)">02:30 PM (Lunch)</option>
                    <option value="07:00 PM (Dinner)">07:00 PM (Dinner)</option>
                    <option value="08:00 PM (Dinner)">08:00 PM (Dinner)</option>
                    <option value="09:00 PM (Dinner)">09:00 PM (Dinner)</option>
                    <option value="10:00 PM (Dinner)">10:00 PM (Dinner)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dining Occasion
                </label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-burgundy-600 bg-stone-50"
                >
                  <option value="Casual Dining">Casual Dining / Family Dinner</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business Meeting">Business Lunch / Dinner</option>
                  <option value="Friends Get-Together">Friends Get-Together</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Special Requests / Seating Preference (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="e.g. Window booth preferred, baby high-chair needed, Jain food options"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-burgundy-600 bg-stone-50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Confirm Reservation via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Contact Details & Info Cards */}
          <div className="lg:col-span-5 space-y-6">

            {/* Quick Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80 space-y-5">
              <h3 className="font-serif font-bold text-xl text-burgundy-950 border-b border-stone-100 pb-3">
                Direct Contact Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-burgundy-100 text-burgundy-900 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Restaurant Location</h4>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">
                      {RESTAURANT_CONFIG.address.street}, {RESTAURANT_CONFIG.address.area}, {RESTAURANT_CONFIG.address.city} - {RESTAURANT_CONFIG.address.pincode}
                    </p>
                    <p className="text-[11px] text-burgundy-800 font-semibold mt-1">
                      Landmark: {RESTAURANT_CONFIG.address.landmark}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-gold-100 text-gold-800 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Phone Numbers</h4>
                    <p className="mt-0.5">
                      <a href={`tel:${RESTAURANT_CONFIG.phone}`} className="text-burgundy-900 hover:underline font-semibold">
                        {RESTAURANT_CONFIG.phone}
                      </a>
                    </p>
                    <p className="text-stone-600 text-xs">
                      Alternate: {RESTAURANT_CONFIG.altPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">WhatsApp Orders & Support</h4>
                    <p className="text-stone-600 mt-0.5">
                      Chat directly with our manager for takeaways and party catering.
                    </p>
                    <a
                      href={`https://wa.me/${RESTAURANT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-1"
                    >
                      <span>Open WhatsApp Chat (+{RESTAURANT_CONFIG.whatsappNumber})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-burgundy-100 text-burgundy-900 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Operating Timings</h4>
                    <p className="text-stone-600 mt-0.5">
                      Monday to Sunday: {RESTAURANT_CONFIG.timings.weekday}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Lunch: {RESTAURANT_CONFIG.timings.lunchSlot} | Dinner: {RESTAURANT_CONFIG.timings.dinnerSlot}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Location Visual Card */}
            <div className="bg-burgundy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold-500/30 space-y-4">
              <h3 className="font-serif font-bold text-lg text-gold-300">
                Finding Us in Vadodara
              </h3>
              <p className="text-xs sm:text-sm text-cream-200 leading-relaxed">
                Located at AARNA 673, Block B 21, Near Om Bungalows, Atladara, Kalali, Vadodara. Easy access with ample parking and family dining.
              </p>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-gold-500/20 relative bg-burgundy-900 flex items-center justify-center text-center p-4">
                <div>
                  <MapPin className="w-8 h-8 text-gold-400 mx-auto mb-2 animate-bounce" />
                  <p className="font-serif font-bold text-white text-base">RJ's Multicuisine</p>
                  <p className="text-xs text-cream-300">FF-3, AARNA 673, Atladara, Vadodara</p>
                  <p className="text-[11px] text-emerald-400 font-medium mt-1">4.9 ★ (75+ Google Reviews)</p>
                </div>
              </div>
              <a
                href={RESTAURANT_CONFIG.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md"
              >
                Get Driving Directions on Google Maps
              </a>

              {/* Table reservation partners */}
              <div className="pt-2 border-t border-burgundy-800/80">
                <p className="text-xs text-gold-300/90 font-medium mb-2 text-center">
                  Book Table Directly on Your Favorite Platform:
                </p>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <a
                    href={RESTAURANT_CONFIG.reservations.googleReserve}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-burgundy-900 hover:bg-burgundy-850 text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg border border-gold-500/30 transition-colors"
                  >
                    Google Reserve
                  </a>
                  <a
                    href={RESTAURANT_CONFIG.reservations.eazydiner}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-burgundy-900 hover:bg-burgundy-850 text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg border border-gold-500/30 transition-colors"
                  >
                    EazyDiner
                  </a>
                  <a
                    href={RESTAURANT_CONFIG.reservations.swiggyDineout}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-burgundy-900 hover:bg-burgundy-850 text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg border border-gold-500/30 transition-colors"
                  >
                    Swiggy Dineout
                  </a>
                  <a
                    href={RESTAURANT_CONFIG.reservations.zomato}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-burgundy-900 hover:bg-burgundy-850 text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg border border-gold-500/30 transition-colors"
                  >
                    Zomato Book
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FAQs SECTION */}
        <section className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-stone-200/80">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
            <span className="text-xs uppercase tracking-widest text-burgundy-700 font-bold">
              Got Questions?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-stone-200">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <h4 className="font-serif font-bold text-base text-burgundy-950 flex items-center gap-2 mb-1.5">
                  <HelpCircle className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ContactPage;
