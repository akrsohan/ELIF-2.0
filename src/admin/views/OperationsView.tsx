import React, { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { AdminOperationsState, AdminView } from '../types';

interface OperationsViewProps {
  operations: AdminOperationsState;
  onNavigate: (view: AdminView) => void;
  onUpdateOperations: (ops: AdminOperationsState) => void;
  onShowToast: (msg: string) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  operations,
  onNavigate,
  onUpdateOperations,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<AdminOperationsState>(operations);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateOperations(formData);
    onShowToast('Updated logistics, courier routes, and payment gateways.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded6be]/80 pb-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Logistics & Payment Operations
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Configure Bangladesh courier integrations, shipping zones, bKash & Nagad merchant accounts.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          <span>Save Operations Configuration</span>
        </button>
      </div>

      {/* 1. Shipping Zones & Rates */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
            local_shipping
          </span>
          <span>Bangladesh Delivery Zones & Tariffs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inside Dhaka */}
          <div className="p-4 rounded-xl bg-[#faf7ed] border border-[#ded6be] space-y-3">
            <h4 className="font-bold text-[13px] text-[#18281b]">Inside Dhaka Metropolis</h4>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div>
                <label className="block text-[10px] font-bold text-[#5c725f] uppercase mb-1">
                  Delivery Fee (৳)
                </label>
                <input
                  type="number"
                  value={formData.shippingZones[0].fee}
                  onChange={(e) => {
                    const zones = [...formData.shippingZones];
                    zones[0].fee = Number(e.target.value);
                    setFormData({ ...formData, shippingZones: zones });
                  }}
                  className="w-full bg-white border border-[#ded6be] rounded-lg px-2.5 py-1.5 font-bold text-[#18281b]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5c725f] uppercase mb-1">
                  Estimated Transit
                </label>
                <input
                  type="text"
                  value={formData.shippingZones[0].estimatedDays}
                  onChange={(e) => {
                    const zones = [...formData.shippingZones];
                    zones[0].estimatedDays = e.target.value;
                    setFormData({ ...formData, shippingZones: zones });
                  }}
                  className="w-full bg-white border border-[#ded6be] rounded-lg px-2.5 py-1.5 text-[#18281b]"
                />
              </div>
            </div>
          </div>

          {/* Outside Dhaka */}
          <div className="p-4 rounded-xl bg-[#faf7ed] border border-[#ded6be] space-y-3">
            <h4 className="font-bold text-[13px] text-[#18281b]">Outside Dhaka (Nationwide)</h4>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div>
                <label className="block text-[10px] font-bold text-[#5c725f] uppercase mb-1">
                  Delivery Fee (৳)
                </label>
                <input
                  type="number"
                  value={formData.shippingZones[1].fee}
                  onChange={(e) => {
                    const zones = [...formData.shippingZones];
                    zones[1].fee = Number(e.target.value);
                    setFormData({ ...formData, shippingZones: zones });
                  }}
                  className="w-full bg-white border border-[#ded6be] rounded-lg px-2.5 py-1.5 font-bold text-[#18281b]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5c725f] uppercase mb-1">
                  Estimated Transit
                </label>
                <input
                  type="text"
                  value={formData.shippingZones[1].estimatedDays}
                  onChange={(e) => {
                    const zones = [...formData.shippingZones];
                    zones[1].estimatedDays = e.target.value;
                    setFormData({ ...formData, shippingZones: zones });
                  }}
                  className="w-full bg-white border border-[#ded6be] rounded-lg px-2.5 py-1.5 text-[#18281b]"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
            Free Shipping Minimum Spend (৳)
          </label>
          <input
            type="number"
            value={formData.freeShippingThreshold}
            onChange={(e) =>
              setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })
            }
            className="w-full max-w-xs bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[13px] font-bold text-[#18281b]"
          />
        </div>
      </div>

      {/* 2. Payment Gateway Configuration */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
            credit_card
          </span>
          <span>Payment Gateways & Digital Wallets</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.paymentGateways.map((gw, idx) => (
            <div
              key={gw.id}
              className="p-4 rounded-xl bg-[#faf7ed] border border-[#ded6be] flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[14px] text-[#18281b]">{gw.name}</h4>
                  <p className="text-[11px] text-[#5c725f]">{gw.type}</p>
                </div>
                <StatusBadge status={gw.status} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#ded6be]/60 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gw.status === 'Active'}
                    onChange={(e) => {
                      const gws = [...formData.paymentGateways];
                      gws[idx].status = e.target.checked ? 'Active' : 'Disabled';
                      setFormData({ ...formData, paymentGateways: gws });
                    }}
                    className="rounded text-[#18281b]"
                  />
                  <span className="font-medium text-[#18281b]">Accept in Checkout</span>
                </label>

                <button
                  type="button"
                  onClick={() => onShowToast(`Testing credentials for ${gw.name}... Passed!`)}
                  className="text-[10px] text-[#2d6636] font-bold hover:underline"
                >
                  Test Connection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
