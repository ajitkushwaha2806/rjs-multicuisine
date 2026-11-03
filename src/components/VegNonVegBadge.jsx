import React from 'react';

/**
 * Standard Indian FSSAI compliant Veg / Non-Veg Indicator
 */
export const VegNonVegBadge = ({ isVeg, size = 'md' }) => {
  const dimensionClass = size === 'sm' ? 'w-3.5 h-3.5 p-[2px]' : size === 'lg' ? 'w-5 h-5 p-[3px]' : 'w-4 h-4 p-[2.5px]';
  const dotClass = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';

  if (isVeg) {
    return (
      <span
        title="Pure Vegetarian"
        className={`inline-flex items-center justify-center border border-emerald-600 rounded-[3px] bg-emerald-50 ${dimensionClass}`}
      >
        <span className={`rounded-full bg-emerald-600 ${dotClass}`} />
      </span>
    );
  }

  return (
    <span
      title="Non-Vegetarian"
      className={`inline-flex items-center justify-center border border-rose-700 rounded-[3px] bg-rose-50 ${dimensionClass}`}
    >
      <span className={`rounded-full bg-rose-700 ${dotClass}`} />
    </span>
  );
};

export default VegNonVegBadge;
