import React, { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { AdminCoupon, AdminView } from '../types';

interface CouponsPromotionsViewProps {
  coupons: AdminCoupon[];
  onNavigate: (view: AdminView) => void;
  onAddCoupon: (coupon: AdminCoupon) => void;
  onDeleteCoupon: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const CouponsPromotionsView: React.FC<CouponsPromotionsViewProps> = ({
  coupons,
  onNavigate,
  onAddCoupon,
  onDeleteCoupon,
  onShowToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrder, setMinOrder] = useState(15000);
  const [usageLimit, setUsageLimit] = useState(200);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onAddCoupon({
      id: `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrder),
      usageLimit: Number(usageLimit),
      usageCount: 0,
      startDate: '2025-09-15',
      endDate: '2025-12-31',
      status: 'Active',
      notes: 'Custom administrator promotion code.',
    });

    onShowToast(`Coupon code ${code.toUpperCase()} published successfully.`);
    setCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Privilege Coupons & Promotions
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Create and monitor luxury promotional vouchers, bKash partnerships, and VIP codes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>+ Create Coupon Code</span>
        </button>
      </div>

      {/* Active Promo Campaigns Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#18281b] to-[#253d29] text-white rounded-2xl p-5 border border-[#3f804b]/40 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d6edd2] bg-[#ffffff]/10 px-2 py-0.5 rounded">
              Active Privilege Campaign
            </span>
            <h3 className="font-serif text-[17px] font-bold">Dhaka Atelier Salon Privilege</h3>
            <p className="text-[11px] text-[#c8dac4]">
              10% discount on orders above ৳15,000 for clients in Dhaka, Chattogram & Sylhet.
            </p>
            <p className="text-[10px] text-[#849685] pt-1">Code: <strong>DHAKA10</strong></p>
          </div>
          <span className="material-symbols-outlined text-[36px] text-[#d6edd2]/60">
            loyalty
          </span>
        </div>

        <div className="bg-[#faf7ed] text-[#18281b] rounded-2xl p-5 border border-[#ded6be] shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d6636] bg-[#eaf5e6] px-2 py-0.5 rounded border border-[#c2e4bb]">
              Digital Wallet Campaign
            </span>
            <h3 className="font-serif text-[17px] font-bold">bKash 15% VIP Checkout Rebate</h3>
            <p className="text-[11px] text-[#5c725f]">
              15% discount for payments completed via bKash online checkout (min ৳30,000).
            </p>
            <p className="text-[10px] text-[#849685] pt-1">Code: <strong>BKASH15</strong></p>
          </div>
          <span className="material-symbols-outlined text-[36px] text-[#e2136e]/60">
            account_balance_wallet
          </span>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-[#ded6be] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#faf7ed] border-b border-[#ded6be] flex items-center justify-between">
          <h3 className="font-serif text-[15px] font-bold text-[#18281b]">
            All Promotional Codes ({coupons.length})
          </h3>
          <span className="text-[11px] text-[#5c725f]">Real-time checkout validation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#faf7ed]/60 border-b border-[#ded6be]/80 text-[#5c725f] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 pl-4 pr-2">Code</th>
                <th className="py-3.5 px-3">Discount</th>
                <th className="py-3.5 px-3">Min Order</th>
                <th className="py-3.5 px-3">Redemptions</th>
                <th className="py-3.5 px-3">Validity</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f9f4]">
              {coupons.map((cp) => (
                <tr key={cp.id} className="hover:bg-[#faf7eb]/60 transition-colors">
                  <td className="py-3.5 pl-4 pr-2 font-mono font-bold text-[13px] text-[#18281b]">
                    {cp.code}
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-[#2d6636]">
                    {cp.discountType === 'percentage'
                      ? `${cp.discountValue}% OFF`
                      : `৳${cp.discountValue.toLocaleString()} OFF`}
                  </td>

                  <td className="py-3.5 px-3 text-[#18281b]">
                    ৳{cp.minOrderAmount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3 text-[#5c725f]">
                    <span className="font-semibold text-[#18281b]">{cp.usageCount}</span> / {cp.usageLimit} uses
                  </td>

                  <td className="py-3.5 px-3 text-[11px] text-[#849685]">
                    {cp.startDate} → {cp.endDate}
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusBadge status={cp.status} />
                  </td>

                  <td className="py-3.5 pr-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteCoupon(cp.id)}
                      className="p-1.5 rounded-lg text-[#849685] hover:text-[#b91c1c] hover:bg-[#fee2e2] transition-colors cursor-pointer"
                      title="Delete coupon"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#ded6be] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f6ee] pb-3">
              <h3 className="font-serif text-[17px] font-bold text-[#18281b]">
                Generate Coupon Code
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#849685] hover:text-[#18281b]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Coupon Code (e.g. NOIR20) *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. WINTER25"
                  className="w-full font-mono font-bold bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    required
                    className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                    Min Order (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    required
                    className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Usage Limit (Total Redemptions)
                </label>
                <input
                  type="number"
                  min={1}
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  required
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#5c725f] hover:bg-[#f1f6ee]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#18281b] text-white font-semibold hover:bg-[#283d2b] transition-colors"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
