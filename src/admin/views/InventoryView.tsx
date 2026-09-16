import React, { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { AdminProduct, AdminView } from '../types';

interface InventoryViewProps {
  products: AdminProduct[];
  onNavigate: (view: AdminView) => void;
  onUpdateStock: (productId: string, newStock: number, reason: string) => void;
  onShowToast: (msg: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onNavigate,
  onUpdateStock,
  onShowToast,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'remove' | 'set'>('add');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<string>('New atelier batch received');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const totalItems = products.length;
  const inStockItems = products.filter((p) => p.stockCount > p.lowStockThreshold).length;
  const lowStockItems = products.filter(
    (p) => p.stockCount <= p.lowStockThreshold && p.stockCount > 0
  ).length;
  const outOfStockItems = products.filter((p) => p.stockCount === 0).length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    let newStock = selectedProduct.stockCount;
    if (adjustType === 'add') newStock += adjustQuantity;
    else if (adjustType === 'remove') newStock = Math.max(0, newStock - adjustQuantity);
    else if (adjustType === 'set') newStock = Math.max(0, adjustQuantity);

    onUpdateStock(selectedProduct.id, newStock, adjustReason);
    onShowToast(`Updated inventory for ${selectedProduct.name} to ${newStock} units.`);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Monitor unit allocations, low-stock alerts, and log atelier material batch restocks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('Stock reconciliation audit exported.')}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#f1f6ee] text-[#18281b] text-[12px] font-semibold border border-[#ded6be] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          <span>Stock Audit Sheet</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard label="Total Catalog SKUs" value={totalItems} icon="inventory_2" />
        <MetricCard label="Healthy Stock" value={inStockItems} icon="check_circle" />
        <MetricCard
          label="Low Stock Warning"
          value={lowStockItems}
          badge={lowStockItems > 0 ? 'Restock Needed' : undefined}
          icon="warning"
        />
        <MetricCard label="Depleted / Out" value={outOfStockItems} icon="cancel" />
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-4 shadow-xs">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#849685]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter inventory by garment name, SKU or textile..."
            className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl pl-10 pr-3 py-2 text-[12px] text-[#18281b] placeholder-[#849685] focus:outline-none focus:bg-white focus:border-[#18281b]"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#ded6be] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#faf7ed] border-b border-[#ded6be]/80 text-[#5c725f] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 pl-4 pr-2">Garment</th>
                <th className="py-3.5 px-3">SKU</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">In Stock</th>
                <th className="py-3.5 px-3">Threshold</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f9f4]">
              {filteredProducts.map((prod) => {
                const isLow = prod.stockCount <= prod.lowStockThreshold;

                return (
                  <tr key={prod.id} className="hover:bg-[#faf7eb]/60 transition-colors">
                    <td className="py-3.5 pl-4 pr-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#ded6be]/70 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-[#18281b] truncate">{prod.name}</p>
                          <p className="text-[10px] text-[#849685] truncate">{prod.fabric}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] text-[#5c725f]">
                      {prod.sku}
                    </td>

                    <td className="py-3.5 px-3 text-[#18281b]">{prod.category}</td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[13px] font-bold ${
                          isLow ? 'text-[#c62828]' : 'text-[#18281b]'
                        }`}
                      >
                        {prod.stockCount} units
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-[#5c725f] text-[11px]">
                      Min {prod.lowStockThreshold} units
                    </td>

                    <td className="py-3.5 px-3">
                      <StatusBadge
                        status={
                          prod.stockCount === 0
                            ? 'Out of Stock'
                            : isLow
                            ? 'Warning'
                            : 'Active'
                        }
                      />
                    </td>

                    <td className="py-3.5 pr-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(prod);
                          setAdjustQuantity(5);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#f1f6ee] hover:bg-[#18281b] hover:text-white text-[#18281b] text-[11px] font-semibold border border-[#d6edd2] transition-colors cursor-pointer"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#ded6be] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f6ee] pb-3">
              <h3 className="font-serif text-[17px] font-bold text-[#18281b]">
                Adjust Stock: {selectedProduct.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-[#849685] hover:text-[#18281b]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1.5">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['add', 'remove', 'set'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAdjustType(type)}
                      className={`py-2 rounded-xl text-[12px] font-semibold capitalize border transition-colors cursor-pointer ${
                        adjustType === type
                          ? 'bg-[#18281b] text-white border-[#18281b]'
                          : 'bg-[#faf7ed] text-[#5c725f] border-[#ded6be]'
                      }`}
                    >
                      {type === 'add' ? '+ Add' : type === 'remove' ? '- Remove' : '= Set Exact'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Quantity Units
                </label>
                <input
                  type="number"
                  min={0}
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                  required
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[14px] font-bold text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Reason for Adjustment
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:outline-none"
                >
                  <option value="New atelier batch received">New atelier batch received</option>
                  <option value="Physical salon fitting allocation">Physical salon fitting allocation</option>
                  <option value="Damage / Quality inspection quarantine">Damage / Quality inspection quarantine</option>
                  <option value="Inventory audit reconciliation">Inventory audit reconciliation</option>
                </select>
              </div>

              <div className="p-3 bg-[#faf7ed] rounded-xl text-[11px] text-[#5c725f] flex justify-between items-center">
                <span>Current Stock: <strong>{selectedProduct.stockCount}</strong></span>
                <span>
                  New Stock:{' '}
                  <strong className="text-[#2d6636]">
                    {adjustType === 'add'
                      ? selectedProduct.stockCount + adjustQuantity
                      : adjustType === 'remove'
                      ? Math.max(0, selectedProduct.stockCount - adjustQuantity)
                      : Math.max(0, adjustQuantity)}
                  </strong>
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl text-[#5c725f] hover:bg-[#f1f6ee] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#18281b] text-white font-semibold hover:bg-[#283d2b] transition-colors cursor-pointer"
                >
                  Confirm Stock Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
