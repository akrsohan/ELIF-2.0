import { Product, CategoryCard, CommunityPost } from '../types';

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXwkE_S1CIlTeaUi2A0kpHKaTO1YMdgcllNa-EuHUFyyKASsJDMmHfzNojZjkKG_haXidUGHAuB3DZwechtj4diS-3gx-5ePjm-jkk8CVwHcGmnzuJs7KvtFABqE-tJ7dE198GYm9fshVFJVkNIXnbGWs7JeUYJCZrWQlrTcsi8FZYsm0tQmXWz4iIkmqvcYTeBYNs0Bouuuv9CMUARxKl81IEsnDikFQKzXTKxP_U0h1VCBJUoS4x';

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    collection: 'COLLECTION N° 08 • DHAKA & PARIS',
    title: 'AUTUMN SOLACE ’25',
    subtitle: 'Pure silhouettes marrying Bengal raw mulberry silks, fine alpaca, and unbleached European wool.',
    cta: 'Shop The Campaign',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxIul4JpU6auSN4aWFcSCXco2-jKGQ0zm0oAAC5ewbu-CWB8mxfO6-XxbiHMo7mW0AqXy9qQ1M70LtYuzM7wYj-SwNNY6qrFrOyF7s1KOhOJnbPvyyzX_2q9wzkKd-Peeg0qCn8gkRmo9Ylj-MK46_nl9laIvAkZ-jMrTSwVVwLD9kuqMIKCzg6M3QmfhtgeEnM0PM0BNg18kQXOuR-Rzg6lRfr4rxIW_MbzCbG1jrCkDgP0cwoKF3',
    alt: 'Editorial fashion photography of modern atelier silhouettes.'
  },
  {
    id: 'slide-2',
    collection: 'DHAKA ATELIER EXCLUSIVES',
    title: 'THE DRAPED SILHOUETTE',
    subtitle: 'Architectural volumes cut from handwoven Rajshahi silk and textured Belgian flax linen.',
    cta: 'Discover Tailoring',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv7LsuZDvnjFdicVGsMw-FhDihCGLATc1-dkUmqP1y3BUl43XBe1dJxvVT7iHoghhkEiWvq9lQJ4bvddB7w9QkB8nlcA0as9qOLxtjmsA66aEFOOfNkqGhb7v0O1cVPAJZbWX7Gvcl3zA67sEIlS6zl_BFHUeX5jKmcUnyF5Y3HZdfo80-LWwDo9ExVjXhg0YCvXuxz5g099Sl3qAKR_DmOPKetHdxquopGMC4ZQvO4_uDQaxV__y7',
    alt: 'Cinematic fashion editorial banner capturing fluid raw silk drapes.'
  },
  {
    id: 'slide-3',
    collection: 'WINTER CAPSULE ARCHIVE',
    title: 'TEXTURE & ESSENCE',
    subtitle: 'Heritage textures engineered for Dhaka evening ease, warmth, and enduring quiet grace.',
    cta: 'Explore Knitwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaT3orp8LDsSVwHOQRjoYNbIfs5-Am1ium7VVY0-R01mLadKoGKud6-Mdf92UOt6BokjYx1wyRYqOxwGQwiGSJLhkL1ckGqVPYyPkdRn7VpqtAMbKy0Qxoo3gVKrk0afuxGBn_xeyTTnOM3W7vxbarOMtdT-fENwAO3pVPTZh2DRL04xlcytVzg7TUOPfo_tXo9EwWYwHasfCTmqDt6CbbLNVPNLjlFghpL7hWDGZvAHXJblW2QSoE',
    alt: 'Editorial portrait of pure cashmere knitwear.'
  }
];

// All hardcoded categories have been purged. Categories are strictly dynamically loaded from Supabase Admin data.
export const CATEGORIES: CategoryCard[] = [];

// All demo/mock products have been purged. Products are dynamically fetched from Supabase.
export const PRODUCTS: Product[] = [];

// All fake demo community posts have been purged.
export const COMMUNITY_POSTS: CommunityPost[] = [];

// Clean initial cart with zero demo items.
export const INITIAL_CART: { product: Product; size: string; color: string; quantity: number }[] = [];
