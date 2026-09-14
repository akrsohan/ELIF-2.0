export type TabType = 'home' | 'categories' | 'wishlist' | 'cart' | 'account';

export interface Product {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  price: number;
  currency: string;
  tag?: 'Limited' | 'Best Seller' | 'New' | 'Archive';
  image: string;
  alt: string;
  description: string;
  fabric: string;
  origin: string;
  sizes: string[];
  colors: string[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface CategoryCard {
  id: string;
  name: string;
  piecesCount: number;
  image: string;
  alt: string;
  slug: string;
}

export interface CommunityPost {
  id: string;
  image: string;
  alt: string;
  caption: string;
  author: string;
  likes: number;
}
