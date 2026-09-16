export type AdminView =
  | 'dashboard'
  | 'products'
  | 'product-new'
  | 'product-edit'
  | 'categories'
  | 'collections'
  | 'inventory'
  | 'orders'
  | 'order-detail'
  | 'returns'
  | 'coupons'
  | 'promotions'
  | 'customers'
  | 'customer-detail'
  | 'reviews'
  | 'wishlist-insights'
  | 'fittings'
  | 'tailoring'
  | 'homepage-cms'
  | 'banners'
  | 'lookbook'
  | 'newsletter'
  | 'delivery'
  | 'payments'
  | 'analytics-sales'
  | 'analytics-products'
  | 'analytics-customers'
  | 'admin-users'
  | 'roles'
  | 'activity-logs'
  | 'settings';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Quality Check'
  | 'Ready to Ship'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type ProductStatus = 'Active' | 'Draft' | 'Out of Stock' | 'Archived';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export type AdminRole = 'Super Admin' | 'Store Manager' | 'Content Manager' | 'Order Manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: AdminRole;
  department: string;
  lastActive: string;
  status: 'Active' | 'Suspended';
  phone?: string;
}

export interface AdminOrder {
  id: string; // e.g. EL-BD4821
  date: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    notes?: string;
  };
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Cash on Delivery' | 'Card (Visa/Mastercard)';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  courier: 'Pathao Express' | 'Steadfast Courier' | 'Dhaka Atelier Direct' | 'Pending Assignment';
  courierTrackingCode?: string;
  timeline: Array<{
    status: OrderStatus;
    time: string;
    note: string;
    by?: string;
  }>;
  adminNotes?: string[];
}

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  nameBn: string;
  subtitle: string;
  subtitleBn: string;
  category: string;
  collection: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  currency: string;
  stockCount: number;
  lowStockThreshold: number;
  status: ProductStatus;
  fabric: string;
  fabricComposition: string;
  origin: string;
  sizes: string[];
  colors: string[];
  images: string[];
  tags: string[];
  badges: string[];
  description: string;
  descriptionBn: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  displayOrder: number;
  status: 'Active' | 'Hidden';
}

export interface AdminCollection {
  id: string;
  name: string;
  nameBn: string;
  season: string;
  description: string;
  heroImage: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  productCount: number;
  status: 'Published' | 'Draft' | 'Archived';
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Disabled';
  applicableCategory?: string;
  notes?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  district: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'VIP Atelier' | 'Regular' | 'New Client';
  tailoringProfileId?: string;
}

export interface AdminFitting {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  sessionType: 'Bespoke Outerwear' | 'Silk Shirting' | 'Cashmere Draping' | 'Bridal Atelier';
  date: string;
  time: string;
  location: 'Gulshan 2' | 'Banani';
  assignedTailor: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notes: string;
}

export interface AdminTailoringProfile {
  id: string;
  customerPhone: string;
  customerName: string;
  trenchCoatSize: string;
  knitwearSize: string;
  trouserInseamCm: number;
  chestBustCm?: number;
  waistCm?: number;
  hipCm?: number;
  sensitivities: string;
  tailorNotes: string;
  lastFittedDate: string;
}

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  verifiedPurchase: boolean;
  featured: boolean;
}

export interface AdminActivityLog {
  id: string;
  adminName?: string;
  userName?: string;
  adminAvatar?: string;
  role?: string;
  userRole?: string;
  action: string;
  module?: string;
  target?: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
}

export interface AdminCMSState {
  announcementEn: string;
  announcementBn: string;
  heroHeadingEn: string;
  heroHeadingBn: string;
  heroSubtitleEn: string;
  heroSubtitleBn: string;
  heroImageUrl: string;
  editorialQuote: string;
  editorialAuthor: string;
}

export interface AdminOperationsState {
  dhakaFee: number;
  suburbFee: number;
  nationalFee: number;
  freeShippingThreshold: number;
  bkashActive: boolean;
  bkashMerchantNumber: string;
  nagadActive: boolean;
  nagadMerchantNumber: string;
  codActive: boolean;
  cardActive: boolean;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'stock' | 'fitting' | 'system' | 'return';
  severity: 'info' | 'warning' | 'critical' | 'success';
  read: boolean;
  linkView?: AdminView;
}
