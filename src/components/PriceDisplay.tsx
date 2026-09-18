import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'stacked' | 'horizontal' | 'detail';
  showDiscountBadge?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  size = 'md',
  layout = 'stacked',
  showDiscountBadge = false,
  className = '',
}) => {
  const { formatPrice, language } = useLanguage();

  const hasDiscount =
    typeof compareAtPrice === 'number' &&
    compareAtPrice > price &&
    price > 0;

  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // Sizing definitions
  const sizeClasses = {
    sm: {
      current: 'text-[13px] font-black text-[#0f2113]',
      compare: 'text-[10.5px] line-through text-[#829985] font-medium',
      badge: 'text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#ffebd6] text-[#b44300]',
    },
    md: {
      current: 'text-[14.5px] sm:text-[15.5px] font-black text-[#0f2113] tracking-tight',
      compare: 'text-[11px] sm:text-[12px] line-through text-[#829985] font-semibold',
      badge: 'text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#fae8d8] text-[#9c3600] border border-[#f5cdb0]',
    },
    lg: {
      current: 'text-[18px] sm:text-[20px] font-black text-[#0a190d] tracking-tight',
      compare: 'text-[13px] sm:text-[14px] line-through text-[#829985] font-semibold',
      badge: 'text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full bg-[#fde8d7] text-[#9c3600] border border-[#f5cdb0]',
    },
    xl: {
      current: 'text-[24px] sm:text-[30px] font-black text-[#08170b] tracking-tight',
      compare: 'text-[14px] sm:text-[16px] line-through text-[#829985] font-semibold',
      badge: 'text-[11px] sm:text-[12px] font-black px-2.5 py-1 rounded-full bg-[#ffebd6] text-[#a83800] border border-[#f5cdb0]',
    },
  }[size];

  if (!hasDiscount) {
    return (
      <div className={`flex items-baseline gap-1 ${className}`}>
        <span className={sizeClasses.current}>{formatPrice(price)}</span>
      </div>
    );
  }

  // When there's a compare-at price:
  // User requirement: Compare-at price written small on top with strikethrough, main price written big below it
  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-start leading-none ${className}`}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={sizeClasses.compare}>{formatPrice(compareAtPrice!)}</span>
          {showDiscountBadge && discountPercent > 0 && (
            <span className={sizeClasses.badge}>
              -{discountPercent}%
            </span>
          )}
        </div>
        <span className={sizeClasses.current}>{formatPrice(price)}</span>
      </div>
    );
  }

  if (layout === 'detail') {
    return (
      <div className={`flex flex-col items-start gap-1 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-[12px] uppercase font-bold tracking-wider text-[#49664e]">
            {language === 'bn' ? 'আসল মূল্য:' : 'Regular Price:'}
          </span>
          <span className={sizeClasses.compare}>{formatPrice(compareAtPrice!)}</span>
          {discountPercent > 0 && (
            <span className={sizeClasses.badge}>
              {language === 'bn' ? `${discountPercent}% ছাড়` : `SAVE ${discountPercent}%`}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={sizeClasses.current}>{formatPrice(price)}</span>
        </div>
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className={sizeClasses.current}>{formatPrice(price)}</span>
      <span className={sizeClasses.compare}>{formatPrice(compareAtPrice!)}</span>
      {showDiscountBadge && discountPercent > 0 && (
        <span className={sizeClasses.badge}>
          -{discountPercent}%
        </span>
      )}
    </div>
  );
};
