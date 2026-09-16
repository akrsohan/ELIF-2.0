import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CategoriesScreen } from '../components/CategoriesScreen';
import { useStore } from '../context/StoreContext';

export const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('category') || undefined;
  const { wishlistIds, toggleWishlist, quickAddToCart, showToast } = useStore();

  const [initialCat, setInitialCat] = useState<string | undefined>(catParam);

  useEffect(() => {
    if (catParam) {
      setInitialCat(catParam);
    }
  }, [catParam]);

  return (
    <div className="w-full pb-16 selection:bg-[#d6edd2] selection:text-[#18281b]">
      <CategoriesScreen
        initialCategory={initialCat}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
        onQuickAddToCart={quickAddToCart}
        onShowToast={showToast}
      />
    </div>
  );
};
