import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

export type Language = 'bn' | 'en';

export interface Translations {
  // Announcements & Ribbon
  announcement: string;
  announcementNationwide: string;
  announcementCod: string;
  announcementExpress: string;
  
  // Header
  navHome: string;
  navCategories: string;
  navWishlist: string;
  navOrders: string;
  taglineDhaka: string;
  searchLabel: string;
  wishlistLabel: string;
  cartLabel: string;
  accountLabel: string;
  
  // Hero Carousel
  heroSlide1Collection: string;
  heroSlide1Title: string;
  heroSlide1Sub: string;
  heroSlide1Cta: string;
  heroSlide2Collection: string;
  heroSlide2Title: string;
  heroSlide2Sub: string;
  heroSlide2Cta: string;
  heroSlide3Collection: string;
  heroSlide3Title: string;
  heroSlide3Sub: string;
  heroSlide3Cta: string;
  
  // Catalog
  collectionEyebrow: string;
  catalogHeading: string;
  catalogTagline: string;
  filterAll: string;
  categoryAll: string;
  sortBy: string;
  sortFeatured: string;
  sortPriceLow: string;
  sortPriceHigh: string;
  sortNewest: string;
  showingItems: string;
  
  // Trust Badges
  trustDelivery: string;
  trustDeliverySub: string;
  trustCod: string;
  trustCodSub: string;
  trustReturn: string;
  trustReturnSub: string;
  trustAuthentic: string;
  trustAuthenticSub: string;
  
  // Product Card
  quickAdd: string;
  viewDetails: string;
  tagLimited: string;
  tagBestSeller: string;
  tagNew: string;
  tagArchive: string;
  currency: string;
  itemsReady: string;
  
  // Product Modal
  selectSize: string;
  selectColor: string;
  buyNowDirect: string;
  buyNow: string;
  addToShoppingBag: string;
  addToBag: string;
  fabricOrigin: string;
  deliveryGuarantee: string;
  deliveryEstimate: string;
  codBadge: string;
  careGuide: string;
  featuresTitle: string;
  inStock: string;
  leftInStock: string;
  
  // Cart
  cartTitle: string;
  bagTitle: string;
  cartEmpty: string;
  cartEmptySub: string;
  bagEmpty: string;
  bagEmptySub: string;
  explorePieces: string;
  exploreCollections: string;
  subtotal: string;
  deliveryFee: string;
  freeInDhaka: string;
  total: string;
  totalAmount: string;
  proceedCheckout: string;
  checkout: string;
  removeItem: string;
  sizeLabel: string;
  colorLabel: string;
  qtyLabel: string;
  bagItemCount: string;
  
  // Checkout
  checkoutTitle: string;
  checkoutSubtitle: string;
  labelName: string;
  placeholderName: string;
  labelPhone: string;
  placeholderPhone: string;
  labelAddress: string;
  placeholderAddress: string;
  labelCity: string;
  placeholderCity: string;
  labelPayment: string;
  codOption: string;
  codDesc: string;
  bkashOption: string;
  bkashDesc: string;
  labelNote: string;
  placeholderNote: string;
  confirmOrderBtn: string;
  orderSuccessTitle: string;
  orderSuccessDesc: string;
  closeBtn: string;
  orderSummary: string;
  
  // Wishlist
  wishlistTitle: string;
  wishlistSubtitle: string;
  wishlistCountText: string;
  wishlistEmpty: string;
  wishlistEmptySub: string;
  moveToBag: string;
  
  // Categories Screen
  categoriesTitle: string;
  categoriesSub: string;
  piecesCountSuffix: string;
  viewCategory: string;
  
  // Account / Tracking
  accountTitle: string;
  trackHeading: string;
  trackInputPlaceholder: string;
  trackBtn: string;
  recentOrdersTitle: string;
  orderStatusPlaced: string;
  orderStatusDispatched: string;
  orderStatusDelivered: string;
  conciergeTitle: string;
  callConcierge: string;
  hoursNote: string;
  dhakaAddress: string;
  
  // Search
  searchPlaceholder: string;
  popularSearches: string;
  noResults: string;
  searchResultsFor: string;
  
  // Menu Drawer
  menuTitle: string;
  languageSelectLabel: string;
  stylistWhatsApp: string;
  boutiqueLocation: string;
  sizeGuide: string;
  
