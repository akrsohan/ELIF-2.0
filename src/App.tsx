import { useState, useEffect, useCallback } from 'react';
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
import { useLanguage } from './context/LanguageContext';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLoginView } from './admin/views/AdminLoginView';
import { AdminUser, AdminView } from './admin/types';
import { DEMO_ADMIN_USERS } from './admin/data/adminDemoData';
import { signOutAdmin } from './admin/services/adminAuthService';

const VALID_ADMIN_VIEWS: Record<string, AdminView> = {
  dashboard: 'dashboard',
  products: 'products',
  'products/new': 'product-new',
  'product-new': 'product-new',
  'product-edit': 'product-edit',
  categories: 'categories',
  collections: 'collections',
  inventory: 'inventory',
  orders: 'orders',
  'order-detail': 'order-detail',
  returns: 'returns',
  coupons: 'coupons',
  promotions: 'promotions',
  customers: 'customers',
  'customer-detail': 'customer-detail',
  reviews: 'reviews',
  'wishlist-insights': 'wishlist-insights',
  atelier: 'fittings',
  fittings: 'fittings',
  tailoring: 'tailoring',
  homepage: 'homepage-cms',
  'homepage-cms': 'homepage-cms',
  cms: 'homepage-cms',
  banners: 'banners',
  lookbook: 'lookbook',
  newsletter: 'newsletter',
  delivery: 'delivery',
  payments: 'payments',
  operations: 'delivery',
  analytics: 'analytics-sales',
  'analytics-sales': 'analytics-sales',
  'analytics-products': 'analytics-products',
  'analytics-customers': 'analytics-customers',
  'admin-users': 'admin-users',
  users: 'admin-users',
  roles: 'roles',
  'activity-logs': 'activity-logs',
  logs: 'activity-logs',
  settings: 'settings',
};

