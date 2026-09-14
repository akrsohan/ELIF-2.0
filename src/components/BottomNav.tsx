import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  cartCount: number;
  wishlistCount: number;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  cartCount,
  wishlistCount,
  onSelectTab,
}) => {
  const navItems: {
    id: TabType;
    label: string;
    icon: string;
    badge?: number;
  }[] = [
    { id: 'home', label: 'Home', icon: 'cottage' },
    { id: 'categories', label: 'Categories', icon: 'grid_view' },
    { id: 'wishlist', label: 'Wishlist', icon: 'favorite', badge: wishlistCount },
    { id: 'cart', label: 'Cart', icon: 'shopping_bag', badge: cartCount },
    { id: 'account', label: 'Account', icon: 'account_circle' },
  ];

  return (
    <nav
      id="bottom-floating-navigation"
      aria-label="Bottom Navigation"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] inset-x-4 max-w-[420px] mx-auto z-40 bg-[#fff9ee]/92 backdrop-blur-xl rounded-full shadow-[0_12px_36px_rgba(29,27,21,0.12)] border border-[#cec5bd]/50 px-2 py-1 touch-manipulation"
    >
      <div className="flex justify-between items-center h-14">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors gap-0.5 relative active:scale-95 focus:outline-none ${
                isActive
                  ? 'text-[#1d1b15] font-semibold after:content-[""] after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-[#7d5700] after:rounded-full'
                  : 'text-[#4b4640] hover:text-[#1d1b15]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform ${
                    isActive ? 'scale-105' : ''
                  }`}
                  style={{
                    fontVariationSettings: isActive && item.id === 'wishlist' ? "'FILL' 1" : undefined,
                  }}
                >
                  {item.icon}
                </span>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-[15px] h-3.5 px-0.5 rounded-full bg-[#7d5700] text-white text-[8px] font-bold flex items-center justify-center leading-none shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wider uppercase font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
