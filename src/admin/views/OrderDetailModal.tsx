import React, { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { AdminOrder, OrderStatus } from '../types';

interface OrderDetailModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  onAddAdminNote: (orderId: string, note: string) => void;
  onShowToast: (msg: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddAdminNote,
  onShowToast,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.orderStatus || 'Pending');
  const [newNote, setNewNote] = useState('');
  const [assignedCourier, setAssignedCourier] = useState(order?.courier || 'Pathao Express');

  if (!isOpen || !order) return null;

  const allStatuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Quality Check',
    'Ready to Ship',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  const handleStatusChange = (status: OrderStatus) => {
    setSelectedStatus(status);
    onUpdateStatus(order.id, status, `Status changed by admin to ${status}`);
    onShowToast(`Order #${order.id} status updated to ${status}.`);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddAdminNote(order.id, newNote.trim());
    setNewNote('');
    onShowToast('Internal atelier note logged.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-[#ded6be] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Strip */}
        <div className="p-5 sm:p-6 bg-[#faf7ed] border-b border-[#ded6be] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#18281b] text-white flex items-center justify-center font-mono font-bold text-[14px]">
              EL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-[18px] sm:text-[20px] font-bold text-[#18281b]">
                  {order.id}
                </h2>
                <StatusBadge status={order.orderStatus} size="md" />
              </div>
              <p className="text-[11px] text-[#5c725f] mt-0.5">
                Consignment placed on {order.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick Status Dropdown */}
            <select
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="bg-white border border-[#ded6be] rounded-xl px-3 py-1.5 text-[12px] font-bold text-[#18281b] focus:outline-none cursor-pointer shadow-2xs"
            >
              {allStatuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#849685] hover:text-[#18281b] hover:bg-[#f1f6ee] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-[12px]">
          {/* 3-Column Summary Info: Client, Shipping, Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Client Card */}
            <div className="p-4 rounded-2xl bg-[#faf7ed] border border-[#ded6be]/80 space-y-2">
              <div className="flex items-center gap-2 text-[#5c725f] font-bold uppercase text-[10px] tracking-wider">
                <span className="material-symbols-outlined text-[16px]">person</span>
                <span>Client Information</span>
              </div>
              <p className="font-semibold text-[14px] text-[#18281b]">{order.customer.name}</p>
              <p className="text-[#5c725f]">{order.customer.phone}</p>
              <p className="text-[#849685] text-[11px] truncate">{order.customer.email}</p>
            </div>

            {/* 2. Delivery Address */}
            <div className="p-4 rounded-2xl bg-[#faf7ed] border border-[#ded6be]/80 space-y-2">
              <div className="flex items-center gap-2 text-[#5c725f] font-bold uppercase text-[10px] tracking-wider">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>Delivery Address</span>
              </div>
              <p className="font-semibold text-[#18281b]">{order.customer.district}</p>
              <p className="text-[#5c725f] leading-relaxed">{order.customer.address}</p>
              {order.customer.notes && (
                <p className="text-[10px] text-[#b45309] font-medium bg-[#fef3c7] px-2 py-1 rounded">
                  Note: {order.customer.notes}
                </p>
              )}
            </div>

            {/* 3. Payment Details */}
            <div className="p-4 rounded-2xl bg-[#faf7ed] border border-[#ded6be]/80 space-y-2">
              <div className="flex items-center gap-2 text-[#5c725f] font-bold uppercase text-[10px] tracking-wider">
                <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                <span>Payment Details</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#18281b]">{order.paymentMethod}</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
              <p className="text-[11px] text-[#5c725f]">
                Courier: <strong className="text-[#18281b]">{order.courier}</strong>
              </p>
              {order.courierTrackingCode && (
                <p className="text-[10px] font-mono text-[#2d6636]">
                  AWB: {order.courierTrackingCode}
                </p>
              )}
            </div>
          </div>

          {/* Garments Items Table */}
          <div className="border border-[#ded6be] rounded-2xl overflow-hidden">
            <div className="bg-[#faf7ed] p-3 border-b border-[#ded6be] flex items-center justify-between">
              <span className="font-bold text-[11px] text-[#5c725f] uppercase tracking-wider">
                Garments Ordered ({order.items.length})
              </span>
              <span className="text-[11px] font-semibold text-[#2d6636]">
                Complimentary Atelier Packaging
              </span>
            </div>

            <div className="divide-y divide-[#f1f6ee]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf7eb]/40"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-14 rounded-xl object-cover border border-[#ded6be]/70 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-[13px] text-[#18281b]">
                        {item.productName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5c725f] mt-0.5">
                        <span className="bg-[#f1f6ee] px-2 py-0.5 rounded font-medium border border-[#d6edd2]">
                          Size: {item.size}
                        </span>
                        <span className="bg-[#f1f6ee] px-2 py-0.5 rounded font-medium border border-[#d6edd2]">
                          Color: {item.color}
                        </span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[14px] text-[#18281b]">
                      ৳{item.subtotal.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#849685]">
                      ৳{item.unitPrice.toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Timeline Progress */}
            <div className="bg-[#faf7ed] rounded-2xl border border-[#ded6be] p-4 space-y-3">
              <h4 className="font-bold text-[11px] text-[#5c725f] uppercase tracking-wider">
                Fulfillment Timeline
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-[#2d6636]">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-3">
                    <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#2d6636] border-2 border-white" />
                    <p className="font-semibold text-[#18281b] text-[12px]">
                      {step.status} <span className="text-[10px] font-normal text-[#849685]">• {step.time}</span>
                    </p>
                    <p className="text-[11px] text-[#5c725f]">{step.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary Box */}
            <div className="bg-white rounded-2xl border border-[#ded6be] p-5 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-[11px] text-[#5c725f] uppercase tracking-wider mb-2">
                Financial Invoice Summary
              </h4>

              <div className="flex justify-between text-[#5c725f]">
                <span>Items Subtotal</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[#2e7d32] font-semibold">
                  <span>Discount ({order.couponCode || 'Privilege'})</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-[#5c725f]">
                <span>Nationwide Shipping</span>
                <span>{order.deliveryFee === 0 ? 'Complimentary (৳0)' : `৳${order.deliveryFee}`}</span>
              </div>

              <div className="pt-2 border-t border-[#ded6be] flex justify-between items-baseline font-bold text-[#18281b] text-[16px]">
                <span>Grand Total (BDT)</span>
                <span className="text-[18px]">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div className="bg-white rounded-2xl border border-[#ded6be] p-5 space-y-3">
            <h4 className="font-bold text-[11px] text-[#5c725f] uppercase tracking-wider">
              Internal Atelier Notes
            </h4>

            {order.adminNotes && order.adminNotes.length > 0 ? (
              <div className="space-y-1.5">
                {order.adminNotes.map((nt, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#faf7ed] text-[#4b5d4e] text-[11px] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#2d6636] shrink-0 mt-0.5">
                      note
                    </span>
                    <span>{nt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[#849685] italic">No internal notes recorded yet.</p>
            )}

            <form onSubmit={handleAddNoteSubmit} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log internal note (e.g. VIP client requested ivory packaging)..."
                className="flex-1 bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[#18281b] text-white font-semibold text-[11px] hover:bg-[#283d2b] transition-colors cursor-pointer"
              >
                Add Note
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer Strip */}
        <div className="p-4 bg-[#faf7ed] border-t border-[#ded6be] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => onShowToast(`Printing packing slip for ${order.id}...`)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#ded6be] text-[12px] font-semibold text-[#18281b] hover:bg-[#f1f6ee] flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Invoice & Label</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#18281b] text-white text-[12px] font-semibold hover:bg-[#253d29] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