function parseCurrentRoute(): { isAdmin: boolean; isLogin: boolean; subview: AdminView } {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  const isPathAdmin = path.startsWith('/admin');
  const isHashAdmin = hash.startsWith('#admin') || hash.startsWith('#/admin');

  if (!isPathAdmin && !isHashAdmin) {
    return { isAdmin: false, isLogin: false, subview: 'dashboard' };
  }

  // Determine subview
  let cleanSegment = '';
  if (isPathAdmin) {
    cleanSegment = path.replace(/^\/admin\/?/, '').split('?')[0].replace(/\/$/, '');
  } else if (isHashAdmin) {
    cleanSegment = hash.replace(/^#\/?admin\/?/, '').split('?')[0].replace(/\/$/, '');
  }

  const isLogin = cleanSegment === 'login';
  const matchedView = VALID_ADMIN_VIEWS[cleanSegment] || 'dashboard';

  return {
    isAdmin: true,
    isLogin,
    subview: matchedView,
  };
}

export default function App() {
  const { language, localizeProduct } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-1', 'prod-2']);

  // Admin Portal State
  const initialRoute = parseCurrentRoute();
  const [isAdminMode, setIsAdminMode] = useState<boolean>(initialRoute.isAdmin);
  const [adminSubview, setAdminSubview] = useState<AdminView>(initialRoute.subview);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('elif_admin_auth') === 'true';
  });
  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    const saved = localStorage.getItem('elif_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_ADMIN_USERS[0];
      }
    }
    return DEMO_ADMIN_USERS[0];
  });

  // Sync URL changes (popstate & hashchange)
  const syncRoute = useCallback(() => {
    const { isAdmin, subview } = parseCurrentRoute();
    setIsAdminMode(isAdmin);
    setAdminSubview(subview);
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, [syncRoute]);

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
    if (!isAdminMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, isAdminMode]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const product = PRODUCTS.find((p) => p.id === productId);
      const loc = product ? localizeProduct(product) : null;
      const name = loc?.name || 'piece';
      if (exists) {
        showToast(language === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে।' : 'Removed from curated wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'bn' ? `'${name}' উইশলিস্টে যুক্ত করা হয়েছে।` : `Added ${name} to wishlist.`);
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
    const loc = localizeProduct(product);
    showToast(
      language === 'bn'
        ? `'${loc.name}' শপিং ব্যাগে যুক্ত হয়েছে।`
        : `Added ${loc.name} to shopping bag.`
    );
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

  const handleDirectBuy = (product: Product, size: string, color: string) => {
    handleAddToCartWithOptions(product, size, color);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
    const loc = localizeProduct(product);
    showToast(
      language === 'bn'
        ? `'${loc.name}' নির্বাচন করা হয়েছে। অর্ডার সম্পন্ন করতে ঠিকানা লিখুন।`
        : `'${loc.name}' selected. Enter your address to place order.`
    );
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
    showToast(language === 'bn' ? 'আইটেমটি ব্যাগ থেকে সরানো হয়েছে।' : 'Item removed from shopping bag.');
  };

  const handleNavigateTab = (tab: TabType, filter?: string) => {
    setCategoryFilter(filter);
    setActiveTab(tab);
  };

  const totalCartAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Admin Portal Handlers
  const handleAdminLogin = (user: AdminUser) => {
    setIsAdminAuthenticated(true);
    setAdminUser(user);
    localStorage.setItem('elif_admin_auth', 'true');
    localStorage.setItem('elif_admin_user', JSON.stringify(user));
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/admin/dashboard');
    } else {
      window.location.hash = '#admin/dashboard';
    }
    setAdminSubview('dashboard');
  };

  const handleAdminLogout = async () => {
    await signOutAdmin();
    setIsAdminAuthenticated(false);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/admin/login');
    } else {
      window.location.hash = '#admin/login';
    }
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/');
    } else {
      window.location.hash = '';
    }
  };

  const handleAdminViewChange = (view: AdminView) => {
    setAdminSubview(view);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', `/admin/${view}`);
    } else {
      window.location.hash = `#admin/${view}`;
    }
  };

  const handleOpenAdminFromStore = () => {
    setIsAdminMode(true);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/admin/dashboard');
    } else {
      window.location.hash = '#admin/dashboard';
    }
  };

  // If in Admin Mode, render the full admin portal or authentication screen
  if (isAdminMode) {
    const route = parseCurrentRoute();
    if (!isAdminAuthenticated || route.isLogin) {
      return (
        <AdminLoginView
          onLoginSuccess={handleAdminLogin}
          onExitToStore={handleExitAdmin}
        />
      );
    }
    return (
      <AdminLayout
        currentUser={adminUser}
        initialView={adminSubview}
        onViewChange={handleAdminViewChange}
        onExitAdmin={handleExitAdmin}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#19241a] font-sans antialiased flex flex-col justify-between selection:bg-[#a0d797]/40 selection:text-[#19241a]">
      {/* Fixed Luxury Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        activeTab={activeTab}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateTab={handleNavigateTab}
        onOpenAdmin={handleOpenAdminFromStore}
      />

      {/* Main View Area with Responsive Mobile/Tablet/Desktop Framing */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-[86px] sm:pt-[96px] pb-12 sm:pb-16">
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
            onNavigateTab={handleNavigateTab}
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
          />
        )}

        {activeTab === 'cart' && (
          <CartScreen
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onProceedCheckout={() => setIsCheckoutOpen(true)}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'account' && (
          <AccountScreen
            onNavigateTab={handleNavigateTab}
            onShowToast={showToast}
            onOpenStory={() => setIsStoryOpen(true)}
            onOpenAdmin={handleOpenAdminFromStore}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation & Atelier Footer */}
      <BottomFooter
        onNavigateTab={handleNavigateTab}
        onShowToast={showToast}
        onOpenAdmin={handleOpenAdminFromStore}
      />

      {/* Floating Admin Portal Quick Access Switcher Button (Always Visible) */}
      <button
        type="button"
        id="floating-admin-portal-btn"
        onClick={handleOpenAdminFromStore}
        title="Open ELIF Admin Atelier Portal"
        className="fixed bottom-20 left-4 z-40 px-3.5 py-2 rounded-full bg-[#18281b] hover:bg-[#253d29] text-[#faf7eb] text-[11px] font-bold tracking-wide shadow-2xl border border-[#3f804b]/60 flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md group"
      >
        <div className="w-5 h-5 rounded-full bg-[#2d6636] flex items-center justify-center text-white text-[12px] group-hover:bg-[#387e44]">
          <span className="material-symbols-outlined text-[13px] text-[#a0d797]">
            admin_panel_settings
          </span>
        </div>
        <span>Admin Portal</span>
        <span className="text-[9px] bg-[#2d6636] text-[#a0d797] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
          Staff
        </span>
      </button>

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCartWithOptions}
        onDirectBuy={handleDirectBuy}
        onShowToast={showToast}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => {
          setSelectedProduct(prod);
          setIsSearchOpen(false);
        }}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onQuickAddToCart={handleQuickAddToCart}
      />

      <SideMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigateTab={handleNavigateTab}
        onShowToast={showToast}
        onOpenAdmin={() => {
          setIsMenuOpen(false);
          handleOpenAdminFromStore();
        }}
      />

      <AtelierStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onExploreCollection={() => {
          setIsStoryOpen(false);
          handleNavigateTab('categories');
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={totalCartAmount}
        onOrderSuccess={() => {
          setCartItems([]);
          setIsCheckoutOpen(false);
          handleNavigateTab('account');
        }}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-[#19241a] text-[#f7f5ee] px-5 py-3 rounded-full text-[13px] font-medium shadow-xl border border-[#2d402f]/40 flex items-center gap-2.5 backdrop-blur-md">
            <span className="material-symbols-outlined text-[18px] text-[#a0d797]">
              check_circle
            </span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
