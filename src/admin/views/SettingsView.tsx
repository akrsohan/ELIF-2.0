import React, { useState } from 'react';
import { AdminView } from '../types';

interface SettingsViewProps {
  onNavigate: (view: AdminView) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [storeName, setStoreName] = useState('ELIF — Haute Couture & Slow Luxury');
  const [email, setEmail] = useState('concierge@elif.clothing');
  const [phone, setPhone] = useState('+880 1711-000000');
  const [salonAddress, setSalonAddress] = useState('Road 79, House 14, Gulshan-2, Dhaka 1212, Bangladesh');
  const [currency, setCurrency] = useState('BDT (৳)');
  const [enable2FA, setEnable2FA] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Atelier settings and security configurations saved.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded6be]/80 pb-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Atelier Settings & Preferences
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Global configuration, concierge contact channels, physical salons, and security policies.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          <span>Save Changes</span>
        </button>
      </div>

      {/* 1. Atelier Information */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
            storefront
          </span>
          <span>Brand Nomenclature & Atelier Coordinates</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Storefront Brand Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Concierge Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              VIP WhatsApp & Phone Concierge
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Primary Currency
            </label>
            <input
              type="text"
              value={currency}
              disabled
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#849685] font-semibold cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
            Gulshan Flagship Salon Address
          </label>
          <input
            type="text"
            value={salonAddress}
            onChange={(e) => setSalonAddress(e.target.value)}
            className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
          />
        </div>
      </div>

      {/* 2. Security & Two-Factor Authentication */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
            security
          </span>
          <span>Access & Security Controls</span>
        </h3>

        <div className="flex items-center justify-between p-4 bg-[#faf7ed] rounded-xl border border-[#ded6be]">
          <div>
            <h4 className="font-bold text-[13px] text-[#18281b]">Two-Factor Authentication (2FA)</h4>
            <p className="text-[11px] text-[#5c725f]">
              Require OTP verification via authenticator app or SMS for staff logins.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enable2FA}
              onChange={(e) => setEnable2FA(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#ded6be] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#ded6be] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2d6636]"></div>
          </label>
        </div>
      </div>
    </form>
  );
};
