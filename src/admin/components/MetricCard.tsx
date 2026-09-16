import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: string;
  badge?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  trend,
  icon,
  badge,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#ded6be]/60 p-4 sm:p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#18281b] hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <span className="text-[12px] font-medium text-[#5c725f] uppercase tracking-wider">
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#f1f6ee] text-[#18281b] flex items-center justify-center shrink-0 border border-[#d6edd2]/80">
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-[24px] sm:text-[28px] font-bold text-[#18281b] tracking-tight leading-none font-sans">
          {value}
        </p>
        {badge && (
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#fde8e8] text-[#991b1b] border border-[#fca5a5]/40">
            {badge}
          </span>
        )}
      </div>

      {(trend || subtext) && (
        <div className="flex items-center gap-2 mt-2.5 text-[11px]">
          {trend && (
            <span
              className={`inline-flex items-center font-semibold ${
                trend.isPositive ? 'text-[#2e7d32]' : 'text-[#c62828]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {trend.isPositive ? 'arrow_upward' : 'arrow_downward'}
              </span>
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-[#849685] truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
