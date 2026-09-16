import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { BottomFooter } from './components/BottomFooter';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ScrollToTop } from './components/ScrollToTop';
import { SearchModal } from './components/SearchModal';
import { SideMenuDrawer } from './components/SideMenuDrawer';
import { AtelierStoryModal } from './components/AtelierStoryModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import {
  AtelierPage,
  SalonPage,
  PrivacyPolicyPage,
  TermsPage,
  ReturnsPage,
  ShippingPage,
  ContactPage,
} from './pages/InfoPages';
import { NotFoundPage } from './pages/NotFoundPage';

const AppLayout: React.FC = () => {
  const { toast } = useStore();

  return (
    <div className="min-h-screen bg-[#faf7eb] text-[#0f2113] flex flex-col font-sans antialiased selection:bg-[#d6edd2] selection:text-[#0f2113]">
      <ScrollToTop />
      <Header />

      {/* Main Content Area with safe spacing for fixed top and bottom navs */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 md:pb-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/categories" element={<ShopPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionDetailPage />} />
          <Route path="/collection/:slug" element={<CollectionDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/bag" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/:tab" element={<AccountPage />} />
          <Route path="/orders" element={<AccountPage />} />
          <Route path="/track-order" element={<AccountPage />} />
          <Route path="/atelier" element={<AtelierPage />} />
          <Route path="/salon" element={<SalonPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Persistent Bottom Footer */}
      <BottomFooter />

      {/* Mobile Sticky Bottom Navigation Bar (Visible only on mobile/tablet screens) */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <SearchModal />
      <SideMenuDrawer />
      <AtelierStoryModal />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0f2113] text-[#d6edd2] px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-xl border border-[#2d6636] text-[12px] sm:text-[13px] font-black flex items-center gap-2 max-w-[92vw] sm:max-w-md animate-bounce-short">
          <CheckCircle className="w-4 h-4 text-[#4caf50] shrink-0" />
          <span className="truncate">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppLayout />
      </StoreProvider>
    </BrowserRouter>
  );
}