  // Footer
  newsletterTitle: string;
  newsletterSub: string;
  newsletterPlaceholder: string;
  newsletterBtn: string;
  flagshipTitle: string;
  flagshipHours: string;
  clientCareTitle: string;
  faqShipping: string;
  faqReturns: string;
  terms: string;
  privacy: string;
  followUs: string;
  allRightsReserved: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  bn: {
    // Announcements & Ribbon
    announcement: '🇧🇩 সারা বাংলাদেশে হোম ডেলিভারি',
    announcementNationwide: 'সারা দেশে ডেলিভারি',
    announcementCod: 'ক্যাশ অন ডেলিভারি ও বিকাশ',
    announcementExpress: 'ঢাকা ২৪ ঘণ্টা এক্সপ্রেস',
    
    // Header
    navHome: 'পোশাক কালেকশন',
    navCategories: 'ক্যাটাগরি',
    navWishlist: 'উইশলিস্ট',
    navOrders: 'অর্ডার ট্র্যাকিং',
    taglineDhaka: '🇧🇩 ঢাকা • ৳ BDT',
    searchLabel: 'অনুসন্ধান করুন',
    wishlistLabel: 'সংরক্ষিত পোশাক',
    cartLabel: 'শপিং ব্যাগ',
    accountLabel: 'অ্যাকাউন্ট',
    
    // Hero Carousel
    heroSlide1Collection: 'কালেকশন নং ০৮ • ঢাকা ও প্যারিস',
    heroSlide1Title: 'অটাম সোলাস ’২৫',
    heroSlide1Sub: 'বাংলার পিওর র সিল্ক, ফাইন আলপাকা ও ইউরোপিয়ান আনব্লিচড উলের অনন্য মেলবন্ধন।',
    heroSlide1Cta: 'কালেকশন দেখুন',
    heroSlide2Collection: 'ঢাকা অঁতেলিয়ে এক্সক্লুসিভ',
    heroSlide2Title: 'দ্য ড্র্যাপড সিলুয়েট',
    heroSlide2Sub: 'হাতে বোনা রাজশাহী সিল্ক এবং টেক্সচার্ড বেলজিয়ান লিনেনের নিখুঁত ড্র্যাপ ও আধুনিক কাটিং।',
    heroSlide2Cta: 'টেইলরিং দেখুন',
    heroSlide3Collection: 'উইন্টার ক্যাপসুল আর্কাইভ',
    heroSlide3Title: 'টেক্সচার ও এসেন্স',
    heroSlide3Sub: 'ঢাকার সান্ধ্য আড্ডা ও স্নিগ্ধ শীতের আমেজে প্রিমিয়াম আরামদায়ক নিটওয়্যার।',
    heroSlide3Cta: 'নিটওয়্যার দেখুন',
    
    // Catalog
    collectionEyebrow: 'নারী ও পুরুষ এক্সক্লুসিভ কালেকশন',
    catalogHeading: 'উপলব্ধ পোশাক কালেকশন',
    catalogTagline: 'আভিজাত্য ও আধুনিক ফ্যাশনের নিখুঁত মেলবন্ধন — প্রিমিয়াম পোশাকে নিজের স্টাইলকে করুন অনন্য।',
    filterAll: 'সব কালেকশন',
    categoryAll: 'সকল পোশাক',
    sortBy: 'সর্ট করুন',
    sortFeatured: 'জনপ্রিয় কালেকশন',
    sortPriceLow: 'মূল্য: কম থেকে বেশি',
    sortPriceHigh: 'মূল্য: বেশি থেকে কম',
    sortNewest: 'নতুন আগমন',
    showingItems: 'টি পোশাক প্রদর্শিত হচ্ছে',
    
    // Trust Badges
    trustDelivery: 'সারা দেশে হোম ডেলিভারি',
    trustDeliverySub: 'ঢাকার ভেতরে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ৩-৫ দিন',
    trustCod: 'ক্যাশ অন ডেলিভারি ও বিকাশ',
    trustCodSub: 'পণ্য হাতে পেয়ে নিশ্চিন্তে মূল্য পরিশোধ করুন',
    trustReturn: '৭ দিনের সহজ এক্সচেঞ্জ',
    trustReturnSub: 'সাইজ সমস্যা বা পছন্দের ক্ষেত্রে সহজ সমাধান',
    trustAuthentic: '১০০% অরিজিনাল ফেব্রিক',
    trustAuthenticSub: 'রাজশাহী সিল্ক, কাশ্মীরি উল ও বেলজিয়ান লিনেন',
    
    // Product Card
    quickAdd: 'ব্যাগে নিন',
    viewDetails: 'বিস্তারিত দেখুন',
    tagLimited: 'সীমিত সংস্করণ',
    tagBestSeller: 'সেরা বিক্রিত',
    tagNew: 'নতুন',
    tagArchive: 'আর্কাইভ',
    currency: '৳',
    itemsReady: 'টি আইটেম ঢাকা শোরুমে প্রস্তুত',
    
    // Product Modal
    selectSize: 'সাইজ নির্বাচন করুন',
    selectColor: 'রঙ নির্বাচন করুন',
    buyNowDirect: 'সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)',
    buyNow: 'সরাসরি কিনুন',
    addToShoppingBag: 'শপিং ব্যাগে যোগ করুন',
    addToBag: 'ব্যাগে যুক্ত করুন',
    fabricOrigin: 'ফেব্রিক ও উপাদান',
    deliveryGuarantee: 'ডেলিভারি ও রিটার্ন সুবিধা',
    deliveryEstimate: 'ঢাকার মধ্যে ২৪-৪৮ ঘণ্টায় এবং সারাদেশে ৩-৫ দিনে হোম ডেলিভারি।',
    codBadge: 'ক্যাশ অন ডেলিভারি (COD) সুবিধা রয়েছে।',
    careGuide: 'যত্ন ও ধোয়ার নির্দেশিকা',
    featuresTitle: 'ডিজাইন বৈশিষ্ট্য',
    inStock: 'স্টক উপলব্ধ',
    leftInStock: 'টি অবশিষ্ট আছে',
    
    // Cart
    cartTitle: 'আপনার শপিং ব্যাগ',
    bagTitle: 'শপিং ব্যাগ',
    cartEmpty: 'আপনার ব্যাগটি এখন খালি',
    cartEmptySub: 'আমাদের প্রিমিয়াম কালেকশন থেকে আপনার পছন্দের পোশাকটি বেছে নিন।',
    bagEmpty: 'আপনার ব্যাগটি এখন খালি',
    bagEmptySub: 'আমাদের প্রিমিয়াম কালেকশন থেকে আপনার পছন্দের পোশাকটি বেছে নিন।',
    explorePieces: 'পোশাক ব্রাউজ করুন',
    exploreCollections: 'কালেকশন দেখুন',
    subtotal: 'সাবটোটাল',
    deliveryFee: 'ডেলিভারি চার্জ',
    freeInDhaka: 'ঢাকার ভেতর ফ্রি ডেলিভারি',
    total: 'সর্বমোট মূল্য',
    totalAmount: 'সর্বমোট মূল্য',
    proceedCheckout: 'চেকআউটে যান (ক্যাশ অন ডেলিভারি)',
    checkout: 'চেকআউটে যান',
    removeItem: 'মুছে ফেলুন',
    sizeLabel: 'সাইজ',
    colorLabel: 'রঙ',
    qtyLabel: 'পরিমাণ',
    bagItemCount: 'টি আইটেম',
    
    // Checkout
    checkoutTitle: 'অর্ডার নিশ্চিতকরণ',
    checkoutSubtitle: 'ক্যাশ অন ডেলিভারি অথবা বিকাশের মাধ্যমে দ্রুত অর্ডার সম্পন্ন করুন',
    labelName: 'আপনার পূর্ণ নাম',
    placeholderName: 'যেমন: ফারহানা আহমেদ / সোহান রহমান',
    labelPhone: 'মোবাইল নম্বর (সরাসরি যোগাযোগ ও ওটিপি)',
    placeholderPhone: '01XXXXXXXXX',
    labelAddress: 'সম্পূর্ণ ডেলিভারি ঠিকানা',
    placeholderAddress: 'বাসা নম্বর, রোড, এরিয়া বা মহল্লা...',
    labelCity: 'শহর / জেলা',
    placeholderCity: 'ঢাকা (অথবা আপনার জেলা)',
    labelPayment: 'মূল্য পরিশোধের পদ্ধতি',
    codOption: 'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)',
    codDesc: 'ডেলিভারি রাইডারের কাছ থেকে পার্সেল গ্রহণ করে মূল্য পরিশোধ করুন।',
    bkashOption: 'বিকাশ / নগদ পেমেন্ট (অগ্রিম পরিশোধ)',
    bkashDesc: 'আমাদের মার্চেন্ট নম্বরে সরাসরি বিকাশ বা নগদ পে করুন।',
    labelNote: 'বিশেষ ডেলিভারি নির্দেশনা (ঐচ্ছিক)',
    placeholderNote: 'যেমন: সন্ধ্যার পর ডেলিভারি দেবেন অথবা গেটে কল দেবেন...',
    confirmOrderBtn: 'অর্ডার কনফার্ম করুন',
    orderSuccessTitle: 'আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!',
    orderSuccessDesc: 'আমাদের ঢাকা অঁতেলিয়ে প্রতিনিধি শীঘ্রই আপনার ফোন নম্বরে যোগাযোগ করবেন।',
    closeBtn: 'বন্ধ করুন',
    orderSummary: 'অর্ডারের সংক্ষিপ্ত বিবরণ',
    
    // Wishlist
    wishlistTitle: 'আপনার উইশলিস্ট',
    wishlistSubtitle: 'আপনার পছন্দের সংরক্ষিত পোশাকগুলো এখানে দেখতে পাবেন',
    wishlistCountText: 'টি পছন্দের পোশাক',
    wishlistEmpty: 'উইশলিস্টে কোনো পোশাক নেই',
    wishlistEmptySub: 'পছন্দের পোশাকের হার্ট আইকনে ক্লিক করে সংরক্ষণ করে রাখুন।',
    moveToBag: 'ব্যাগে যোগ করুন',
    
    // Categories Screen
    categoriesTitle: 'পোশাক ক্যাটাগরি',
    categoriesSub: 'আভিজাত্য ও নান্দনিক কাটিংয়ের সেরা পোশাকের সংগ্রহ',
    piecesCountSuffix: 'টি ডিজাইন',
    viewCategory: 'ক্যাটাগরি দেখুন',
    
    // Account / Tracking
    accountTitle: 'ক্লায়েন্ট ড্যাশবোর্ড ও সার্ভিস',
    trackHeading: 'লাইভ অর্ডার ট্র্যাক করুন',
    trackInputPlaceholder: 'অর্ডার আইডি (যেমন: ELIF-9421) অথবা মোবাইল নম্বর লিখুন',
    trackBtn: 'অবস্থা জানুন',
    recentOrdersTitle: 'সাম্প্রতিক অর্ডারসমূহ',
    orderStatusPlaced: 'অর্ডার গৃহীত হয়েছে',
    orderStatusDispatched: 'ডেলিভারির জন্য বের হয়েছে',
    orderStatusDelivered: 'সফলভাবে ডেলিভার্ড',
    conciergeTitle: 'স্টাইলিস্ট ও কাস্টমার কেয়ার',
    callConcierge: 'কল করুন: +880 1995-513269',
    hoursNote: 'প্রতিদিন সকাল ১০:০০ - রাত ১০:০০ টা পর্যন্ত',
    dhakaAddress: 'রোড ১১, বনানী, ঢাকা ১২১৩, বাংলাদেশ',
    
    // Search
    searchPlaceholder: 'পোশাক, সিল্ক, লিনেন বা ড্রেস খুঁজুন...',
    popularSearches: 'জনপ্রিয় অনুসন্ধান',
    noResults: 'কোনো পোশাক পাওয়া যায়নি',
    searchResultsFor: 'অনুসন্ধানের ফলাফল:',
    
    // Menu Drawer
    menuTitle: 'এলিফ নেভিগেশন',
    languageSelectLabel: 'ভাষা নির্বাচন করুন / Choose Language',
    stylistWhatsApp: 'হোয়াটসঅ্যাপ স্টাইলিস্ট কনসিয়ার্জ',
    boutiqueLocation: 'ঢাকা ফ্ল্যাগশিপ স্টোর',
    sizeGuide: 'পরিমাপ ও সাইজ গাইড',
    
    // Footer
    newsletterTitle: 'প্রাইভেট ফ্যাশন গ্যাজেট',
    newsletterSub: 'নতুন কালেকশন ও এক্সক্লুসিভ ডিজাইনের আপডেট সবার আগে পেতে সাবস্ক্রাইব করুন।',
    newsletterPlaceholder: 'আপনার ইমেইল ঠিকানা লিখুন',
    newsletterBtn: 'সাবস্ক্রাইব',
    flagshipTitle: 'ঢাকা ফ্ল্যাগশিপ বুটিক',
    flagshipHours: 'খোলা থাকে: প্রতিদিন সকাল ১০:০০ টা - রাত ১০:০০ টা',
    clientCareTitle: 'কাস্টমার কেয়ার ও সহায়তা',
    faqShipping: 'ডেলিভারি পলিসি ও চার্জ',
    faqReturns: 'সহজ রিটার্ন ও সাইজ এক্সচেঞ্জ',
    terms: 'শর্তাবলী ও নিয়মাবলী',
    privacy: 'প্রাইভেসি পলিসি',
    followUs: 'সোশ্যাল মিডিয়া ফলো করুন:',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত। এলিফ ঢাকা আতলিয়ে।'
  },
  en: {
    // Announcements & Ribbon
    announcement: '🇧🇩 Nationwide Delivery in Bangladesh',
    announcementNationwide: 'Nationwide Delivery',
    announcementCod: 'Cash on Delivery & bKash',
    announcementExpress: 'Dhaka 24h Express',
    
    // Header
    navHome: 'Shop Clothes',
    navCategories: 'Categories',
    navWishlist: 'Wishlist',
    navOrders: 'Orders & Tracking',
    taglineDhaka: '🇧🇩 Dhaka • ৳ BDT',
    searchLabel: 'Search collection',
    wishlistLabel: 'Saved pieces',
    cartLabel: 'Shopping bag',
    accountLabel: 'Client account',
    
    // Hero Carousel
    heroSlide1Collection: 'COLLECTION N° 08 • DHAKA & PARIS',
    heroSlide1Title: 'AUTUMN SOLACE ’25',
    heroSlide1Sub: 'Pure silhouettes marrying Bengal raw mulberry silks, fine alpaca, and unbleached European wool.',
    heroSlide1Cta: 'Shop The Campaign',
    heroSlide2Collection: 'DHAKA ATELIER EXCLUSIVES',
    heroSlide2Title: 'THE DRAPED SILHOUETTE',
    heroSlide2Sub: 'Architectural volumes cut from handwoven Rajshahi silk and textured Belgian flax linen.',
    heroSlide2Cta: 'Discover Tailoring',
    heroSlide3Collection: 'WINTER CAPSULE ARCHIVE',
    heroSlide3Title: 'TEXTURE & ESSENCE',
    heroSlide3Sub: 'Heritage textures engineered for Dhaka evening ease, warmth, and enduring quiet grace.',
    heroSlide3Cta: 'Explore Knitwear',
    
    // Catalog
    collectionEyebrow: 'Women & Men Exclusive Collection',
    catalogHeading: 'Available Clothing',
    catalogTagline: 'Where timeless craft meets modern silhouettes — handcrafted tailoring for effortless elegance.',
    filterAll: 'All Pieces',
    categoryAll: 'All Pieces',
    sortBy: 'Sort By',
    sortFeatured: 'Curated / Featured',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortNewest: 'New Arrivals',
    showingItems: 'silhouettes displayed',
    
    // Trust Badges
    trustDelivery: 'Nationwide Delivery',
    trustDeliverySub: '24-48h within Dhaka, 3-5 days all across Bangladesh',
    trustCod: 'Cash on Delivery & bKash',
    trustCodSub: 'Inspect at your doorstep before paying with confidence',
    trustReturn: '7-Day Easy Exchange',
    trustReturnSub: 'Hassle-free size replacement and complimentary support',
    trustAuthentic: '100% Handcrafted Fabrics',
    trustAuthenticSub: 'Rajshahi mulberry silk, cashmere wool & flax linen',
    
    // Product Card
    quickAdd: 'Add to Bag',
    viewDetails: 'View Details',
    tagLimited: 'Limited',
    tagBestSeller: 'Best Seller',
    tagNew: 'New',
    tagArchive: 'Archive',
    currency: '৳',
    itemsReady: 'pieces ready to dispatch from Dhaka Atelier',
    
    // Product Modal
    selectSize: 'Select Size',
    selectColor: 'Select Color',
    buyNowDirect: 'Buy Now (Direct COD)',
    buyNow: 'Direct Buy',
    addToShoppingBag: 'Add to Shopping Bag',
    addToBag: 'Add to Bag',
    fabricOrigin: 'Fabric & Provenance',
    deliveryGuarantee: 'Delivery & Return Guarantee',
    deliveryEstimate: 'Home delivery in 24-48h in Dhaka and 3-5 days across Bangladesh.',
    codBadge: 'Cash on Delivery (COD) supported nationwide.',
    careGuide: 'Garment Care & Cleaning',
    featuresTitle: 'Design Attributes',
    inStock: 'In Stock',
    leftInStock: 'units left in atelier',
    
    // Cart
    cartTitle: 'Your Shopping Bag',
    bagTitle: 'Shopping Bag',
    cartEmpty: 'Your shopping bag is empty',
    cartEmptySub: 'Explore our curated silhouettes and discover pieces designed to elevate your everyday elegance.',
    bagEmpty: 'Your shopping bag is empty',
    bagEmptySub: 'Explore our curated silhouettes and discover pieces designed to elevate your everyday elegance.',
    explorePieces: 'Explore Clothing',
    exploreCollections: 'Explore Collections',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    freeInDhaka: 'Complimentary in Dhaka',
    total: 'Total Amount',
    totalAmount: 'Total Amount',
    proceedCheckout: 'Proceed to Checkout (COD / bKash)',
    checkout: 'Proceed to Checkout',
    removeItem: 'Remove',
    sizeLabel: 'Size',
    colorLabel: 'Color',
    qtyLabel: 'Qty',
    bagItemCount: 'pieces',
    
    // Checkout
    checkoutTitle: 'Complete Your Order',
    checkoutSubtitle: 'Cash on Delivery or instant bKash payment with doorstep dispatch',
    labelName: 'Full Name',
    placeholderName: 'e.g., Farhana Ahmed / Sohan Rahman',
    labelPhone: 'Mobile Phone Number (for delivery verification)',
    placeholderPhone: '01XXXXXXXXX',
    labelAddress: 'Full Delivery Address',
    placeholderAddress: 'House/Apartment, Road, Area, Ward...',
    labelCity: 'City / District',
    placeholderCity: 'Dhaka (or your district)',
    labelPayment: 'Payment Method',
    codOption: 'Cash on Delivery (Pay upon receiving)',
    codDesc: 'Hand payment to rider upon parcel inspection at your door.',
    bkashOption: 'bKash / Nagad Payment (Instant)',
    bkashDesc: 'Direct transfer to our verified merchant account.',
    labelNote: 'Special Delivery Note (Optional)',
    placeholderNote: 'e.g., Deliver after 5 PM or ring doorbell on arrival...',
    confirmOrderBtn: 'Confirm Order',
    orderSuccessTitle: 'Your Order is Confirmed!',
    orderSuccessDesc: 'Our Dhaka Atelier concierge will contact you shortly to coordinate dispatch.',
    closeBtn: 'Close',
    orderSummary: 'Order Summary',
    
    // Wishlist
    wishlistTitle: 'Your Saved Wishlist',
    wishlistSubtitle: 'Silhouettes and bespoke garments you have curated for later',
    wishlistCountText: 'curated pieces',
    wishlistEmpty: 'Your wishlist is empty',
    wishlistEmptySub: 'Tap the heart icon on any garment to curate your personal wardrobe collection.',
    moveToBag: 'Move to Bag',
    
    // Categories Screen
    categoriesTitle: 'Curated Categories',
    categoriesSub: 'Explore garments categorized by tactile texture, silhouette, and season',
    piecesCountSuffix: 'pieces',
    viewCategory: 'View Category',
    
    // Account / Tracking
    accountTitle: 'Client Account & Concierge',
    trackHeading: 'Track Live Order',
    trackInputPlaceholder: 'Enter Order ID (e.g. ELIF-9421) or phone number',
    trackBtn: 'Track Status',
    recentOrdersTitle: 'Recent Orders',
    orderStatusPlaced: 'Order Placed',
    orderStatusDispatched: 'Out for Delivery',
    orderStatusDelivered: 'Delivered',
    conciergeTitle: 'Atelier Stylist & Support',
    callConcierge: 'Call Concierge: +880 1995-513269',
    hoursNote: 'Open Daily 10:00 AM - 10:00 PM',
    dhakaAddress: 'Road 11, Banani, Dhaka 1213, Bangladesh',
    
    // Search
    searchPlaceholder: 'Search clothing, silk, linen, knitwear...',
    popularSearches: 'Popular Searches',
    noResults: 'No clothing found',
    searchResultsFor: 'Search results for:',
    
    // Menu Drawer
    menuTitle: 'ELIF Navigation',
    languageSelectLabel: 'Choose Language / ভাষা নির্বাচন',
    stylistWhatsApp: 'WhatsApp Stylist Concierge',
    boutiqueLocation: 'Dhaka Flagship Boutique',
    sizeGuide: 'Garment Sizing Guide',
    
    // Footer
    newsletterTitle: 'Private Atelier Gazette',
    newsletterSub: 'Subscribe to receive discreet editorial previews and private seasonal invitations.',
    newsletterPlaceholder: 'Enter your email address',
    newsletterBtn: 'Subscribe',
    flagshipTitle: 'Dhaka Flagship Boutique',
    flagshipHours: 'Hours: Daily 10:00 AM - 10:00 PM',
    clientCareTitle: 'Client Care & Assistance',
    faqShipping: 'Shipping & Delivery Policy',
    faqReturns: 'Easy Returns & Size Exchanges',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    followUs: 'Follow our official journals:',
    allRightsReserved: 'All Rights Reserved. ELIF Dhaka Atelier.'
  }
};

