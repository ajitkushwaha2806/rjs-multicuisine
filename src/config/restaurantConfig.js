/**
 * RJ's Multicuisine - Central Configuration File
 *
 * All restaurant details, WhatsApp ordering number, contact info,
 * operating hours, and location can be updated here in one place.
 */

export const RESTAURANT_CONFIG = {
  name: "RJ's Multicuisine",
  legalName: "RJ's Multi Cuisine Restaurant",
  tagline: "A World of Flavours, One Destination.",
  shortDescription: "Experience an exquisite 100% Pure Vegetarian symphony of North Indian, Indo-Chinese, Tandoori, Italian, Mexican, and Kathiyawadi gourmet delicacies in Vadodara.",
  
  // =========================================================================
  // WhatsApp Configuration (Direct Orders to Official Business WhatsApp)
  // =========================================================================
  whatsappNumber: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) || "918490065500",

  phone: "+91 84900 65500",
  displayPhone: "084900 65500",
  altPhone: "+91 84900 65500",
  email: "contact@rjsmulticuisinerestaurant.com",
  website: "http://rjsmulticuisinerestaurant.com/",

  rating: {
    google: "4.9 ★",
    googleReviews: "75+ Google Reviews",
    zomato: "4.2 ★",
    priceRange: "₹200–400 per person",
    costForTwo: "₹1,100 for two",
  },

  address: {
    street: "FF-3, AARNA 673, BLOCK B 21, Nr Om Bungalows",
    area: "Atladara, Kalali",
    city: "Vadodara",
    state: "Gujarat",
    pincode: "390012",
    country: "India",
    landmark: "Near Om Bungalows, Municipal Corporation Kalali",
    fullAddress: "Municipal Corporation, FF-3, AARNA 673, BLOCK B 21, Nr Om Bungalows, Atladara, Kalali, Vadodara, Gujarat 390012",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=RJ%27S+MULTICUISINE+Vadodara+Atladara",
  },

  timings: {
    weekday: "11:00 AM – 11:00 PM",
    weekend: "11:00 AM – 11:30 PM",
    lunchSlot: "11:00 AM – 03:30 PM",
    dinnerSlot: "07:00 PM – 11:00 PM",
    kitchenCloses: "10:45 PM",
    openDays: "Open All 7 Days (Opens 11:00 AM)",
  },

  delivery: {
    minOrderValue: 200,
    freeDeliveryThreshold: 499,
    standardDeliveryFee: 40,
    packagingFee: 20,
    estimatedTime: "30 – 40 mins",
    radius: "Across Vadodara (Atladara, Kalali, Gotri & nearby)",
  },

  reservations: {
    googleReserve: "https://www.google.com/maps/reserve/v/dine/c/nabzFqYIby0",
    eazydiner: "https://www.eazydiner.com/vadodara/rjs-multicuisine-atladara-vadodara-713252",
    swiggyDineout: "https://www.swiggy.com/restaurants/rjs-multi-cuisine-gotri-vadodara-1243308/dineout",
    zomato: "https://www.zomato.com/vadodara/rjs-multi-cuisine-atladara/book",
    district: "https://www.district.in/dining/vadodara/rjs-multi-cuisine-atladara/book",
  },

  socials: {
    website: "http://rjsmulticuisinerestaurant.com/",
    google: "https://www.google.com/search?q=rjs+multicuisine+vadodara",
    zomato: "https://www.zomato.com/vadodara/rjs-multi-cuisine-atladara",
    swiggy: "https://www.swiggy.com/restaurants/rjs-multi-cuisine-gotri-vadodara-1243308",
  },

  highlights: [
    { title: "4.9★ Rated", desc: "Top rated by 75+ happy diners on Google" },
    { title: "100% Pure Veg", desc: "Wholesome vegetarian kitchen crafted with farm-fresh produce" },
    { title: "Live Music", desc: "Warm ambience, live music, and family dining hall in Vadodara" },
    { title: "Fast Delivery", desc: "Piping hot delivery & quick WhatsApp ordering" },
  ]
};

export default RESTAURANT_CONFIG;
