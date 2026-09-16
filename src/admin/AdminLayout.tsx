import React, { useState, useEffect } from 'react';
import { AdminHeader } from './components/AdminHeader';
import { AdminNotificationsModal } from './components/AdminNotificationsModal';
import { AdminSearchModal } from './components/AdminSearchModal';
import { AdminSidebar } from './components/AdminSidebar';
import {
  initialActivityLogs,
  initialAdminUsers,
  initialCategories,
  initialCMSState,
  initialCollections,
  initialCoupons,
  initialCustomers,
  initialFittings,
  initialNotifications,
  initialOperationsState,
  initialOrders,
  initialProducts,
  initialReviews,
  initialTailoringProfiles,
} from './data/adminDemoData';
import {
  AdminActivityLog,
  AdminCMSState,
  AdminCoupon,
  AdminNotification,
  AdminOperationsState,
  AdminOrder,
  AdminProduct,
  AdminReview,
  AdminTailoringProfile,
  AdminUser,
  AdminView,
  OrderStatus,
} from './types';
import { hasAdminPermission, recordAdminActivityLog } from './services/adminAuthService';
import { ActivityLogsView } from './views/ActivityLogsView';
import { AdminUsersRolesView } from './views/AdminUsersRolesView';
import { AnalyticsView } from './views/AnalyticsView';
import { CategoriesCollectionsView } from './views/CategoriesCollectionsView';
import { CouponsPromotionsView } from './views/CouponsPromotionsView';
import { CustomersReviewsView } from './views/CustomersReviewsView';
import { DashboardView } from './views/DashboardView';
import { HomepageCMSView } from './views/HomepageCMSView';
import { InventoryView } from './views/InventoryView';
import { OperationsView } from './views/OperationsView';
import { OrderDetailModal } from './views/OrderDetailModal';
import { OrdersView } from './views/OrdersView';
import { ProductEditorView } from './views/ProductEditorView';
import { ProductsView } from './views/ProductsView';
import { SalonFittingsView } from './views/SalonFittingsView';
import { SettingsView } from './views/SettingsView';
import { TailoringProfilesView } from './views/TailoringProfilesView';

