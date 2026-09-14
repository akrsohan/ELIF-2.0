import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (productId: string) => void;
  onShowToast: (message: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onShowToast,
}) => {
  const [selectedSize, setSelectedSize] = useState('38 FR');
  const [selectedColor, setSelectedColor] = useState('Natural');
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '38 FR');
      setSelectedColor(product.colors[0] || 'Natural');
      setActiveTab('details');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    onShowToast(`Added ${product.name} (${selectedSize}) to your bag.`);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
    >
      <div
        className="w-full max-w-lg bg-[#fff9ee] rounded-t-2xl sm:rounded-2xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8e2d8] flex flex-col relative no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle / Close Bar */}
        <div className="sticky top-0 z-10 bg-[#fff9ee]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#e8e2d8]">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700]">
            {product.category}
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f3ede3] flex items-center justify-center text-[#1d1b15] hover:bg-[#ede7dd] cursor-pointer active:scale-95 transition-transform"
            aria-label="Close details"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Product Image */}
        <div className="relative w-full aspect-[4/5] max-h-[380px] bg-[#ede7dd] overflow-hidden">
          <img
            src={product.image}
            alt={product.alt}
            className="w-full h-full object-cover object-top"
          />

          {product.tag && (
            <span className="absolute bottom-3 left-3 bg-[#1d1b19]/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              {product.tag}
            </span>
          )}

          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-[#fff9ee]/85 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer ${
              isWishlisted ? 'text-[#7d5700]' : 'text-[#1d1b15]'
            }`}
            aria-label="Wishlist"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Product Information */}
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-display text-[22px] sm:text-[24px] text-[#1d1b15] leading-snug">
              {product.name}
            </h2>
            <p className="text-[13px] text-[#4b4640] mt-0.5">{product.subtitle}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-display text-[22px] sm:text-[24px] font-semibold text-[#1d1b15]">
                {product.currency}{product.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#2e7d32] font-semibold bg-[#e8f5e9] px-2 py-0.5 rounded-full">
                COD Available
              </span>
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#4b4640] mb-2">
              <span>Color Shade:</span>
              <span className="text-[#1d1b15]">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium border transition-all cursor-pointer ${
                    selectedColor === color
                      ? 'bg-[#1d1b19] text-white border-[#1d1b19]'
                      : 'bg-[#f3ede3] text-[#1d1b15] border-[#e8e2d8] hover:border-[#7d5700]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#4b4640] mb-2">
              <span>Size:</span>
              <button
                onClick={() => onShowToast('French tailoring sizing: 36 (US 4), 38 (US 6), 40 (US 8).')}
                className="text-[#7d5700] underline lowercase cursor-pointer"
              >
                size guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-10 px-3 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-[#ffc55f] text-[#755100] border-[#ffc55f] shadow-sm'
                      : 'bg-[#ffffff] text-[#1d1b15] border-[#cec5bd] hover:border-[#7d5700]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Information Tabs */}
          <div className="border-t border-[#e8e2d8] pt-3">
            <div className="flex gap-4 border-b border-[#e8e2d8] pb-2 text-[11px] font-semibold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
              {[
                { id: 'details', label: 'Silhouettes' },
                { id: 'fabric', label: 'Craft & Textiles' },
                { id: 'shipping', label: 'White Glove Delivery' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`transition-colors cursor-pointer shrink-0 pb-1 ${
                    activeTab === tab.id
                      ? 'text-[#7d5700] border-b-2 border-[#7d5700]'
                      : 'text-[#4b4640] hover:text-[#1d1b15]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pt-3 text-[13px] text-[#4b4640] leading-relaxed">
              {activeTab === 'details' && <p>{product.description}</p>}
              {activeTab === 'fabric' && (
                <div className="space-y-1">
                  <p>
                    <strong className="text-[#1d1b15]">Textile Composition:</strong>{' '}
                    {product.fabric}
                  </p>
                  <p>
                    <strong className="text-[#1d1b15]">Artisanal Provenance:</strong>{' '}
                    {product.origin}
                  </p>
                  <p className="text-[11px] text-[#7d5700] pt-1">
                    Cradle-to-Cradle Gold & OEKO-TEX Standard 100 Certified.
                  </p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-1.5">
                  <p>
                    Complimentary express courier across Dhaka (24–48 hours) and 2–3 days to Chittagong, Sylhet, and all 64 districts via Pathao / Steadfast.
                  </p>
                  <p className="text-[#2e7d32] font-semibold text-[12px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    Cash on Delivery (COD) supported at doorstep inspection.
                  </p>
                  <p className="text-[11px] text-[#7d766f]">
                    Delivered from our Gulshan 2 Flagship Atelier in hand-tied artisanal boxes with 7-day exchange guarantee.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Actions inside modal */}
          <div className="sticky bottom-0 bg-[#fff9ee] pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] border-t border-[#e8e2d8]">
            <button
              onClick={handleAdd}
              className="w-full h-12 bg-[#ffc55f] text-[#755100] hover:bg-[#ffdeaa] font-semibold text-[13px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md cursor-pointer"
            >
              <span>Add to Bag • {product.currency}{product.price.toLocaleString()}</span>
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
