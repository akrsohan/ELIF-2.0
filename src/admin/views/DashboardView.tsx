import React, { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  AdminFitting,
  AdminOrder,
  AdminProduct,
  AdminView,
} from '../types';

interface DashboardViewProps {
  orders: AdminOrder[];
  products: AdminProduct[];
  fittings: AdminFitting[];
  onNavigate: (view: AdminView) => void;
  onSelectOrder: (order: AdminOrder) => void;
  onSelectProduct: (product: AdminProduct) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders = [],
  products = [],
  fittings = [],
  onNavigate,
  onSelectOrder,
  onSelectProduct,
  onUpdateOrderStatus,
}) => {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'custom'>('7d');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>('revenue');

  // Computed metrics
  const safeOrders = orders || [];
  const safeProducts = products || [];
  const safeFittings = fittings || [];

  const totalRevenue = safeOrders.reduce((sum, o) => sum + o.total, 0) + 182800;
  const totalOrdersCount = safeOrders.length + 124;
  const averageOrderValue = Math.round(totalRevenue / totalOrdersCount);
  const lowStockItems = safeProducts.filter((p) => p.stockCount <= p.lowStockThreshold);
  const pendingOrders = safeOrders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed'
  );

  // Chart data points
  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const revenuePoints = [32000, 48500, 24500, 68000, 52000, 89000, 65700];
  const maxRevenue = Math.max(...revenuePoints);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Atelier Executive Overview
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Live operational status of your Dhaka flagship salon and nationwide online consignments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Date Range Selector */}
          <div className="bg-white p-1 rounded-xl border border-[#ded6be] flex items-center gap-1 shadow-2xs text-[11px] font-medium">
            {(['today', '7d', '30d', 'custom'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                  dateRange === r
                    ? 'bg-[#18281b] text-white font-semibold shadow-xs'
                    : 'text-[#5c725f] hover:text-[#18281b]'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('product-new')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Key KPI Metrics Grid (6 Tiles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          label="Total Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          trend={{ value: '+18.4%', isPositive: true }}
          icon="payments"
          onClick={() => onNavigate('analytics-sales')}
        />
        <MetricCard
          label="Consignments"
          value={totalOrdersCount}
          trend={{ value: '+12.1%', isPositive: true }}
          icon="shopping_bag"
          onClick={() => onNavigate('orders')}
        />
        <MetricCard
          label="Avg Order Value"
          value={`৳${averageOrderValue.toLocaleString()}`}
          subtext="High-value luxury tier"
          icon="show_chart"
          onClick={() => onNavigate('analytics-sales')}
        />
        <MetricCard
          label="Active Clients"
          value="1,842"
          trend={{ value: '+8.2%', isPositive: true }}
          icon="group"
          onClick={() => onNavigate('customers')}
        />
        <MetricCard
          label="Low Stock Alert"
          value={lowStockItems.length}
          badge={lowStockItems.length > 0 ? 'Requires Restock' : undefined}
          icon="inventory_2"
          onClick={() => onNavigate('inventory')}
        />
        <MetricCard
          label="Pending Dispatch"
          value={pendingOrders.length}
          subtext="Awaiting QC / courier"
          icon="pending_actions"
          onClick={() => onNavigate('orders')}
        />
      </div>

      {/* Sales Overview Chart & Atelier Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-serif text-[17px] font-bold text-[#18281b] tracking-tight">
                Sales & Revenue Trajectory
              </h3>
              <p className="text-[11px] text-[#5c725f]">
                Weekly revenue and dispatch velocity across Bangladesh
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#faf7ed] p-1 rounded-xl border border-[#ded6be]/70 text-[11px]">
              <button
                type="button"
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  chartMetric === 'revenue'
                    ? 'bg-white text-[#18281b] font-bold shadow-xs'
                    : 'text-[#849685]'
                }`}
              >
                Revenue (৳)
              </button>
              <button
                type="button"
                onClick={() => setChartMetric('orders')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  chartMetric === 'orders'
                    ? 'bg-white text-[#18281b] font-bold shadow-xs'
                    : 'text-[#849685]'
                }`}
              >
                Order Volume
              </button>
            </div>
          </div>

          {/* Clean Vector SVG Chart */}
          <div className="h-60 w-full flex flex-col justify-end pt-4">
            <div className="flex-1 flex items-end justify-between gap-3 sm:gap-6 border-b border-[#ded6be]/80 pb-2">
              {chartDays.map((day, idx) => {
                const val = revenuePoints[idx];
                const heightPercent = Math.max(15, (val / maxRevenue) * 100);

                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-[#18281b] text-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                      ৳{val.toLocaleString()}
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[40px] bg-[#f1f6ee] rounded-t-lg overflow-hidden h-44 flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-[#2d6636] hover:bg-[#18281b] transition-all rounded-t-lg duration-300"
                      />
                    </div>

                    <span className="text-[11px] font-semibold text-[#5c725f]">{day}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#849685] pt-3">
              <span>Peak Day: Saturday (৳89,000)</span>
              <span>Avg Daily Revenue: ৳54,240</span>
            </div>
          </div>
        </div>

        {/* Upcoming Atelier Salon Appointments (1 Col) */}
        <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-[17px] font-bold text-[#18281b]">
                Salon Appointments
              </h3>
              <p className="text-[11px] text-[#5c725f]">VIP fittings today & tomorrow</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('fittings')}
              className="text-[11px] font-semibold text-[#2d6636] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {fittings.slice(0, 3).map((fit) => (
              <div
                key={fit.id}
                className="p-3 rounded-xl bg-[#faf7ed] border border-[#ded6be]/60 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[13px] text-[#18281b]">
                    {fit.customerName}
                  </span>
                  <StatusBadge status={fit.status} />
                </div>
                <p className="text-[11px] text-[#2d6636] font-medium">{fit.sessionType}</p>
                <div className="flex items-center justify-between text-[11px] text-[#849685]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">calendar_month</span>
                    {fit.date} • {fit.time}
                  </span>
                  <span className="font-semibold text-[#18281b]">{fit.location}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('fittings')}
            className="w-full mt-4 py-2 rounded-xl bg-[#f1f6ee] hover:bg-[#e2edd8] text-[#18281b] text-[12px] font-semibold border border-[#d6edd2] transition-colors cursor-pointer"
          >
            Manage Salon Schedule
          </button>
        </div>
      </div>

      {/* Recent Orders & Low Stock Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-[17px] font-bold text-[#18281b]">
                Recent Client Orders
              </h3>
              <p className="text-[11px] text-[#5c725f]">Real-time customer purchases</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-[11px] font-semibold text-[#2d6636] hover:underline cursor-pointer"
            >
              All Orders ({orders.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-[#f1f6ee] text-[#849685] font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-1">Order</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-1">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f9f4]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#faf7eb]/60 transition-colors">
                    <td className="py-3 pl-1 font-mono font-bold text-[#18281b]">{order.id}</td>
                    <td className="py-3">
                      <p className="font-semibold text-[#18281b]">{order.customer.name}</p>
                      <p className="text-[10px] text-[#849685]">{order.customer.district}</p>
                    </td>
                    <td className="py-3 text-[#5c725f]">
                      {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'}
                    </td>
                    <td className="py-3 font-semibold text-[#18281b]">
                      ৳{order.total.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4b5d4e]">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="py-3 text-right pr-1">
                      <button
                        type="button"
                        onClick={() => onSelectOrder(order)}
                        className="px-2.5 py-1 rounded-lg bg-[#f1f6ee] hover:bg-[#18281b] hover:text-white text-[#18281b] text-[11px] font-semibold transition-colors cursor-pointer border border-[#d6edd2]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Inventory Needs (1 Col) */}
        <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-[17px] font-bold text-[#18281b]">
                Low Stock Warning
              </h3>
              <p className="text-[11px] text-[#5c725f]">Items nearing threshold</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('inventory')}
              className="text-[11px] font-semibold text-[#2d6636] hover:underline cursor-pointer"
            >
              Inventory →
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {safeProducts
              .filter((p) => p.stockCount <= p.lowStockThreshold + 2)
              .slice(0, 4)
              .map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="p-2.5 rounded-xl hover:bg-[#faf7eb] border border-transparent hover:border-[#ded6be] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#ded6be]/60 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#18281b] truncate">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-[#849685]">
                        SKU: {prod.sku} • {prod.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[12px] font-bold block ${
                        prod.stockCount <= prod.lowStockThreshold
                          ? 'text-[#c62828]'
                          : 'text-[#f57c00]'
                      }`}
                    >
                      {prod.stockCount} left
                    </span>
                    <span className="text-[9px] text-[#849685]">
                      Min: {prod.lowStockThreshold}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className="w-full mt-4 py-2 rounded-xl bg-[#f1f6ee] hover:bg-[#e2edd8] text-[#18281b] text-[12px] font-semibold border border-[#d6edd2] transition-colors cursor-pointer"
          >
            Adjust Stock Levels
          </button>
        </div>
      </div>
    </div>
  );
};