// Localized product details mapping
const PRODUCT_TRANSLATIONS_BN: Record<string, { name: string; subtitle: string; category: string; fabric?: string }> = {
  'prod-1': {
    name: 'আলপাকা কোকুন ওভারকোট',
    subtitle: 'ভার্জিন উল • স্যান্ডস্টোন',
    category: 'ওভারওয়্যার',
    fabric: '৭০% রয়্যাল বেবি আলপাকা, ৩০% ফাইন ভার্জিন উল; ১০০% হাবোটাই সিল্ক লাইনিং'
  },
  'prod-2': {
    name: 'কাশ্মিরী রিবড টার্টলনেক',
    subtitle: 'পিওর কাশ্মীরি উল • আইভরি',
    category: 'নিটওয়্যার',
    fabric: '১০০% গ্রেড-এ পিওর কাশ্মীরি উল'
  },
  'prod-3': {
    name: 'বিসপোক প্লিটেড ট্রাউজার্স',
    subtitle: 'ফাইন ওস্টেড উল • এক্রু',
    category: 'ট্রাউজার্স',
    fabric: '১০০% ফাইন ট্রাভেলার ওস্টেড উল'
  },
  'prod-4': {
    name: 'রাজশাহী র সিল্ক ড্র্যাপড ব্লাউজ',
    subtitle: 'হাতে বোনা মালবেরি সিল্ক • মুক্তা রঙ',
    category: 'বেঙ্গল সিল্ক',
    fabric: '১০০% হাতে বোনা রাজশাহী র সিল্ক'
  },
  'prod-5': {
    name: 'ইতালিয়ান কাফস্কিন টোট ব্যাগ',
    subtitle: 'ফুল-গ্রেইন লেদার • কনিয়াক',
    category: 'লেদার ও ব্যাগ',
    fabric: '১০০% ফুল-গ্রেইন ভেজিটেবল ট্যানড কাফ লেদার'
  },
  'prod-6': {
    name: 'স্কাল্পচারাল বেলজিয়ান লিনেন ব্লেজার',
    subtitle: 'পিওর ন্যাচারাল লিনেন • ফ্ল্যাক্স',
    category: 'ওভারওয়্যার',
    fabric: '১০০% সার্টিফাইড বেলজিয়ান ফ্ল্যাক্স লিনেন'
  },
  'prod-7': {
    name: 'সিল্ক অর্গানজা ট্রেন্স ওভারকোট',
    subtitle: 'স্বচ্ছ মালবেরি সিল্ক • স্মোক গ্রে',
    category: 'ওভারওয়্যার',
    fabric: '১০০% মালবেরি সিল্ক অর্গানজা'
  },
  'prod-8': {
    name: 'চাংকি রিবড উল কার্ডিগান',
    subtitle: 'মেরিনো উল • ওটমিল',
    category: 'নিটওয়্যার',
    fabric: '১০০% এক্সট্রাফাইন মেরিনো উল'
  },
  'prod-9': {
    name: 'বেঙ্গল সিল্ক ড্র্যাপড স্লিপ ড্রেস',
    subtitle: 'হেভি সিল্ক স্যাটিন • শ্যাম্পেইন',
    category: 'বেঙ্গল সিল্ক',
    fabric: '১০০% রাজশাহী সিল্ক স্যাটিন'
  },
  'prod-10': {
    name: 'স্ট্রাকচার্ড উল টেইলর্ড ভেস্ট',
    subtitle: 'হেরিংবোন উল • চারকোল',
    category: 'ট্রাউজার্স',
    fabric: '১০০% স্কটিশ হেরিংবোন উল'
  },
  'prod-11': {
    name: 'মিনিমালিস্ট স্যাডল লেদার লোফার্স',
    subtitle: 'হাতে তৈরি কাফ লেদার • ক্যারামেল',
    category: 'ফুটওয়্যার',
    fabric: '১০০% ভেজিটেবল ট্যানড কাফ লেদার'
  },
  'prod-12': {
    name: 'কাশ্মিরী উল ফ্রিঞ্জড স্কার্ফ',
    subtitle: 'গ্রেড-এ কাশ্মীরি উল • ডিপ স্লেট',
    category: 'নিটওয়্যার',
    fabric: '১০০% প্রিমিয়াম কাশ্মীরি উল'
  }
};

