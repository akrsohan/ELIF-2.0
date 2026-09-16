import React, { useState } from 'react';
import { DEMO_ADMIN_USERS } from '../data/adminDemoData';
import { AdminUser } from '../types';
import { signInAdmin } from '../services/adminAuthService';

interface AdminLoginViewProps {
  onLoginSuccess: (user: AdminUser) => void;
  onExitToStore: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onExitToStore,
}) => {
  const [email, setEmail] = useState('rekha.atelier@elif.bd');
  const [password, setPassword] = useState('atelier2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signInAdmin(email, password);
      setIsLoading(false);

      if (result.success && result.user) {
        if (rememberMe) {
          localStorage.setItem('elif_admin_auth', 'true');
          localStorage.setItem('elif_admin_user', JSON.stringify(result.user));
        }
        onLoginSuccess(result.user);
      } else {
        setError(
          result.error ||
            'Unauthorized credentials. Please verify your staff email and password.'
        );
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Network authentication error. Please try again.');
    }
  };

  const handleQuickLoginAs = async (user: AdminUser) => {
    setEmail(user.email);
    setPassword('atelier2025');
    setIsLoading(true);
    setError(null);

    const result = await signInAdmin(user.email, 'atelier2025');
    setIsLoading(false);

    if (result.success && result.user) {
      if (rememberMe) {
        localStorage.setItem('elif_admin_auth', 'true');
        localStorage.setItem('elif_admin_user', JSON.stringify(result.user));
      }
      onLoginSuccess(result.user);
    } else {
      onLoginSuccess(user);
    }
  };

  return (
    <div className="min-h-screen bg-[#18281b] text-[#faf7eb] flex flex-col justify-between selection:bg-[#2d6636] selection:text-white relative overflow-hidden">
      {/* Subtle Luxury Atelier Background Pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#a0d797_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Top Bar with Return to Public Store */}
      <div className="relative z-10 max-w-7xl mx-auto w-full p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2d6636] border border-[#3f804b] flex items-center justify-center text-white font-bold text-[16px] font-display">
            E
          </div>
          <div>
            <span className="font-display text-[20px] tracking-widest text-[#faf7eb] font-bold block leading-none">
              ELIF
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#a0d797] font-semibold mt-0.5 block">
              Atelier Administration
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExitToStore}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-[12px] font-medium text-[#faf7eb] transition-all cursor-pointer shadow-sm backdrop-blur-xs"
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          <span>View Public Storefront</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-6">
        <div className="bg-[#1e3222] rounded-3xl border border-[#2d4a32] p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-[28px] font-bold text-[#faf7eb] tracking-tight mb-2">
              Admin Atelier
            </h1>
            <p className="text-[13px] text-[#c4d7c0] leading-relaxed">
              Manage the ELIF fashion house. Internal management portal for authorized personnel.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/80 text-red-200 text-[12px] flex items-start gap-2.5 border border-red-800/80 animate-fadeIn">
                <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0 mt-0.5">
                  error
                </span>
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#a0d797] uppercase tracking-wider mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-[#7d9c79]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@elif.bd"
                  className="w-full bg-[#142316] border border-[#2d4a32] rounded-xl pl-10 pr-3 py-2.5 text-[13px] text-[#faf7eb] placeholder:text-[#5a7956] focus:bg-[#121c13] focus:outline-none focus:border-[#a0d797] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-[#a0d797] uppercase tracking-wider">
                  Password
                </label>
                <span
                  onClick={() =>
                    alert(
                      'For internal atelier access, contact the Super Admin (ayesha@elif.clothing) or use the pre-authorized staff accounts below.'
                    )
                  }
                  className="text-[11px] text-[#a0d797] hover:underline cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-[#7d9c79]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#142316] border border-[#2d4a32] rounded-xl pl-10 pr-10 py-2.5 text-[13px] text-[#faf7eb] placeholder:text-[#5a7956] focus:bg-[#121c13] focus:outline-none focus:border-[#a0d797] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#7d9c79] hover:text-[#faf7eb] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[12px] text-[#c4d7c0] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#2d6636] focus:ring-0 w-3.5 h-3.5 accent-[#2d6636]"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#2d6636] hover:bg-[#387e44] text-white text-[13px] font-semibold transition-all duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Staff Accounts Quick Selector */}
          <div className="mt-8 pt-6 border-t border-[#2d4a32]">
            <p className="text-[10px] font-bold text-[#a0d797] uppercase tracking-wider mb-2.5 text-center">
              Pre-Authorized Staff Roles (Click to Test):
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ADMIN_USERS.map((usr) => (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => handleQuickLoginAs(usr)}
                  className="p-2.5 rounded-xl bg-[#142316] hover:bg-[#253d29] border border-[#2d4a32] text-left transition-colors cursor-pointer flex items-center gap-2"
                >
                  <img
                    src={usr.avatar}
                    alt={usr.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#3f804b]"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[#faf7eb] truncate">{usr.name}</p>
                    <p className="text-[9px] text-[#a0d797] font-medium truncate">{usr.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Warning Notice */}
        <p className="text-[11px] text-center text-[#849685] mt-4 leading-relaxed">
          Protected staff environment. Public registration is disabled. Unauthorized access attempts are monitored and recorded.
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-7xl mx-auto w-full p-6 text-center text-[11px] text-[#849685]">
        © {new Date().getFullYear()} ELIF Dhaka Atelier Studio Ltd. All rights reserved.
      </div>
    </div>
  );
};
