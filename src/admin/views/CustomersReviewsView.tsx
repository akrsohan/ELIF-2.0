import React, { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { AdminCustomer, AdminReview, AdminView } from '../types';

interface CustomersReviewsViewProps {
  customers: AdminCustomer[];
  reviews: AdminReview[];
  onNavigate: (view: AdminView) => void;
  onApproveReview: (reviewId: string) => void;
  onRejectReview: (reviewId: string) => void;
  onShowToast: (msg: string) => void;
}

export const CustomersReviewsView: React.FC<CustomersReviewsViewProps> = ({
  customers,
  reviews,
  onNavigate,
  onApproveReview,
  onRejectReview,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'customers' | 'reviews'>('customers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Client Directory & Review Moderation
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Manage ELIF patrons, high-net-worth VIP tiers, and moderate client satisfaction testimonials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('Exported customer CRM records to CSV.')}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#f1f6ee] text-[#18281b] text-[12px] font-semibold border border-[#ded6be] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Export Patrons</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#ded6be]/80 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-t-xl text-[13px] font-bold transition-all cursor-pointer border-b-2 ${
            activeTab === 'customers'
              ? 'border-[#18281b] text-[#18281b] bg-white'
              : 'border-transparent text-[#5c725f] hover:text-[#18281b]'
          }`}
        >
          VIP Clients & Patrons ({customers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-t-xl text-[13px] font-bold transition-all cursor-pointer border-b-2 ${
            activeTab === 'reviews'
              ? 'border-[#18281b] text-[#18281b] bg-white'
              : 'border-transparent text-[#5c725f] hover:text-[#18281b]'
          }`}
        >
          Review Moderation ({reviews.length})
        </button>
      </div>

      {/* 1. Customers Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#ded6be] p-4 shadow-xs">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#849685]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patrons by name, mobile number, or email..."
                className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl pl-10 pr-3 py-2 text-[12px] text-[#18281b] placeholder-[#849685] focus:outline-none focus:bg-white focus:border-[#18281b]"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#ded6be] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#faf7ed] border-b border-[#ded6be]/80 text-[#5c725f] uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 pl-4 pr-2">Patron Name</th>
                    <th className="py-3.5 px-3">Contact</th>
                    <th className="py-3.5 px-3">District</th>
                    <th className="py-3.5 px-3">Orders</th>
                    <th className="py-3.5 px-3">Lifetime Spent</th>
                    <th className="py-3.5 px-3">VIP Tier</th>
                    <th className="py-3.5 pr-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f9f4]">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-[#faf7eb]/60 transition-colors">
                      <td className="py-3.5 pl-4 pr-2 font-semibold text-[#18281b]">
                        {cust.name}
                      </td>

                      <td className="py-3.5 px-3 text-[#5c725f]">
                        <p className="font-mono text-[11px] text-[#18281b]">{cust.phone}</p>
                        <p className="text-[10px] text-[#849685]">{cust.email}</p>
                      </td>

                      <td className="py-3.5 px-3 text-[#18281b]">{cust.district}</td>

                      <td className="py-3.5 px-3 font-semibold text-[#18281b]">
                        {cust.totalOrders}
                      </td>

                      <td className="py-3.5 px-3 font-bold text-[#18281b]">
                        ৳{cust.totalSpent.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            cust.tier === 'Haute Circle'
                              ? 'bg-[#18281b] text-white'
                              : cust.tier === 'VIP Patron'
                              ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                              : 'bg-[#faf7ed] text-[#5c725f] border border-[#ded6be]'
                          }`}
                        >
                          {cust.tier}
                        </span>
                      </td>

                      <td className="py-3.5 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate('tailoring')}
                          className="px-2.5 py-1 rounded-lg bg-[#f1f6ee] text-[#18281b] hover:bg-[#18281b] hover:text-white text-[11px] font-semibold border border-[#d6edd2] cursor-pointer"
                        >
                          Fittings
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Reviews Moderation Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1 text-[#f59e0b]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[16px] fill-current">
                          star
                        </span>
                      ))}
                    </div>
                    <StatusBadge status={rev.status} />
                  </div>

                  <p className="text-[11px] font-bold text-[#2d6636] uppercase">
                    Garment: {rev.productName}
                  </p>
                  <p className="font-semibold text-[13px] text-[#18281b] mt-1">
                    {rev.customerName}{' '}
                    <span className="text-[10px] text-[#849685] font-normal">({rev.date})</span>
                  </p>

                  <p className="text-[12px] text-[#5c725f] leading-relaxed mt-2 italic bg-[#faf7ed] p-3 rounded-xl border border-[#ded6be]/60">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f1f6ee] flex items-center justify-end gap-2">
                  {rev.status !== 'Approved' && (
                    <button
                      type="button"
                      onClick={() => {
                        onApproveReview(rev.id);
                        onShowToast(`Approved testimonial from ${rev.customerName}.`);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#2d6636] hover:bg-[#1e4825] text-white text-[11px] font-semibold cursor-pointer"
                    >
                      Approve & Publish
                    </button>
                  )}
                  {rev.status !== 'Rejected' && (
                    <button
                      type="button"
                      onClick={() => {
                        onRejectReview(rev.id);
                        onShowToast(`Rejected review from ${rev.customerName}.`);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#fee2e2] hover:bg-[#fca5a5] text-[#b91c1c] text-[11px] font-semibold cursor-pointer"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
