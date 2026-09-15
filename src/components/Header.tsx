import React from 'react';
import { LOGO_URL } from '../data/catalog';
import { TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  cartCount: number;
  wishlistCount?: number;
  activeTab?: TabType;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount = 0,
  activeTab = 'home',
  onOpenMenu,
  onOpenSearch,
  onNavigateTab,
}) => {
  const { language, setLanguage, t, formatNumber } = useLanguage();

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#fff9ee]/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(29,27,21,0.04)] border-b border-[#e8e2d8]/60 pt-[env(safe-area-inset-top,0px)]">
      {/* Top Announcement Ribbon with Bangladesh context & Language Switcher (Option 1) */}
      <div className="w-full bg-[#ede7dd]/95 px-2.5 sm:px-6 py-1 flex items-center justify-between border-b border-[#cec5bd]/40">
        <div className="flex-1 text-center overflow-hidden pr-2">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.14em] text-[#4b4640] truncate">
            {t.announcement}
          </p>
        </div>

        {/* Compact & Elegant Language Switcher Pill (Mobile & Desktop Friendly) */}
        <div className="flex-shrink-0 flex items-center" id="header-lang-switch">
          <div
            className="inline-flex items-center rounded-full bg-[#dfd7cc] p-0.5 border border-[#cec5bd] shadow-xs"
            role="group"
            aria-label="Language Selector"
          >
            <button
              onClick={() => setLanguage('bn')}
              title="বাংলায় দেখুন"
              aria-label="Switch to Bangla"
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                language === 'bn'
                  ? 'bg-[#1d1b15] text-[#ffc55f] shadow-xs'
                  : 'text-[#4b4640] hover:text-[#1d1b15]'
              }`}
            >
              বাং
            </button>
            <button
              onClick={() => setLanguage('en')}
              title="View in English"
              aria-label="Switch to English"
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                language === 'en'
                  ? 'bg-[#1d1b15] text-[#ffc55f] shadow-xs'
                  : 'text-[#4b4640] hover:text-[#1d1b15]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-hamburger-btn"
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className="w-11 h-11 flex items-center justify-center text-[#1d1b15] hover:text-[#7d5700] active:scale-95 transition-all cursor-pointer md:hidden"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <button
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-1.5 text-left group focus:outline-none cursor-pointer"
            aria-label="ELIF Home"
          >
            <img
              alt="ELIF Wordmark Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-102"
              src={LOGO_URL}
            />
            <span className="font-display text-[20px] font-medium tracking-tight uppercase text-[#1d1b15] ml-0.5 sm:ml-1">
              ELIF
            </span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-[#7d5700] bg-[#ffdeaa]/50 px-2 py-0.5 rounded-full border border-[#7d5700]/20 ml-2">
            {t.taglineDhaka}
          </span>
        </div>

        {/* Center: Desktop / Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-[12px] font-semibold uppercase tracking-wider">
          <button
            onClick={() => onNavigateTab('home')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-[#7d5700] border-b-2 border-[#7d5700] pb-0.5' : 'text-[#4b4640] hover:text-[#1d1b15]'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => onNavigateTab('categories')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'categories' ? 'text-[#7d5700] border-b-2 border-[#7d5700] pb-0.5' : 'text-[#4b4640] hover:text-[#1d1b15]'
            }`}
          >
            {t.navCategories}
          </button>
          <button
            onClick={() => onNavigateTab('wishlist')}
            className={`transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'wishlist' ? 'text-[#7d5700] border-b-2 border-[#7d5700] pb-0.5' : 'text-[#4b4640] hover:text-[#1d1b15]'
            }`}
          >
            <span>{t.navWishlist}</span>
            {wishlistCount > 0 && (
              <span className="text-[10px] bg-[#7d5700] text-white px-1.5 py-0.2 rounded-full">
                {formatNumber(wishlistCount)}
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigateTab('account')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'account' ? 'text-[#7d5700] border-b-2 border-[#7d5700] pb-0.5' : 'text-[#4b4640] hover:text-[#1d1b15]'
            }`}
          >
            {t.navOrders}
          </button>
        </nav>

        {/* Right: Search, Wishlist, Bag & Profile */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            aria-label={t.searchLabel}
            title={t.searchLabel}
            className="w-10 h-10 flex items-center justify-center text-[#1d1b15] hover:text-[#7d5700] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Wishlist Icon in Header */}
          <button
            id="header-wishlist-btn"
            onClick={() => onNavigateTab('wishlist')}
            aria-label={`${t.wishlistLabel} (${wishlistCount})`}
            title={t.wishlistLabel}
            className="w-10 h-10 relative flex items-center justify-center text-[#1d1b15] hover:text-[#7d5700] active:scale-95 transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: wishlistCount > 0 ? "'FILL' 1" : undefined }}
            >
              favorite
            </span>
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[15px] h-3.5 px-1 rounded-full bg-[#7d5700] text-[#ffffff] text-[8px] font-bold flex items-center justify-center leading-none shadow-sm">
                {formatNumber(wishlistCount)}
              </span>
            )}
          </button>

          {/* Cart Icon in Header */}
          <button
            id="header-cart-btn"
            onClick={() => onNavigateTab('cart')}
            aria-label={`${t.cartLabel} (${cartCount})`}
            title={t.cartLabel}
            className="w-10 h-10 relative flex items-center justify-center text-[#1d1b15] hover:text-[#7d5700] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[15px] h-3.5 px-1 rounded-full bg-[#7d5700] text-[#ffffff] text-[8px] font-bold flex items-center justify-center leading-none shadow-[0_2px_4px_rgba(125,87,0,0.3)] animate-pulse">
                {formatNumber(cartCount)}
              </span>
            )}
          </button>

          {/* Account Icon in Header */}
          <button
            id="header-account-btn"
            onClick={() => onNavigateTab('account')}
            aria-label={t.accountLabel}
            title={t.accountLabel}
            className="w-8 h-8 rounded-full bg-[#1d1b19] flex items-center justify-center ml-1 text-white hover:bg-[#7d5700] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
