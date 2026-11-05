'use client';

import React, { useState } from 'react';
import { Plus, Minus, Flame, Star, Sparkles } from 'lucide-react';
import VegNonVegBadge from './VegNonVegBadge';
import { useCart } from '../context/CartContext';
import { usePrice } from '../context/PriceContext';

export const FoodCard = ({ item }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { getItemPrice } = usePrice();

  // Customization / Variant handling (e.g. Small / Large, Gravy / Dry, 450 Gm)
  const variantGroup = item.variants?.[0];
  const options = variantGroup?.options || [];
  const hasMultipleOptions = options.length > 1;
  const singleOptionName = options.length === 1 ? options[0].option_name : null;

  const [selectedOptionId, setSelectedOptionId] = useState(() => {
    const defaultOpt = options.find((o) => o.is_default) || options[0];
    return defaultOpt ? defaultOpt.option_id : null;
  });

  const basePrice = getItemPrice(item);
  const currentOption = options.find((o) => o.option_id === selectedOptionId);
  const activePrice = currentOption ? Number(currentOption.price) : basePrice;
  const activeItemId = currentOption && hasMultipleOptions ? `${item.id}-${currentOption.option_id}` : item.id;
  const activeItemName = currentOption && hasMultipleOptions ? `${item.name} (${currentOption.option_name})` : item.name;

  const cartItem = cart.find((i) => i.id === activeItemId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(
      {
        ...item,
        id: activeItemId,
        name: activeItemName,
        price: activePrice,
        selectedVariant: currentOption ? currentOption.option_name : null,
      },
      1
    );
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 border border-burgundy-900/10 flex flex-col justify-between h-full">
      {/* Food Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={item.image || '/placeholder-food.svg'}
          alt={item.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Clean placeholder if link fails
            e.target.onerror = null;
            e.target.src = '/placeholder-food.svg';
          }}
        />

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <div className="bg-white/95 backdrop-blur-sm p-1 rounded-md shadow-sm">
            <VegNonVegBadge isVeg={item.isVeg} size="sm" />
          </div>

          {item.isBestseller && (
            <span className="inline-flex items-center gap-1 bg-gold-500 text-burgundy-950 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
              <Star className="w-2.5 h-2.5 fill-burgundy-950 text-burgundy-950" />
              Bestseller
            </span>
          )}

          {item.isChefSpecial && (
            <span className="inline-flex items-center gap-1 bg-burgundy-800 text-gold-300 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm border border-gold-500/30">
              <Sparkles className="w-2.5 h-2.5" />
              Chef's Special
            </span>
          )}
        </div>

        {/* Spice Level Indicator (if available) */}
        {item.spiceLevel && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <Flame className={`w-3 h-3 ${item.spiceLevel === 'Spicy' ? 'text-rose-500 fill-rose-500' : 'text-amber-400'}`} />
            <span>{item.spiceLevel}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subcategory / Cuisine Badge */}
          {item.subCategory && (
            <span className="text-[10px] font-semibold tracking-wider uppercase text-gold-600 mb-1 block">
              {item.subCategory}
            </span>
          )}

          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif font-bold text-base sm:text-lg text-burgundy-950 group-hover:text-burgundy-700 transition-colors line-clamp-1">
              {item.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-3">
            {item.description || 'Authentically prepared by RJ’s master chefs using fresh herbs, wholesome produce, and traditional spices.'}
          </p>

          {/* Multiple Variants Selector (e.g. Small / Large, Dry / Gravy) */}
          {hasMultipleOptions && (
            <div className="flex items-center gap-1.5 mb-3 bg-stone-100 p-1 rounded-xl border border-stone-200">
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.option_id;
                return (
                  <button
                    key={opt.option_id}
                    type="button"
                    onClick={() => setSelectedOptionId(opt.option_id)}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-burgundy-900 text-gold-300 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {opt.option_name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pricing and Add to Cart Section */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-600 block uppercase font-medium">Price</span>
              {singleOptionName && (
                <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                  {singleOptionName}
                </span>
              )}
            </div>
            <span className="text-lg sm:text-xl font-bold text-burgundy-950 font-serif">
              ₹{activePrice}
            </span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-burgundy-800 hover:bg-burgundy-900 active:scale-95 text-gold-300 hover:text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 border border-gold-500/30 shrink-0"
              aria-label={`Add ${activeItemName} to cart`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex items-center bg-burgundy-900 text-gold-300 rounded-xl overflow-hidden shadow-sm border border-gold-500/40">
              <button
                onClick={() => updateQuantity(activeItemId, -1)}
                className="p-2 hover:bg-burgundy-950 text-gold-300 hover:text-white transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 font-bold text-sm text-white select-none">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(activeItemId, 1)}
                className="p-2 hover:bg-burgundy-950 text-gold-300 hover:text-white transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
