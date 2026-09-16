import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { language, t, formatNumber } = useLanguage();
  const { cartCount, wishlistCount } = useStore();

  const isHome = path === '/';
  const isShop = path.startsWith('/shop') || path.startsWith('/category');
  const isWishlist = path === '/wishlist';
  const isCart = path === '/cart';
  const isAccount = path.startsWith('/account') || path === '/orders' || path === '/track-order';

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#faf7eb]/95 backdrop-blur-xl border-t border-[#ded6be] md:hidden pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(25,36,26,0.05)]">
      <div className="flex items-center justify-around h-14 px-2">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isHome ? 'text-[#1b5e28]' : 'text-[#3a4d3d] hover:text-[#18281b]'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className={`text-[9.5px] uppercase tracking-wider mt-1 ${isHome ? 'font-black' : 'font-bold'}`}>
            {t.navHome}
          </span>
        </Link>

        {/* Shop / Categories */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isShop ? 'text-[#1b5e28]' : 'text-[#3a4d3d] hover:text-[#18281b]'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${isShop ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className={`text-[9.5px] uppercase tracking-wider mt-1 ${isShop ? 'font-black' : 'font-bold'}`}>
            {language === 'bn' ? 'শপ' : 'Shop'}
          </span>
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
            isWishlist ? 'text-[#1b5e28]' : 'text-[#3a4d3d] hover:text-[#18281b]'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isWishlist ? 'fill-[#1b5e28] stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-[#1b5e28] text-white text-[8px] font-black flex items-center justify-center">
                {formatNumber(wishlistCount)}
              </span>
            )}
          </div>
          <span className={`text-[9.5px] uppercase tracking-wider mt-1 ${isWishlist ? 'font-black' : 'font-bold'}`}>
            {language === 'bn' ? 'উইশলিস্ট' : 'Saved'}
          </span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
            isCart ? 'text-[#1b5e28]' : 'text-[#3a4d3d] hover:text-[#18281b]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${isCart ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-[#1b5e28] text-white text-[8px] font-black flex items-center justify-center animate-pulse">
                {formatNumber(cartCount)}
              </span>
            )}
          </div>
          <span className={`text-[9.5px] uppercase tracking-wider mt-1 ${isCart ? 'font-black' : 'font-bold'}`}>
            {language === 'bn' ? 'ব্যাগ' : 'Bag'}
          </span>
        </Link>

        {/* Account */}
        <Link
          to="/account"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isAccount ? 'text-[#1b5e28]' : 'text-[#3a4d3d] hover:text-[#18281b]'
          }`}
        >
          <User className={`w-5 h-5 ${isAccount ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className={`text-[9.5px] uppercase tracking-wider mt-1 ${isAccount ? 'font-black' : 'font-bold'}`}>
            {language === 'bn' ? 'অ্যাকাউন্ট' : 'Account'}
          </span>
        </Link>
      </div>
    </div>
  );
};
