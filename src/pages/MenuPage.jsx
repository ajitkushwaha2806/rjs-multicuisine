import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  X, 
  Utensils, 
  SlidersHorizontal,
  CheckCircle2,
  Leaf
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import VegNonVegBadge from '../components/VegNonVegBadge';
import { MENU_CATEGORIES, SAMPLE_MENU_ITEMS } from '../data/menuData';
import { useCart } from '../context/CartContext';

export const MenuPage = () => {
  const { cartCount, subtotal, setIsCartOpen } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-low' | 'price-high' | 'popular'

  // Sync category state with query params
  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
      setSelectedSubCategory('all');
    }
  }, [categoryParam]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all');
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams, { replace: true });
  };

  // Extract unique subcategories for the currently selected category
  const availableSubCategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    const subs = new Set();
    SAMPLE_MENU_ITEMS.forEach((item) => {
      if (item.category === selectedCategory && item.subCategory) {
        subs.add(item.subCategory);
      }
    });
    return Array.from(subs);
  }, [selectedCategory]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return SAMPLE_MENU_ITEMS.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      // Subcategory match
      const matchesSubCategory =
        selectedSubCategory === 'all' || item.subCategory === selectedSubCategory;

      // Dietary match (all items are 100% Pure Veg)
      const matchesDiet =
        vegFilter === 'all'
          ? true
          : vegFilter === 'veg'
          ? item.isVeg === true
          : item.isVeg === false;

      // Search match (name or description)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q));

      return matchesCategory && matchesSubCategory && matchesDiet && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'popular') return (b.isBestseller || b.isChefSpecial ? 1 : 0) - (a.isBestseller || a.isChefSpecial ? 1 : 0);
      return 0;
    });
  }, [selectedCategory, selectedSubCategory, vegFilter, searchQuery, sortBy]);

  const currentCategoryName =
    MENU_CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'All Dishes';

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      
      {/* Header Banner */}
      <div className="bg-burgundy-950 text-white py-12 sm:py-16 px-4 border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy-900 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Food Menu</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Explore Our Culinary Delights
          </h1>
          <p className="text-xs sm:text-base text-cream-200 max-w-2xl mx-auto leading-relaxed">
            Choose from a rich spread of North Indian, Charcoal Tandoor, Indo-Chinese woks, gourmet pizzas, biryanis, and artisanal beverages.
          </p>

          {/* Genuine 100% Pure Veg badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs px-4 py-2 rounded-xl max-w-xl text-left mt-2 shadow-sm">
            <VegNonVegBadge isVeg={true} size="sm" />
            <span>
              <strong>100% Pure Vegetarian</strong> • Authentic Multi-Cuisine Menu • Freshly Cooked to Order
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Search & Dietary Controls Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-stone-200/80 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish (e.g. Paneer, Biryani, Soup, Pizza, Manchurian)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-burgundy-600 focus:border-burgundy-600 text-sm bg-stone-50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Group: Veg / Non-Veg & Sort */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
              
              {/* Veg / Non-Veg Pill Filter */}
              <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-semibold">
                <button
                  onClick={() => setVegFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    vegFilter === 'all'
                      ? 'bg-burgundy-950 text-gold-300 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({SAMPLE_MENU_ITEMS.length})
                </button>
                <button
                  onClick={() => setVegFilter('veg')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    vegFilter === 'veg'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <VegNonVegBadge isVeg={true} size="sm" />
                  <span>Pure Veg</span>
                </button>
                <button
                  onClick={() => setVegFilter('nonveg')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    vegFilter === 'nonveg'
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <VegNonVegBadge isVeg={false} size="sm" />
                  <span>Non-Veg</span>
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-stone-500 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-stone-300 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-burgundy-600"
                >
                  <option value="default">Sort by: Recommended</option>
                  <option value="popular">Bestsellers & Specials</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills Bar (Horizontal Scrollable) */}
        <div className="sticky top-[68px] sm:top-[74px] z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 border-b border-stone-200/60 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {MENU_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                    isSelected
                      ? 'bg-burgundy-900 text-gold-300 shadow-md border border-gold-500/40 scale-105'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subcategory Pills Bar (if current category has multiple subcategories) */}
        {availableSubCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
              Section:
            </span>
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-burgundy-800 text-gold-300 shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Sections
            </button>
            {availableSubCategories.map((subName) => (
              <button
                key={subName}
                onClick={() => setSelectedSubCategory(subName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  selectedSubCategory === subName
                    ? 'bg-burgundy-800 text-gold-300 shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {subName}
              </button>
            ))}
          </div>
        )}

        {/* Section Heading & Counter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-burgundy-950 flex items-center gap-2">
              <span>{currentCategoryName}</span>
              {selectedSubCategory !== 'all' && (
                <span className="text-xs font-normal text-gold-700 bg-gold-100 border border-gold-300/60 px-2 py-0.5 rounded-md">
                  {selectedSubCategory}
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
            </p>
          </div>

          {(searchQuery || vegFilter !== 'all' || selectedCategory !== 'all' || selectedSubCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setVegFilter('all');
                handleCategoryChange('all');
                setSelectedSubCategory('all');
                setSortBy('default');
              }}
              className="text-xs font-semibold text-burgundy-800 hover:text-burgundy-950 underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dietary pure veg alert if Non-Veg is selected */}
        {vegFilter === 'nonveg' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center max-w-lg mx-auto my-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-burgundy-950">
              100% Pure Vegetarian Restaurant
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              RJ's Multicuisine is committed to serving strictly 100% vegetarian culinary delights. Every dish is cooked using fresh dairy, farm produce, and authentic spices with zero meat or egg ingredients.
            </p>
            <button
              onClick={() => setVegFilter('all')}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
            >
              <span>View All Pure Veg Dishes</span>
            </button>
          </div>
        )}

        {/* Dishes Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : vegFilter !== 'nonveg' && (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-lg text-burgundy-950 mb-1">
              No dishes found
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-6">
              We couldn't find any dishes matching your current filter or search keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setVegFilter('all');
                handleCategoryChange('all');
                setSelectedSubCategory('all');
              }}
              className="bg-burgundy-900 text-gold-300 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-burgundy-950 transition-all"
            >
              Show All Dishes
            </button>
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar when items in cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40 animate-slideUp">
          <div className="bg-burgundy-950 text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-gold-500/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500 text-burgundy-950 flex items-center justify-center font-bold text-base shadow-sm">
                {cartCount}
              </div>
              <div>
                <p className="text-xs text-gold-400 uppercase tracking-wider font-bold">
                  Your Cart
                </p>
                <p className="text-sm sm:text-base font-bold font-serif text-white">
                  ₹{subtotal} Subtotal
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
            >
              <span>View Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
