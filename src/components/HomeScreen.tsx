import React, { useState } from 'react';
import {
  HERO_SLIDES,
  CATEGORIES,
  PRODUCTS,
  COMMUNITY_POSTS,
} from '../data/catalog';
import { Product, TabType } from '../types';

interface HomeScreenProps {
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
  onOpenStory: () => void;
  onNavigateTab: (tab: TabType, categoryFilter?: string) => void;
  onShowToast: (message: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  wishlistIds,
  onToggleWishlist,
  onQuickAddToCart,
  onOpenProductDetail,
  onOpenStory,
  onNavigateTab,
  onShowToast,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('Women');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    info: false,
    concierge: false,
    policies: false,
  });
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    } else if (diff < -40) {
      setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
    setTouchStartX(null);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      onShowToast('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    onShowToast('Welcome to the Private Salon. Lookbook sent to your inbox.');
    setEmailInput('');
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <div className="flex flex-col w-full selection:bg-[#ffdeaa] selection:text-[#271900]">
      {/* 1. HERO CAMPAIGN SECTION */}
      <section className="relative w-full px-4 mb-10 pt-2">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full aspect-[3/4] max-h-[580px] rounded-xl overflow-hidden shadow-sm bg-[#f3ede3] transition-all duration-500 touch-pan-y"
        >
          <img
            className="w-full h-full object-cover object-center transition-all duration-700"
            src={currentSlide.image}
            alt={currentSlide.alt}
          />
          {/* Editorial Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

          {/* Campaign Copy & Hero CTA */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex flex-col items-start gap-2 text-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffdeaa]">
              {currentSlide.collection}
            </span>
            <h1 className="font-display text-[26px] sm:text-[32px] text-white tracking-tight leading-tight">
              {currentSlide.title}
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#f3ede3] line-clamp-2 max-w-[320px] opacity-95">
              {currentSlide.subtitle}
            </p>
            <div className="pt-2 w-full">
              <button
                id="hero-shop-campaign-btn"
                onClick={() => onNavigateTab('categories')}
                aria-label={currentSlide.cta}
                className="w-full h-12 bg-[#ffc55f] text-[#755100] hover:bg-[#ffdeaa] font-semibold text-[13px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md cursor-pointer"
                type="button"
              >
                <span>{currentSlide.cta}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Dot Carousel Indicators */}
        <div
          aria-label="Hero Carousel Navigation"
          className="flex items-center justify-center gap-1 mt-3"
        >
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="p-2 cursor-pointer flex items-center justify-center"
            >
              <span
                className={`transition-all duration-300 block ${
                  currentSlideIndex === idx
                    ? 'w-6 h-1.5 rounded-full bg-[#7d5700]'
                    : 'w-1.5 h-1.5 rounded-full bg-[#cec5bd] hover:bg-[#7d766f]'
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* 2. HORIZONTAL SCROLLING CATEGORY CHIPS */}
      <section aria-label="Quick Category Filter" className="w-full mb-10">
        <div
          className="flex items-center gap-2 overflow-x-auto px-4 scroll-smooth no-scrollbar"
          style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
        >
          {[
            { label: 'Women', key: 'Women' },
            { label: 'Men', key: 'Men' },
            { label: 'New In', key: 'New In' },
            { label: 'Sale', key: 'Sale', hasDot: true },
            { label: 'Accessories', key: 'Accessories' },
            { label: 'Footwear', key: 'Footwear' },
            { label: 'Kids', key: 'Kids' },
          ].map((chip) => {
            const isSelected = selectedFilter === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => {
                  setSelectedFilter(chip.key);
                  if (chip.key === 'Sale' || chip.key === 'New In') {
                    onShowToast(`Filtered by ${chip.label}`);
                  }
                }}
                className={`shrink-0 h-9 px-4 rounded-full text-[11px] font-semibold uppercase tracking-wider flex items-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#ffc55f] text-[#755100] shadow-sm'
                    : 'bg-[#f3ede3] text-[#1d1b15] hover:bg-[#ede7dd]'
                }`}
              >
                {chip.hasDot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7d5700] mr-1.5" />
                )}
                {chip.label}
              </button>
            );
          })}
          <div className="w-2 shrink-0" aria-hidden="true" />
        </div>
      </section>

      {/* 3. 'SHOP BY CATEGORY' 2x3 GRID */}
      <section className="w-full px-4 mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7d5700]">
              Curated Catalog
            </p>
            <h2 className="font-display text-[26px] text-[#1d1b15] tracking-tight">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('categories')}
            className="text-[11px] font-semibold uppercase tracking-wider text-[#7d5700] underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
          >
            Index
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateTab('categories', cat.name)}
              className="group flex flex-col bg-[#f3ede3] rounded-xl overflow-hidden shadow-sm transition-all duration-300 active:scale-[0.99] cursor-pointer border border-[#e8e2d8]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#ede7dd] relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={cat.image}
                  alt={cat.alt}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="p-3 flex flex-col justify-between">
                <h3 className="text-[15px] font-semibold text-[#1d1b15] leading-tight group-hover:text-[#7d5700] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[12px] text-[#4b4640] mt-0.5">
                  {cat.piecesCount} pieces
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CAMPAIGN STORY BLOCK */}
      <section className="w-full px-4 mb-12">
        <div className="bg-[#f9f3e9] border border-[#cec5bd]/40 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700] mb-1">
            The Atelier Dossier
          </span>
          <h2 className="font-display text-[22px] sm:text-[26px] text-[#1d1b15] max-w-[340px] mb-2 leading-snug">
            THE ARCHITECTURE OF SILK & LINEN
          </h2>
          <p className="text-[13px] text-[#4b4640] max-w-[320px] mb-5 leading-relaxed">
            Designed in Paris, crafted from heritage European textiles. Pure silhouettes made to outlast seasons.
          </p>

          {/* Full-width visual within block */}
          <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#ede7dd] shadow-inner mb-4 relative">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv7LsuZDvnjFdicVGsMw-FhDihCGLATc1-dkUmqP1y3BUl43XBe1dJxvVT7iHoghhkEiWvq9lQJ4bvddB7w9QkB8nlcA0as9qOLxtjmsA66aEFOOfNkqGhb7v0O1cVPAJZbWX7Gvcl3zA67sEIlS6zl_BFHUeX5jKmcUnyF5Y3HZdfo80-LWwDo9ExVjXhg0YCvXuxz5g099Sl3qAKR_DmOPKetHdxquopGMC4ZQvO4_uDQaxV__y7"
              alt="Cinematic fashion editorial banner capturing two models in fluid raw silk drapes and tailored linen walking in warm sunset glow."
              loading="lazy"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full justify-center max-w-md mx-auto">
            <button
              onClick={onOpenStory}
              className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#1d1b19] text-white text-[12px] font-semibold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform cursor-pointer hover:bg-[#7d5700] whitespace-nowrap"
            >
              Read Story
            </button>
            <button
              onClick={() => onShowToast('Atelier Runway Film now streaming.')}
              className="w-full sm:w-auto h-11 px-5 rounded-lg bg-[#f3ede3] text-[#1d1b15] text-[12px] font-semibold uppercase tracking-wider flex items-center justify-center hover:bg-[#ede7dd] active:scale-95 transition-colors cursor-pointer whitespace-nowrap border border-[#e8e2d8]"
            >
              View Atelier Film
            </button>
          </div>
        </div>
      </section>

      {/* 5. HORIZONTAL PRODUCT CAROUSEL WITH WISHLIST INTERACTION */}
      <section className="w-full mb-12">
        <div className="px-4 flex items-baseline justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7d5700]">
              Most Coveted
            </p>
            <h2 className="font-display text-[26px] text-[#1d1b15] tracking-tight">
              Autumn Essentials
            </h2>
          </div>
          <span className="text-[10px] text-[#4b4640] uppercase tracking-wider font-semibold">
            Swipe ›
          </span>
        </div>

        {/* Swipeable track with peek effect */}
        <div
          className="flex gap-3 overflow-x-auto px-4 scroll-smooth snap-x snap-mandatory no-scrollbar"
          style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
        >
          {PRODUCTS.slice(0, 4).map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="shrink-0 w-[240px] snap-start bg-[#f3ede3] rounded-xl p-2.5 flex flex-col shadow-sm border border-[#e8e2d8]"
              >
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-[#ede7dd] mb-3">
                  <img
                    onClick={() => onOpenProductDetail(product)}
                    className="w-full h-full object-cover cursor-pointer hover:scale-104 transition-transform duration-500"
                    src={product.image}
                    alt={product.alt}
                    loading="lazy"
                  />

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    aria-label={`Toggle wishlist for ${product.name}`}
                    className={`wishlist-btn absolute top-2 right-2 w-10 h-10 rounded-full bg-[#fff9ee]/85 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform shadow-sm cursor-pointer ${
                      isWishlisted ? 'text-[#7d5700]' : 'text-[#1d1b15]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px] transition-colors"
                      style={{
                        fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      favorite
                    </span>
                  </button>

                  {/* Badge */}
                  {product.tag && (
                    <span
                      className={`absolute bottom-2 left-2 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                        product.tag === 'Best Seller'
                          ? 'bg-[#ffc55f] text-[#755100]'
                          : 'bg-[#1d1b19]/80 backdrop-blur-sm text-white'
                      }`}
                    >
                      {product.tag}
                    </span>
                  )}
                </div>

                <div className="px-1 pb-1 flex flex-col flex-1">
                  <h3
                    onClick={() => onOpenProductDetail(product)}
                    className="text-[15px] font-semibold text-[#1d1b15] truncate cursor-pointer hover:text-[#7d5700] transition-colors"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[12px] text-[#4b4640] mb-2 truncate">{product.subtitle}</p>

                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-[16px] text-[#1d1b15] font-semibold">
                      {product.currency}
                      {product.price}
                    </span>

                    <button
                      onClick={() => onQuickAddToCart(product)}
                      aria-label={`Quick add ${product.name}`}
                      className="w-10 h-10 rounded-lg bg-[#e8e2d8] text-[#1d1b15] flex items-center justify-center active:bg-[#7d5700] active:text-white transition-colors cursor-pointer hover:bg-[#ffc55f] hover:text-[#755100]"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* End Card: Explore All */}
          <div
            onClick={() => onNavigateTab('categories')}
            className="shrink-0 w-[180px] snap-start bg-[#ede7dd] rounded-xl p-4 flex flex-col items-center justify-center text-center group active:scale-95 transition-transform shadow-sm cursor-pointer border border-[#e8e2d8]"
          >
            <div className="w-12 h-12 rounded-full bg-[#fff9ee] flex items-center justify-center text-[#1d1b15] mb-2 group-hover:bg-[#7d5700] group-hover:text-white transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
            </div>
            <span className="text-[15px] font-semibold text-[#1d1b15] mb-0.5">
              Explore All
            </span>
            <span className="text-[10px] text-[#4b4640] uppercase tracking-wider">
              (38 pieces)
            </span>
          </div>
          <div className="w-2 shrink-0" aria-hidden="true" />
        </div>
      </section>

      {/* 6. BRAND STATEMENT SECTION */}
      <section className="w-full px-4 mb-12">
        <div className="bg-[#ffffff] border border-[#e8e2d8] rounded-xl px-6 py-8 text-center shadow-sm relative overflow-hidden">
          <div className="w-12 h-0.5 bg-[#ffdeaa] mx-auto mb-4 rounded-full" />
          <blockquote className="font-display italic text-[18px] sm:text-[20px] text-[#1d1b15] leading-relaxed max-w-[340px] mx-auto mb-3">
            “Clothes that respect the architecture of the body and the quiet power of understated luxury.”
          </blockquote>
          <p className="text-[10px] text-[#4b4640] uppercase tracking-[0.2em] font-bold">
            Elif Manifesto • Paris
          </p>
        </div>
      </section>

      {/* 7. INSTAGRAM / UGC STRIP */}
      <section className="w-full mb-12">
        <div className="px-4 flex items-baseline justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7d5700]">
              Community
            </p>
            <h2 className="font-display text-[26px] text-[#1d1b15] tracking-tight">
              As seen on @elif
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold uppercase tracking-wider text-[#7d5700] flex items-center gap-0.5 hover:underline"
          >
            <span>Follow</span>
            <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
          </a>
        </div>

        {/* 4 aesthetic square street-style snaps */}
        <div
          className="flex gap-2 overflow-x-auto px-4 scroll-smooth no-scrollbar"
          style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
        >
          {COMMUNITY_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => onShowToast(`Post by ${post.author}: "${post.caption}"`)}
              className="shrink-0 w-36 aspect-square rounded-lg overflow-hidden bg-[#f3ede3] relative group shadow-sm cursor-pointer border border-[#e8e2d8]"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={post.image}
                alt={post.alt}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                <span className="material-symbols-outlined text-[20px]">visibility</span>
                <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">
                  {post.author}
                </span>
              </div>
            </div>
          ))}
          <div className="w-2 shrink-0" aria-hidden="true" />
        </div>
      </section>

      {/* 8. MOBILE ACCORDION FOOTER */}
      <footer className="w-full px-4 pb-12">
        <div className="bg-[#f3ede3] border border-[#e8e2d8] rounded-xl p-4 shadow-sm">
          {/* Accordion 1: Information */}
          <div className="border-b border-[#e8e2d8]/80 py-1">
            <button
              onClick={() => toggleAccordion('info')}
              aria-expanded={openAccordions.info}
              className="w-full h-12 flex items-center justify-between text-left font-semibold text-[15px] text-[#1d1b15] cursor-pointer"
              type="button"
            >
              <span>Information</span>
              <span className="material-symbols-outlined text-[20px] transition-transform duration-200">
                {openAccordions.info ? 'remove' : 'add'}
              </span>
            </button>
            {openAccordions.info && (
              <div className="pb-3 pl-1 flex flex-col gap-2.5 text-[13px] text-[#4b4640] animate-fadeIn">
                <button
                  onClick={() => onShowToast('ELIF: Founded in Paris, 2021. Built on heritage craftsmanship.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  About ELIF
                </button>
                <button
                  onClick={() => onShowToast('100% GOTS Organic Cotton, Master of Linen, Cradle-to-Cradle certification.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Sustainability & Traceability
                </button>
                <button
                  onClick={() => onShowToast('Featured in Vogue France, Monocle, and Architectural Digest.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Press & Editorial
                </button>
                <button
                  onClick={() => onShowToast('Atelier Parisian internships and design director positions open.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Careers
                </button>
              </div>
            )}
          </div>

          {/* Accordion 2: Customer Service */}
          <div className="border-b border-[#e8e2d8]/80 py-1">
            <button
              onClick={() => toggleAccordion('concierge')}
              aria-expanded={openAccordions.concierge}
              className="w-full h-12 flex items-center justify-between text-left font-semibold text-[15px] text-[#1d1b15] cursor-pointer"
              type="button"
            >
              <span>Customer Concierge</span>
              <span className="material-symbols-outlined text-[20px] transition-transform duration-200">
                {openAccordions.concierge ? 'remove' : 'add'}
              </span>
            </button>
            {openAccordions.concierge && (
              <div className="pb-3 pl-1 flex flex-col gap-2.5 text-[13px] text-[#4b4640] animate-fadeIn">
                <button
                  onClick={() => onShowToast('Concierge available 7 days a week: concierge@elif-paris.com')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Contact Concierge
                </button>
                <button
                  onClick={() => onNavigateTab('account')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Track Shipment
                </button>
                <button
                  onClick={() => onShowToast('Sizes reflect French sizing (FR). Relaxed silhouette draping.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Size & Fit Guide
                </button>
                <button
                  onClick={() => onShowToast('Atelier appointments available at 14 Rue Saint-Honoré, Paris.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Atelier FAQs
                </button>
              </div>
            )}
          </div>

          {/* Accordion 3: Policies */}
          <div className="border-b border-[#e8e2d8]/80 py-1">
            <button
              onClick={() => toggleAccordion('policies')}
              aria-expanded={openAccordions.policies}
              className="w-full h-12 flex items-center justify-between text-left font-semibold text-[15px] text-[#1d1b15] cursor-pointer"
              type="button"
            >
              <span>Policies & Legal</span>
              <span className="material-symbols-outlined text-[20px] transition-transform duration-200">
                {openAccordions.policies ? 'remove' : 'add'}
              </span>
            </button>
            {openAccordions.policies && (
              <div className="pb-3 pl-1 flex flex-col gap-2.5 text-[13px] text-[#4b4640] animate-fadeIn">
                <button
                  onClick={() => onShowToast('Complimentary DHL Express on all orders over €200.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Shipping & Delivery
                </button>
                <button
                  onClick={() => onShowToast('Prepaid return label enclosed in your monogrammed parcel.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Complimentary Returns
                </button>
                <button
                  onClick={() => onShowToast('Terms of Service: ELIF Luxury Studio SAS Paris.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => onShowToast('GDPR compliant data protection.')}
                  className="text-left hover:text-[#1d1b15]"
                >
                  Privacy Statement
                </button>
              </div>
            )}
          </div>

          {/* Newsletter Signup Micro-Module */}
          <div className="mt-4 p-4 bg-[#f9f3e9] rounded-lg border border-[#e8e2d8]">
            <p className="font-semibold text-[15px] text-[#1d1b15] mb-1">
              Join the Private Salon
            </p>
            <p className="text-[12px] text-[#4b4640] mb-3 leading-relaxed">
              Receive preview access to seasonal releases and monographic lookbooks.
            </p>
            {isSubscribed ? (
              <div className="p-3 bg-[#e8e2d8] rounded-lg text-[12px] font-semibold text-[#7d5700] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>You are subscribed to the Private Salon lookbook.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 min-w-0 h-11 px-3 rounded-lg bg-[#ffffff] border border-[#cec5bd] text-[#1d1b15] text-[13px] placeholder:text-[#4b4640]/60 focus:outline-none focus:ring-1 focus:ring-[#7d5700]"
                  placeholder="Enter email address"
                  type="email"
                />
                <button
                  className="h-11 px-4 rounded-lg bg-[#1d1b19] text-white text-[11px] font-semibold uppercase tracking-wider active:scale-95 transition-transform cursor-pointer hover:bg-[#7d5700] shrink-0"
                  type="submit"
                >
                  Join
                </button>
              </form>
            )}
          </div>

          {/* Social Channels */}
          <div className="flex items-center justify-center gap-4 mt-6 mb-4 text-[#1d1b15]">
            <a
              aria-label="Instagram"
              className="w-11 h-11 rounded-full bg-[#ffffff] border border-[#e8e2d8] flex items-center justify-center hover:text-[#7d5700] transition-colors shadow-sm"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
              </svg>
            </a>

            <a
              aria-label="Pinterest"
              className="w-11 h-11 rounded-full bg-[#ffffff] border border-[#e8e2d8] flex items-center justify-center hover:text-[#7d5700] transition-colors shadow-sm"
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.19-.33 1.353-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"></path>
              </svg>
            </a>

            <a
              aria-label="TikTok"
              className="w-11 h-11 rounded-full bg-[#ffffff] border border-[#e8e2d8] flex items-center justify-center hover:text-[#7d5700] transition-colors shadow-sm"
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.18 2.09 2.35 2.27.9.15 1.86-.04 2.59-.59.71-.52 1.12-1.35 1.17-2.23.07-3.99.04-7.98.05-11.97z"></path>
              </svg>
            </a>
          </div>

          {/* Payment Gateways Badge Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 py-2 text-[#4b4640] text-[10px] uppercase tracking-widest opacity-80">
            <span className="px-2 py-1 rounded bg-[#ffffff] border border-[#e8e2d8]">Apple Pay</span>
            <span className="px-2 py-1 rounded bg-[#ffffff] border border-[#e8e2d8]">Visa</span>
            <span className="px-2 py-1 rounded bg-[#ffffff] border border-[#e8e2d8]">Mastercard</span>
            <span className="px-2 py-1 rounded bg-[#ffffff] border border-[#e8e2d8]">Klarna</span>
            <span className="px-2 py-1 rounded bg-[#ffffff] border border-[#e8e2d8]">Amex</span>
          </div>

          {/* Copyright */}
          <div className="text-center pt-3 text-[#4b4640] text-[10px] tracking-wider uppercase font-medium">
            © 2025 ELIF STUDIO. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};
