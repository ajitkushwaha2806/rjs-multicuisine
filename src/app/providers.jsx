'use client';

import React from 'react';
import { PriceProvider } from '../context/PriceContext';
import { CartProvider } from '../context/CartContext';

export default function Providers({ children }) {
  return (
    <PriceProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </PriceProvider>
  );
}

