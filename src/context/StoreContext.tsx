import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, CategoryCard } from '../types';
import { CollectionInfo, COLLECTIONS as DEFAULT_COLLECTIONS, slugify } from '../utils/slug';
import { useLanguage } from './LanguageContext';
import {
  fetchProductsFromSupabase,
  fetchCategoriesFromSupabase,
  fetchCollectionsFromSupabase,
} from '../services/supabaseService';

interface StoreContextType {
  products: Product[];
  categories: CategoryCard[];
  collections: CollectionInfo[];
  isLoadingCatalog: boolean;
  refreshCatalog: () => Promise<void>;
  cartItems: CartItem[];
  wishlistIds: string[];
  totalCartCount: number;
  cartCount: number;
  totalCartAmount: number;
  wishlistCount: number;
  toast: string | null;
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  isStoryModalOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setIsStoryModalOpen: (open: boolean) => void;
  setStoryModalOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
  toggleWishlist: (productId: string) => void;
  quickAddToCart: (product: Product) => void;
  addToCartWithOptions: (product: Product, size: string, color: string, quantity?: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeCartItem: (index: number) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'elif_shopping_cart_v3';
const WISHLIST_STORAGE_KEY = 'elif_wishlist_ids_v3';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, localizeProduct } = useLanguage();

  // Dynamic Catalog State from Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [collections, setCollections] = useState<CollectionInfo[]>(DEFAULT_COLLECTIONS);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  const refreshCatalog = useCallback(async () => {
    setIsLoadingCatalog(true);
    try {
      const [fetchedProducts, fetchedCats, fetchedCols] = await Promise.all([
        fetchProductsFromSupabase(),
        fetchCategoriesFromSupabase(),
        fetchCollectionsFromSupabase(),
      ]);

      setProducts(fetchedProducts);

      if (fetchedCats && fetchedCats.length > 0) {
        // Enriched with dynamic piece counts matching the fetched products
        const dynamicCats: CategoryCard[] = fetchedCats.map((cat) => {
          const matchCount = fetchedProducts.filter((p) => {
            const pCat = p.category.toLowerCase().trim();
            const cName = cat.name.toLowerCase().trim();
            const cSlug = cat.slug.toLowerCase().trim();
            return pCat === cName || pCat === cSlug || pCat.includes(cName) || cName.includes(pCat);
          }).length;
          return {
            ...cat,
            piecesCount: cat.piecesCount > 0 ? cat.piecesCount : matchCount,
          };
        });
        setCategories(dynamicCats);
      } else if (fetchedProducts && fetchedProducts.length > 0) {
        // If categories table is not populated yet, dynamically generate from the admin's uploaded products
        const uniqueCatNames = Array.from(
          new Set(fetchedProducts.map((p) => p.category).filter(Boolean))
        );
        const derivedCats: CategoryCard[] = uniqueCatNames.map((name, idx) => {
          const matching = fetchedProducts.filter((p) => p.category === name);
          return {
            id: `cat-dynamic-${idx}`,
            name,
            piecesCount: matching.length,
            slug: slugify(name),
            image: matching[0]?.image || '',
            alt: name,
          };
        });
        setCategories(derivedCats);
      } else {
        // No categories in Supabase
        setCategories([]);
      }

      if (fetchedCols && fetchedCols.length > 0) {
        setCollections(fetchedCols);
      }
    } catch (err) {
      console.error('Failed to load catalog from Supabase:', err);
      setCategories([]);
    } finally {
      setIsLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  // Clean persistent cart: defaults to empty array []
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(CART_STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Clean persistent wishlist: defaults to empty array []
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(WISHLIST_STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [toast, setToast] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      }
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
      }
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const foundProduct = products.find((p) => p.id === productId);
      const loc = foundProduct ? localizeProduct(foundProduct) : null;
      const name = loc?.name || (language === 'bn' ? 'পোশাক' : 'Piece');
      if (exists) {
        showToast(language === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে।' : 'Removed from curated wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'bn' ? `'${name}' উইশলিস্টে যুক্ত করা হয়েছে।` : `Added ${name} to wishlist.`);
        return [...prev, productId];
      }
    });
  };

  const quickAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === (product.sizes[0] || '38 FR')
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          size: product.sizes[0] || '38 FR',
          color: product.colors[0] || 'Natural',
          quantity: 1,
        },
      ];
    });
    const loc = localizeProduct(product);
    showToast(
      language === 'bn'
        ? `'${loc.name}' শপিং ব্যাগে যুক্ত হয়েছে।`
        : `Added ${loc.name} to shopping bag.`
    );
  };

  const addToCartWithOptions = (product: Product, size: string, color: string, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          size,
          color,
          quantity,
        },
      ];
    });
    const loc = localizeProduct(product);
    showToast(
      language === 'bn'
        ? `'${loc.name}' শপিং ব্যাগে যুক্ত হয়েছে।`
        : `Added ${loc.name} to shopping bag.`
    );
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const copy = [...prev];
      copy[index].quantity = quantity;
      return copy;
    });
  };

  const removeCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast(language === 'bn' ? 'আইটেমটি ব্যাগ থেকে সরানো হয়েছে।' : 'Item removed from shopping bag.');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        collections,
        isLoadingCatalog,
        refreshCatalog,
        cartItems,
        wishlistIds,
        totalCartCount,
        cartCount: totalCartCount,
        totalCartAmount,
        wishlistCount: wishlistIds.length,
        toast,
        isSearchOpen,
        isMenuOpen,
        isStoryModalOpen,
        setIsSearchOpen,
        setSearchOpen: setIsSearchOpen,
        setIsMenuOpen,
        setMenuOpen: setIsMenuOpen,
        setIsStoryModalOpen,
        setStoryModalOpen: setIsStoryModalOpen,
        showToast,
        toggleWishlist,
        quickAddToCart,
        addToCartWithOptions,
        updateCartQuantity,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
