import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { LOGO_URL } from '../data/catalog';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { language, setLanguage, t, formatNumber } = useLanguage();
  const {
    cartCount,
    wishlistCount,
    setMenuOpen,
    setSearchOpen,
  } = useStore();

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#faf7eb]/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(25,36,26,0.04)] border-b border-[#ded6be]/80 pt-[env(safe-area-inset-top,0px)]">
      {/* Top Announcement Ribbon with Bangladesh context & Language Switcher */}
      <div className="w-full bg-[#f3eedc]/95 px-2.5 sm:px-6 py-1.5 flex items-center justify-between border-b border-[#ded6be]/60">
        <div className="flex-1 text-center min-w-0 pr-2">
          <p className="text-[10px] xs:text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.08em] xs:tracking-[0.14em] sm:tracking-[0.2em] text-[#223825] leading-tight whitespace-nowrap overflow-visible">
            {language === 'bn' ? '🇧🇩 সারা বাংলাদেশে ডেলিভারি' : '🇧🇩 NATIONWIDE DELIVERY IN BANGLADESH'}
          </p>
        </div>

        {/* Right Header Top Controls: Language Switcher */}
        <div className="flex-shrink-0 flex items-center" id="header-top-controls">
          {/* Compact & Elegant Language Switcher Pill */}
          <div
            className="inline-flex items-center rounded-full bg-[#e3efe0] p-0.5 border border-[#bedec0] shadow-xs"
            role="group"
            aria-label="Language Selector"
          >
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              title="বাংলায় দেখুন"
              aria-label="Switch to Bangla"
              className={`px-1.5 xs:px-2 py-0.5 rounded-full text-[9.5px] xs:text-[10.5px] font-black tracking-wider transition-all duration-200 cursor-pointer ${
                language === 'bn'
                  ? 'bg-[#0f2113] text-white shadow-xs'
                  : 'text-[#223825] hover:text-[#000000]'
              }`}
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              title="View in English"
              aria-label="Switch to English"
              className={`px-1.5 xs:px-2 py-0.5 rounded-full text-[9.5px] xs:text-[10.5px] font-black tracking-wider transition-all duration-200 cursor-pointer ${
                language === 'en'
                  ? 'bg-[#0f2113] text-white shadow-xs'
                  : 'text-[#223825] hover:text-[#000000]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="h-14 sm:h-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-hamburger-btn"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="w-10 h-10 flex items-center justify-center text-[#0f2113] hover:text-[#1b5e28] active:scale-95 transition-all cursor-pointer md:hidden"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-left group focus:outline-none cursor-pointer"
            aria-label="ELIF Home"
          >
            <img
              alt="ELIF Wordmark Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-102"
              src={LOGO_URL}
            />
            <span className="font-display text-[22px] font-black tracking-tight uppercase text-[#0a180d] ml-0.5 sm:ml-1">
              ELIF
            </span>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10.5px] font-black tracking-wider text-[#13461d] bg-[#d3ecd0] px-2.5 py-0.5 rounded-full border border-[#aed2a7] ml-2">
            {t.taglineDhaka}
          </span>
        </div>

        {/* Center: Desktop / Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[12.5px] font-black uppercase tracking-wider">
          <Link
            to="/"
            className={`transition-colors cursor-pointer ${
              path === '/' ? 'text-[#13461d] border-b-2 border-[#13461d] pb-0.5 font-black' : 'text-[#2a452e] hover:text-[#000000]'
            }`}
          >
            {t.navHome}
          </Link>
          <Link
            to="/shop"
            className={`transition-colors cursor-pointer ${
              path.startsWith('/shop') || path.startsWith('/category') ? 'text-[#13461d] border-b-2 border-[#13461d] pb-0.5 font-black' : 'text-[#2a452e] hover:text-[#000000]'
            }`}
          >
            {t.navCategories}
          </Link>
          <Link
            to="/collections"
            className={`transition-colors cursor-pointer ${
              path.startsWith('/collections') ? 'text-[#13461d] border-b-2 border-[#13461d] pb-0.5 font-black' : 'text-[#2a452e] hover:text-[#000000]'
            }`}
          >
            {language === 'bn' ? 'কালেকশনস' : 'Collections'}
          </Link>
          <Link
            to="/wishlist"
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              path === '/wishlist' ? 'text-[#13461d] border-b-2 border-[#13461d] pb-0.5 font-black' : 'text-[#2a452e] hover:text-[#000000]'
            }`}
          >
            <span>{t.navWishlist}</span>
            {wishlistCount > 0 && (
              <span className="text-[10px] bg-[#13461d] text-white px-1.5 py-0.2 rounded-full font-black">
                {formatNumber(wishlistCount)}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            className={`transition-colors cursor-pointer ${
              path.startsWith('/account') ? 'text-[#13461d] border-b-2 border-[#13461d] pb-0.5 font-black' : 'text-[#2a452e] hover:text-[#000000]'
            }`}
          >
            {t.navOrders}
          </Link>
        </nav>

        {/* Right: Search, Wishlist, Bag & Profile */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            id="header-search-btn"
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t.searchLabel}
            title={t.searchLabel}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#19241a] hover:text-[#2e5b33] active:scale-95 transition-all cursor-pointer"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Wishlist Icon in Header */}
          <Link
            id="header-wishlist-btn"
            to="/wishlist"
            aria-label={`${t.wishlistLabel} (${wishlistCount})`}
            title={t.wishlistLabel}
            className="w-9 h-9 sm:w-10 sm:h-10 relative flex items-center justify-center text-[#19241a] hover:text-[#2e5b33] active:scale-95 transition-all cursor-pointer"
          >
            <Heart className={`w-5 h-5 stroke-[2.2] ${wishlistCount > 0 ? 'fill-[#1b5e28] text-[#1b5e28]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-3.5 px-1 rounded-full bg-[#2e5b33] text-[#ffffff] text-[8px] font-bold flex items-center justify-center leading-none shadow-sm">
                {formatNumber(wishlistCount)}
              </span>
            )}
          </Link>

          {/* Cart Icon in Header */}
          <Link
            id="header-cart-btn"
            to="/cart"
            aria-label={`${t.cartLabel} (${cartCount})`}
            title={t.cartLabel}
            className="w-9 h-9 sm:w-10 sm:h-10 relative flex items-center justify-center text-[#19241a] hover:text-[#2e5b33] active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-3.5 px-1 rounded-full bg-[#2e5b33] text-[#ffffff] text-[8px] font-bold flex items-center justify-center leading-none shadow-[0_2px_4px_rgba(46,91,51,0.3)] animate-pulse">
                {formatNumber(cartCount)}
              </span>
            )}
          </Link>

          {/* Account Icon in Header */}
          <Link
            id="header-account-btn"
            to="/account"
            aria-label={t.accountLabel}
            title={t.accountLabel}
            className="w-8 h-8 rounded-full bg-[#19241a] flex items-center justify-center ml-0.5 text-white hover:bg-[#2e5b33] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <User className="w-4 h-4 stroke-[2.2]" />
          </Link>
        </div>
      </div>
    </header>
  );
};
