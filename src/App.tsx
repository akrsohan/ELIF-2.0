import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomFooter } from './components/BottomFooter';
import { HomeScreen } from './components/HomeScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { WishlistScreen } from './components/WishlistScreen';
import { CartScreen } from './components/CartScreen';
import { AccountScreen } from './components/AccountScreen';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { SideMenuDrawer } from './components/SideMenuDrawer';
import { AtelierStoryModal } from './components/AtelierStoryModal';
import { CheckoutModal } from './components/CheckoutModal';
import { INITIAL_CART, PRODUCTS } from './data/catalog';
import { CartItem, Product, TabType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-1', 'prod-2']);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Scroll to top when changing tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const product = PRODUCTS.find((p) => p.id === productId);
      if (exists) {
        showToast(`Removed from curated wishlist.`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Added ${product?.name || 'piece'} to wishlist.`);
        return [...prev, productId];
      }
    });
  };

  const handleQuickAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === product.sizes[0]
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
    showToast(`Added ${product.name} to shopping bag.`);
  };

  const handleAddToCartWithOptions = (product: Product, size: string, color: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === color
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
          size,
          color,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from shopping bag.');
  };

  const handleNavigateTab = (tab: TabType, filter?: string) => {
    setCategoryFilter(filter);
    setActiveTab(tab);
  };

  const totalCartAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#fff9ee] text-[#1d1b15] font-sans antialiased flex flex-col justify-between selection:bg-[#ffdeaa] selection:text-[#271900]">
      {/* Fixed Luxury Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        activeTab={activeTab}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateTab={handleNavigateTab}
      />

      {/* Main View Area with Responsive Mobile/Tablet/Desktop Framing */}
      <main className="flex-1 w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto pt-[92px] pb-10 sm:pb-14">
        {activeTab === 'home' && (
          <HomeScreen
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAddToCart={handleQuickAddToCart}
            onOpenProductDetail={(prod) => setSelectedProduct(prod)}
            onOpenStory={() => setIsStoryOpen(true)}
            onNavigateTab={handleNavigateTab}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesScreen
            initialCategory={categoryFilter}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAddToCart={handleQuickAddToCart}
            onOpenProductDetail={(prod) => setSelectedProduct(prod)}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'wishlist' && (
          <WishlistScreen
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAddToCart={handleQuickAddToCart}
            onOpenProductDetail={(prod) => setSelectedProduct(prod)}
            onNavigateTab={handleNavigateTab}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'cart' && (
          <CartScreen
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onNavigateTab={handleNavigateTab}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'account' && (
          <AccountScreen onShowToast={showToast} />
        )}
      </main>

      {/* Bottom Footer Navbar with Copyrights, Policies, Cookies, Social Media */}
      <BottomFooter
        onNavigateTab={handleNavigateTab}
        onShowToast={showToast}
      />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCartWithOptions}
        onToggleWishlist={handleToggleWishlist}
        onShowToast={showToast}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      <SideMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigateTab={handleNavigateTab}
        onShowToast={showToast}
      />

      <AtelierStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onExploreCollection={() => handleNavigateTab('categories')}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cartItems={cartItems}
        totalAmount={totalCartAmount}
        onClose={() => setIsCheckoutOpen(false)}
        onClearCart={() => setCartItems([])}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div
          id="toast-notification"
          className="fixed top-20 inset-x-4 max-w-sm mx-auto z-50 bg-[#1d1b19] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-[#cec5bd]/40 animate-fadeIn"
        >
          <span className="material-symbols-outlined text-[#ffc55f] text-[18px]">
            info
          </span>
          <span className="text-[12px] font-medium leading-tight">{toast}</span>
        </div>
      )}
    </div>
  );
}
