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
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount = 0,
  activeTab = 'home',
  onOpenMenu,
  onOpenSearch,
  onNavigateTab,
  onOpenAdmin,
}) => {
  const { language, setLanguage, t, formatNumber } = useLanguage();

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#faf7eb]/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(25,36,26,0.04)] border-b border-[#ded6be]/80 pt-[env(safe-area-inset-top,0px)]">
      {/* Top Announcement Ribbon with Bangladesh context, Language Switcher & Direct Admin Portal Launcher */}
      <div className="w-full bg-[#f3eedc]/95 px-2.5 sm:px-6 py-1 flex items-center justify-between border-b border-[#ded6be]/60">
        <div className="flex-1 text-left sm:text-center overflow-hidden pr-2">
          <p className="text-[10.5px] sm:text-[11.5px] font-extrabold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#223825] truncate">
            {t.announcement}
          </p>
        </div>

        {/* Right Header Top Controls: Admin Switcher & Language Switcher */}
        <div className="flex-shrink-0 flex items-center gap-2" id="header-top-controls">
          {/* Quick Admin Portal Button */}
          <button
            type="button"
            onClick={onOpenAdmin}
            title={language === 'bn' ? 'অ্যাডমিন পোর্টালে যান' : 'Go to Admin Atelier'}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0f2113] hover:bg-[#1f4726] text-[#faf7eb] text-[10.5px] font-black tracking-wider transition-all duration-150 cursor-pointer shadow-xs border border-[#3f804b]/50"
          >
            <span className="material-symbols-outlined text-[14px] text-[#a0d797]">
              admin_panel_settings
            </span>
            <span className="hidden xs:inline">
              {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
            </span>
            <span className="text-[8.5px] bg-[#1f4726] text-[#a0d797] px-1 rounded-sm uppercase font-black">
              Portal
            </span>
          </button>

          {/* Compact & Elegant Language Switcher Pill */}
          <div
            className="inline-flex items-center rounded-full bg-[#e3efe0] p-0.5 border border-[#bedec0] shadow-xs"
            role="group"
            aria-label="Language Selector"
          >
            <button
              onClick={() => setLanguage('bn')}
              title="বাংলায় দেখুন"
              aria-label="Switch to Bangla"
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-black tracking-wider transition-all duration-200 cursor-pointer ${
                language === 'bn'
                  ? 'bg-[#0f2113] text-white shadow-xs'
                  : 'text-[#223825] hover:text-[#000000]'
              }`}
            >
              বাং
            </button>
            <button
              onClick={() => setLanguage('en')}
              title="View in English"
              aria-label="Switch to English"
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-black tracking-wider transition-all duration-200 cursor-pointer ${
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
      <div className="h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-hamburger-btn"
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className="w-11 h-11 flex items-center justify-center text-[#0f2113] hover:text-[#1b5e28] active:scale-95 transition-all cursor-pointer md:hidden"
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
            <span className="font-display text-[22px] font-black tracking-tight uppercase text-[#0a180d] ml-0.5 sm:ml-1">
              ELIF
            </span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10.5px] font-black tracking-wider text-[#13461d] bg-[#d3ecd0] px-2.5 py-0.5 rounded-full border border-[#aed2a7] ml-2">
            {t.taglineDhaka}
          </span>
        </div>

        {/* Center: Desktop / Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[12.5px] font-black uppercase tracking-wider">
          <button
            onClick={() => onNavigateTab('home')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-[#13461d] border-b-2 border-[#13461d] pb-0.5 font-black' : 'text-[#2a452e] hover:text-[#000000]'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => onNavigateTab('categories')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'categories' ? 'text-[#13461d] border-b-2 border-[#13461d] pb-0.5 font-black' : 'text-[#2a452e] hover:text-[#000000]'
            }`}
          >
            {t.navCategories}
          </button>
          <button
            onClick={() => onNavigateTab('wishlist')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'wishlist' ? 'text-[#13461d] border-b-2 border-[#13461d] pb-0.5 font-black' : 'text-[#2a452e] hover:text-[#000000]'
            }`}
          >
            <span>{t.navWishlist}</span>
            {wishlistCount > 0 && (
              <span className="text-[10px] bg-[#13461d] text-white px-1.5 py-0.2 rounded-full font-black">
                {formatNumber(wishlistCount)}
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigateTab('account')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'account' ? 'text-[#13461d] border-b-2 border-[#13461d] pb-0.5 font-black' : 'text-[#2a452e] hover:text-[#000000]'
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
            className="w-10 h-10 flex items-center justify-center text-[#19241a] hover:text-[#2e5b33] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Wishlist Icon in Header */}
          <button
            id="header-wishlist-btn"
            onClick={() => onNavigateTab('wishlist')}
            aria-label={`${t.wishlistLabel} (${wishlistCount})`}
            title={t.wishlistLabel}
            className="w-10 h-10 relative flex items-center justify-center text-[#19241a] hover:text-[#2e5b33] active:scale-95 transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: wishlistCount > 0 ? "'FILL' 1" : undefined }}
            >
              favorite
            </span>
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[15px] h-3.5 px-1 rounded-full bg-[#2e5b33] text-[#ffffff] text-[8px] font-bold flex items-center justify-center leading-none shadow-sm">
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
            className="w-10 h-10 relative flex items-center justify-center text-[#19241a] hover:text-[#2e5b33] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[15px] h-3.5 px-1 rounded-full bg-[#2e5b33] text-[#ffffff] text-[8px] font-bold flex items-center justify-center leading-none shadow-[0_2px_4px_rgba(46,91,51,0.3)] animate-pulse">
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
            className="w-8 h-8 rounded-full bg-[#19241a] flex items-center justify-center ml-1 text-white hover:bg-[#2e5b33] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
