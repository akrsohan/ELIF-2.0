import React, { useState, useMemo } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { AdminOrder, AdminView, OrderStatus } from '../types';

interface OrdersViewProps {
  orders: AdminOrder[];
  onNavigate: (view: AdminView) => void;
  onSelectOrder: (order: AdminOrder) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onShowToast: (msg: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onNavigate,
  onSelectOrder,
  onUpdateStatus,
  onShowToast,
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedPayment, setSelectedPayment] = useState<string>('All');

  const statusTabs: Array<{ id: string; label: string; count?: number }> = [
    { id: 'All', label: 'All Orders', count: orders.length },
    { id: 'Pending', label: 'Pending', count: orders.filter((o) => o.orderStatus === 'Pending').length },
    { id: 'Confirmed', label: 'Confirmed', count: orders.filter((o) => o.orderStatus === 'Confirmed').length },
    { id: 'Processing', label: 'Processing', count: orders.filter((o) => o.orderStatus === 'Processing').length },
    { id: 'Quality Check', label: 'Quality Check', count: orders.filter((o) => o.orderStatus === 'Quality Check').length },
    { id: 'Shipped', label: 'Shipped', count: orders.filter((o) => o.orderStatus === 'Shipped').length },
    { id: 'Delivered', label: 'Delivered', count: orders.filter((o) => o.orderStatus === 'Delivered').length },
    { id: 'Cancelled', label: 'Cancelled', count: orders.filter((o) => o.orderStatus === 'Cancelled').length },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        selectedStatusTab === 'All' || o.orderStatus === selectedStatusTab;
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.phone.includes(searchQuery);
      const matchesDistrict =
        selectedDistrict === 'All' || o.customer.district.includes(selectedDistrict);
      const matchesPayment =
        selectedPayment === 'All' || o.paymentMethod.includes(selectedPayment);

      return matchesStatus && matchesSearch && matchesDistrict && matchesPayment;
    });
  }, [orders, selectedStatusTab, searchQuery, selectedDistrict, selectedPayment]);

  const totalValue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Consignments & Orders
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Manage client orders, status timelines, invoice generation, and courier handovers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onShowToast('Exported filtered orders to CSV spreadsheet.')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#f1f6ee] text-[#18281b] text-[12px] font-semibold border border-[#ded6be] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tab Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-[#ded6be]/80">
        {statusTabs.map((tab) => {
          const isActive = selectedStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3.5 py-2 rounded-t-xl text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                isActive
                  ? 'border-[#18281b] text-[#18281b] bg-white'
                  : 'border-transparent text-[#5c725f] hover:text-[#18281b] hover:bg-white/60'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#18281b] text-white' : 'bg-[#ded6be]/50 text-[#5c725f]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filters */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#849685]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID (e.g. EL-BD4821), customer name, or mobile number..."
            className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl pl-10 pr-3 py-2 text-[12px] text-[#18281b] placeholder-[#849685] focus:outline-none focus:bg-white focus:border-[#18281b]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] font-medium text-[#18281b] focus:outline-none cursor-pointer"
          >
            <option value="All">All Delivery Zones</option>
            <option value="Dhaka">Dhaka (Inside City)</option>
            <option value="Chattogram">Chattogram</option>
            <option value="Sylhet">Sylhet</option>
          </select>

          {/* Payment */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] font-medium text-[#18281b] focus:outline-none cursor-pointer"
          >
            <option value="All">All Payment Types</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Card">Visa / Mastercard</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#ded6be] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#faf7ed] border-b border-[#ded6be]/80 text-[#5c725f] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 pl-4 pr-2">Order ID</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Client</th>
                <th className="py-3.5 px-3">Garments</th>
                <th className="py-3.5 px-3">Total Amount</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Courier</th>
                <th className="py-3.5 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f9f4]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-[#849685]">
                    <span className="material-symbols-outlined text-[36px] block mb-2 opacity-40">
                      receipt_long
                    </span>
                    <p className="text-[13px] font-medium text-[#18281b]">No orders found</p>
                    <p className="text-[11px]">No orders match the selected filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#faf7eb]/60 transition-colors cursor-pointer"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="py-3.5 pl-4 pr-2 font-mono font-bold text-[#18281b]">
                      {order.id}
                    </td>

                    <td className="py-3.5 px-3 text-[#5c725f] text-[11px] whitespace-nowrap">
                      {order.date}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-[#18281b]">{order.customer.name}</p>
                      <p className="text-[10px] text-[#849685]">{order.customer.phone}</p>
                    </td>

                    <td className="py-3.5 px-3 text-[#4b5d4e]">
                      <span className="font-medium">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      <span className="text-[10px] text-[#849685] block truncate max-w-[140px]">
                        {order.items[0]?.productName}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-[#18281b]">
                      ৳{order.total.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 font-medium text-[11px] text-[#18281b]">
                        {order.paymentMethod}
                      </span>
                      <span className="text-[9px] block text-[#849685]">{order.paymentStatus}</span>
                    </td>

                    <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={order.orderStatus} />
                    </td>

                    <td className="py-3.5 px-3 text-[11px] text-[#5c725f]">
                      <span className="font-medium text-[#18281b] block">{order.courier}</span>
                      {order.courierTrackingCode && (
                        <span className="text-[9px] font-mono text-[#2d6636]">
                          {order.courierTrackingCode}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onSelectOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-[#f1f6ee] hover:bg-[#18281b] hover:text-white text-[#18281b] text-[11px] font-semibold border border-[#d6edd2] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-3.5 bg-[#faf7ed] border-t border-[#ded6be]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#5c725f]">
          <span>
            Displaying {filteredOrders.length} consignments
          </span>
          <span className="font-bold text-[#18281b]">
            Batch Volume: ৳{totalValue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
