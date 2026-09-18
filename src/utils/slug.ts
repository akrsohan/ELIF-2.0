import { PRODUCTS, CATEGORIES, HERO_SLIDES } from '../data/catalog';
import { Product, CategoryCard } from '../types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const PRODUCT_SLUG_MAP: Record<string, string> = {
  'prod-1': 'cocoon-coat',
  'prod-2': 'cashmere-ribbed-turtleneck',
  'prod-3': 'travertine-leather-bag',
  'prod-4': 'pleated-wool-trouser',
  'prod-5': 'sculptural-linen-trench',
  'prod-6': 'rajshahi-silk-shirt',
  'prod-7': 'caramel-leather-ankle-boots',
  'prod-8': 'double-breasted-wool-blazer',
  'prod-9': 'silk-draped-dress',
  'prod-10': 'fine-merino-knit-crewneck',
};

export function getProductSlug(product: Product): string {
  if (PRODUCT_SLUG_MAP[product.id]) {
    return PRODUCT_SLUG_MAP[product.id];
  }
  return slugify(product.name) || product.id;
}

export function findProductBySlug(slugOrId: string, productsList: Product[] = []): Product | undefined {
  if (!slugOrId) return undefined;
  const list = productsList.length > 0 ? productsList : PRODUCTS;
  const normalized = slugOrId.toLowerCase().trim();

  // 1. Direct ID match
  const byId = list.find((p) => p.id.toLowerCase() === normalized);
  if (byId) return byId;

  // 2. Exact map match
  for (const [id, mappedSlug] of Object.entries(PRODUCT_SLUG_MAP)) {
    if (mappedSlug.toLowerCase() === normalized) {
      const found = list.find((p) => p.id === id);
      if (found) return found;
    }
  }

  // 3. Name slug match
  const byNameSlug = list.find((p) => slugify(p.name) === normalized);
  if (byNameSlug) return byNameSlug;

  // 4. Fuzzy / partial match
  return list.find((p) => {
    const pSlug = slugify(p.name);
    return pSlug.includes(normalized) || normalized.includes(pSlug);
  });
}

export const CATEGORY_MAP: Record<string, { name: string; filterKey: string }> = {
  outerwear: { name: 'Outerwear & Trench', filterKey: 'Outerwear' },
  knitwear: { name: 'Fine Knitwear', filterKey: 'Knitwear' },
  leather: { name: 'Leather & Bags', filterKey: 'Leather' },
  trousers: { name: 'Tailored Trousers', filterKey: 'Trousers' },
  silk: { name: 'Bengal Silk & Shirting', filterKey: 'Silk' },
  footwear: { name: 'Modern Footwear', filterKey: 'Footwear' },
};

export function getCategorySlug(categoryName: string): string {
  const norm = categoryName.toLowerCase();
  if (norm.includes('outerwear') || norm.includes('trench') || norm.includes('coat')) return 'outerwear';
  if (norm.includes('knitwear') || norm.includes('cashmere') || norm.includes('sweater')) return 'knitwear';
  if (norm.includes('leather') || norm.includes('bag')) return 'leather';
  if (norm.includes('trouser') || norm.includes('pant')) return 'trousers';
  if (norm.includes('silk') || norm.includes('shirting') || norm.includes('dress')) return 'silk';
  if (norm.includes('footwear') || norm.includes('boot') || norm.includes('shoe')) return 'footwear';
  return slugify(categoryName);
}

export function findCategoryBySlug(slug: string): CategoryCard | undefined {
  if (!slug) return undefined;
  const norm = slug.toLowerCase().trim();
  const direct = CATEGORIES.find((c) => c.slug.toLowerCase() === norm);
  if (direct) return direct;
  return CATEGORIES.find((c) => slugify(c.name) === norm);
}

export interface CollectionInfo {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  collectionNumber: string;
  image: string;
  description: string;
  categoryFilter?: string;
}

export const COLLECTIONS: CollectionInfo[] = [
  {
    id: 'autumn-solace',
    slug: 'autumn-solace',
    title: 'AUTUMN SOLACE ’25',
    subtitle: 'Pure silhouettes marrying Bengal raw mulberry silks, fine alpaca, and unbleached European wool.',
    collectionNumber: 'COLLECTION N° 08 • DHAKA & PARIS',
    image: HERO_SLIDES[0]?.image || '',
    description: 'An architectural dialogue between Dhaka craftsmanship and Parisian cut, highlighting textured outerwear, baby alpaca, and natural earth dyes.',
    categoryFilter: 'Outerwear',
  },
  {
    id: 'the-draped-silhouette',
    slug: 'the-draped-silhouette',
    title: 'THE DRAPED SILHOUETTE',
    subtitle: 'Architectural volumes cut from handwoven Rajshahi silk and textured Belgian flax linen.',
    collectionNumber: 'DHAKA ATELIER EXCLUSIVES',
    image: HERO_SLIDES[1]?.image || '',
    description: 'Celebrating fluid Bengal silk habotai with generous bias drape, mother-of-pearl fastenings, and refined minimalist proportions.',
    categoryFilter: 'Silk',
  },
  {
    id: 'texture-and-essence',
    slug: 'texture-and-essence',
    title: 'TEXTURE & ESSENCE',
    subtitle: 'Heritage textures engineered for Dhaka evening ease, warmth, and enduring quiet grace.',
    collectionNumber: 'WINTER CAPSULE ARCHIVE',
    image: HERO_SLIDES[2]?.image || '',
    description: 'Cloud-soft grade-A cashmere and extra-fine Australian merino wool tailored for subtle luxury and comfortable thermal ease.',
    categoryFilter: 'Knitwear',
  },
  {
    id: 'architecture-of-silk-and-linen',
    slug: 'architecture-of-silk-and-linen',
    title: 'ARCHITECTURE OF SILK & LINEN',
    subtitle: 'Master Belgian flax and Rajshahi mulberry fibers sculpted into versatile day-to-evening forms.',
    collectionNumber: 'ATELIER PERMANENT SUITE',
    image: CATEGORIES[4]?.image || '',
    description: 'Unlined tailored linen trench coats, double knife-pleat trousers, and sensual raw silk shirting for timeless tropical luxury.',
    categoryFilter: 'All',
  },
];

export function findCollectionBySlug(slug: string): CollectionInfo | undefined {
  if (!slug) return undefined;
  const norm = slug.toLowerCase().trim();
  return COLLECTIONS.find((c) => c.slug === norm || slugify(c.title) === norm);
}
