import React, { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { AdminUser, AdminView } from '../types';

interface AdminUsersRolesViewProps {
  users: AdminUser[];
  onNavigate: (view: AdminView) => void;
  onAddUser: (user: AdminUser) => void;
  onShowToast: (msg: string) => void;
}

export const AdminUsersRolesView: React.FC<AdminUsersRolesViewProps> = ({
  users,
  onNavigate,
  onAddUser,
  onShowToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Super Admin' | 'Store Manager' | 'Inventory Lead' | 'Master Tailor'>('Store Manager');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onAddUser({
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status: 'Active',
      lastActive: 'Just now',
    });

    onShowToast(`Staff member ${name} granted ${role} privileges.`);
    setName('');
    setEmail('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Atelier Staff & Role Permissions
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Manage master tailors, store managers, and role-based permissions (RBAC).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">person_add</span>
          <span>+ Invite Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((usr) => (
          <div
            key={usr.id}
            className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    usr.role === 'Super Admin'
                      ? 'bg-[#18281b] text-white'
                      : usr.role === 'Master Tailor'
                      ? 'bg-[#eaf5e6] text-[#2d6636] border border-[#c2e4bb]'
                      : 'bg-[#faf7ed] text-[#5c725f] border border-[#ded6be]'
                  }`}
                >
                  {usr.role}
                </span>
                <StatusBadge status={usr.status} />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#faf7ed] border border-[#ded6be] text-[#18281b] font-bold font-serif flex items-center justify-center text-[14px]">
                  {usr.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[14px] text-[#18281b]">{usr.name}</h3>
                  <p className="text-[11px] text-[#849685] truncate max-w-[140px]">{usr.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f1f6ee] flex items-center justify-between text-[11px] text-[#849685]">
              <span>Active: {usr.lastActive}</span>
              <button
                type="button"
                onClick={() => onShowToast(`Edited permissions for ${usr.name}`)}
                className="text-[#2d6636] font-semibold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#ded6be] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f6ee] pb-3">
              <h3 className="font-serif text-[17px] font-bold text-[#18281b]">
                Grant Staff Access
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#849685] hover:text-[#18281b]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Ustad Kabir Hossain"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="staff@elif.clothing"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Designated Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:outline-none"
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Store Manager">Store Manager (Orders & Inventory)</option>
                  <option value="Master Tailor">Master Tailor (Fittings & Measurements)</option>
                  <option value="Inventory Lead">Inventory Lead (Stock Controls)</option>
                </select>
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
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
