import React, { useState } from 'react';
import { AdminActivityLog, AdminView } from '../types';

interface ActivityLogsViewProps {
  logs: AdminActivityLog[];
  onNavigate: (view: AdminView) => void;
  onShowToast: (msg: string) => void;
}

export const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({
  logs,
  onNavigate,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Security & Atelier Activity Logs
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Real-time chronological audit trail of administrator actions, inventory alterations, and price updates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('Exported audit trail to security compliance log.')}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#f1f6ee] text-[#18281b] text-[12px] font-semibold border border-[#ded6be] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          <span>Download Audit Log</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-4 shadow-xs">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#849685]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity records by action, staff name or affected item..."
            className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl pl-10 pr-3 py-2 text-[12px] text-[#18281b] placeholder-[#849685] focus:outline-none focus:bg-white focus:border-[#18281b]"
          />
        </div>
      </div>

      {/* Activity Timeline Table */}
      <div className="bg-white rounded-2xl border border-[#ded6be] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#faf7ed] border-b border-[#ded6be]/80 text-[#5c725f] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 pl-4 pr-2">Timestamp</th>
                <th className="py-3.5 px-3">Staff Member</th>
                <th className="py-3.5 px-3">Action</th>
                <th className="py-3.5 px-3">Details</th>
                <th className="py-3.5 pr-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f9f4]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#faf7eb]/60 transition-colors">
                  <td className="py-3.5 pl-4 pr-2 text-[#849685] font-mono text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-[#18281b]">
                    {log.userName}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-[#2d6636] bg-[#eaf5e6] px-2 py-0.5 rounded border border-[#c2e4bb] text-[11px]">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-[#5c725f]">
                    {log.details}
                  </td>

                  <td className="py-3.5 pr-4 text-right font-mono text-[11px] text-[#849685]">
                    {log.ipAddress || '103.145.118.24'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
