import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Check,
  ShoppingBag,
  Zap,
  ArrowRight,
  X,
  ShieldCheck,
  Truck,
  RefreshCw,
  Package,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { findProductBySlug, getProductSlug, getCategorySlug } from '../utils/slug';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, t, localizeProduct, localizeCategory, formatPrice, formatNumber } = useLanguage();
  const { products, wishlistIds, toggleWishlist, addToCartWithOptions, showToast } = useStore();

  const product = slug ? findProductBySlug(slug, products) : undefined;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'care' | 'shipping'>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize selected size and color whenever product changes
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedSize(product.sizes[0] || '38 FR');
      setSelectedColor(product.colors[0] || 'Natural');
      setActiveTab('details');
      setShowSizeGuide(false);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 selection:bg-[#d6edd2] selection:text-[#18281b]">
        <div className="w-16 h-16 rounded-2xl bg-[#edf6eb] text-[#1b5e28] flex items-center justify-center mb-4 border border-[#badbb3] shadow-xs">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="font-display text-[26px] sm:text-[32px] font-black text-[#0f2113] tracking-tight mb-2">
          {language === 'bn' ? 'পোশাকটি খুঁজে পাওয়া যায়নি' : 'Product Not Found'}
        </h1>
        <p className="text-[14px] text-[#2d4530] max-w-md mb-8 leading-relaxed">
          {language === 'bn'
            ? 'আপনি যে পোশাকটির লিংক খুঁজছেন তা বর্তমানে স্টকে নেই অথবা লিংকটি পরিবর্তিত হয়েছে।'
            : 'The piece you are looking for is either no longer in current stock or the link has changed.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shop"
            className="px-6 py-3 bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-widest rounded-xl hover:bg-[#1a3820] transition-colors shadow-sm"
          >
            {language === 'bn' ? 'সকল পোশাক দেখুন' : 'Explore All Pieces'}
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-[#e7f0e3] text-[#0f2113] font-black text-[12px] uppercase tracking-widest rounded-xl hover:bg-[#d6e5d2] transition-colors border border-[#bedec0]"
          >
            {language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  const localizedProduct = localizeProduct(product);
  const isWishlisted = wishlistIds.includes(product.id);
  const imageGallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const catSlug = getCategorySlug(product.category);

  // Related products from the same or complementary category
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? imageGallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === imageGallery.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCartWithOptions(product, selectedSize, selectedColor, quantity);
  };

  const handleDirectBuy = () => {
    addToCartWithOptions(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast(language === 'bn' ? 'পোশাকের লিংক কপি হয়েছে।' : 'Direct product URL copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="w-full pb-20 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* 1. BREADCRUMBS NAVIGATION */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#35523a] mb-5 overflow-x-auto no-scrollbar py-1"
      >
        <Link to="/" className="hover:text-[#0f2113] hover:underline whitespace-nowrap">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <Link to="/shop" className="hover:text-[#0f2113] hover:underline whitespace-nowrap">
          {language === 'bn' ? 'শপ' : 'Shop'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <Link
          to={`/category/${catSlug}`}
          className="hover:text-[#0f2113] hover:underline whitespace-nowrap text-[#1a5327]"
        >
          {localizeCategory(product.category)}
        </Link>
        <span className="text-[#96b499]">•</span>
        <span className="text-[#0f2113] font-black truncate max-w-[200px] sm:max-w-none">
          {localizedProduct.name}
        </span>
      </nav>

      {/* 2. MAIN PRODUCT PRESENTATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: IMAGE GALLERY (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Large Stage Image */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] md:aspect-[4/5] bg-[#edf4ea] rounded-2xl overflow-hidden shadow-[0_6px_25px_rgba(24,40,27,0.06)] border border-[#bedec0] group">
            <img
              src={imageGallery[selectedImageIndex]}
              alt={`${localizedProduct.name} - View ${selectedImageIndex + 1}`}
              className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-103"
            />

            {/* Gallery Navigation Overlay Arrows */}
            {imageGallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Top Badges */}
            <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
              {product.tag && (
                <span className="bg-[#0f2113]/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs">
                  {product.tag === 'Best Seller'
                    ? t.tagBestSeller
                    : product.tag === 'Limited'
                    ? t.tagLimited
                    : product.tag === 'New'
                    ? t.tagNew
                    : product.tag}
                </span>
              )}
              <span className="bg-white/90 text-[#0f2113] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-[#bedec0] shadow-xs">
                {localizeCategory(product.category)}
              </span>
            </div>

            {/* Action Top Right: Copy Share Link & Wishlist */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                title={language === 'bn' ? 'লিংক কপি করুন' : 'Copy Direct Link'}
                aria-label="Copy share link"
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#0f2113] backdrop-blur-md border border-[#bedec0] flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#1b5e28]" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle Wishlist"
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border shadow-xs cursor-pointer active:scale-90 transition-all ${
                  isWishlisted
                    ? 'bg-[#d6edd2] border-[#aed6a3] text-[#15381a]'
                    : 'bg-white/90 border-[#bedec0] text-[#0f2113] hover:bg-white'
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted ? 'fill-[#1b5e28] text-[#1b5e28]' : 'text-[#0f2113]'
                  }`}
                />
              </button>
            </div>

            {/* Bottom Image Counter */}
            <div className="absolute bottom-3.5 right-3.5 bg-black/60 text-white text-[11px] font-black px-3 py-1 rounded-full backdrop-blur-md">
              {formatNumber(selectedImageIndex + 1)} / {formatNumber(imageGallery.length)}
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          {imageGallery.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {imageGallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#0f2113] ring-2 ring-[#0f2113]/30 scale-102'
                      : 'border-[#bedec0] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Editorial Atelier Textile Provenance Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#edf6eb] border border-[#b8dab2] flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-[#13461d] text-[12px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#1b5e28]" />
              <span>{language === 'bn' ? 'উৎপত্তি ও কাপড়ের মান' : 'Provenance & Craftsmanship'}</span>
            </div>
            <p className="text-[13px] text-[#1f3823] font-medium leading-relaxed">
              {localizedProduct.origin} • {localizedProduct.fabric}
            </p>
            {product.modelStats && (
              <p className="text-[12px] text-[#335639] italic">
                {product.modelStats}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT PURCHASING & SPECIFICATIONS (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1b5e28]">
                {localizeCategory(product.category)}
              </span>
              {product.stockCount ? (
                <span className="text-[11px] font-bold text-[#144f20] bg-[#d7edd4] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-[#bedeb8]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf50] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2e7d32]"></span>
                  </span>
                  {language === 'bn'
                    ? `স্টকে মাত্র ${formatNumber(product.stockCount)}টি অবশিষ্ট`
                    : `Only ${product.stockCount} pieces left`}
                </span>
              ) : null}
            </div>

            <h1 className="font-display text-[26px] sm:text-[32px] font-black text-[#0b1b0e] leading-tight tracking-tight">
              {localizedProduct.name}
            </h1>

            <p className="text-[14px] text-[#2b4d32] font-semibold mt-1">
              {localizedProduct.subtitle}
            </p>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3 mt-3.5">
              <span className="text-[28px] sm:text-[32px] font-black text-[#0a190d] tracking-tight">
                {formatPrice(product.price)}
              </span>
              <span className="text-[12px] font-bold uppercase text-[#1a5327] bg-[#d9eed6] px-2.5 py-0.5 rounded-md border border-[#b2d6ae]">
                {language === 'bn' ? 'ভ্যাট অন্তর্ভুক্ত' : 'VAT Included'}
              </span>
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-[13.5px] text-[#1e3b24] leading-relaxed font-medium">
            {localizedProduct.description}
          </p>

          {/* COLOR SELECTOR */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1b5e28]">
                  {language === 'bn' ? 'রঙ / শেড:' : 'Color Palette:'}
                </span>
                <span className="text-[12px] font-bold text-[#0f2113]">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((clr) => (
                  <button
                    key={clr}
                    type="button"
                    onClick={() => setSelectedColor(clr)}
                    className={`px-3.5 py-1.5 rounded-xl text-[11.5px] font-bold transition-all border cursor-pointer ${
                      selectedColor === clr
                        ? 'bg-[#0f2113] text-white border-[#0f2113] shadow-xs'
                        : 'bg-[#edf6eb] text-[#1e3c23] border-[#bedec0] hover:border-[#1b5e28]'
                    }`}
                  >
                    {clr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1b5e28]">
                  {language === 'bn' ? 'সাইজ নির্বাচন করুন:' : 'Select Size:'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[11.5px] font-black text-[#1b5e28] underline hover:text-[#0f2113] cursor-pointer"
                >
                  {language === 'bn' ? 'সাইজ গাইড ↗' : 'Size Guide ↗'}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`h-11 rounded-xl text-[12px] font-black transition-all border flex items-center justify-center cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#0f2113] text-white border-[#0f2113] shadow-xs scale-102'
                        : 'bg-white text-[#15341c] border-[#badbb3] hover:border-[#1b5e28]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY AND DIRECT BUY / ADD TO BAG ACTIONS */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center h-12 bg-white border border-[#badbb3] rounded-xl px-2 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#0f2113] font-black text-[16px] hover:bg-[#edf6eb] rounded-lg cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center text-[14px] font-black text-[#0f2113]">
                  {formatNumber(quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#0f2113] font-black text-[16px] hover:bg-[#edf6eb] rounded-lg cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-12 rounded-xl bg-[#0f2113] hover:bg-[#1a3d21] text-white font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'bn' ? 'শপিং ব্যাগে যুক্ত করুন' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Direct Buy Now Button */}
            <button
              type="button"
              onClick={handleDirectBuy}
              className="w-full h-12 rounded-xl bg-[#d4ebd0] hover:bg-[#c2e4bc] text-[#0a1a0c] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-[#9fd099] shadow-xs active:scale-98 transition-all"
            >
              <Zap className="w-4 h-4 text-[#165020]" />
              <span>{language === 'bn' ? 'সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)' : 'Instant Buy (Cash On Delivery)'}</span>
            </button>
          </div>

          {/* 3-KEY ATELIER VALUE PILLARS */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#bedec0] text-center">
            <div className="p-2.5 bg-[#edf6eb] rounded-xl border border-[#c4e0c0]">
              <Truck className="w-4 h-4 mx-auto text-[#1b5e28] mb-1" />
              <p className="text-[10px] font-black text-[#0f2113]">{t.trustDelivery}</p>
              <p className="text-[9px] text-[#335639]">{t.trustDeliverySub}</p>
            </div>
            <div className="p-2.5 bg-[#edf6eb] rounded-xl border border-[#c4e0c0]">
              <ShieldCheck className="w-4 h-4 mx-auto text-[#1b5e28] mb-1" />
              <p className="text-[10px] font-black text-[#0f2113]">{t.trustCod}</p>
              <p className="text-[9px] text-[#335639]">{t.trustCodSub}</p>
            </div>
            <div className="p-2.5 bg-[#edf6eb] rounded-xl border border-[#c4e0c0]">
              <RefreshCw className="w-4 h-4 mx-auto text-[#1b5e28] mb-1" />
              <p className="text-[10px] font-black text-[#0f2113]">{t.trustReturn}</p>
              <p className="text-[9px] text-[#335639]">{t.trustReturnSub}</p>
            </div>
          </div>

          {/* TABBED SPECIFICATIONS & ATELIER NOTES */}
          <div className="pt-2">
            <div className="flex border-b border-[#bedec0] gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-2 text-[12px] font-black uppercase tracking-wider cursor-pointer transition-colors border-b-2 ${
                  activeTab === 'details'
                    ? 'border-[#0f2113] text-[#0f2113]'
                    : 'border-transparent text-[#426148] hover:text-[#0f2113]'
                }`}
              >
                {language === 'bn' ? 'বিবরণ' : 'Details'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`pb-2 text-[12px] font-black uppercase tracking-wider cursor-pointer transition-colors border-b-2 ${
                  activeTab === 'specs'
                    ? 'border-[#0f2113] text-[#0f2113]'
                    : 'border-transparent text-[#426148] hover:text-[#0f2113]'
                }`}
              >
                {language === 'bn' ? 'ফেব্রিক' : 'Textile'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={`pb-2 text-[12px] font-black uppercase tracking-wider cursor-pointer transition-colors border-b-2 ${
                  activeTab === 'care'
                    ? 'border-[#0f2113] text-[#0f2113]'
                    : 'border-transparent text-[#426148] hover:text-[#0f2113]'
                }`}
              >
                {language === 'bn' ? 'যত্ন' : 'Care'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 text-[12px] font-black uppercase tracking-wider cursor-pointer transition-colors border-b-2 ${
                  activeTab === 'shipping'
                    ? 'border-[#0f2113] text-[#0f2113]'
                    : 'border-transparent text-[#426148] hover:text-[#0f2113]'
                }`}
              >
                {language === 'bn' ? 'ডেলিভারি' : 'Delivery'}
              </button>
            </div>

            <div className="pt-3 text-[12.5px] leading-relaxed text-[#1f3b25]">
              {activeTab === 'details' && (
                <ul className="space-y-1.5">
                  {localizedProduct.features && localizedProduct.features.length > 0 ? (
                    localizedProduct.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#1b5e28] font-black">•</span>
                        <span>{feat}</span>
                      </li>
                    ))
                  ) : (
                    <li>{localizedProduct.description}</li>
                  )}
                </ul>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-[#0f2113]">
                      {language === 'bn' ? 'উপাদান / কম্পোজিশন:' : 'Textile Composition:'}
                    </span>
                    <p className="mt-0.5 text-[#2b4c30]">{localizedProduct.fabric}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#0f2113]">
                      {language === 'bn' ? 'অঁতেলিয়ে উৎস:' : 'Atelier Provenance:'}
                    </span>
                    <p className="mt-0.5 text-[#2b4c30]">{localizedProduct.origin}</p>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <ul className="space-y-2">
                  {localizedProduct.careInstructions && localizedProduct.careInstructions.length > 0 ? (
                    localizedProduct.careInstructions.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#1b5e28] font-black">•</span>
                        <span>{c}</span>
                      </li>
                    ))
                  ) : (
                    <li>
                      {language === 'bn'
                        ? 'ড্রাই ক্লিন অথবা ঠান্ডা পানিতে কোমল ওয়াশ করুন।'
                        : 'Specialist dry clean or delicate cold handwash recommended.'}
                    </li>
                  )}
                </ul>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>
                    <strong>{language === 'bn' ? 'ঢাকা সিটি:' : 'Dhaka City:'}</strong>{' '}
                    {language === 'bn'
                      ? '২৪ থেকে ৪৮ ঘণ্টার মধ্যে এক্সপ্রেস হোম ডেলিভারি।'
                      : 'Express 24-48 hours doorstep dispatch.'}
                  </p>
                  <p>
                    <strong>{language === 'bn' ? 'সমগ্র বাংলাদেশ:' : 'Nationwide 64 Districts:'}</strong>{' '}
                    {language === 'bn'
                      ? '২-৩ কার্যদিবসে ক্যাশ অন ডেলিভারি (COD) সুবিধা।'
                      : '2-3 business days with Cash on Delivery option.'}
                  </p>
                  <p>
                    <strong>{language === 'bn' ? 'সাইজ পরিবর্তন:' : 'Exchanges:'}</strong>{' '}
                    {language === 'bn'
                      ? '৭ দিনের মধ্যে যেকোনো সাইজ ফ্রি এক্সচেঞ্জ করার সুযোগ।'
                      : 'Complimentary 7-day size and silhouette replacement.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. RELATED PIECES SHOWCASE */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-10 border-t border-[#bedec0]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1b5e28]">
                {language === 'bn' ? 'সম্পূরক কালেকশন' : 'Complementary Pieces'}
              </span>
              <h2 className="font-display text-[22px] sm:text-[26px] font-black text-[#0b1b0e]">
                {language === 'bn' ? 'আপনার জন্য নির্বাচিত' : 'You May Also Admire'}
              </h2>
            </div>
            <Link
              to={`/category/${catSlug}`}
              className="text-[12px] font-black text-[#1b5e28] uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'আরও দেখুন' : 'Explore Category'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((relProd) => {
              const locRel = localizeProduct(relProd);
              const relSlug = getProductSlug(relProd);
              return (
                <Link
                  key={relProd.id}
                  to={`/product/${relSlug}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#bedec0] shadow-xs hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[3/4] bg-[#edf4ea] overflow-hidden">
                    <img
                      src={relProd.image}
                      alt={locRel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {relProd.tag && (
                      <span className="absolute top-2 left-2 bg-[#0f2113]/90 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {relProd.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#1b5e28]">
                        {localizeCategory(relProd.category)}
                      </span>
                      <h3 className="font-display text-[14px] font-bold text-[#0f2113] line-clamp-1 group-hover:text-[#1b5e28] transition-colors">
                        {locRel.name}
                      </h3>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#edf4ea] flex items-center justify-between">
                      <span className="text-[13px] font-black text-[#0f2113]">
                        {formatPrice(relProd.price)}
                      </span>
                      <span className="text-[10px] font-bold text-[#1b5e28] uppercase">
                        {language === 'bn' ? 'দেখুন →' : 'View →'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. MOBILE STICKY FLOATING BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#faf7eb]/95 backdrop-blur-xl border-t border-[#bedec0] p-3 md:hidden shadow-[0_-4px_20px_rgba(24,40,27,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 h-11 rounded-xl bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{language === 'bn' ? 'ব্যাগে যোগ' : 'Add to Bag'}</span>
          </button>

          <button
            type="button"
            onClick={handleDirectBuy}
            className="flex-1 h-11 rounded-xl bg-[#d4ebd0] text-[#0a1a0c] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border border-[#a2cf9d] active:scale-95 transition-all shadow-xs"
          >
            <Zap className="w-4 h-4 text-[#134e1f]" />
            <span>{language === 'bn' ? 'অর্ডার করুন' : 'Buy Now'}</span>
          </button>
        </div>
      </div>

      {/* 5. SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div
          onClick={() => setShowSizeGuide(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#faf7eb] text-[#0f2113] rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#bedec0] flex flex-col gap-4 relative"
          >
            <div className="flex items-start justify-between border-b border-[#bedec0] pb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#1b5e28]">
                  {language === 'bn' ? 'প্যারিসিয়ান ও আন্তর্জাতিক সাইজিং' : 'Parisian & Atelier Sizing'}
                </p>
                <h3 className="font-display text-[20px] font-black text-[#0f2113]">
                  {language === 'bn' ? 'সাইজ ও মেজারমেন্ট গাইড' : 'Garment Size Conversion'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="w-8 h-8 rounded-full bg-[#edf6eb] flex items-center justify-center text-[#0f2113] hover:bg-[#dcefe0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[12px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#edf6eb] border-b border-[#bedec0] text-[#1b5e28] font-black uppercase tracking-wider">
                    <th className="p-2.5">FR / EU</th>
                    <th className="p-2.5">International</th>
                    <th className="p-2.5">Bust (Inches)</th>
                    <th className="p-2.5">Waist (Inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bedec0]/60 text-[#1f3b25]">
                  <tr>
                    <td className="p-2.5 font-bold">34 FR</td>
                    <td className="p-2.5">XS</td>
                    <td className="p-2.5">32–33&quot;</td>
                    <td className="p-2.5">24–25&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">36 FR</td>
                    <td className="p-2.5">S</td>
                    <td className="p-2.5">34–35&quot;</td>
                    <td className="p-2.5">26–27&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">38 FR</td>
                    <td className="p-2.5">M</td>
                    <td className="p-2.5">36–37&quot;</td>
                    <td className="p-2.5">28–29&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">40 FR</td>
                    <td className="p-2.5">L</td>
                    <td className="p-2.5">38–39&quot;</td>
                    <td className="p-2.5">30–31&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">42 FR</td>
                    <td className="p-2.5">XL</td>
                    <td className="p-2.5">40–42&quot;</td>
                    <td className="p-2.5">32–34&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11.5px] text-[#2c4e31] leading-relaxed italic bg-[#edf6eb] p-3 rounded-xl border border-[#bedec0]">
              {language === 'bn'
                ? '💡 পরামর্শ: আমাদের কোট ও ট্রেনচ আধুনিক রিল্যাক্সড স্লোপ শোল্ডার কাট। পারফেক্ট ড্রপের জন্য আপনার স্বাভাবিক সাইজই অর্ডার করুন।'
                : '💡 Tip: ELIF coats and outerwear are cut with relaxed sloping shoulders. Choose your true size for the intended fluid runway silhouette.'}
            </p>

            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2.5 bg-[#0f2113] text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:bg-[#1a3820] transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'বুঝেছি' : 'Understood'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
