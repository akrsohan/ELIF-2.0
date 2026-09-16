import React from 'react';
import { AdminNotification, AdminUser, AdminView } from '../types';

interface AdminHeaderProps {
  currentView: AdminView;
  currentUser: AdminUser;
  notifications?: AdminNotification[];
  unreadNotificationsCount?: number;
  onOpenMobileMenu?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onNavigate?: (view: AdminView) => void;
  onExitToStore?: () => void;
  onExitAdmin?: () => void;
  onLogout?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentView,
  currentUser,
  notifications = [],
  unreadNotificationsCount,
  onOpenMobileMenu,
  onToggleMobileSidebar,
  onOpenSearch,
  onOpenNotifications,
  onNavigate = (_view: AdminView) => {},
  onExitToStore,
  onExitAdmin,
}) => {
  const handleExit = onExitToStore || onExitAdmin || (() => {});
  const handleMobileMenu = onOpenMobileMenu || onToggleMobileSidebar || (() => {});
  const unreadCount =
    typeof unreadNotificationsCount === 'number'
      ? unreadNotificationsCount
      : (notifications || []).filter((n) => !n.read).length;

  const getViewTitle = (view: AdminView) => {
    switch (view) {
      case 'dashboard':
        return { title: 'Dashboard', category: 'Overview' };
      case 'products':
        return { title: 'Products Catalog', category: 'Catalog' };
      case 'product-new':
        return { title: 'New Garment Creation', category: 'Products' };
      case 'product-edit':
        return { title: 'Edit Garment', category: 'Products' };
      case 'categories':
        return { title: 'Categories', category: 'Catalog' };
      case 'collections':
        return { title: 'Collections & Capsules', category: 'Catalog' };
      case 'inventory':
        return { title: 'Inventory & Stock Levels', category: 'Catalog' };
      case 'orders':
        return { title: 'Orders Management', category: 'Sales' };
      case 'order-detail':
        return { title: 'Order Details & Invoice', category: 'Orders' };
      case 'returns':
        return { title: 'Returns & Exchanges', category: 'Sales' };
      case 'coupons':
        return { title: 'Promotional Coupons', category: 'Marketing' };
      case 'promotions':
        return { title: 'Seasonal Campaigns', category: 'Marketing' };
      case 'customers':
        return { title: 'Customer Directory & VIP', category: 'CRM' };
      case 'reviews':
        return { title: 'Product Reviews Moderation', category: 'Community' };
      case 'wishlist-insights':
        return { title: 'Wishlist Analytics', category: 'Insights' };
      case 'fittings':
        return { title: 'Salon Fitting Appointments', category: 'Atelier' };
      case 'tailoring':
        return { title: 'Customer Tailoring Profiles', category: 'Atelier' };
      case 'homepage-cms':
        return { title: 'Homepage Content Manager', category: 'Editorial' };
      case 'banners':
        return { title: 'Banners & Lookbook Media', category: 'Editorial' };
      case 'newsletter':
        return { title: 'VIP Newsletter Subscribers', category: 'Audience' };
      case 'delivery':
        return { title: 'Delivery Zones & Courier Rates', category: 'Logistics' };
      case 'payments':
        return { title: 'Payment Gateways & Settings', category: 'Finance' };
      case 'analytics-sales':
        return { title: 'Sales Analytics & Revenue', category: 'Intelligence' };
      case 'analytics-products':
        return { title: 'Product Performance Metrics', category: 'Intelligence' };
      case 'admin-users':
        return { title: 'Admin Users & Staff Roles', category: 'Governance' };
      case 'activity-logs':
        return { title: 'Audit Trail & Activity Logs', category: 'Security' };
      case 'settings':
        return { title: 'Store Settings & Policies', category: 'System' };
      default:
        return { title: 'Administration', category: 'ELIF' };
    }
  };

  const info = getViewTitle(currentView);

  return (
    <header className="sticky top-0 z-30 bg-[#faf7ed]/95 backdrop-blur-md border-b border-[#ded6be]/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#18281b] hover:bg-[#f1f6ee] cursor-pointer"
          aria-label="Open Sidebar Menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#849685] font-medium">
            <span>ELIF Atelier</span>
            <span>/</span>
            <span className="text-[#5c725f]">{info.category}</span>
          </div>
          <h2 className="text-[17px] sm:text-[20px] font-bold text-[#18281b] font-serif tracking-tight leading-tight">
            {info.title}
          </h2>
        </div>
      </div>

      {/* Right: Quick Search, Actions, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Quick Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#ded6be] text-[12px] text-[#849685] hover:border-[#18281b] hover:text-[#18281b] transition-colors shadow-2xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px] text-[#5c725f]">search</span>
          <span className="hidden md:inline">Quick jump (Orders, SKU, Clients)...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-[#f1f6ee] text-[#5c725f] rounded border border-[#ded6be]">
            ⌘K
          </kbd>
        </button>

        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="sm:hidden p-2 rounded-xl bg-white border border-[#ded6be] text-[#18281b] hover:bg-[#f1f6ee] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[19px]">search</span>
        </button>

        {/* Quick Add Product CTA */}
        {currentView !== 'product-new' && (
          <button
            type="button"
            onClick={() => onNavigate('product-new')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-all duration-150 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Garment</span>
          </button>
        )}

        {/* Notification Bell with Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-white border border-[#ded6be] text-[#18281b] hover:bg-[#f1f6ee] transition-colors cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#b91c1c] text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Storefront View Button */}
        <button
          type="button"
          onClick={handleExit}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f1f6ee] hover:bg-[#e4ede0] text-[#18281b] text-[11px] font-semibold border border-[#d6edd2] transition-colors cursor-pointer"
          title="Return to Customer Storefront"
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          <span>Storefront</span>
        </button>

        {/* Current Admin User Profile Avatar */}
        <div
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 pl-2 border-l border-[#ded6be] cursor-pointer"
          title="Account Settings"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-[#18281b]/30 hover:ring-2 hover:ring-[#18281b] transition-all"
          />
        </div>
      </div>
    </header>
  );
};
