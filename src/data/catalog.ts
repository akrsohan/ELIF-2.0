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

export const CATEGORIES: CategoryCard[] = [
  {
    id: 'cat-1',
    name: 'Outerwear & Trench',
    piecesCount: 0,
    slug: 'outerwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkrZbPj5hr7o3CWZ0gWno-1UK_CufCPRCNQWSA7qOL429NtOKvZ9NXHsV7JnQMSDzEnhEGMC6O8nu5PfOWG9p8TH-haGxl4GNGjvYzf2sqFSgObCe-aJ1oDRgFA0U5MeAofMyEYEEvfQy45krLZE12WrZVOp4WYS6RjaJ4rExEVaKt2x6YqgTWyRwruWUFjdx0Y2lk7Nsf0Mo2VTbJO9hHQTKhOVSYOzQronCjGDlzRJF5T2l42b1z',
    alt: 'Outerwear & Trench'
  },
  {
    id: 'cat-2',
    name: 'Fine Knitwear',
    piecesCount: 0,
    slug: 'knitwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaT3orp8LDsSVwHOQRjoYNbIfs5-Am1ium7VVY0-R01mLadKoGKud6-Mdf92UOt6BokjYx1wyRYqOxwGQwiGSJLhkL1ckGqVPYyPkdRn7VpqtAMbKy0Qxoo3gVKrk0afuxGBn_xeyTTnOM3W7vxbarOMtdT-fENwAO3pVPTZh2DRL04xlcytVzg7TUOPfo_tXo9EwWYwHasfCTmqDt6CbbLNVPNLjlFghpL7hWDGZvAHXJblW2QSoE',
    alt: 'Fine Knitwear'
  },
  {
    id: 'cat-3',
    name: 'Leather & Bags',
    piecesCount: 0,
    slug: 'leather',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv3zF1urBy_3iIL0aUwNoIV-dfPcPY_cZLZJK5mC3WE2fPMTgJeJ-hYHpVwDqi_2C0Mt99U2BXL6bC7ZJhJ7rqW4aW4l2FIOF99j3X_GAsvJOS2_61FYZpd0kmLWnjKP-0DaPmEr7QFgBrCQ7_lFJipecpaYeoNBhYzox02TgR2p2CbsFWRUYKK_I3j8YL_ySCPyV-6Ft5kh5JqFgaRBwZPfmLj18aSWfg1trSloY0WPgh1e8QOfNh',
    alt: 'Leather & Bags'
  },
  {
    id: 'cat-4',
    name: 'Tailored Trousers',
    piecesCount: 0,
    slug: 'trousers',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA67qGgAmi5R9mMCOvTeXv86p_HrnKLFVGmUnuzRDelnXicSZwkjB47lUkPI5hzcUfkV7YtwfM7MnPBUdcw4M0qdUdeNTuxdNiX35q2LK2tsfXr9A8zqTfc0xnP4IKaDAtO87BH62-XvJNwZHHoGip1ulbVpEBVd19ZV9Cim7bcdnxeRdJBFEF5V8UxSnu56J_zYXa6Zq9BEBXk7y4vFJN_16ZcGLqagJXbSSd8v-1zMQXs4D0BsTfA',
    alt: 'Tailored Trousers'
  },
  {
    id: 'cat-5',
    name: 'Bengal Silk & Shirting',
    piecesCount: 0,
    slug: 'silk',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZxcMeC-UtT2jpeKkY4rwyIO1v-2yTrbIM4wGkINUR5GytvtuUvodGpQPNMIx0pMrz1D5lbJWbvvozsDffUbgpH9xejgyHC4MREeoOuGs_36nGUrdJNcWzjAI9ThHrtspp3rtYjQfHF0t6vwSjIWt_vv4v0VJC81txZunugOo1SOIWMXgjJmGbkagO6xNx_Kp_L0QgVGUKZr-4vAhSQKlkqw9pHbQFMKYgcggc5aPgoL-YRo3LgUZr',
    alt: 'Bengal Silk & Shirting'
  },
  {
    id: 'cat-6',
    name: 'Modern Footwear',
    piecesCount: 0,
    slug: 'footwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORvaoGBc2_tjzpcCQp0EFk7KYQ6PxtdjkLNifKcGCA2V9A2WsWn5EGvc-zwJninnePFFy5Dtk17G8XMRO4jw_uqeIU6L9dOB8oid-Fu8GInkxcZRZqw-xSVmNrkYXRadMg7pMKyq_2TSrRi77CVAl81Cm7txXr_L_MnUAHNOLADe89ztgFJePQJaDPdbFV_BLHw5t7NCqBQku9Y9jIypU0vJIWjitiEX0Q5AkvZSAjk6aFlAY7n0Z',
    alt: 'Modern Footwear'
  }
];

// All demo/mock products have been purged. Products are dynamically fetched from Supabase.
export const PRODUCTS: Product[] = [];

// All fake demo community posts have been purged.
export const COMMUNITY_POSTS: CommunityPost[] = [];

// Clean initial cart with zero demo items.
export const INITIAL_CART: { product: Product; size: string; color: string; quantity: number }[] = [];
