import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (productId: string) => void;
  onDirectBuy: (product: Product, size: string, color: string) => void;
  onShowToast: (message: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onDirectBuy,
  onShowToast,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'care' | 'shipping'>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Initialize state when a product is opened
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedSize(product.sizes[0] || '38 FR');
      setSelectedColor(product.colors[0] || 'Natural');
      setActiveTab('details');
      setShowSizeGuide(false);
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Prepare images array (fallback to main product image if images array is empty)
  const imageGallery = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? imageGallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === imageGallery.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedSize, selectedColor);
    }
    onShowToast(`'${product.name}' (${selectedSize}, ${selectedColor}) ব্যাগে যোগ করা হয়েছে।`);
    onClose();
  };

  const handleBuyNow = () => {
    onDirectBuy(product, selectedSize, selectedColor);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
    >
      <div
        className="w-full max-w-2xl md:max-w-4xl lg:max-w-5xl bg-[#fff9ee] rounded-t-2xl sm:rounded-2xl max-h-[92vh] sm:max-h-[92vh] shadow-2xl border border-[#e8e2d8] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP STICKY BAR */}
        <div className="sticky top-0 z-30 bg-[#fff9ee]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#e8e2d8]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700] bg-[#f3ede3] px-2.5 py-1 rounded-md border border-[#e8e2d8]">
              {product.category}
            </span>
            {product.stockCount ? (
              <span className="text-[10px] font-semibold text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32] animate-pulse"></span>
                In Stock ({product.stockCount} left)
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {/* Wishlist Quick Button */}
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform cursor-pointer border ${
                isWishlisted
                  ? 'bg-[#fce4ec] border-[#f48fb1] text-[#c2185b]'
                  : 'bg-[#f3ede3] border-[#e8e2d8] text-[#1d1b15] hover:bg-[#ede7dd]'
              }`}
              title={isWishlisted ? 'উইশলিস্টে সেভ আছে' : 'উইশলিস্টে যোগ করুন'}
              aria-label="Wishlist toggle"
            >
              <span
                className="material-symbols-outlined text-[19px]"
                style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#f3ede3] border border-[#e8e2d8] flex items-center justify-center text-[#1d1b15] hover:bg-[#ede7dd] cursor-pointer active:scale-95 transition-transform"
              aria-label="Close product details"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY (2-COLUMN GRID ON TABLET & PC) */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-0">
            {/* LEFT COLUMN: PRODUCT IMAGE GALLERY & TEXTILE ORIGIN */}
            <div className="md:col-span-6 bg-[#ede7dd] p-3 sm:p-5 border-b md:border-b-0 md:border-r border-[#e8e2d8] flex flex-col justify-start">
              {/* Main Large Image Display */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/5] max-h-[420px] bg-[#e2dbd0] rounded-xl overflow-hidden shadow-inner group">
            <img
              src={imageGallery[selectedImageIndex]}
              alt={`${product.name} - View ${selectedImageIndex + 1}`}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Prev / Next Arrows */}
            {imageGallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 active:scale-90"
                  aria-label="Previous image"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 active:scale-90"
                  aria-label="Next image"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </>
            )}

            {/* Badges on main image */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {product.tag && (
                <span className="bg-[#1d1b19]/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Image counter indicator */}
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              {selectedImageIndex + 1} / {imageGallery.length}
            </span>
          </div>

          {/* ROW-WISE THUMBNAILS (সবগুলো ছবি সারিবদ্ধভাবে নিচে দেখানো) */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#4b4640] mb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#7d5700]">collections</span>
                <span>Photo Gallery ({imageGallery.length} Pictures)</span>
              </span>
              <span className="text-[10px] text-[#7d5700] lowercase font-normal">
                ছবি পরিবর্তন করতে ক্লিক করুন
              </span>
            </div>

            {/* Row of thumbnail photos */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {imageGallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative shrink-0 w-16 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer active:scale-95 ${
                    selectedImageIndex === idx
                      ? 'border-[#7d5700] ring-2 ring-[#7d5700]/30 shadow-md scale-105'
                      : 'border-[#cec5bd] opacity-70 hover:opacity-100 hover:border-[#7d5700]/50'
                  }`}
                  aria-label={`View picture ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {selectedImageIndex === idx && (
                    <span className="absolute inset-0 bg-[#7d5700]/15 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Textile Origin Card */}
            <div className="hidden md:flex flex-col gap-2 mt-5 p-3.5 bg-[#f3ede3] rounded-xl border border-[#ded5cb] text-[11px] text-[#4b4640]">
              <div className="flex items-center gap-1.5 font-semibold text-[#1d1b15] uppercase tracking-wider text-[10px]">
                <span className="material-symbols-outlined text-[16px] text-[#7d5700]">verified</span>
                <span>Atelier Heritage & Craftsmanship</span>
              </div>
              <p className="leading-relaxed">
                Handcrafted at our Dhaka flagship tailoring suite using ethically sourced fibres from Rajshahi and heritage European mills.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[10px] text-[#7d5700] font-semibold">
                <span>✓ OEKO-TEX Standard</span>
                <span>✓ Natural Vegetable Dyes</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT INFO & PRICING */}
        <div className="md:col-span-6 p-4 sm:p-6 flex flex-col gap-5">
          <div>
            <span className="text-[11px] font-bold text-[#7d5700] uppercase tracking-wider block mb-1">
              ELIF Dhaka Atelier
            </span>
            <h1 className="font-display text-[22px] sm:text-[28px] text-[#1d1b15] font-semibold tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-[13px] text-[#4b4640] mt-1 font-medium">{product.subtitle}</p>

            {/* Price section */}
            <div className="flex flex-wrap items-baseline gap-3 mt-3 pb-3 border-b border-[#e8e2d8]">
              <span className="font-display text-[26px] sm:text-[30px] font-bold text-[#1d1b15]">
                {product.currency}{product.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#7d766f] uppercase tracking-wider">
                VAT Inclusive
              </span>
              <span className="text-[11px] text-[#2e7d32] font-semibold bg-[#e8f5e9] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                Cash on Delivery Available
              </span>
            </div>

            {/* Fast Perks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-1 text-[11px] text-[#4b4640]">
              <div className="flex items-center gap-1.5 bg-[#f3ede3] p-2 rounded-lg border border-[#e8e2d8]">
                <span className="material-symbols-outlined text-[16px] text-[#7d5700]">local_shipping</span>
                <span>ঢাকা ২৪-৪৮ ঘণ্টায়</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f3ede3] p-2 rounded-lg border border-[#e8e2d8]">
                <span className="material-symbols-outlined text-[16px] text-[#7d5700]">payments</span>
                <span>হোম ডেলিভারি ও COD</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f3ede3] p-2 rounded-lg border border-[#e8e2d8] col-span-2 sm:col-span-1">
                <span className="material-symbols-outlined text-[16px] text-[#7d5700]">sync</span>
                <span>৭ দিনের সহজ রিটার্ন</span>
              </div>
            </div>
          </div>

          {/* 4. COLOR SELECTION */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#4b4640] mb-2">
              <span>রং সিলেক্ট করুন (Color Shade):</span>
              <span className="text-[#1d1b15] font-bold">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium border transition-all cursor-pointer ${
                    selectedColor === color
                      ? 'bg-[#1d1b19] text-white border-[#1d1b19] shadow-sm'
                      : 'bg-[#f3ede3] text-[#1d1b15] border-[#e8e2d8] hover:border-[#7d5700]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* 5. SIZE SELECTION & SIZE GUIDE */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#4b4640] mb-2">
              <span>সাইজ সিলেক্ট করুন (Size):</span>
              <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-[#7d5700] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">straighten</span>
                <span>{showSizeGuide ? 'Hide Size Chart' : 'Size Guide (সাইজ চার্ট)'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[52px] h-10 px-3 rounded-lg text-[12px] font-bold border transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-[#ffc55f] text-[#755100] border-[#ffc55f] shadow-md ring-2 ring-[#ffc55f]/30'
                      : 'bg-[#ffffff] text-[#1d1b15] border-[#cec5bd] hover:border-[#7d5700]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Model stats banner */}
            {product.modelStats && (
              <p className="text-[11px] text-[#7d766f] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#7d5700]">accessibility_new</span>
                <span>{product.modelStats}</span>
              </p>
            )}

            {/* Size Guide Table Toggle */}
            {showSizeGuide && (
              <div className="mt-3 p-3.5 bg-[#f3ede3] rounded-xl border border-[#e8e2d8] text-[12px] animate-fadeIn">
                <h4 className="font-semibold text-[#1d1b15] mb-2 flex items-center justify-between">
                  <span>Size & Measurement Guide (ইঞ্চি/cm)</span>
                  <span className="text-[10px] text-[#7d5700] uppercase font-bold">French / EU Standard</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-[#4b4640]">
                    <thead>
                      <tr className="border-b border-[#cec5bd] text-[#1d1b15]">
                        <th className="py-1 px-2 font-bold">Size</th>
                        <th className="py-1 px-2 font-bold">Bust / Chest</th>
                        <th className="py-1 px-2 font-bold">Waist</th>
                        <th className="py-1 px-2 font-bold">Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8e2d8]">
                      <tr>
                        <td className="py-1 px-2 font-semibold">36 FR / S</td>
                        <td className="py-1 px-2">34-35 in (88 cm)</td>
                        <td className="py-1 px-2">27-28 in (70 cm)</td>
                        <td className="py-1 px-2">42 in (106 cm)</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 font-semibold">38 FR / M</td>
                        <td className="py-1 px-2">36-37 in (92 cm)</td>
                        <td className="py-1 px-2">29-30 in (74 cm)</td>
                        <td className="py-1 px-2">43 in (108 cm)</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 font-semibold">40 FR / L</td>
                        <td className="py-1 px-2">38-39 in (96 cm)</td>
                        <td className="py-1 px-2">31-32 in (78 cm)</td>
                        <td className="py-1 px-2">44 in (110 cm)</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 font-semibold">42 FR / XL</td>
                        <td className="py-1 px-2">40-41 in (102 cm)</td>
                        <td className="py-1 px-2">33-34 in (84 cm)</td>
                        <td className="py-1 px-2">45 in (112 cm)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 6. QUANTITY PICKER */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4b4640]">
              পরিমাণ (Quantity):
            </span>
            <div className="flex items-center border border-[#cec5bd] rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-[#1d1b15] hover:bg-[#f3ede3] active:scale-95 transition-all cursor-pointer font-bold"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center text-[13px] font-bold text-[#1d1b15]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-8 h-8 flex items-center justify-center text-[#1d1b15] hover:bg-[#f3ede3] active:scale-95 transition-all cursor-pointer font-bold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* 7. DETAILED SPECIFICATIONS TABS */}
          <div className="border-t border-[#e8e2d8] pt-3">
            <div className="flex gap-4 border-b border-[#e8e2d8] pb-2 text-[11px] font-semibold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
              {[
                { id: 'details', label: 'পোশাকের বিবরণ (Details)' },
                { id: 'specs', label: 'ফেব্রিক ও কারিগরি (Specs)' },
                { id: 'care', label: 'যত্ন নেওয়ার নিয়ম (Care)' },
                { id: 'shipping', label: 'ডেলিভারি পলিসি (Shipping)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`transition-colors cursor-pointer shrink-0 pb-1.5 ${
                    activeTab === tab.id
                      ? 'text-[#7d5700] border-b-2 border-[#7d5700] font-bold'
                      : 'text-[#4b4640] hover:text-[#1d1b15]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pt-3 text-[13px] text-[#4b4640] leading-relaxed">
              {/* Overview & Description Tab */}
              {activeTab === 'details' && (
                <div className="space-y-2">
                  <p>{product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <div className="mt-3 bg-[#f3ede3] p-3 rounded-xl border border-[#e8e2d8]">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1d1b15] mb-2">
                        বিশেষ বৈশিষ্ট্যসমূহ (Key Highlights):
                      </h4>
                      <ul className="space-y-1 text-[12px]">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[15px] text-[#7d5700]">check_circle</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Specs Tab */}
              {activeTab === 'specs' && (
                <div className="space-y-2.5">
                  <div className="bg-[#f3ede3] p-3 rounded-xl border border-[#e8e2d8] space-y-1.5">
                    <p>
                      <strong className="text-[#1d1b15]">Textile Composition:</strong>{' '}
                      {product.fabric}
                    </p>
                    <p>
                      <strong className="text-[#1d1b15]">Artisanal Provenance:</strong>{' '}
                      {product.origin}
                    </p>
                    <p className="text-[11px] text-[#7d5700] pt-0.5">
                      Cradle-to-Cradle Gold & OEKO-TEX Standard 100 Certified Textile.
                    </p>
                  </div>
                </div>
              )}

              {/* Care Instructions Tab */}
              {activeTab === 'care' && (
                <div className="space-y-2">
                  <p className="text-[12px] text-[#1d1b15] font-semibold">
                    পোশাকটি দীর্ঘস্থায়ী ও নতুন রাখার নির্দেশনা:
                  </p>
                  <ul className="space-y-1.5 text-[12px]">
                    {product.careInstructions && product.careInstructions.length > 0 ? (
                      product.careInstructions.map((inst, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#7d5700] shrink-0 mt-0.5">
                            dry_cleaning
                          </span>
                          <span>{inst}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#7d5700]">dry_cleaning</span>
                          <span>Dry clean or hand wash gently in cold water</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#7d5700]">iron</span>
                          <span>Iron on reverse with low heat setting</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              {/* Shipping Tab */}
              {activeTab === 'shipping' && (
                <div className="space-y-2 text-[12px]">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#7d5700] shrink-0">
                      local_shipping
                    </span>
                    <p>
                      <strong>ঢাকা মেট্রো এরিয়া:</strong> ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি। হোম ডেলিভারিতে পণ্য দেখে ক্যাশ অন ডেলিভারি (COD) পেমেন্ট করার সুবিধা রয়েছে।
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#7d5700] shrink-0">
                      distance
                    </span>
                    <p>
                      <strong>সমগ্র বাংলাদেশ:</strong> চট্টগ্রাম, সিলেট, রাজশাহীসহ ৬৪টি জেলায় ২ থেকে ৩ কর্মদিবসের মধ্যে নির্ভরযোগ্য কুরিয়ারে (Pathao / Steadfast) ডেলিভারি।
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#2e7d32] shrink-0">
                      verified
                    </span>
                    <p className="text-[#2e7d32] font-semibold">
                      ৭ দিনের সহজ সাইজ এক্সচেঞ্জ ও রিটার্ন পলিসি সুবিধা।
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

        {/* 8. STICKY BOTTOM ACTIONS BAR: DIRECT BUY, ADD TO BAG, WISHLIST */}
        <div className="sticky bottom-0 z-30 bg-[#fff9ee] p-3 sm:p-4 border-t border-[#e8e2d8] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`h-12 px-3.5 rounded-xl border flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-[#fce4ec] border-[#f48fb1] text-[#c2185b]'
                  : 'bg-[#f3ede3] border-[#cec5bd] text-[#1d1b15] hover:bg-[#ede7dd]'
              }`}
              title={isWishlisted ? 'উইশলিস্ট থেকে সরান' : 'উইশলিস্টে রাখুন'}
              aria-label="Wishlist toggle"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider hidden sm:inline">
                {isWishlisted ? 'Saved' : 'Wishlist'}
              </span>
            </button>

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-[#1d1b19] text-white hover:bg-[#34302c] font-semibold text-[12px] sm:text-[13px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md cursor-pointer border border-[#1d1b19]"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>ব্যাগে যোগ করুন</span>
            </button>

            {/* Direct Buy (Buy Now) Button */}
            <button
              onClick={handleBuyNow}
              className="flex-1 h-12 bg-[#ffc55f] text-[#755100] hover:bg-[#ffdeaa] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md cursor-pointer border border-[#e0a838]"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>এখনই কিনুন • {product.currency}{(product.price * quantity).toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
