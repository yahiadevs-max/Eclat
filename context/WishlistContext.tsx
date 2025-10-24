
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { WishlistItem, Product } from '../types';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const addToWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      if (prevItems.some(item => item.product.id === product.id)) {
        return prevItems;
      }
      return [...prevItems, { product }];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.product.id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
