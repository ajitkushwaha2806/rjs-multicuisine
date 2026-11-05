'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SAMPLE_MENU_ITEMS, MENU_CATEGORIES } from '../data/menuData';

const PriceContext = createContext();

export const PriceProvider = ({ children }) => {
  const [prices, setPrices] = useState({});
  const [menuItems, setMenuItems] = useState(SAMPLE_MENU_ITEMS);
  const [categories, setCategories] = useState(MENU_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // 1. Fetch menu directly from MongoDB
  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setMenuItems(data.items);
        }
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.warn('Could not fetch menu from DB, using fallback menu items:', err);
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  // 2. Fetch prices from MongoDB backend
  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch('/api/prices');
      if (res.ok) {
        const data = await res.json();
        if (data.prices) {
          setPrices(data.prices);
        }
      }
    } catch (err) {
      console.warn('Could not fetch price overrides:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
    fetchPrices();
  }, [fetchMenu, fetchPrices]);

  // Helper to get active price for an item
  const getItemPrice = useCallback(
    (item) => {
      if (!item) return 0;
      if (prices[item.id] !== undefined && !isNaN(prices[item.id])) {
        return Number(prices[item.id]);
      }
      return Number(item.price || item.base_price || 0);
    },
    [prices]
  );

  // Update price in MongoDB
  const updateItemPrice = async (itemId, newPrice, itemName = '', originalPrice = null) => {
    const numPrice = Number(newPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      throw new Error('Please enter a valid positive price.');
    }

    // Optimistic UI updates
    setPrices((prev) => ({
      ...prev,
      [itemId]: numPrice,
    }));

    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, price: numPrice, hasCustomPrice: true } : item
      )
    );

    try {
      const res = await fetch(`/api/prices/${encodeURIComponent(itemId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: numPrice,
          name: itemName,
          originalPrice,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save price');
      }

      return await res.json();
    } catch (err) {
      fetchPrices();
      throw err;
    }
  };

  // Reset price back to default
  const resetItemPrice = async (itemId) => {
    setPrices((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });

    try {
      const res = await fetch(`/api/prices/${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to reset price');
      }

      // Re-fetch menu to restore baseline prices
      fetchMenu();
      return await res.json();
    } catch (err) {
      fetchPrices();
      throw err;
    }
  };

  // Seed / Sync menu to DB manually if needed
  const seedMenuToDb = async () => {
    try {
      const res = await fetch('/api/menu', { method: 'POST' });
      const data = await res.json();
      await fetchMenu();
      return data;
    } catch (err) {
      console.error('Seed menu error:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <PriceContext.Provider
      value={{
        prices,
        menuItems,
        categories,
        loading,
        loadingMenu,
        getItemPrice,
        updateItemPrice,
        resetItemPrice,
        fetchPrices,
        fetchMenu,
        seedMenuToDb,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

export const usePrice = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
};

export default PriceContext;
