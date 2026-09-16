import React, { useState } from 'react';
import { AdminTailoringProfile, AdminView } from '../types';

interface TailoringProfilesViewProps {
  tailoringProfiles: AdminTailoringProfile[];
  onNavigate: (view: AdminView) => void;
  onUpdateProfile: (profile: AdminTailoringProfile) => void;
  onShowToast: (msg: string) => void;
}

export const TailoringProfilesView: React.FC<TailoringProfilesViewProps> = ({
  tailoringProfiles,
  onNavigate,
  onUpdateProfile,
  onShowToast,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<AdminTailoringProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = tailoringProfiles.filter(
    (tp) =>
      tp.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.customerPhone.includes(searchQuery)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;
    onUpdateProfile(selectedProfile);
    onShowToast(`Updated tailoring profile for ${selectedProfile.customerName}.`);
    setSelectedProfile(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Customer Tailoring Measurements
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Client anatomical silhouette dimensions, trench fit preferences, and fiber allergy records.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-4 shadow-xs">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#849685]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name or phone number..."
            className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl pl-10 pr-3 py-2 text-[12px] text-[#18281b] placeholder-[#849685] focus:outline-none focus:bg-white focus:border-[#18281b]"
          />
        </div>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((tp) => (
          <div
            key={tp.id}
            className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#18281b] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-[17px] font-bold text-[#18281b]">
                  {tp.customerName}
                </h3>
                <span className="text-[10px] text-[#849685] font-mono">
                  Fitted: {tp.lastFittedDate}
                </span>
              </div>
              <p className="text-[12px] text-[#5c725f]">{tp.customerPhone}</p>

              {/* Grid of Measurements */}
              <div className="grid grid-cols-3 gap-2 my-3 p-3 rounded-xl bg-[#faf7ed] border border-[#ded6be]/60 text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#849685] block">Trench / Coat</span>
                  <strong className="text-[13px] text-[#18281b]">{tp.trenchCoatSize}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#849685] block">Knitwear</span>
                  <strong className="text-[13px] text-[#18281b]">{tp.knitwearSize}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#849685] block">Inseam</span>
                  <strong className="text-[13px] text-[#18281b]">{tp.trouserInseamCm} cm</strong>
                </div>
              </div>

              {/* Sensitivities */}
              {tp.sensitivities && (
                <div className="text-[11px] text-[#4b5d4e] bg-[#fee2e2]/40 border border-[#fecaca] p-2.5 rounded-lg mb-2">
                  <strong className="text-[#991b1b]">Fiber Sensitivity:</strong> {tp.sensitivities}
                </div>
              )}

              {/* Tailor Notes */}
              {tp.tailorNotes && (
                <p className="text-[11px] text-[#5c725f] italic bg-[#f1f6ee] p-2.5 rounded-lg border border-[#d6edd2]">
                  &ldquo;{tp.tailorNotes}&rdquo;
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#f1f6ee] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProfile(tp)}
                className="px-3.5 py-1.5 rounded-xl bg-[#f1f6ee] hover:bg-[#18281b] hover:text-white text-[#18281b] text-[11px] font-semibold border border-[#d6edd2] transition-colors cursor-pointer"
              >
                Edit Measurements
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#ded6be] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f6ee] pb-3">
              <h3 className="font-serif text-[17px] font-bold text-[#18281b]">
                Edit Profile: {selectedProfile.customerName}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="text-[#849685] hover:text-[#18281b]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-[12px]">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Trench / Outerwear Size
                </label>
                <input
                  type="text"
                  value={selectedProfile.trenchCoatSize}
                  onChange={(e) =>
                    setSelectedProfile({ ...selectedProfile, trenchCoatSize: e.target.value })
                  }
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Trouser Inseam (cm)
                </label>
                <input
                  type="number"
                  value={selectedProfile.trouserInseamCm}
                  onChange={(e) =>
                    setSelectedProfile({
                      ...selectedProfile,
                      trouserInseamCm: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Fiber Sensitivities / Allergies
                </label>
                <input
                  type="text"
                  value={selectedProfile.sensitivities}
                  onChange={(e) =>
                    setSelectedProfile({ ...selectedProfile, sensitivities: e.target.value })
                  }
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Master Tailor Notes
                </label>
                <textarea
                  rows={2}
                  value={selectedProfile.tailorNotes}
                  onChange={(e) =>
                    setSelectedProfile({ ...selectedProfile, tailorNotes: e.target.value })
                  }
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="px-4 py-2 rounded-xl text-[#5c725f] hover:bg-[#f1f6ee]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#18281b] text-white font-semibold hover:bg-[#283d2b]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
