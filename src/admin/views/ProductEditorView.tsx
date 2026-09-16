import React, { useState } from 'react';
import { AdminProduct, AdminView } from '../types';

interface ProductEditorViewProps {
  product?: AdminProduct | null;
  onSave: (productData: Partial<AdminProduct>) => void;
  onCancel: () => void;
  onNavigate: (view: AdminView) => void;
}

export const ProductEditorView: React.FC<ProductEditorViewProps> = ({
  product,
  onSave,
  onCancel,
  onNavigate,
}) => {
  const isEditing = !!product;

  // Form State
  const [name, setName] = useState(product?.name || '');
  const [nameBn, setNameBn] = useState(product?.nameBn || '');
  const [subtitle, setSubtitle] = useState(product?.subtitle || '');
  const [subtitleBn, setSubtitleBn] = useState(product?.subtitleBn || '');
  const [sku, setSku] = useState(product?.sku || `ELF-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState(product?.category || 'Outerwear & Trench');
  const [collection, setCollection] = useState(product?.collection || "Autumn Solace '25");
  const [price, setPrice] = useState(product?.price || 28500);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(product?.compareAtPrice);
  const [costPrice, setCostPrice] = useState<number | undefined>(product?.costPrice || 11000);
  const [stockCount, setStockCount] = useState(product?.stockCount || 10);
  const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold || 4);
  const [status, setStatus] = useState<any>(product?.status || 'Active');
  const [fabric, setFabric] = useState(product?.fabric || 'Rajshahi Mulberry Silk & Fine Wool');
  const [fabricComposition, setFabricComposition] = useState(
    product?.fabricComposition || '100% Hand-reeled natural silk'
  );
  const [origin, setOrigin] = useState(product?.origin || 'Dhaka Atelier & Rajshahi Weavers');
  const [description, setDescription] = useState(
    product?.description ||
      'Handcrafted with meticulous attention to tailoring, structured drape, and premium natural dyes.'
  );
  const [descriptionBn, setDescriptionBn] = useState(
    product?.descriptionBn || 'খাঁটি প্রাকৃতিক উপাদানে হাতে তৈরি আভিজাত্যপূর্ণ পোশাক।'
  );
  const [mainImage, setMainImage] = useState(
    product?.images[0] ||
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80'
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    product?.sizes || ['FR 36 / US 4', 'FR 38 / US 6', 'FR 40 / US 8']
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    product?.colors || ['Travertine Cream', 'Deep Olive', 'Espresso Noir']
  );
  const [selectedBadges, setSelectedBadges] = useState<string[]>(
    product?.badges || ['Limited Edition', 'Artisanal Tailored']
  );
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(product?.seoDescription || '');

  const allAvailableSizes = [
    'FR 36 / US 4',
    'FR 38 / US 6',
    'FR 40 / US 8',
    'FR 42 / US 10',
    'One Size',
  ];

  const allBadgeOptions = [
    'Limited Edition',
    'Best Seller',
    'New',
    'Artisanal Tailored',
    'Organic Certified',
    'Made in Bangladesh',
  ];

  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: product?.id || `prod-${Date.now()}`,
      name,
      nameBn,
      subtitle,
      subtitleBn,
      sku,
      category,
      collection,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      costPrice: costPrice ? Number(costPrice) : undefined,
      stockCount: Number(stockCount),
      lowStockThreshold: Number(lowStockThreshold),
      status,
      fabric,
      fabricComposition,
      origin,
      description,
      descriptionBn,
      images: [mainImage],
      sizes: selectedSizes,
      colors: selectedColors,
      badges: selectedBadges,
      seoTitle,
      seoDescription,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 pb-16">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded6be]/80 pb-4">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[11px] font-semibold text-[#5c725f] hover:text-[#18281b] flex items-center gap-1 mb-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            <span>Back to Products</span>
          </button>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            {isEditing ? `Edit Garment: ${product.name}` : 'Create New Luxury Garment'}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#f1f6ee] text-[#4b5d4e] text-[12px] font-semibold border border-[#ded6be] transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus('Draft');
              setTimeout(() => {
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }, 50);
            }}
            className="px-4 py-2 rounded-xl bg-[#f1f6ee] hover:bg-[#e4ede0] text-[#18281b] text-[12px] font-semibold border border-[#d6edd2] transition-colors cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">publish</span>
            <span>{isEditing ? 'Update Garment' : 'Publish to Catalog'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Luxury Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main Specifications (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Basic Information */}
          <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
                edit_note
              </span>
              <span>Garment Nomenclature & Narrative</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Cocoon Coat in Double-Faced Alpaca"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[13px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Product Name (বাংলা) *
                </label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  required
                  placeholder="যেমন: ডাবল-ফেসড আলপাকা উল কোকুন কোট"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[13px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Editorial Subtitle (EN)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Peruvian baby alpaca with unstructured drape"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Editorial Subtitle (বাংলা)
                </label>
                <input
                  type="text"
                  value={subtitleBn}
                  onChange={(e) => setSubtitleBn(e.target.value)}
                  placeholder="যেমন: পেরুভিয়ান বেবি আলপাকা ও ড্র্যাপ"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                Atelier Narrative & Description (EN)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe fabric tactile sensation, silhouette structure, button hardware..."
                className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl p-3 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
              />
            </div>
          </div>

          {/* 2. Media Gallery */}
          <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
                photo_camera
              </span>
              <span>Lookbook & Product Media</span>
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                Primary Editorial Image URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>
            </div>

            {/* Media Upload Box Placeholder */}
            <div className="border-2 border-dashed border-[#ded6be] rounded-2xl p-6 text-center bg-[#faf7ed]/40 hover:bg-[#faf7ed] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[32px] text-[#5c725f] mb-1">
                cloud_upload
              </span>
              <p className="text-[12px] font-semibold text-[#18281b]">
                Drag high-resolution studio photos or click to browse
              </p>
              <p className="text-[10px] text-[#849685] mt-0.5">
                Recommended aspect ratio: 3:4 portrait (min 1600 × 2133px). Supports JPG, PNG, WebP.
              </p>
            </div>
          </div>

          {/* 3. Textile Origin & Tailoring Specs */}
          <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#2d6636]">texture</span>
              <span>Textile Composition & Provenance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Primary Fabric
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. Peruvian Alpaca & Virgin Wool"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Artisanal Origin
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Arequipa, Peru & Dhaka Atelier"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                Detailed Fiber Composition
              </label>
              <input
                type="text"
                value={fabricComposition}
                onChange={(e) => setFabricComposition(e.target.value)}
                placeholder="e.g. 70% Baby Alpaca, 30% Virgin Wool"
                className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
              />
            </div>

            {/* Sizes Multi-Select */}
            <div>
              <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-2">
                Available Parisian / US Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {allAvailableSizes.map((sz) => {
                  const isChecked = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleToggleSize(sz)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer border ${
                        isChecked
                          ? 'bg-[#18281b] text-white border-[#18281b]'
                          : 'bg-[#faf7ed] text-[#4b5d4e] border-[#ded6be] hover:border-[#18281b]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Pricing Architecture */}
          <div className="bg-white rounded-2xl border border-[#ded6be] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
                attach_money
              </span>
              <span>Pricing Architecture (BDT / ৳)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Retail Price (৳) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[13px] font-bold text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Compare At Price (৳)
                </label>
                <input
                  type="number"
                  value={compareAtPrice || ''}
                  onChange={(e) =>
                    setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="Original retail"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Production Cost (৳)
                </label>
                <input
                  type="number"
                  value={costPrice || ''}
                  onChange={(e) =>
                    setCostPrice(e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="Internal atelier cost"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Publishing, Inventory & Live Preview (1 Col) */}
        <div className="space-y-6">
          {/* 1. Publishing & Status */}
          <div className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs space-y-4">
            <h3 className="font-serif text-[15px] font-bold text-[#18281b]">
              Publishing State
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1.5">
                Visibility Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] font-semibold text-[#18281b] focus:outline-none"
              >
                <option value="Active">Active (Live in Storefront)</option>
                <option value="Draft">Draft (Internal Only)</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                Garment SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full font-mono bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:outline-none"
              >
                <option value="Outerwear & Trench">Outerwear & Trench</option>
                <option value="Fine Knitwear">Fine Knitwear</option>
                <option value="Silk & Shirting">Silk & Shirting</option>
                <option value="Tailored Trousers">Tailored Trousers</option>
                <option value="Leather Goods">Leather Goods</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                Collection
              </label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:outline-none"
              >
                <option value="Autumn Solace '25">Autumn Solace &apos;25</option>
                <option value="Collection N° 08">Collection N° 08</option>
                <option value="Bridal Atelier">Bridal Atelier</option>
              </select>
            </div>
          </div>

          {/* 2. Stock Inventory */}
          <div className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs space-y-4">
            <h3 className="font-serif text-[15px] font-bold text-[#18281b]">
              Inventory Controls
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  In Stock Units
                </label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                  min={0}
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[13px] font-bold text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Alert Threshold
                </label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  min={1}
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[13px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>
            </div>
          </div>

          {/* 3. Luxury Badges */}
          <div className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs space-y-3">
            <h3 className="font-serif text-[15px] font-bold text-[#18281b]">
              Artisanal Badges
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {allBadgeOptions.map((b) => {
                const isSelected = selectedBadges.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleToggleBadge(b)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-[#2d6636] text-white border-[#2d6636]'
                        : 'bg-[#faf7ed] text-[#5c725f] border-[#ded6be]'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Live Customer Storefront Card Preview */}
          <div className="bg-[#faf7ed] rounded-2xl border border-[#ded6be] p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#849685] uppercase tracking-wider">
                Storefront Card Preview
              </span>
              <span className="text-[10px] text-[#2d6636] font-semibold">Live</span>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-[#ded6be] shadow-sm">
              <div className="relative aspect-3/4 overflow-hidden bg-[#f1f6ee]">
                <img
                  src={mainImage}
                  alt={name || 'Preview'}
                  className="w-full h-full object-cover"
                />
                {selectedBadges.length > 0 && (
                  <span className="absolute top-2 left-2 bg-[#18281b]/90 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                    {selectedBadges[0]}
                  </span>
                )}
              </div>

              <div className="p-3">
                <p className="text-[11px] text-[#849685] uppercase tracking-wider">{category}</p>
                <h4 className="font-semibold text-[13px] text-[#18281b] truncate mt-0.5">
                  {name || 'Garment Name'}
                </h4>
                <p className="text-[10px] text-[#5c725f] truncate">{fabric}</p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-[13px] font-bold text-[#18281b]">
                    ৳{price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-[#2d6636]">
                    {stockCount > 0 ? `${stockCount} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
