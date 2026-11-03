import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MessageCircle, 
  Star, 
  Award, 
  UtensilsCrossed, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Flame, 
  PhoneCall, 
  Users, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { SAMPLE_MENU_ITEMS } from '../data/menuData';
import RESTAURANT_CONFIG from '../config/restaurantConfig';

export const HomePage = () => {
  // Select featured items (bestsellers & chef specials across diverse categories)
  const featuredItems = React.useMemo(() => {
    // Pick iconic bestsellers across categories
    const specials = SAMPLE_MENU_ITEMS.filter((item) => item.isChefSpecial || item.isBestseller);
    // Take up to 8 diverse items
    return specials.slice(0, 8);
  }, []);

  const directWhatsAppOrderUrl = `https://wa.me/${RESTAURANT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello ${RESTAURANT_CONFIG.name}! I would like to explore the menu and place an order on WhatsApp.`
  )}`;

  const testimonials = [
    {
      name: 'Dr. Vikram Malhotra',
      role: 'Food Connoisseur & Local Resident',
      comment: 'RJ’s Multicuisine has completely elevated fine dining in our area. The Dal Makhani has that authentic slow-cooked 18-hour richness, and the Paneer Tikka simply melts on the tongue. Ordering on WhatsApp is super fast!',
      rating: 5,
      dish: 'Loved: Dal Makhani & Paneer Tikka',
    },
    {
      name: 'Ananya & Sahil Roy',
      role: 'Weekend Family Diners',
      comment: 'Finding a place where my parents love the North Indian thalis and my kids devour the stone-baked pizza and Hakka noodles is rare. The hospitality, ambience, and consistency here are world-class.',
      rating: 5,
      dish: 'Loved: Paneer Tikka Pizza & Dum Biryani',
    },
    {
      name: 'Pooja Kashyap',
      role: 'Corporate Event Host',
      comment: 'We ordered lunch delivery for our team of 25. Every container was leak-proof, piping hot, and labelled cleanly. The WhatsApp ordering flow was flawless. 10/10 recommend!',
      rating: 5,
      dish: 'Loved: Chinese Combo & Biryani Platters',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-burgundy-950 overflow-hidden">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="RJ's Multicuisine Restaurant Dining Hall"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-950/50 via-burgundy-950/80 to-burgundy-950/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-transparent to-burgundy-950/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center lg:text-left grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-burgundy-900/80 border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Welcome to RJ's Multicuisine • Fine Dining & Delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              A World of Flavours, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 italic font-serif">
                One Destination.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-cream-200 max-w-2xl leading-relaxed font-normal">
              Immerse yourself in a culinary journey celebrating the royal heritage of North Indian curries, sizzling charcoal tandoor, authentic Indo-Chinese wok specialities, and gourmet continental flavours—crafted with passion and pristine ingredients.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <Link
                to="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-burgundy-950 font-bold px-7 py-4 rounded-xl shadow-luxury-gold transition-all duration-300 transform hover:-translate-y-0.5 text-base"
              >
                <UtensilsCrossed className="w-5 h-5 text-burgundy-950" />
                <span>Explore Our Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={directWhatsAppOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-base border border-emerald-400/30"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-burgundy-800/80 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-serif text-gold-400">4.9 ★</p>
                <p className="text-xs text-cream-300/80">75+ Google Reviews</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-serif text-gold-400">100%</p>
                <p className="text-xs text-cream-300/80">Pure Veg Kitchen</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-serif text-gold-400">₹200–400</p>
                <p className="text-xs text-cream-300/80">Per Person</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Signature Dish Spotlight */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative mx-auto max-w-md">
              
              {/* Decorative Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/30 to-burgundy-600/30 rounded-3xl blur-2xl opacity-70" />

              <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/40 shadow-2xl bg-burgundy-900/60 backdrop-blur-md">
                <img
                  src="/dal-makhani.jpg"
                  alt="RJ's Signature Dal Makhani"
                  className="w-full h-80 object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6 bg-gradient-to-t from-burgundy-950 via-burgundy-900 to-transparent">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-gold-400">
                      Chef's Masterpiece
                    </span>
                    <span className="text-xs font-semibold text-cream-200 bg-burgundy-800 px-2.5 py-1 rounded-full border border-gold-500/20">
                      18-Hour Simmered
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-1.5">
                    RJ's Signature Dal Makhani
                  </h3>
                  <p className="text-xs text-cream-300 leading-relaxed mb-4">
                    Slow-simmered on slow heat with selected spices, churned white butter, and rich cream swirl in an authentic copper handi.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-burgundy-800">
                    <span className="text-xl font-bold font-serif text-gold-400">₹269 <span className="text-xs font-normal text-cream-200">(450 Gm)</span></span>
                    <Link
                      to="/menu?category=main-course"
                      className="text-xs font-semibold text-white hover:text-gold-300 flex items-center gap-1 group"
                    >
                      <span>Order in Menu</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Review Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gold-400/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Highest Hygiene Certified</p>
                  <p className="text-[10px] text-stone-500">FSSAI Compliant Kitchen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BESTSELLERS DISHES SECTION */}
      <section className="bg-stone-100/70 py-16 sm:py-20 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-burgundy-700 font-bold block mb-1">
                Hand-Picked By Our Executive Chef
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950">
                Signature & Featured Dishes
              </h2>
              <p className="text-sm text-stone-600 mt-1 max-w-xl">
                The most beloved culinary creations at RJ's Multicuisine, prepared with artisanal care and served with pride.
              </p>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-burgundy-900 hover:bg-burgundy-800 text-gold-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <span>View All 150+ Dishes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase tracking-widest text-burgundy-700 font-bold">
            The RJ's Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950">
            Why Food Lovers Choose Us
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Our commitment to quality, warmth, and culinary authenticity sets RJ's Multicuisine apart in every plate we serve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 rounded-2xl bg-burgundy-100 text-burgundy-900 flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-burgundy-950 mb-2">Master Chefs</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Specialized culinary masters dedicated to North Indian gravies, live clay tandoor, and authentic Asian woks.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-burgundy-950 mb-2">100% Fresh Farm Produce</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Hand-picked whole spices stone-ground in-house, farm fresh vegetables, and premium grain ingredients.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-burgundy-950 mb-2">Zero Compromise Hygiene</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              FSSAI compliant, fully sanitized kitchen stations, temperature-controlled storage, and food-grade eco packaging.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 rounded-2xl bg-burgundy-100 text-burgundy-900 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-burgundy-950 mb-2">Piping Hot & Prompt</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Speedy delivery and insulated multi-compartment containers ensuring your food arrives just like fresh from the kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* AMBIENCE & STORY SPOTLIGHT */}
      <section className="bg-burgundy-950 text-white py-16 sm:py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block">
              Dine In Elegance
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              An Ambience Designed for Memorable Celebrations
            </h2>
            <p className="text-sm sm:text-base text-cream-200 leading-relaxed">
              Whether you are planning an intimate candlelit dinner, a joyful family reunion, or a celebratory birthday feast, RJ’s Multicuisine offers luxurious seating, warm ambient lighting, and hospitable service that treats you like royalty.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-cream-100">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span>Spacious, comfortable family booths & private party dining</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-cream-100">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span>Live music & fully air-conditioned family dining hall</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-cream-100">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span>Dedicated parking bays & convenient Atladara, Vadodara location</span>
              </div>
            </div>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md text-sm"
              >
                Book a Table Now
              </Link>
              <a
                href={RESTAURANT_CONFIG.reservations.googleReserve}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-burgundy-900 hover:bg-burgundy-850 text-gold-300 border border-gold-500/40 font-semibold px-6 py-3 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                <span>Reserve on Google</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="/hero-bg.jpg"
              alt="RJ's Multicuisine Restaurant Dining Area"
              className="rounded-2xl object-cover h-64 sm:h-80 w-full shadow-lg"
            />
            <img
              src="/logo.jpg"
              alt="RJ's Multicuisine Mascot Logo"
              className="rounded-2xl object-contain bg-white p-4 h-64 sm:h-80 w-full shadow-lg mt-8 border border-emerald-400/40"
            />
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest text-burgundy-700 font-bold">
            Guest Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950">
            Loved By Thousands of Diners
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Read what our regulars and first-time guests have to say about their multicuisine dining experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-500 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm italic leading-relaxed mb-6">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-serif font-bold text-burgundy-950 text-base">
                  {review.name}
                </h4>
                <p className="text-xs text-stone-500">{review.role}</p>
                <p className="text-[11px] font-semibold text-burgundy-700 mt-1">
                  {review.dish}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION, OPENING HOURS & WHATSAPP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-gradient-to-br from-burgundy-900 via-burgundy-950 to-stone-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-gold-500/30 grid lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block">
              Hungry Right Now?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Order Your Favourite Meal Directly On WhatsApp
            </h2>
            <p className="text-sm sm:text-base text-cream-200 max-w-2xl leading-relaxed">
              No complicated registrations or app downloads required. Choose your dishes from our menu, click "Place Order on WhatsApp", and receive instant confirmation from our restaurant team!
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-cream-300">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>Open Today: {RESTAURANT_CONFIG.timings.weekday}</span>
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>{RESTAURANT_CONFIG.address.area}, {RESTAURANT_CONFIG.address.city}</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <a
              href={directWhatsAppOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all text-base text-center"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Open WhatsApp Chat</span>
            </a>
            <Link
              to="/menu"
              className="bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm text-center"
            >
              Explore Digital Menu
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