const CATEGORY_TRANSLATIONS_BN: Record<string, string> = {
  'Outerwear & Trench': 'ওভারওয়্যার ও ট্রেন্স',
  'Fine Knitwear': 'ফাইন নিটওয়্যার',
  'Leather & Bags': 'লেদার ও ব্যাগ',
  'Tailored Trousers': 'টেইলর্ড ট্রাউজার্স',
  'Bengal Silk & Shirting': 'বেঙ্গল সিল্ক ও শার্ট',
  'Modern Footwear': 'মডার্ন ফুটওয়্যার'
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  localizeProduct: (product: Product) => Product;
  localizeCategoryName: (name: string) => string;
  localizeCategory: (name: string) => string;
  formatNumber: (num: number) => string;
  formatPrice: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('elif_site_lang');
      if (saved === 'bn' || saved === 'en') {
        return saved;
      }
    }
    return 'bn'; // Default to Bangla as requested by user
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('elif_site_lang', lang);
    }
  };

  const t = TRANSLATIONS[language];

  // Helper to localize product name & subtitle
  const localizeProduct = (product: Product): Product => {
    if (language === 'bn') {
      const bnData = PRODUCT_TRANSLATIONS_BN[product.id];
      if (bnData) {
        return {
          ...product,
          name: bnData.name,
          subtitle: bnData.subtitle,
          category: bnData.category,
          fabric: bnData.fabric || product.fabric
        };
      }
    }
    return product;
  };

  const localizeCategoryName = (name: string): string => {
    if (language === 'bn' && CATEGORY_TRANSLATIONS_BN[name]) {
      return CATEGORY_TRANSLATIONS_BN[name];
    }
    return name;
  };

  // English to Bengali numeral converter
  const formatNumber = (num: number): string => {
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return String(num).replace(/[0-9]/g, (digit) => bnDigits[Number(digit)]);
    }
    return String(num);
  };

  const formatPrice = (amount: number): string => {
    const formatted = amount.toLocaleString('en-US');
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      const bnFormatted = formatted.replace(/[0-9]/g, (digit) => bnDigits[Number(digit)]);
      return `৳ ${bnFormatted}`;
    }
    return `৳ ${formatted}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        localizeProduct,
        localizeCategoryName,
        localizeCategory: localizeCategoryName,
        formatNumber,
        formatPrice
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
