import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { getProductSlug } from '../utils/slug';

interface CategoriesScreenProps {
  initialCategory?: string;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
  onShowToast: (message: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  initialCategory,
  wishlistIds,
  onToggleWishlist,
  onQuickAddToCart,
  onOpenProductDetail,
  onShowToast,
}) => {
  const navigate = useNavigate();
  const { language, t, localizeCategory, localizeProduct, formatPrice, formatNumber } =
    useLanguage();
  const { products, categories } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' ||
      p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      activeCategory.toLowerCase().includes(p.category.toLowerCase());

    return matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex flex-col w-full px-1.5 sm:px-4 pt-1 sm:pt-2 pb-16 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* Screen Title */}
      <div className="mb-4 sm:mb-5 px-1 sm:px-0">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-[#1b5e28] block">
          {language === 'bn' ? 'অঁতেলিয়ে ক্যাটালগ' : 'Haute Catalog'}
        </span>
        <h1 className="font-display font-black text-[24px] sm:text-[34px] text-[#0a180d] tracking-[-0.02em] mt-0.5">
          {language === 'bn' ? 'পোশাকের বিভাগসমূহ' : 'Curated Departments'}
        </h1>
        <p className="text-[12.5px] sm:text-[14.5px] text-[#1c3821] max-w-xl mt-1 font-bold leading-relaxed">
          {language === 'bn'
            ? 'আপনার অ্যাডমিন প্যানেল থেকে আপলোড করা সমস্ত কালেকশন ও পোশাক।'
            : 'Explore architectural cuts and timeless silhouettes.'}
        </p>
      </div>

      {/* Category Pills & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1 sm:px-0">
        <div
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scroll-smooth no-scrollbar"
          style={{ scrollPaddingLeft: '0.5rem', scrollPaddingRight: '0.5rem' }}
        >
          {['All', ...categories.map((c) => c.name)].map((catName) => {
            const isSelected = activeCategory === catName;
            const displayLabel = catName === 'All' ? t.categoryAll : localizeCategory(catName);
            return (
              <button
                key={catName}
                onClick={() => setActiveCategory(catName)}
                className={`shrink-0 h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl text-[11px] sm:text-[11.5px] font-black uppercase tracking-wider flex items-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f2113] text-white shadow-sm border border-[#0f2113]'
                    : 'bg-[#eaf3e7] text-[#0f2113] hover:bg-[#dcefe0] border border-[#c4e0c0]'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-[#3a4d3d]">
            {t.sortBy}:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white text-[#18281b] text-[10.5px] sm:text-[11px] font-bold py-1.5 px-2.5 rounded-lg border border-[#c8dac4] focus:outline-none cursor-pointer"
          >
            <option value="featured">{t.sortFeatured}</option>
            <option value="price-asc">{t.sortPriceLow}</option>
            <option value="price-desc">{t.sortPriceHigh}</option>
          </select>
        </div>
      </div>

      {/* Product Grid (PC Responsive 4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 mb-10 px-1 sm:px-0">
        {filteredProducts.map((product) => {
          const localized = localizeProduct(product);
          const isWishlisted = wishlistIds.includes(product.id);
          const tagLabel =
            product.tag === 'Best Seller'
              ? t.tagBestSeller
              : product.tag === 'Limited'
              ? t.tagLimited
              : product.tag === 'New'
              ? t.tagNew
              : product.tag === 'Archive'
              ? t.tagArchive
              : product.tag;

            const prodSlug = getProductSlug(product);
            const handleCardClick = () => {
              if (onOpenProductDetail) {
                onOpenProductDetail(product);
              } else {
                navigate(`/product/${prodSlug}`);
              }
            };

            return (
              <div
                key={product.id}
                onClick={handleCardClick}
                className="flex flex-col bg-[#f1f6ee] rounded-2xl overflow-hidden shadow-xs border border-[#d6e5d2] group transition-all hover:shadow-md hover:border-[#2d6636]/40 cursor-pointer"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#e7f0e3]">
                  <img
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    src={product.image}
                    alt={product.alt}
                    loading="lazy"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    aria-label={`Toggle wishlist for ${localized.name}`}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform shadow-xs cursor-pointer ${
                      isWishlisted ? 'text-[#2d6636]' : 'text-[#18281b]'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isWishlisted ? 'fill-[#2d6636] text-[#2d6636]' : 'text-[#18281b]'
                      }`}
                    />
                  </button>

                  {product.tag && (
                    <span
                      className={`absolute bottom-2 left-2 text-[8.5px] sm:text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold ${
                        product.tag === 'Best Seller'
                          ? 'bg-[#d6edd2] text-[#15381a] border border-[#bce4b6]'
                          : 'bg-[#18281b]/85 text-white backdrop-blur-sm'
                      }`}
                    >
                      {tagLabel}
                    </span>
                  )}
                </div>

                <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between bg-white/50">
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px] text-[#1b5e28] uppercase tracking-wider font-black mb-1">
                      <span className="truncate">{localized.category}</span>
                      <span className="shrink-0 text-[#15461e] font-black bg-[#d6edd2] px-1 py-0.2 rounded-xs text-[8px] sm:text-[8.5px]">
                        COD
                      </span>
                    </div>
                    <h3
                      className="font-display font-black text-[13.5px] sm:text-[15.5px] text-[#0a180d] leading-snug truncate hover:text-[#2d6636] transition-colors"
                    >
                      {localized.name}
                    </h3>
                    <p className="text-[11px] sm:text-[12px] text-[#224027] mt-0.5 line-clamp-1 font-bold">
                      {localized.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 sm:pt-2.5 border-t border-[#cee2cb] mt-2 flex items-center justify-between gap-1">
                    <div className="min-w-0">
                      <span className="text-[8.5px] sm:text-[9.5px] text-[#305335] block uppercase tracking-wider leading-none font-black">
                        {language === 'bn' ? 'মূল্য' : 'Price'}
                      </span>
                      <span className="text-[13.5px] sm:text-[16px] font-black text-[#09150c] tracking-tight block truncate">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenProductDetail) {
                          onOpenProductDetail(product);
                        } else {
                          navigate(`/product/${prodSlug}`);
                        }
                      }}
                      className="h-7 sm:h-8.5 px-2.5 sm:px-3 rounded-lg bg-[#0f2113] text-white hover:bg-[#1b5e28] font-black text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all shadow-2xs shrink-0 cursor-pointer"
                      aria-label={`View ${localized.name}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'দেখুন' : 'View'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-16 text-center bg-[#f1f6ee] rounded-xl border border-[#d6e5d2] p-6">
          <p className="font-display text-[20px] text-[#18281b] mb-2">
            {t.noResults}
          </p>
          <p className="text-[13px] text-[#3a4d3d] mb-4">
            {language === 'bn'
              ? 'অন্য কোনো ফেব্রিক বা বিভাগ নির্বাচন করে পুনরায় চেষ্টা করুন।'
              : 'Try resetting your material or category selection.'}
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
            }}
            className="h-10 px-5 rounded-lg bg-[#2d6636] text-white text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
          >
            {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
