import React, { useState, useMemo } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { AdminProduct, AdminView } from '../types';

interface ProductsViewProps {
  products: AdminProduct[];
  onNavigate: (view: AdminView) => void;
  onSelectProduct: (product: AdminProduct) => void;
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct: (product: AdminProduct) => void;
  onShowToast: (msg: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'stock'>('newest');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Categories list
  const categories = useMemo(() => {
    return ['All', ...new Set(products.map((p) => p.category))];
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.fabric.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock') return a.stockCount - b.stockCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Bulk Selection
  const isAllSelected =
    filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkActivate = () => {
    onShowToast(`Activated ${selectedProductIds.length} products successfully.`);
    setSelectedProductIds([]);
  };

  const handleBulkArchive = () => {
    onShowToast(`Archived ${selectedProductIds.length} products.`);
    setSelectedProductIds([]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Garments Catalog
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Manage ELIF&apos;s haute couture outerwear, silk draping, and knitwear inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onShowToast('Exported catalog to CSV & Excel.')}
            className="px-3 py-2 rounded-xl bg-white hover:bg-[#f1f6ee] text-[#18281b] text-[12px] font-semibold border border-[#ded6be] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('product-new')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Add Garment</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#849685]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU (e.g. ELF-CT-2501), or fabric..."
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl pl-10 pr-3 py-2 text-[12px] text-[#18281b] placeholder-[#849685] focus:outline-none focus:bg-white focus:border-[#18281b] transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] font-medium text-[#18281b] focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] font-medium text-[#18281b] focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Archived">Archived</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] font-medium text-[#18281b] focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="stock">Stock Quantity</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (when items selected) */}
        {selectedProductIds.length > 0 && (
          <div className="pt-2 border-t border-[#f1f6ee] flex items-center justify-between bg-[#f1f6ee]/60 -mx-4 -mb-4 px-4 py-2.5 rounded-b-2xl">
            <span className="text-[12px] font-semibold text-[#18281b]">
              {selectedProductIds.length} {selectedProductIds.length === 1 ? 'garment' : 'garments'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBulkActivate}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#ded6be] text-[11px] font-semibold text-[#2e7d32] hover:bg-[#eaf5e6] cursor-pointer"
              >
                Set Active
              </button>
              <button
                type="button"
                onClick={handleBulkArchive}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#ded6be] text-[11px] font-semibold text-[#c62828] hover:bg-[#feecec] cursor-pointer"
              >
                Archive
              </button>
              <button
                type="button"
                onClick={() => setSelectedProductIds([])}
                className="text-[11px] font-medium text-[#849685] hover:underline cursor-pointer pl-1"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#ded6be] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#faf7ed] border-b border-[#ded6be]/80 text-[#5c725f] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3.5 pl-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded text-[#18281b] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 pr-2">Garment</th>
                <th className="py-3.5 px-3">SKU</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Collection</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Stock</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f9f4]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-[#849685]">
                    <span className="material-symbols-outlined text-[36px] block mb-2 opacity-40">
                      inventory_2
                    </span>
                    <p className="text-[13px] font-medium text-[#18281b]">No garments match your filters</p>
                    <p className="text-[11px] mt-0.5">Try resetting search criteria or add a new piece.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isSelected = selectedProductIds.includes(prod.id);
                  const isLowStock = prod.stockCount <= prod.lowStockThreshold;

                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-[#faf7eb]/60 transition-colors ${
                        isSelected ? 'bg-[#f4faee]' : ''
                      }`}
                    >
                      <td className="p-3.5 pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(prod.id)}
                          className="rounded text-[#18281b] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>

                      {/* Image & Title */}
                      <td className="py-3.5 pr-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-11 h-11 rounded-lg object-cover border border-[#ded6be]/70 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p
                              onClick={() => onEditProduct(prod)}
                              className="font-semibold text-[#18281b] truncate hover:text-[#2d6636] cursor-pointer"
                            >
                              {prod.name}
                            </p>
                            <p className="text-[10px] text-[#849685] truncate">
                              {prod.fabric}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-[#5c725f]">
                        {prod.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 text-[#18281b] font-medium">
                        {prod.category}
                      </td>

                      {/* Collection */}
                      <td className="py-3.5 px-3 text-[#5c725f] text-[11px]">
                        {prod.collection}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 font-bold text-[#18281b]">
                        ৳{prod.price.toLocaleString()}
                        {prod.compareAtPrice && (
                          <span className="text-[10px] text-[#849685] line-through block font-normal">
                            ৳{prod.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-semibold ${
                            isLowStock ? 'text-[#c62828] font-bold' : 'text-[#18281b]'
                          }`}
                        >
                          {prod.stockCount} in stock
                        </span>
                        {isLowStock && (
                          <span className="text-[9px] text-[#c62828] block font-medium">
                            Low (min {prod.lowStockThreshold})
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <StatusBadge status={prod.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditProduct(prod)}
                            title="Edit Garment Specifications"
                            className="p-1.5 rounded-lg bg-[#faf7ed] hover:bg-[#18281b] hover:text-white text-[#18281b] transition-colors cursor-pointer border border-[#ded6be]/60"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateProduct(prod)}
                            title="Duplicate as New Draft"
                            className="p-1.5 rounded-lg bg-[#faf7ed] hover:bg-[#18281b] hover:text-white text-[#18281b] transition-colors cursor-pointer border border-[#ded6be]/60"
                          >
                            <span className="material-symbols-outlined text-[15px]">content_copy</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(prod.id)}
                            title="Archive / Delete"
                            className="p-1.5 rounded-lg bg-[#faf7ed] hover:bg-[#fee2e2] text-[#849685] hover:text-[#b91c1c] transition-colors cursor-pointer border border-[#ded6be]/60"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-3.5 bg-[#faf7ed] border-t border-[#ded6be]/80 flex items-center justify-between text-[11px] text-[#5c725f]">
          <span>
            Showing {filteredProducts.length} of {products.length} catalog garments
          </span>
          <span>ELIF Atelier Inventory System</span>
        </div>
      </div>
    </div>
  );
};
