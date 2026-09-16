import React, { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { AdminFitting, AdminView } from '../types';

interface SalonFittingsViewProps {
  fittings: AdminFitting[];
  onNavigate: (view: AdminView) => void;
  onUpdateStatus: (id: string, newStatus: any) => void;
  onShowToast: (msg: string) => void;
}

export const SalonFittingsView: React.FC<SalonFittingsViewProps> = ({
  fittings,
  onNavigate,
  onUpdateStatus,
  onShowToast,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredFittings = fittings.filter((f) => {
    const matchesLoc = selectedLocation === 'All' || f.location === selectedLocation;
    const matchesSt = selectedStatus === 'All' || f.status === selectedStatus;
    return matchesLoc && matchesSt;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            VIP Salon Fittings & Consultations
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Manage bespoke tailoring appointments, master artisan assignments, and salon fitting schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onShowToast('Synced schedule with Master Tailor calendar.')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#f1f6ee] text-[#18281b] text-[12px] font-semibold border border-[#ded6be] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Sync Calendar</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] font-medium text-[#18281b] focus:outline-none cursor-pointer"
          >
            <option value="All">All Atelier Salons</option>
            <option value="Gulshan 2">Gulshan 2 Flagship</option>
            <option value="Banani">Banani Studio</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] font-medium text-[#18281b] focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Rescheduled">Rescheduled</option>
          </select>
        </div>

        <span className="text-[11px] text-[#5c725f] font-semibold">
          {filteredFittings.length} VIP appointments booked
        </span>
      </div>

      {/* Fittings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFittings.map((fit) => (
          <div
            key={fit.id}
            className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#18281b] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold bg-[#faf7ed] px-2 py-0.5 rounded border border-[#ded6be] text-[#2d6636]">
                  {fit.location}
                </span>
                <StatusBadge status={fit.status} />
              </div>

              <h3 className="font-serif text-[16px] font-bold text-[#18281b]">
                {fit.customerName}
              </h3>
              <p className="text-[11px] text-[#5c725f]">{fit.customerPhone}</p>

              <div className="my-3 p-3 rounded-xl bg-[#faf7ed] border border-[#ded6be]/60 space-y-1.5 text-[11px]">
                <p className="font-semibold text-[#18281b] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#2d6636]">
                    styler
                  </span>
                  <span>{fit.sessionType}</span>
                </p>
                <p className="text-[#5c725f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#849685]">
                    calendar_month
                  </span>
                  <span>
                    {fit.date} at <strong>{fit.time}</strong>
                  </span>
                </p>
                <p className="text-[#5c725f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#849685]">
                    person
                  </span>
                  <span>
                    Tailor: <strong>{fit.assignedTailor}</strong>
                  </span>
                </p>
              </div>

              {fit.notes && (
                <p className="text-[11px] text-[#4b5d4e] leading-relaxed italic bg-[#f1f6ee]/60 p-2.5 rounded-lg border border-[#d6edd2]/80">
                  &ldquo;{fit.notes}&rdquo;
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#f1f6ee] flex items-center justify-between">
              {fit.status !== 'Completed' ? (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(fit.id, 'Completed');
                    onShowToast(`Marked fitting with ${fit.customerName} as Completed.`);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#2d6636] text-white text-[11px] font-semibold hover:bg-[#1e4825] transition-colors cursor-pointer"
                >
                  Mark Completed
                </button>
              ) : (
                <span className="text-[11px] text-[#2d6636] font-bold">Fitted & Recorded</span>
              )}

              <button
                type="button"
                onClick={() => onShowToast(`Sent SMS reminder to ${fit.customerName}.`)}
                className="px-2.5 py-1 rounded-lg bg-[#faf7ed] hover:bg-[#f1f6ee] text-[#18281b] text-[11px] font-semibold border border-[#ded6be] cursor-pointer"
              >
                Send SMS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
