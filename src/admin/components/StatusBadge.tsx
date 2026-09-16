import React from 'react';
import { OrderStatus, PaymentStatus, ProductStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus | ProductStatus | PaymentStatus | 'VIP Atelier' | 'Regular' | 'New Client' | 'Published' | 'Draft' | 'Archived' | 'Active' | 'Expired' | 'Disabled' | 'Confirmed' | 'Pending' | 'Completed' | 'Rescheduled' | 'Approved' | 'Rejected' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeStyle = (val: string) => {
    switch (val) {
      // Order & Fitting Statuses
      case 'Delivered':
      case 'Completed':
      case 'Approved':
      case 'Published':
      case 'Paid':
        return {
          bg: 'bg-[#eaf5e6] text-[#1e5025] border-[#c2e4bb]',
          dot: 'bg-[#2e7d32]',
        };
      case 'Shipped':
      case 'Ready to Ship':
        return {
          bg: 'bg-[#e6f4f8] text-[#0d4f66] border-[#badfed]',
          dot: 'bg-[#0288d1]',
        };
      case 'Confirmed':
      case 'Processing':
      case 'Quality Check':
        return {
          bg: 'bg-[#fff8e6] text-[#7a5500] border-[#fae29f]',
          dot: 'bg-[#f57c00]',
        };
      case 'Pending':
      case 'Draft':
        return {
          bg: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
          dot: 'bg-[#9ca3af]',
        };
      case 'Cancelled':
      case 'Rejected':
      case 'Failed':
      case 'Expired':
      case 'Out of Stock':
      case 'Archived':
      case 'Disabled':
        return {
          bg: 'bg-[#feecec] text-[#991b1b] border-[#fecaca]',
          dot: 'bg-[#dc2626]',
        };
      case 'Active':
        return {
          bg: 'bg-[#eaf5e6] text-[#1e5025] border-[#c2e4bb]',
          dot: 'bg-[#2e7d32]',
        };
      case 'VIP Atelier':
        return {
          bg: 'bg-[#fcf5e5] text-[#855309] border-[#f4db9b]',
          dot: 'bg-[#d97706]',
        };
      case 'Rescheduled':
        return {
          bg: 'bg-[#f3e8ff] text-[#6b21a8] border-[#e9d5ff]',
          dot: 'bg-[#9333ea]',
        };
      default:
        return {
          bg: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]',
          dot: 'bg-[#6b7280]',
        };
    }
  };

  const style = getBadgeStyle(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${sizeClasses} whitespace-nowrap select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      <span>{status}</span>
    </span>
  );
};
