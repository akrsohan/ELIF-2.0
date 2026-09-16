import React from 'react';
import { AdminNotification, AdminView } from '../types';

interface AdminNotificationsModalProps {
  isOpen: boolean;
  notifications?: AdminNotification[];
  onClose: () => void;
  onNavigate: (view: AdminView) => void;
  onMarkAllAsRead?: () => void;
  onMarkAllRead?: () => void;
}

export const AdminNotificationsModal: React.FC<AdminNotificationsModalProps> = ({
  isOpen,
  notifications = [],
  onClose,
  onNavigate,
  onMarkAllAsRead,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;
  const handleMarkAll = onMarkAllAsRead || onMarkAllRead || (() => {});

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#ded6be] shadow-2xl z-50 overflow-hidden animate-fadeIn">
        <div className="p-4 border-b border-[#f1f6ee] flex items-center justify-between bg-[#faf7ed]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#18281b]">
              notifications
            </span>
            <span className="font-bold text-[14px] text-[#18281b]">Atelier Notifications</span>
            <span className="text-[10px] bg-[#18281b] text-white px-2 py-0.5 rounded-full font-semibold">
              {(notifications || []).filter((n) => !n.read).length} new
            </span>
          </div>
          <button
            type="button"
            onClick={handleMarkAll}
            className="text-[11px] font-semibold text-[#2d6636] hover:underline cursor-pointer"
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#f7f9f4]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[12px] text-[#849685]">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.linkView) {
                    onNavigate(notif.linkView);
                    onClose();
                  }
                }}
                className={`p-3.5 hover:bg-[#faf7eb] transition-colors cursor-pointer flex items-start gap-3 ${
                  !notif.read ? 'bg-[#f4faee]/60' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.severity === 'critical' || notif.severity === 'warning'
                      ? 'bg-[#fee2e2] text-[#b91c1c]'
                      : 'bg-[#eaf3e7] text-[#18281b]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {notif.type === 'order'
                      ? 'shopping_bag'
                      : notif.type === 'stock'
                      ? 'inventory_2'
                      : notif.type === 'fitting'
                      ? 'styler'
                      : 'info'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="text-[12px] font-semibold text-[#18281b] truncate">{notif.title}</p>
                    <span className="text-[10px] text-[#849685] shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-[#5c725f] line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[#2d6636] shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 bg-[#faf7ed] border-t border-[#f1f6ee] text-center">
          <button
            type="button"
            onClick={() => {
              onNavigate('activity-logs');
              onClose();
            }}
            className="text-[11px] font-semibold text-[#18281b] hover:text-[#2d6636] transition-colors cursor-pointer"
          >
            View Complete Activity Stream →
          </button>
        </div>
      </div>
    </>
  );
};
