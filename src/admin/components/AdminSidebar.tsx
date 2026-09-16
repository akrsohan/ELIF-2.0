import React from 'react';
import { AdminUser, AdminView } from '../types';
import { hasAdminPermission } from '../services/adminAuthService';

interface AdminSidebarProps {
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
  currentUser: AdminUser;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onExitToStore: () => void;
  onLogout: () => void;
}

interface NavGroup {
  label: string;
  items: Array<{
    id: AdminView;
    label: string;
    icon: string;
    badge?: string | number;
  }>;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  isOpenMobile,
  onCloseMobile,
  onExitToStore,
  onLogout,
}) => {
  const allNavGroups: NavGroup[] = [
    {
      label: 'MAIN',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }],
    },
    {
      label: 'CATALOG',
      items: [
        { id: 'products', label: 'Products', icon: 'checkroom', badge: '6' },
        { id: 'categories', label: 'Categories', icon: 'category' },
        { id: 'collections', label: 'Collections', icon: 'auto_awesome_mosaic' },
        { id: 'inventory', label: 'Inventory', icon: 'inventory_2', badge: 'Low' },
      ],
    },
    {
      label: 'SALES',
      items: [
        { id: 'orders', label: 'Orders', icon: 'shopping_bag', badge: '4' },
        { id: 'returns', label: 'Returns & Exchanges', icon: 'assignment_return' },
        { id: 'coupons', label: 'Coupons', icon: 'loyalty' },
        { id: 'promotions', label: 'Promotions', icon: 'campaign' },
      ],
    },
    {
      label: 'CUSTOMERS',
      items: [
        { id: 'customers', label: 'Customers', icon: 'group' },
        { id: 'reviews', label: 'Reviews', icon: 'rate_review' },
        { id: 'wishlist-insights', label: 'Wishlist Insights', icon: 'favorite_border' },
      ],
    },
    {
      label: 'ATELIER',
      items: [
        { id: 'fittings', label: 'Salon Fittings', icon: 'styler', badge: '3' },
        { id: 'tailoring', label: 'Tailoring Profiles', icon: 'straighten' },
      ],
    },
    {
      label: 'CONTENT',
      items: [
        { id: 'homepage-cms', label: 'Homepage CMS', icon: 'view_quilt' },
        { id: 'banners', label: 'Banners & Lookbook', icon: 'photo_library' },
        { id: 'newsletter', label: 'Newsletter', icon: 'mail' },
      ],
    },
    {
      label: 'OPERATIONS',
      items: [
        { id: 'delivery', label: 'Delivery & Courier', icon: 'local_shipping' },
        { id: 'payments', label: 'Payments', icon: 'payments' },
      ],
    },
    {
      label: 'ANALYTICS',
      items: [
        { id: 'analytics-sales', label: 'Sales Analytics', icon: 'insights' },
        { id: 'analytics-products', label: 'Product Performance', icon: 'bar_chart' },
      ],
    },
    {
      label: 'SYSTEM',
      items: [
        { id: 'admin-users', label: 'Admin Users & Roles', icon: 'admin_panel_settings' },
        { id: 'activity-logs', label: 'Activity Logs', icon: 'history' },
        { id: 'settings', label: 'Store Settings', icon: 'settings' },
      ],
    },
  ];

  // Filter items by role permissions
  const currentRole = currentUser?.role || 'Super Admin';
  const navGroups = (allNavGroups || [])
    .map((group) => ({
      ...group,
      items: (group.items || []).filter((item) => hasAdminPermission(currentRole, item.id)),
    }))
    .filter((group) => (group.items || []).length > 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#18281b] text-[#c8dac4] flex flex-col border-r border-[#253626] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#253626] flex items-center justify-between shrink-0 bg-[#121c13]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2d6636] border border-[#3f804b] flex items-center justify-center text-white font-bold text-[14px] font-display">
              E
            </div>
            <div>
              <h1 className="font-display text-[16px] text-white tracking-widest leading-none">
                ELIF
              </h1>
              <p className="text-[9px] uppercase tracking-widest text-[#849685] font-semibold mt-1">
                Atelier Administration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden text-[#849685] hover:text-white p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-[12px] no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] font-bold text-[#627a65] tracking-wider uppercase">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    currentView === item.id ||
                    (item.id === 'products' &&
                      (currentView === 'product-new' || currentView === 'product-edit')) ||
                    (item.id === 'orders' && currentView === 'order-detail');

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(item.id);
                          onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-[#2d6636] text-white font-semibold shadow-xs'
                            : 'text-[#a9bfa6] hover:bg-[#203322] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[18px] opacity-90">
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isActive
                                ? 'bg-[#18281b] text-[#a0d797]'
                                : item.badge === 'Low'
                                ? 'bg-amber-900/60 text-amber-300'
                                : 'bg-[#253626] text-[#c8dac4]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom User Profile Card & Quick Actions */}
        <div className="p-3 border-t border-[#253626] bg-[#121c13] shrink-0">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#18281b] border border-[#253626]">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#3f804b] shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-white truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] shrink-0" />
                  <p className="text-[10px] text-[#849685] truncate font-medium">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-[#849685] hover:text-rose-300 hover:bg-[#253626] rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onExitToStore}
            className="w-full mt-2 py-1.5 px-3 rounded-lg text-[11px] font-medium text-[#849685] hover:text-white hover:bg-[#18281b] transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-transparent hover:border-[#253626]"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>Return to Public Store</span>
          </button>
        </div>
      </aside>
    </>
  );
};
