import React from 'react';
import { LOGO_URL } from '../data/catalog';
import { TabType } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenMenu,
  onOpenSearch,
  onNavigateTab,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#fff9ee]/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(29,27,21,0.04)] border-b border-[#e8e2d8]/60 pt-[env(safe-area-inset-top,0px)]">
      {/* Top Announcement Ribbon */}
      <div className="w-full bg-[#ede7dd]/90 px-3 py-1 flex items-center justify-center overflow-hidden border-b border-[#cec5bd]/40">
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4b4640] truncate text-center max-w-2xl px-1">
          Free shipping countrywide • Complimentary returns within 30 days • New Autumn/Winter Drop
        </p>
      </div>

      {/* Main Header Bar */}
      <div className="h-16 px-3 sm:px-4 max-w-5xl mx-auto flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-hamburger-btn"
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className="w-11 h-11 flex items-center justify-center text-[#1d1b15] hover:text-[#7d5700] active:scale-95 transition-all cursor-pointer"
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
        </div>

        {/* Right: Search, Bag & Profile */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            aria-label="Search Collection"
            className="w-11 h-11 flex items-center justify-center text-[#1d1b15] hover:text-[#7d5700] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            id="header-cart-btn"
            onClick={() => onNavigateTab('cart')}
            aria-label={`Shopping Bag (${cartCount} items)`}
            className="w-11 h-11 relative flex items-center justify-center text-[#1d1b15] hover:text-[#7d5700] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#7d5700] text-[#ffffff] text-[9px] font-bold flex items-center justify-center leading-none shadow-[0_2px_4px_rgba(125,87,0,0.3)] animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <button
            id="header-account-btn"
            onClick={() => onNavigateTab('account')}
            aria-label="Client Account"
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-[#1d1b19] flex items-center justify-center ml-1 text-white hover:bg-[#7d5700] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
