import React, { useState, useMemo } from 'react';
import {
  AdminOrder,
  AdminProduct,
  AdminCustomer,
  AdminCollection,
  AdminView,
} from '../types';

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AdminView) => void;
  onSelectOrder?: (order: AdminOrder) => void;
  onSelectProduct?: (product: AdminProduct) => void;
  products?: AdminProduct[];
  orders?: AdminOrder[];
  customers?: AdminCustomer[];
  collections?: AdminCollection[];
}

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectOrder,
  onSelectProduct,
  products = [],
  orders = [],
  customers = [],
  collections = [],
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], orders: [], customers: [], collections: [] };

    return {
      products: (products || []).filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      ),
      orders: (orders || []).filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q)
      ),
      customers: (customers || []).filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      ),
      collections: (collections || []).filter((col) => col.name.toLowerCase().includes(q)),
    };
  }, [query, products, orders, customers, collections]);

  if (!isOpen) return null;

  const totalResults =
    filtered.products.length +
    filtered.orders.length +
    filtered.customers.length +
    filtered.collections.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#ded6be] shadow-2xl overflow-hidden animate-scaleUp">
        {/* Search Input */}
        <div className="p-4 border-b border-[#f1f6ee] flex items-center gap-3 bg-[#faf7ed]">
          <span className="material-symbols-outlined text-[20px] text-[#5c725f]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders (e.g. EL-BD4821), products, SKU, clients, collections..."
            autoFocus
            className="flex-1 bg-transparent border-none text-[14px] text-[#18281b] placeholder-[#849685] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#849685] hover:text-[#18281b] p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-white border border-[#ded6be] text-[#5c725f] rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[420px] overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-[12px] text-[#849685]">
              <span className="material-symbols-outlined text-[32px] block mb-2 opacity-40">
                manage_search
              </span>
              Type a product name, customer phone, or order ID to quickly jump to any record.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#849685]">
              No results found for &ldquo;<span className="text-[#18281b] font-medium">{query}</span>&rdquo;
            </div>
          ) : (
            <>
              {/* Orders */}
              {filtered.orders.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-2">
                    Orders ({filtered.orders.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filtered.orders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => {
                          if (onSelectOrder) onSelectOrder(order);
                          else onNavigate('orders');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-[#faf7eb] border border-transparent hover:border-[#ded6be] transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[13px] text-[#18281b]">
                            {order.id}
                          </span>
                          <span className="text-[12px] text-[#4b5d4e]">
                            {order.customer.name} ({order.customer.phone})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-[#18281b]">
                            ৳{order.total.toLocaleString()}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f1f6ee] text-[#18281b] font-medium border border-[#d6edd2]">
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {filtered.products.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-2">
                    Products ({filtered.products.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filtered.products.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(prod);
                          else onNavigate('products');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-[#faf7eb] border border-transparent hover:border-[#ded6be] transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-8 h-8 rounded-lg object-cover border border-[#ded6be]/60"
                          />
                          <div>
                            <p className="text-[12px] font-semibold text-[#18281b]">{prod.name}</p>
                            <p className="text-[10px] text-[#849685]">
                              SKU: {prod.sku} • {prod.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-[#18281b]">
                            ৳{prod.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#5c725f]">
                            Stock: {prod.stockCount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {filtered.customers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-2">
                    Customers ({filtered.customers.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filtered.customers.map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => {
                          onNavigate('customers');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-[#faf7eb] border border-transparent hover:border-[#ded6be] transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[12px] font-semibold text-[#18281b]">{cust.name}</p>
                          <p className="text-[10px] text-[#849685]">
                            {cust.phone} • {cust.district}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-[#2d6636]">
                          ৳{cust.totalSpent.toLocaleString()} ({cust.totalOrders} orders)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#faf7ed] border-t border-[#f1f6ee] flex items-center justify-between text-[11px] text-[#849685]">
          <span>Press ESC or click outside to dismiss</span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-[#18281b] hover:text-[#2d6636]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