interface AdminLayoutProps {
  onExitAdmin: () => void;
  currentUser: AdminUser;
  onLogout?: () => void;
  initialView?: AdminView;
  onViewChange?: (view: AdminView) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onExitAdmin,
  currentUser,
  onLogout = () => {},
  initialView = 'dashboard',
  onViewChange,
}) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<AdminView>(initialView);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (initialView && initialView !== currentView) {
      if (hasAdminPermission(currentUser.role, initialView)) {
        setCurrentView(initialView);
      }
    }
  }, [initialView, currentUser.role]);

  // Entities Data State
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [fittings, setFittings] = useState(initialFittings);
  const [tailoringProfiles, setTailoringProfiles] = useState<AdminTailoringProfile[]>(
    initialTailoringProfiles
  );
  const [categories, setCategories] = useState(initialCategories);
  const [collections, setCollections] = useState(initialCollections);
  const [coupons, setCoupons] = useState<AdminCoupon[]>(initialCoupons);
  const [customers, setCustomers] = useState(initialCustomers);
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews);
  const [cms, setCms] = useState<AdminCMSState>(initialCMSState);
  const [operations, setOperations] = useState<AdminOperationsState>(initialOperationsState);
  const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [logs, setLogs] = useState<AdminActivityLog[]>(initialActivityLogs);
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);

  // Modals & Selected items
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleNavigate = (view: AdminView) => {
    if (!hasAdminPermission(currentUser.role, view)) {
      showToast(`Access Restricted: Your staff role (${currentUser.role}) is not permitted to view this module.`);
      return;
    }
    setCurrentView(view);
    if (onViewChange) {
      onViewChange(view);
    }
  };

  const logActivity = (action: string, details: string, moduleName = 'Atelier Management') => {
    const newLog: AdminActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      details,
      module: moduleName,
      ipAddress: '103.145.118.24',
    };
    setLogs((prev) => [newLog, ...prev]);
    recordAdminActivityLog(action, details, currentUser, moduleName);
  };

  // Product Actions
  const handleSaveProduct = (productData: Partial<AdminProduct>) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...productData } as AdminProduct) : p))
      );
      logActivity('Updated Garment', `Modified specifications for ${productData.name}`, 'Catalog');
      showToast(`Garment "${productData.name}" updated successfully.`);
    } else {
      const newProduct = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      } as AdminProduct;
      setProducts((prev) => [newProduct, ...prev]);
      logActivity('Added Garment', `Created new catalog item ${newProduct.name}`, 'Catalog');
      showToast(`Garment "${newProduct.name}" created.`);
    }
    setEditingProduct(null);
    handleNavigate('products');
  };

  const handleDeleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    logActivity('Archived Garment', `Removed ${target.name} from active catalog`, 'Catalog');
    showToast(`Garment "${target.name}" archived.`);
  };

  const handleDuplicateProduct = (product: AdminProduct) => {
    const duplicated: AdminProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      sku: `${product.sku}-COPY`,
      name: `${product.name} (Copy)`,
      nameBn: `${product.nameBn} (কপি)`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [duplicated, ...prev]);
    logActivity('Duplicated Garment', `Cloned ${product.name}`, 'Catalog');
    showToast(`Created duplicate copy of "${product.name}".`);
  };

  const handleStockUpdate = (productId: string, newStock: number, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    const oldStock = prod?.stockCount || 0;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount: newStock } : p))
    );
    logActivity(
      'Adjusted Stock',
      `${prod?.name || productId}: ${oldStock} → ${newStock} units (${reason})`,
      'Inventory'
    );
    showToast('Stock level updated successfully.');
  };

  // Order Actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, note = '') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: newStatus,
            timeline: [
              {
                status: newStatus,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                note: note || `Status updated to ${newStatus} by ${currentUser.name}`,
                by: currentUser.name,
              },
              ...o.timeline,
            ],
          };
        }
        return o;
      })
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: newStatus,
              timeline: [
                {
                  status: newStatus,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  note: note || `Status updated to ${newStatus} by ${currentUser.name}`,
                  by: currentUser.name,
                },
                ...prev.timeline,
              ],
            }
          : null
      );
    }

    logActivity('Updated Order Status', `Order #${orderId} changed to "${newStatus}"`, 'Orders');
    showToast(`Order #${orderId} marked as ${newStatus}.`);
  };

  const handleAddAdminNote = (orderId: string, noteText: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            adminNotes: [...(o.adminNotes || []), `${currentUser.name}: ${noteText}`],
          };
        }
        return o;
      })
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              adminNotes: [...(prev.adminNotes || []), `${currentUser.name}: ${noteText}`],
            }
          : null
      );
    }
    showToast('Internal note saved.');
  };

  // Fitting Actions
  const handleUpdateFittingStatus = (
    fittingId: string,
    status: 'Confirmed' | 'Pending' | 'Completed' | 'Rescheduled' | 'Cancelled'
  ) => {
    setFittings((prev) =>
      prev.map((f) => (f.id === fittingId ? { ...f, status } : f))
    );
    logActivity('Updated Fitting Appointment', `Appointment #${fittingId} set to ${status}`, 'Atelier');
    showToast(`Salon session #${fittingId} updated to ${status}.`);
  };

  // Notifications
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All administrative alerts marked as read.');
  };

  // Render Subviews with Strict Role Verification
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            orders={orders}
            products={products}
            fittings={fittings}
            onNavigate={handleNavigate}
            onSelectOrder={(order) => {
              setSelectedOrder(order);
              setIsOrderDetailOpen(true);
            }}
            onShowToast={showToast}
          />
        );

      case 'orders':
        return (
          <OrdersView
            orders={orders}
            onNavigate={handleNavigate}
            onSelectOrder={(order) => {
              setSelectedOrder(order);
              setIsOrderDetailOpen(true);
            }}
            onUpdateStatus={handleUpdateOrderStatus}
            onShowToast={showToast}
          />
        );

      case 'products':
        return (
          <ProductsView
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={(product) => {
              setEditingProduct(product);
              handleNavigate('product-edit');
            }}
            onEditProduct={(product) => {
              setEditingProduct(product);
              handleNavigate('product-edit');
            }}
            onDeleteProduct={handleDeleteProduct}
            onDuplicateProduct={handleDuplicateProduct}
            onShowToast={showToast}
          />
        );

      case 'product-new':
        return (
          <ProductEditorView
            product={null}
            onSave={handleSaveProduct}
            onCancel={() => handleNavigate('products')}
            onNavigate={handleNavigate}
          />
        );

      case 'product-edit':
        return (
          <ProductEditorView
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setEditingProduct(null);
              handleNavigate('products');
            }}
            onNavigate={handleNavigate}
          />
        );

      case 'inventory':
        return (
          <InventoryView
            products={products}
            onNavigate={handleNavigate}
            onUpdateStock={handleStockUpdate}
            onShowToast={showToast}
          />
        );

      case 'categories':
      case 'collections':
        return (
          <CategoriesCollectionsView
            categories={categories}
            collections={collections}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );

      case 'coupons':
      case 'promotions':
        return (
          <CouponsPromotionsView
            coupons={coupons}
            onNavigate={handleNavigate}
            onAddCoupon={(newCp) => setCoupons((prev) => [newCp, ...prev])}
            onDeleteCoupon={(id) => {
              setCoupons((prev) => prev.filter((c) => c.id !== id));
              showToast('Coupon removed.');
            }}
            onShowToast={showToast}
          />
        );

      case 'returns':
        return (
          <OrdersView
            orders={orders}
            onNavigate={handleNavigate}
            onSelectOrder={(order) => {
              setSelectedOrder(order);
              setIsOrderDetailOpen(true);
            }}
            onUpdateStatus={handleUpdateOrderStatus}
            onShowToast={showToast}
          />
        );

      case 'fittings':
        return (
          <SalonFittingsView
            fittings={fittings}
            onNavigate={handleNavigate}
            onUpdateStatus={handleUpdateFittingStatus}
            onShowToast={showToast}
          />
        );

      case 'tailoring':
        return (
          <TailoringProfilesView
            tailoringProfiles={tailoringProfiles}
            onNavigate={handleNavigate}
            onUpdateProfile={(updated) => {
              setTailoringProfiles((prev) =>
                prev.map((tp) => (tp.id === updated.id ? updated : tp))
              );
            }}
            onShowToast={showToast}
          />
        );

      case 'cms':
      case 'homepage-cms':
      case 'banners':
      case 'lookbook':
      case 'newsletter':
        return (
          <HomepageCMSView
            cms={cms}
            onNavigate={handleNavigate}
            onUpdateCMS={(newCms) => {
              setCms(newCms);
              logActivity('CMS Updated', 'Published changes to storefront narrative & hero', 'Content');
            }}
            onShowToast={showToast}
          />
        );

      case 'customers':
      case 'customer-detail':
      case 'reviews':
      case 'wishlist-insights':
        return (
          <CustomersReviewsView
            customers={customers}
            reviews={reviews}
            onNavigate={handleNavigate}
            onApproveReview={(id) => {
              setReviews((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
              );
              logActivity('Approved Review', `Published testimonial #${id}`, 'Customers');
            }}
            onRejectReview={(id) => {
              setReviews((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
              );
            }}
            onShowToast={showToast}
          />
        );

      case 'operations':
      case 'delivery':
      case 'payments':
        return (
          <OperationsView
            operations={operations}
            onNavigate={handleNavigate}
            onUpdateOperations={(newOps) => {
              setOperations(newOps);
              logActivity('Operations Updated', 'Saved shipping zones & payment settings', 'Operations');
            }}
            onShowToast={showToast}
          />
        );

      case 'analytics':
      case 'analytics-sales':
      case 'analytics-products':
      case 'analytics-customers':
        return <AnalyticsView onNavigate={handleNavigate} onShowToast={showToast} />;

      case 'users':
      case 'admin-users':
      case 'roles':
        return (
          <AdminUsersRolesView
            users={users}
            onNavigate={handleNavigate}
            onAddUser={(newUsr) => setUsers((prev) => [...prev, newUsr])}
            onShowToast={showToast}
          />
        );

      case 'logs':
      case 'activity-logs':
        return <ActivityLogsView logs={logs} onNavigate={handleNavigate} onShowToast={showToast} />;

      case 'settings':
        return <SettingsView onNavigate={handleNavigate} onShowToast={showToast} />;

      default:
        return (
          <DashboardView
            orders={orders}
            products={products}
            fittings={fittings}
            onNavigate={handleNavigate}
            onSelectOrder={(order) => {
              setSelectedOrder(order);
              setIsOrderDetailOpen(true);
            }}
            onShowToast={showToast}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7ed] text-[#18281b] flex flex-col antialiased selection:bg-[#18281b] selection:text-white">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className="bg-[#18281b] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#2d6636]/60 text-[12px]">
            <span className="material-symbols-outlined text-[18px] text-[#86efac]">
              check_circle
            </span>
            <span className="font-medium">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-[#9ca3af] hover:text-white ml-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Shell Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Desktop & Mobile Drawer Sidebar */}
        <AdminSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onExitToStore={onExitAdmin}
          onLogout={onLogout}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-64">
          {/* Top Sticky Header */}
          <AdminHeader
            currentView={currentView}
            currentUser={currentUser}
            notifications={notifications}
            unreadNotificationsCount={(notifications || []).filter((n) => !n.read).length}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onNavigate={handleNavigate}
            onExitAdmin={onExitAdmin}
            onExitToStore={onExitAdmin}
            onLogout={onLogout}
          />

          {/* Main Scrollable Canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#faf7ed]">
            <div className="max-w-7xl mx-auto">{renderCurrentView()}</div>
          </main>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isOrderDetailOpen}
        onClose={() => {
          setIsOrderDetailOpen(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={handleUpdateOrderStatus}
        onAddAdminNote={handleAddAdminNote}
        onShowToast={showToast}
      />

      {/* Global Admin Search Modal */}
      <AdminSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        onSelectProduct={(p) => {
          setEditingProduct(p);
          handleNavigate('product-edit');
          setIsSearchOpen(false);
        }}
        onSelectOrder={(o) => {
          setSelectedOrder(o);
          setIsOrderDetailOpen(true);
          setIsSearchOpen(false);
        }}
        products={products}
        orders={orders}
        customers={customers}
        collections={collections}
      />

      {/* Notifications Drawer */}
      <AdminNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onNavigate={handleNavigate}
      />
    </div>
  );
};
