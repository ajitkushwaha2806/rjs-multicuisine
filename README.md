# RJ's Multicuisine – Premium Restaurant Website & WhatsApp Ordering System

A complete, modern, responsive, and luxurious restaurant website for **RJ's Multicuisine**.

Built with **React 19**, **Tailwind CSS**, and **Vite**, featuring an authentic culinary design palette of deep forest green, fresh emerald, warm cream, and subtle gold accents.

---

## 🌟 Key Features

### 1. Brand Identity & Visual Design
- **Color Palette**: Rich forest & emerald green (`#0F3D24`, `#16A34A`), warm cream (`#FAF7F2`), charcoal, and polished gold accents (`#D4AF37`).
- **Typography**: Clean, elegant modern typography using **Poppins** across the entire website (headings, body, cards, and UI).
- **Culinary Imagery**: High-resolution photography for dishes, tandoor kitchen, and fine dining ambience.
- **Micro-Interactions**: Smooth hover effects, animated cart badge, quantity steppers, and celebratory order confetti.

### 2. Homepage
- **Cinematic Hero**: Featuring headline *"A World of Flavours, One Destination."*, supporting text, quick WhatsApp order CTA, and Explore Menu button.
- **Trust Metrics**: 4.8★ Ratings, 100% Fresh Farm Produce, FSSAI Certified hygiene.
- **Cuisine Specialties Showcase**: North Indian, Charcoal Tandoor, Authentic Indo-Chinese, Royal Dum Biryanis, Continental & Italian, Desserts & Mocktails.
- **Featured Dishes Grid**: Bestsellers and Chef's Specials with instant *Add to Cart*.
- **Why Choose Us**: Master chefs, fresh whole spices, zero-compromise hygiene, and insulated packaging.
- **Guest Testimonials**: Verified diner quotes and recommendations.
- **Opening Hours & WhatsApp Banner**: Quick access for instant ordering.

### 3. Complete Digital Food Menu (`/menu`)
- **16+ Rich Categories**:
  - Starters, Soups, Chinese Cuisine, North Indian, South Indian, Tandoori & Kebabs, Main Course, Biryani & Rice, Noodles, Pizza, Pasta, Burgers & Sandwiches, Fast Food & Snacks, Desserts, Beverages, Special Combos.
- **Real-Time Search**: Search by dish name or ingredient.
- **Dietary Filters**: Toggle between **All Dishes**, **Pure Veg** (green indicator), and **Non-Veg** (red indicator).
- **Sorting**: Bestsellers first, Price: Low to High, Price: High to Low.
- **Indian FSSAI Standard Indicators**: Green and red square-dot badges on every dish.
- **Floating Cart Pill**: Displays current subtotal and items count with one-click access.

### 4. Shopping Cart & Official WhatsApp Ordering
- **No Login Required**: Seamless ordering directly for any customer.
- **Quantity Adjustments**: Add, increment, decrement, and remove items with real-time recalculations.
- **Delivery vs. Takeaway**: Toggle between Doorstep Delivery and Self Pickup.
- **Free Delivery Calculation**: Automatically tracks free delivery threshold (e.g. Free above ₹499).
- **Special Cooking Instructions**: Field for customer requests (e.g., *"Less spicy, extra green chutney"*).
- **Pre-filled WhatsApp Message**: Constructs the official WhatsApp click-to-chat URL:
  `https://wa.me/WHATSAPP_NUMBER?text=ENCODED_MESSAGE`
  
  **Sample Generated Message:**
  ```text
  Hello RJ's Multicuisine!

  I would like to place an order.

  Customer Name: Rahul Sharma
  Customer Phone: 9876543210
  Order Type: Home Delivery

  --- Order Details ---
  1. Paneer Butter Masala (Sample) x 2 – ₹640
  2. RJ's Signature Dal Makhani (Sample) x 1 – ₹290
  3. Royal Punjabi Kesar Lassi (Sample) x 2 – ₹300

  Subtotal: ₹1230
  Delivery Fee: FREE
  Packaging Fee: ₹20
  Total Amount: ₹1250

  Delivery Address:
  Flat 402, Royal Palms, Civil Lines
  Landmark: Near Metro Gate 2

  Special Instructions: Less spicy, extra onions and mint chutney please.

  Please confirm my order and let me know the preparation time. Thank you!
  ```

### 5. Table Reservation & Contact (`/contact`)
- **Instant Table Reservation Form**: Date, time slot, guest count, occasion, and special requests sent directly to WhatsApp.
- **Operating Hours & Location**: Detailed lunch and dinner shifts, phone numbers, and Google Maps link.
- **FAQs Accordion**: Information on Jain food, private dining halls, valet parking, and catering.

### 6. About Us (`/about`) & Photo Gallery (`/gallery`)
- **Our Story & Heritage**: The inspiration behind RJ's Multicuisine.
- **Food Philosophy**: The 4 pillars of authentic spices, fresh farm produce, kitchen hygiene, and warm hospitality.
- **Interactive Lightbox Gallery**: Ambience, signature dishes, chef wok & tandoor action, and guest celebrations.

---

## 🛠️ Configuration & Customization Guide

### 1. Central Restaurant Configuration
All restaurant details, contact numbers, and the WhatsApp ordering number are centralized in:
📁 `src/config/restaurantConfig.js`

```javascript
export const RESTAURANT_CONFIG = {
  name: "RJ's Multicuisine",
  tagline: "A World of Flavours, One Destination.",

  // Replace with your restaurant's WhatsApp number (Country code + digits without '+' or symbols)
  whatsappNumber: "919876543210", 

  phone: "+91 98765 43210",
  email: "orders@rjsmulticuisine.com",

  address: {
    street: "Plot No. 42, Heritage Court, Royal Palm Boulevard",
    area: "Civil Lines",
    city: "New Delhi",
    pincode: "110001",
  },
  // ...
};
```

You can also set the WhatsApp number using an environment variable `.env`:
```env
VITE_WHATSAPP_NUMBER=919876543210
```

### 2. Menu Items & Pricing
All dishes and categories are cleanly structured in:
📁 `src/data/menuData.js`

To add or update a dish, edit the `SAMPLE_MENU_ITEMS` array:
```javascript
{
  id: 'dish-id',
  name: 'Your Dish Name',
  category: 'north-indian', // matches MENU_CATEGORIES id
  description: 'Appetizing description of the dish and spices.',
  price: 320,
  isVeg: true, // true for Veg, false for Non-Veg
  isBestseller: true, // optional
  isChefSpecial: true, // optional
  spiceLevel: 'Medium', // 'Mild' | 'Medium' | 'Spicy'
  image: 'https://images.unsplash.com/...',
}
```

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 📱 Responsive & Mobile-First
Tested and optimized for seamless experience across:
- Mobile smartphones (iOS & Android)
- Tablets (iPad & Android tablets)
- Laptops & High-Resolution Desktop displays
