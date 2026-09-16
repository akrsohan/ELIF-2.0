import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen?: boolean;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (productId: string) => void;
  onDirectBuy: (product: Product, size: string, color: string) => void;
  onShowToast: (message: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen = true,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onDirectBuy,
  onShowToast,
}) => {
  const { language, t, localizeProduct, localizeCategory, formatPrice, formatNumber } =
    useLanguage();
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

  if (!product || isOpen === false) return null;

  const localizedProduct = localizeProduct(product);

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
    onShowToast(
      language === 'bn'
        ? `'${localizedProduct.name}' (${selectedSize}, ${selectedColor}) ব্যাগে যোগ করা হয়েছে।`
        : `Added '${localizedProduct.name}' (${selectedSize}, ${selectedColor}) to your bag.`
    );
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
        className="w-full max-w-2xl md:max-w-4xl lg:max-w-5xl bg-[#faf7eb] rounded-t-2xl sm:rounded-2xl max-h-[92vh] sm:max-h-[92vh] shadow-2xl border border-[#ded6be] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP STICKY BAR */}
        <div className="sticky top-0 z-30 bg-[#faf7eb]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#ded6be]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d6636] bg-[#f1f6ee] px-2.5 py-1 rounded-md border border-[#d6e5d2]">
              {localizeCategory(product.category)}
            </span>
            {product.stockCount ? (
              <span className="text-[10px] font-semibold text-[#2d6636] bg-[#eef7ec] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#d6e5d2]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2d6636] animate-pulse"></span>
                {language === 'bn' ? `স্টকে আছে (${formatNumber(product.stockCount)}টি অবশিষ্ট)` : `In Stock (${product.stockCount} left)`}
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
                  : 'bg-[#f1f6ee] border-[#d6e5d2] text-[#18281b] hover:bg-[#e7f0e3]'
              }`}
              title={isWishlisted ? (language === 'bn' ? 'উইশলিস্টে সেভ আছে' : 'Saved in Wishlist') : (language === 'bn' ? 'উইশলিস্টে যোগ করুন' : 'Add to Wishlist')}
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
              className="w-9 h-9 rounded-full bg-[#f1f6ee] border border-[#d6e5d2] flex items-center justify-center text-[#18281b] hover:bg-[#e7f0e3] cursor-pointer active:scale-95 transition-transform"
              aria-label="Close product details"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY (2-COLUMN GRID ON TABLET & PC) */}
        <div className="overflow-y-auto flex-1 no-scrollbar selection:bg-[#d6edd2] selection:text-[#18281b]">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-0">
            {/* LEFT COLUMN: PRODUCT IMAGE GALLERY & TEXTILE ORIGIN */}
            <div className="md:col-span-6 bg-[#f1f6ee] p-3 sm:p-5 border-b md:border-b-0 md:border-r border-[#d6e5d2] flex flex-col justify-start">
              {/* Main Large Image Display */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/5] max-h-[420px] bg-[#e7f0e3] rounded-xl overflow-hidden shadow-inner group">
            <img
              src={imageGallery[selectedImageIndex]}
              alt={`${localizedProduct.name} - View ${selectedImageIndex + 1}`}
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
                <span className="bg-[#18281b]/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
                  {product.tag === 'Best Seller'
                    ? t.tagBestSeller
                    : product.tag === 'Limited'
                    ? t.tagLimited
                    : product.tag === 'New'
                    ? t.tagNew
                    : product.tag}
                </span>
              )}
            </div>

            {/* Image counter indicator */}
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              {formatNumber(selectedImageIndex + 1)} / {formatNumber(imageGallery.length)}
            </span>
          </div>

          {/* ROW-WISE THUMBNAILS */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#3a4d3d] mb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#2d6636]">collections</span>
                <span>{language === 'bn' ? `ছবি গ্যালারি (${formatNumber(imageGallery.length)}টি ছবি)` : `Photo Gallery (${imageGallery.length} Pictures)`}</span>
              </span>
              <span className="text-[10px] text-[#2d6636] lowercase font-normal">
                {language === 'bn' ? 'ছবি পরিবর্তন করতে ট্যাপ করুন' : 'Click to switch photo'}
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
                      ? 'border-[#2d6636] ring-2 ring-[#2d6636]/30 shadow-sm scale-105'
                      : 'border-[#c8dac4] opacity-70 hover:opacity-100 hover:border-[#2d6636]/50'
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
                    <span className="absolute inset-0 bg-[#2d6636]/15 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Textile Origin Card */}
            <div className="hidden md:flex flex-col gap-2 mt-5 p-3.5 bg-[#ffffff] rounded-xl border border-[#d6e5d2] text-[11px] text-[#3a4d3d] shadow-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#18281b] uppercase tracking-wider text-[10px]">
                <span className="material-symbols-outlined text-[16px] text-[#2d6636]">verified</span>
                <span>{language === 'bn' ? 'অঁতেলিয়ে ঐতিহ্য ও কারুশিল্প' : 'Atelier Heritage & Craftsmanship'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'bn'
                  ? 'রাজশাহীর প্রাচীন রেশম ও ইউরোপীয় প্রিমিয়াম মিলের প্রাকৃতিক সুতায় তৈরি ঢাকাই ঐতিহ্য ও আধুনিক ফ্যাশনের মেলবন্ধন।'
                  : 'Handcrafted at our Dhaka flagship tailoring suite using ethically sourced fibres from Rajshahi and heritage European mills.'}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[10px] text-[#2d6636] font-semibold">
                <span>✓ OEKO-TEX Standard</span>
                <span>✓ Natural Vegetable Dyes</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT INFO & PRICING */}
        <div className="md:col-span-6 p-4 sm:p-6 flex flex-col gap-5">
          <div>
            <span className="text-[11px] font-medium text-[#2d6636] uppercase tracking-[0.18em] block mb-1">
              ELIF Dhaka Atelier
            </span>
            <h1 className="font-display text-[22px] sm:text-[26px] text-[#18281b] font-medium tracking-tight leading-tight">
              {localizedProduct.name}
            </h1>
            <p className="text-[13px] text-[#3a4d3d] mt-1 font-normal">{localizedProduct.subtitle}</p>

            {/* Price section */}
            <div className="flex flex-wrap items-baseline gap-3 mt-3 pb-3 border-b border-[#d6e5d2]">
              <span className="text-[24px] sm:text-[28px] font-semibold text-[#18281b]">
                {formatPrice(product.price)}
              </span>
              <span className="text-[11px] text-[#3a4d3d] uppercase tracking-wider font-medium">
                {language === 'bn' ? 'ভ্যাট অন্তর্ভুক্ত' : 'VAT Inclusive'}
              </span>
              <span className="text-[11px] text-[#2d6636] font-medium bg-[#eef7ec] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#d6e5d2]">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                {t.trustCod}
              </span>
            </div>

            {/* Fast Perks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-1 text-[11px] text-[#3a4d3d]">
              <div className="flex items-center gap-1.5 bg-[#f1f6ee] p-2 rounded-lg border border-[#d6e5d2]">
                <span className="material-symbols-outlined text-[16px] text-[#2d6636]">local_shipping</span>
                <span>{language === 'bn' ? 'ঢাকা ২৪-৪৮ ঘণ্টায়' : 'Dhaka 24-48h'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f1f6ee] p-2 rounded-lg border border-[#d6e5d2]">
                <span className="material-symbols-outlined text-[16px] text-[#2d6636]">payments</span>
                <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash On Delivery'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f1f6ee] p-2 rounded-lg border border-[#d6e5d2] col-span-2 sm:col-span-1">
                <span className="material-symbols-outlined text-[16px] text-[#2d6636]">sync</span>
                <span>{language === 'bn' ? '৭ দিনের সহজ রিটার্ন' : '7-Day Return'}</span>
              </div>
            </div>
          </div>

          {/* COLOR SELECTION */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#3a4d3d] mb-2">
              <span>{language === 'bn' ? 'রং নির্বাচন (Color Shade):' : 'Select Color:'}</span>
              <span className="text-[#18281b] font-bold">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium border transition-all cursor-pointer ${
                    selectedColor === color
                      ? 'bg-[#2d6636] text-white border-[#2d6636] shadow-xs'
                      : 'bg-[#f1f6ee] text-[#18281b] border-[#d6e5d2] hover:border-[#2d6636]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* SIZE SELECTION & SIZE GUIDE */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#3a4d3d] mb-2">
              <span>{language === 'bn' ? 'সাইজ নির্বাচন (Size):' : 'Select Size:'}</span>
              <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-[#2d6636] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">straighten</span>
                <span>{showSizeGuide ? (language === 'bn' ? 'সাইজ চার্ট লুকান' : 'Hide Size Chart') : (language === 'bn' ? 'সাইজ গাইড (চার্ট)' : 'Size Guide')}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[52px] h-10 px-3 rounded-lg text-[12px] font-bold border transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-[#d6edd2] text-[#15381a] border-[#bce4b6] shadow-xs ring-2 ring-[#2d6636]/30'
                      : 'bg-[#ffffff] text-[#18281b] border-[#c8dac4] hover:border-[#2d6636]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Model stats banner */}
            {product.modelStats && (
              <p className="text-[11px] text-[#3a4d3d] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#2d6636]">accessibility_new</span>
                <span>{product.modelStats}</span>
              </p>
            )}

            {/* Size Guide Table Toggle */}
            {showSizeGuide && (
              <div className="mt-3 p-3.5 bg-[#f1f6ee] rounded-xl border border-[#d6e5d2] text-[12px] animate-fadeIn">
                <h4 className="font-semibold text-[#18281b] mb-2 flex items-center justify-between">
                  <span>{language === 'bn' ? 'সাইজ ও মেজারমেন্ট গাইড (ইঞ্চি/cm)' : 'Size & Measurement Guide (inches/cm)'}</span>
                  <span className="text-[10px] text-[#2d6636] uppercase font-bold">Standard Atelier</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-[#3a4d3d]">
                    <thead>
                      <tr className="border-b border-[#c8dac4] text-[#18281b]">
                        <th className="py-1 px-2 font-bold">{language === 'bn' ? 'সাইজ' : 'Size'}</th>
                        <th className="py-1 px-2 font-bold">{language === 'bn' ? 'বক্ষ (Bust)' : 'Bust'}</th>
                        <th className="py-1 px-2 font-bold">{language === 'bn' ? 'কোমর (Waist)' : 'Waist'}</th>
                        <th className="py-1 px-2 font-bold">{language === 'bn' ? 'দৈর্ঘ্য (Length)' : 'Length'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d6e5d2]">
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

          {/* QUANTITY PICKER */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#3a4d3d]">
              {language === 'bn' ? 'পরিমাণ (Quantity):' : 'Quantity:'}
            </span>
            <div className="flex items-center border border-[#c8dac4] rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-[#18281b] hover:bg-[#f1f6ee] active:scale-95 transition-all cursor-pointer font-bold"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center text-[13px] font-bold text-[#18281b]">
                {formatNumber(quantity)}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-8 h-8 flex items-center justify-center text-[#18281b] hover:bg-[#f1f6ee] active:scale-95 transition-all cursor-pointer font-bold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* DETAILED SPECIFICATIONS TABS */}
          <div className="border-t border-[#d6e5d2] pt-3">
            <div className="flex gap-4 border-b border-[#d6e5d2] pb-2 text-[11px] font-semibold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
              {[
                { id: 'details', label: language === 'bn' ? 'পোশাকের বিবরণ' : 'Details' },
                { id: 'specs', label: language === 'bn' ? 'ফেব্রিক ও কারিগরি' : 'Textile & Specs' },
                { id: 'care', label: language === 'bn' ? 'যত্ন নেওয়ার নিয়ম' : 'Garment Care' },
                { id: 'shipping', label: language === 'bn' ? 'ডেলিভারি পলিসি' : 'Shipping Policy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`transition-colors cursor-pointer shrink-0 pb-1.5 ${
                    activeTab === tab.id
                      ? 'text-[#2d6636] border-b-2 border-[#2d6636] font-bold'
                      : 'text-[#3a4d3d] hover:text-[#18281b]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pt-3 text-[13px] text-[#3a4d3d] leading-relaxed">
              {/* Overview & Description Tab */}
              {activeTab === 'details' && (
                <div className="space-y-2">
                  <p>{localizedProduct.description}</p>
                  {product.features && product.features.length > 0 && (
                    <div className="mt-3 bg-[#f1f6ee] p-3 rounded-xl border border-[#d6e5d2]">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#18281b] mb-2">
                        {language === 'bn' ? 'বিশেষ বৈশিষ্ট্যসমূহ (Key Highlights):' : 'Key Highlights:'}
                      </h4>
                      <ul className="space-y-1 text-[12px]">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[15px] text-[#2d6636]">check_circle</span>
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
                  <div className="bg-[#f1f6ee] p-3 rounded-xl border border-[#d6e5d2] space-y-1.5">
                    <p>
                      <strong className="text-[#18281b]">{language === 'bn' ? 'ফেব্রিক ম্যাটেরিয়াল:' : 'Textile Composition:'}</strong>{' '}
                      {localizedProduct.fabric}
                    </p>
                    <p>
                      <strong className="text-[#18281b]">{language === 'bn' ? 'উৎস ও ঐতিহ্য:' : 'Artisanal Provenance:'}</strong>{' '}
                      {localizedProduct.origin}
                    </p>
                    <p className="text-[11px] text-[#2d6636] pt-0.5 font-medium">
                      {language === 'bn' ? 'সার্টিফায়েড প্রাকৃতিক ডাই ও ১০০% প্রিমিয়াম ফিনিশিং।' : 'Cradle-to-Cradle Gold & OEKO-TEX Standard 100 Certified Textile.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Care Instructions Tab */}
              {activeTab === 'care' && (
                <div className="space-y-2">
                  <p className="text-[12px] text-[#18281b] font-semibold">
                    {language === 'bn' ? 'পোশাকটি দীর্ঘস্থায়ী ও নতুন রাখার নির্দেশনা:' : 'Garment preservation guide:'}
                  </p>
                  <ul className="space-y-1.5 text-[12px]">
                    {product.careInstructions && product.careInstructions.length > 0 ? (
                      product.careInstructions.map((inst, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#2d6636] shrink-0 mt-0.5">
                            dry_cleaning
                          </span>
                          <span>{inst}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#2d6636]">dry_cleaning</span>
                          <span>{language === 'bn' ? 'ড্রাই ওয়াশ অথবা ঠাণ্ডা পানিতে কোমলভাবে ধুয়ে নিন' : 'Dry clean or hand wash gently in cold water'}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#2d6636]">iron</span>
                          <span>{language === 'bn' ? 'হালকা তাপে উল্টো দিক থেকে আয়রন করুন' : 'Iron on reverse with low heat setting'}</span>
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
                    <span className="material-symbols-outlined text-[18px] text-[#2d6636] shrink-0">
                      local_shipping
                    </span>
                    <p>
                      <strong>{language === 'bn' ? 'ঢাকা মেট্রো এরিয়া:' : 'Dhaka Metro:'}</strong>{' '}
                      {language === 'bn'
                        ? '২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি। হোম ডেলিভারিতে পণ্য দেখে ক্যাশ অন ডেলিভারি (COD) পেমেন্ট করার সুবিধা রয়েছে।'
                        : 'Delivery within 24 to 48 hours. Cash on Delivery is available with doorstep review.'}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#2d6636] shrink-0">
                      distance
                    </span>
                    <p>
                      <strong>{language === 'bn' ? 'সমগ্র বাংলাদেশ:' : 'Nationwide Bangladesh:'}</strong>{' '}
                      {language === 'bn'
                        ? 'চট্টগ্রাম, সিলেট, রাজশাহীসহ ৬৪টি জেলায় ২ থেকে ৩ কর্মদিবসের মধ্যে নির্ভরযোগ্য কুরিয়ারে ডেলিভারি।'
                        : 'Delivery within 2-3 business days across 64 districts via premium couriers (Pathao/Steadfast).'}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#2d6636] shrink-0">
                      verified
                    </span>
                    <p className="text-[#2d6636] font-semibold">
                      {language === 'bn' ? '৭ দিনের সহজ সাইজ এক্সচেঞ্জ ও রিটার্ন পলিসি সুবিধা।' : '7-Day seamless size exchange & return policy.'}
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
        <div className="sticky bottom-0 z-30 bg-[#faf7eb] p-3 sm:p-4 border-t border-[#ded6be] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`h-12 px-3.5 rounded-xl border flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-[#fce4ec] border-[#f48fb1] text-[#c2185b]'
                  : 'bg-[#f1f6ee] border-[#d6e5d2] text-[#18281b] hover:bg-[#e7f0e3]'
              }`}
              title={isWishlisted ? (language === 'bn' ? 'উইশলিস্ট থেকে সরান' : 'Remove from Wishlist') : (language === 'bn' ? 'উইশলিস্টে রাখুন' : 'Save to Wishlist')}
              aria-label="Wishlist toggle"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider hidden sm:inline">
                {isWishlisted ? (language === 'bn' ? 'সেভ করা' : 'Saved') : (language === 'bn' ? 'উইশলিস্ট' : 'Wishlist')}
              </span>
            </button>

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-[#18281b] text-white hover:bg-[#2d6636] font-semibold text-[12px] sm:text-[13px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-xs cursor-pointer border border-[#18281b]"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>{t.addToBag}</span>
            </button>

            {/* Direct Buy (Buy Now) Button */}
            <button
              onClick={handleBuyNow}
              className="flex-1 h-12 bg-[#d6edd2] text-[#15381a] hover:bg-[#c7e7c2] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-xs cursor-pointer border border-[#bce4b6]"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>{t.buyNow} • {formatPrice(product.price * quantity)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
