import React, { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { AdminView } from '../types';

interface AnalyticsViewProps {
  onNavigate: (view: AdminView) => void;
  onShowToast: (msg: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'year'>('30d');

  const monthlySales = [
    { month: 'Apr', revenue: 640000, orders: 18 },
    { month: 'May', revenue: 780000, orders: 22 },
    { month: 'Jun', revenue: 920000, orders: 26 },
    { month: 'Jul', revenue: 860000, orders: 24 },
    { month: 'Aug', revenue: 1150000, orders: 32 },
    { month: 'Sep', revenue: 1480000, orders: 41 },
  ];

  const categoryShare = [
    { name: 'Outerwear & Trench', percent: 48, revenue: 710400, color: '#18281b' },
    { name: 'Fine Knitwear', percent: 26, revenue: 384800, color: '#2d6636' },
    { name: 'Silk & Shirting', percent: 16, revenue: 236800, color: '#4b5d4e' },
    { name: 'Tailored Trousers', percent: 10, revenue: 148000, color: '#849685' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Revenue & Haute Couture Performance
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Financial analytics, seasonal garment demand, and conversion metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-white border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] font-semibold text-[#18281b] shadow-2xs focus:outline-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="year">Full Year 2025</option>
          </select>

          <button
            type="button"
            onClick={() => onShowToast('Exported executive analytics report (PDF).')}
            className="px-3.5 py-2 rounded-xl bg-[#18281b] text-white text-[12px] font-semibold hover:bg-[#283d2b] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Revenue (BDT)"
          value="৳14,80,000"
          change="+28.4% vs last mo"
          changeType="positive"
          icon="payments"
        />
        <MetricCard
          label="Average Order Value"
          value="৳36,097"
          change="+12.1%"
          changeType="positive"
          icon="shopping_basket"
        />
        <MetricCard
          label="Checkout Conversion"
          value="3.84%"
          change="+0.6%"
          changeType="positive"
          icon="query_stats"
        />
        <MetricCard
          label="Salon Fitting Conversion"
          value="76.2%"
          change="+4.5%"
          changeType="positive"
          icon="styler"
        />
      </div>

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bars */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-[16px] font-bold text-[#18281b]">
              Monthly Revenue Trajectory (2025)
            </h3>
            <span className="text-[11px] text-[#5c725f] font-semibold">BDT in Millions</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlySales.map((item) => {
              const max = 1600000;
              const heightPercent = (item.revenue / max) * 100;

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-[#18281b] opacity-0 group-hover:opacity-100 transition-opacity">
                    ৳{(item.revenue / 100000).toFixed(1)}L
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-[#18281b] hover:bg-[#2d6636] rounded-t-xl transition-all duration-300"
                  />
                  <span className="text-[11px] font-semibold text-[#5c725f]">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-[16px] font-bold text-[#18281b]">
            Sales by Category
          </h3>

          <div className="space-y-3">
            {categoryShare.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-[#18281b]">{cat.name}</span>
                  <span className="text-[#5c725f]">{cat.percent}% (৳{cat.revenue.toLocaleString()})</span>
                </div>
                <div className="w-full h-2 bg-[#f1f6ee] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#f1f6ee] bg-[#faf7ed] p-3 rounded-xl text-[11px] text-[#5c725f]">
            <p>
              <strong>Insight:</strong> Outerwear & Alpaca Trench coats represent the primary revenue driver this season.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
