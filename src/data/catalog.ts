import { Product, CategoryCard, CommunityPost } from '../types';

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXwkE_S1CIlTeaUi2A0kpHKaTO1YMdgcllNa-EuHUFyyKASsJDMmHfzNojZjkKG_haXidUGHAuB3DZwechtj4diS-3gx-5ePjm-jkk8CVwHcGmnzuJs7KvtFABqE-tJ7dE198GYm9fshVFJVkNIXnbGWs7JeUYJCZrWQlrTcsi8FZYsm0tQmXWz4iIkmqvcYTeBYNs0Bouuuv9CMUARxKl81IEsnDikFQKzXTKxP_U0h1VCBJUoS4x';

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    collection: 'COLLECTION N° 08',
    title: 'AUTUMN SOLACE ’25',
    subtitle: 'Pure silhouettes sculptured in raw silks, fine alpaca, and unbleached European wool.',
    cta: 'Shop The Campaign',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxIul4JpU6auSN4aWFcSCXco2-jKGQ0zm0oAAC5ewbu-CWB8mxfO6-XxbiHMo7mW0AqXy9qQ1M70LtYuzM7wYj-SwNNY6qrFrOyF7s1KOhOJnbPvyyzX_2q9wzkKd-Peeg0qCn8gkRmo9Ylj-MK46_nl9laIvAkZ-jMrTSwVVwLD9kuqMIKCzg6M3QmfhtgeEnM0PM0BNg18kQXOuR-Rzg6lRfr4rxIW_MbzCbG1jrCkDgP0cwoKF3',
    alt: 'Editorial fashion photography of an elegant woman wearing a chic oversized beige linen trench suit and tailored wide trousers walking barefoot along an atmospheric sunlit Parisian cobblestone alleyway in warm autumn light.'
  },
  {
    id: 'slide-2',
    collection: 'ATELIER EXCLUSIVES',
    title: 'THE DRAPED SILHOUETTE',
    subtitle: 'Architectural volumes cut from handwoven Belgian flax linen and textured mulberry silk.',
    cta: 'Discover Tailoring',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv7LsuZDvnjFdicVGsMw-FhDihCGLATc1-dkUmqP1y3BUl43XBe1dJxvVT7iHoghhkEiWvq9lQJ4bvddB7w9QkB8nlcA0as9qOLxtjmsA66aEFOOfNkqGhb7v0O1cVPAJZbWX7Gvcl3zA67sEIlS6zl_BFHUeX5jKmcUnyF5Y3HZdfo80-LWwDo9ExVjXhg0YCvXuxz5g099Sl3qAKR_DmOPKetHdxquopGMC4ZQvO4_uDQaxV__y7',
    alt: 'Cinematic fashion editorial banner capturing two models in fluid raw silk drapes and tailored linen walking in warm sunset glow.'
  },
  {
    id: 'slide-3',
    collection: 'CAPSULE ARCHIVE',
    title: 'TEXTURE & ESSENCE',
    subtitle: 'Heritage textures engineered for contemplative ease, warmth, and enduring grace.',
    cta: 'Explore Knitwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaT3orp8LDsSVwHOQRjoYNbIfs5-Am1ium7VVY0-R01mLadKoGKud6-Mdf92UOt6BokjYx1wyRYqOxwGQwiGSJLhkL1ckGqVPYyPkdRn7VpqtAMbKy0Qxoo3gVKrk0afuxGBn_xeyTTnOM3W7vxbarOMtdT-fENwAO3pVPTZh2DRL04xlcytVzg7TUOPfo_tXo9EwWYwHasfCTmqDt6CbbLNVPNLjlFghpL7hWDGZvAHXJblW2QSoE',
    alt: 'Editorial portrait of model in cream knit turtleneck sweater with matching ribbed trousers leaning against a textured terracotta wall.'
  }
];

export const CATEGORIES: CategoryCard[] = [
  {
    id: 'cat-1',
    name: 'Outerwear & Trench',
    piecesCount: 24,
    slug: 'outerwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkrZbPj5hr7o3CWZ0gWno-1UK_CufCPRCNQWSA7qOL429NtOKvZ9NXHsV7JnQMSDzEnhEGMC6O8nu5PfOWG9p8TH-haGxl4GNGjvYzf2sqFSgObCe-aJ1oDRgFA0U5MeAofMyEYEEvfQy45krLZE12WrZVOp4WYS6RjaJ4rExEVaKt2x6YqgTWyRwruWUFjdx0Y2lk7Nsf0Mo2VTbJO9hHQTKhOVSYOzQronCjGDlzRJF5T2l42b1z',
    alt: 'Modern sculptural luxury camel wool trench coat on a model against minimalist sand-toned architecture studio.'
  },
  {
    id: 'cat-2',
    name: 'Fine Knitwear',
    piecesCount: 18,
    slug: 'knitwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaT3orp8LDsSVwHOQRjoYNbIfs5-Am1ium7VVY0-R01mLadKoGKud6-Mdf92UOt6BokjYx1wyRYqOxwGQwiGSJLhkL1ckGqVPYyPkdRn7VpqtAMbKy0Qxoo3gVKrk0afuxGBn_xeyTTnOM3W7vxbarOMtdT-fENwAO3pVPTZh2DRL04xlcytVzg7TUOPfo_tXo9EwWYwHasfCTmqDt6CbbLNVPNLjlFghpL7hWDGZvAHXJblW2QSoE',
    alt: 'Editorial portrait of model in cream knit turtleneck sweater with matching ribbed trousers leaning against a textured terracotta wall.'
  },
  {
    id: 'cat-3',
    name: 'Leather & Bags',
    piecesCount: 15,
    slug: 'leather',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv3zF1urBy_3iIL0aUwNoIV-dfPcPY_cZLZJK5mC3WE2fPMTgJeJ-hYHpVwDqi_2C0Mt99U2BXL6bC7ZJhJ7rqW4aW4l2FIOF99j3X_GAsvJOS2_61FYZpd0kmLWnjKP-0DaPmEr7QFgBrCQ7_lFJipecpaYeoNBhYzox02TgR2p2CbsFWRUYKK_I3j8YL_ySCPyV-6Ft5kh5JqFgaRBwZPfmLj18aSWfg1trSloY0WPgh1e8QOfNh',
    alt: 'Warm flat lay arrangement of luxury cognac brown leather satchel purse with gold hardware on travertine stone surrounded by accessories.'
  },
  {
    id: 'cat-4',
    name: 'Tailored Trousers',
    piecesCount: 20,
    slug: 'trousers',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA67qGgAmi5R9mMCOvTeXv86p_HrnKLFVGmUnuzRDelnXicSZwkjB47lUkPI5hzcUfkV7YtwfM7MnPBUdcw4M0qdUdeNTuxdNiX35q2LK2tsfXr9A8zqTfc0xnP4IKaDAtO87BH62-XvJNwZHHoGip1ulbVpEBVd19ZV9Cim7bcdnxeRdJBFEF5V8UxSnu56J_zYXa6Zq9BEBXk7y4vFJN_16ZcGLqagJXbSSd8v-1zMQXs4D0BsTfA',
    alt: 'Model posing in elegant pleated wide leg ecru trousers with structured waistline on natural stone podium.'
  },
  {
    id: 'cat-5',
    name: 'Silk & Shirting',
    piecesCount: 14,
    slug: 'silk',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZxcMeC-UtT2jpeKkY4rwyIO1v-2yTrbIM4wGkINUR5GytvtuUvodGpQPNMIx0pMrz1D5lbJWbvvozsDffUbgpH9xejgyHC4MREeoOuGs_36nGUrdJNcWzjAI9ThHrtspp3rtYjQfHF0t6vwSjIWt_vv4v0VJC81txZunugOo1SOIWMXgjJmGbkagO6xNx_Kp_L0QgVGUKZr-4vAhSQKlkqw9pHbQFMKYgcggc5aPgoL-YRo3LgUZr',
    alt: 'Sensual drapery of oyster white mulberry silk shirt on a high-fashion runway model with warm ambient backlight.'
  },
  {
    id: 'cat-6',
    name: 'Modern Footwear',
    piecesCount: 11,
    slug: 'footwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORvaoGBc2_tjzpcCQp0EFk7KYQ6PxtdjkLNifKcGCA2V9A2WsWn5EGvc-zwJninnePFFy5Dtk17G8XMRO4jw_uqeIU6L9dOB8oid-Fu8GInkxcZRZqw-xSVmNrkYXRadMg7pMKyq_2TSrRi77CVAl81Cm7txXr_L_MnUAHNOLADe89ztgFJePQJaDPdbFV_BLHw5t7NCqBQku9Y9jIypU0vJIWjitiEX0Q5AkvZSAjk6aFlAY7n0Z',
    alt: 'Editorial still life of sculptural caramel leather ankle boots standing against raw plaster and warm sunlight reflections.'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Alpaca Cocoon Coat',
    category: 'Outerwear',
    subtitle: 'Virgin Wool • Sandstone',
    price: 480,
    currency: '€',
    tag: 'Limited',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYKsgAQ07g-41pEX-iKj4nbRlqEbQgY0tBx4NHja55xAb6oOmDWCdE1LkUGBK0D7ubHYtUj56HcqlPBTtThLPF4CDj7VP-fVxsn5CNX8PnEa6z0Yzm7s21FYWCz7IoRYUB4BJot3oTYqncArxuYg7rLqUYWjzBWPQW4e9zvDJq7CHbxKOOL3xwQf_2mEaPlSC5Ch-pE_Fqzi02hcqYBK3E_GxZ1u3BSmqgGUDp6X2f_sVdqPdoRklN',
    alt: 'Editorial studio portrait of woman wearing oversized alpaca cocoon coat in rich warm sand tone.',
    description: 'An architectural outerwear masterpiece cut with generous, relaxed sloping shoulders. Loomed from natural Andean baby alpaca and unbleached European virgin wool with horn-button concealed closures.',
    fabric: '70% Royal Baby Alpaca, 30% Fine Virgin Wool; 100% Cupro lining',
    origin: 'Crafted in Biella, Italy',
    sizes: ['36 FR', '38 FR', '40 FR', '42 FR'],
    colors: ['Sandstone', 'Oatmeal Melange', 'Deep Obsidian']
  },
  {
    id: 'prod-2',
    name: 'Cashmere Ribbed Turtleneck',
    category: 'Knitwear',
    subtitle: 'Pure Cashmere • Ivory',
    price: 260,
    currency: '€',
    tag: 'Best Seller',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9eNuTouW8cvE3UE3XB0Z0mkT_0r8MUCGT6mh0ywd8IRaoVrZr4fnt-A0qLC3_eVA28ORImns5rYLn6Irfsfty5WZQSbAwnPIytFWT799MzRPZMT12UoiIKew9wuJ7ADWwwZ6ns6Tl1_pypf2wP-2XZNvq6A2Kt2xbwQo8hrCNLx-sqGiqREu16uFJ1YdSgNjuxxPPJd6Hk1O02tfvaVJtRFHhjRwyttBWRi28-kRoKXCL3qNygae',
    alt: 'Close up knit texture on woman wearing luxury thick cashmere ribbed turtleneck in warm cream.',
    description: 'A tactile, heavyweight rib-knitted sweater with an elongated folded funnel neckline. Spun from 4-ply grade-A Mongolian cashmere fibers for supreme cloud-soft thermal comfort.',
    fabric: '100% Grade-A Pure Cashmere (4-ply, 7-gauge)',
    origin: 'Spun and knitted in Hawick, Scotland',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Ivory', 'Raw Camel', 'Charcoal Heather']
  },
  {
    id: 'prod-3',
    name: 'Travertine Leather Bag',
    category: 'Leather Goods',
    subtitle: 'Full-grain Calfskin • Cognac',
    price: 390,
    currency: '€',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMrZY-H7bv9i_8f8AsjQ7A7tksf6furRwQ7D1--2p-fy1w1z3oc-g-ZpO2DQZk95C8zWB5yp0yd0ZcCIdYInZ8HueAtOxc8aum5O2Z5BclUAImoOCLlvhjf8iB0MgRPifVkvdNogdFdh1XGXEQFr__EElXTDeOjiRuwLnKxPqqgiBuoITk_B6AFYtrJZ5OCZY6WcOFA3iwitq8c0CP-85Lv53psJbFZXp8oAt4c7_Jf4COaCydHI6A',
    alt: 'Editorial studio angle of structured caramel brown textured leather handbag resting on polished natural stone.',
    description: 'Sculptural silhouette formed from vegetable-tanned French calfskin with polished solid brass hardware and an interior suede compartment sized for tablets and daily essentials.',
    fabric: '100% French Full-Grain Calfskin with Tuscan brass lock',
    origin: 'Handmade in Florence, Italy',
    sizes: ['One Size (30 × 22 × 11 cm)'],
    colors: ['Cognac', 'Espresso Box', 'Natural Vachetta']
  },
  {
    id: 'prod-4',
    name: 'Pleated Wool Trouser',
    category: 'Trousers',
    subtitle: 'Merino Blend • Desert Amber',
    price: 220,
    currency: '€',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGn_fu41rL3aGqATEc6n58uTthwpJBHpZu_Ov7cjB9xp75m9p3p2p4EPYIbiFYLEfX4-aTwun3WN88bWolFb33b1UAt9mpKJdIS9B5RBC9OtKH1gIorzJ0Zu71fbvUqImf4kcPCTxGbmeu6f1pk8ENdlFjWP34NZr5w7wC3lxrk1FbXd2vnQQKpZTqc4h5bO_FV-ScpiMkV7NgbihK5fJJfaM5zHSTkG4H0IStu6gm0NlwPtkpbkmc',
    alt: 'Tailored model posing in fluid wide-leg pleated wool trousers in amber mustard tone.',
    description: 'High-waisted wide-leg tailored trousers featuring sharp double knife pleats and an unbroken drape. Finished with pick-stitch detailing and extended button waistband tabs.',
    fabric: '92% Extra-Fine Merino Wool, 8% Mulberry Silk',
    origin: 'Tailored in Porto, Portugal',
    sizes: ['34 FR', '36 FR', '38 FR', '40 FR', '42 FR'],
    colors: ['Desert Amber', 'Ecru Chalk', 'Obsidian Slate']
  },
  {
    id: 'prod-5',
    name: 'Sculptural Linen Trench',
    category: 'Outerwear',
    subtitle: 'Belgian Linen • Sand',
    price: 540,
    currency: '€',
    tag: 'New',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkrZbPj5hr7o3CWZ0gWno-1UK_CufCPRCNQWSA7qOL429NtOKvZ9NXHsV7JnQMSDzEnhEGMC6O8nu5PfOWG9p8TH-haGxl4GNGjvYzf2sqFSgObCe-aJ1oDRgFA0U5MeAofMyEYEEvfQy45krLZE12WrZVOp4WYS6RjaJ4rExEVaKt2x6YqgTWyRwruWUFjdx0Y2lk7Nsf0Mo2VTbJO9hHQTKhOVSYOzQronCjGDlzRJF5T2l42b1z',
    alt: 'Modern sculptural luxury camel wool trench coat on a model.',
    description: 'A definitive statement piece tailored with storm flaps, horn buckle belt, and structured storm collar. Balanced between breezy lightness and crisp tailoring.',
    fabric: '100% Belgian Master of Linen Certified',
    origin: 'Crafted in Paris Atelier',
    sizes: ['36 FR', '38 FR', '40 FR'],
    colors: ['Sand', 'Raw Flax']
  },
  {
    id: 'prod-6',
    name: 'Mulberry Silk Draped Blouse',
    category: 'Silk & Shirting',
    subtitle: 'Raw Silk • Oyster',
    price: 290,
    currency: '€',
    tag: 'Limited',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZxcMeC-UtT2jpeKkY4rwyIO1v-2yTrbIM4wGkINUR5GytvtuUvodGpQPNMIx0pMrz1D5lbJWbvvozsDffUbgpH9xejgyHC4MREeoOuGs_36nGUrdJNcWzjAI9ThHrtspp3rtYjQfHF0t6vwSjIWt_vv4v0VJC81txZunugOo1SOIWMXgjJmGbkagO6xNx_Kp_L0QgVGUKZr-4vAhSQKlkqw9pHbQFMKYgcggc5aPgoL-YRo3LgUZr',
    alt: 'Sensual drapery of oyster white mulberry silk shirt on runway model.',
    description: 'Sensual fluid drapery with mother-of-pearl buttons and tailored French cuffs. Floats gently on the shoulders with effortless motion.',
    fabric: '100% Mulberry Silk Habotai 22mm',
    origin: 'Crafted in Lyon, France',
    sizes: ['36 FR', '38 FR', '40 FR'],
    colors: ['Oyster', 'Pale Gold', 'Noir']
  },
  {
    id: 'prod-7',
    name: 'Caramel Leather Ankle Boots',
    category: 'Footwear',
    subtitle: 'Calfskin • Caramel',
    price: 440,
    currency: '€',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORvaoGBc2_tjzpcCQp0EFk7KYQ6PxtdjkLNifKcGCA2V9A2WsWn5EGvc-zwJninnePFFy5Dtk17G8XMRO4jw_uqeIU6L9dOB8oid-Fu8GInkxcZRZqw-xSVmNrkYXRadMg7pMKyq_2TSrRi77CVAl81Cm7txXr_L_MnUAHNOLADe89ztgFJePQJaDPdbFV_BLHw5t7NCqBQku9Y9jIypU0vJIWjitiEX0Q5AkvZSAjk6aFlAY7n0Z',
    alt: 'Editorial still life of sculptural caramel leather ankle boots.',
    description: 'Architectural block heel with supple glove-tanned leather, memory foam arch support, and durable Goodyear welt construction.',
    fabric: '100% Tuscan Glove Leather, Hand-stacked wooden heel 55mm',
    origin: 'Artisanal workshop in Marche, Italy',
    sizes: ['37 EU', '38 EU', '39 EU', '40 EU', '41 EU'],
    colors: ['Caramel', 'Burnt Siena', 'Deep Black']
  }
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXnNz7eewX0QpR0LypwLmLMPL0IoYQtIqCxKNo45Qb-wy1KHf14sGPlhZO5j52KEICY0PRrnGL2Cl55pnY_GJiqNt_iy8rrs668TguszFndKexNLUzW1FAbi-Xd-HtWO_JImVDoarTrCELD9VfK4uviZ0V_Plc9YM0VgKrk27bIpQ6lufPTeT67Jk1LjIm-sGQbVGpt13OjaGXY1eTHGOYks-z11OAx0nKRQ0gpWi37F-Vbsl9yGXO',
    alt: 'Street style snapshot of fashionable woman in oversized linen trench drinking espresso outside a Parisian cafe.',
    caption: 'Mornings at Café de Flore in the oversized trench suit.',
    author: '@camille_parisian',
    likes: 1420
  },
  {
    id: 'post-2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYm-SFd_k8VOx81fb11lP2qX5l0RXbGBqsS_T9DzW3bxFblnqqZxuMSeOyUP2BEQS2J3B6lsmA0khnL17nyP1OIOdokUAVE2KBaAT5EKfoQhnKuL0pjUMIMS6RGZSZjxsx0z5rzqL0HeZOkXGi4cjpt8cYx7JzmQVQmXmkUs9_ZzHFkExK-ITWIu4tgol0ZoMd5MQP3ut7c8ThnepJSIDO4gJCkT-GDrx52ukxIKS0TfH3989UaXCU',
    alt: 'Editorial portrait of model styling the cream cashmere knit scarf during autumn golden hour in Madrid.',
    caption: 'Pure warmth against the Madrid autumn breeze.',
    author: '@sofia.atelier',
    likes: 980
  },
  {
    id: 'post-3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_U_iELFcbtROKzh55rux3YrJIIRUPF5zkO3j6J0jXS9w1OPO8bGiccLn9atty3Lfx3ui-vBTTXLDzC0NMfdO026uXbBz004fx_Ggs_Y72JMRMWf1eEY8PNBG8_S2kgegqHALbUOF-cXVI_5l0N7b8oIEzB1gRjDHVvgzitNuMrlGLhJxWL6iIb7QoExhPrcve9kgOoY28G1jQ4a3FxFN163xqDBsGCbklbQzOxJLHAh3bPwtulfBM',
    alt: 'Chic aesthetic shot of structured ELIF leather satchel handbag resting on modern architectural steps.',
    caption: 'Lines and light. The Travertine in Cognac.',
    author: '@arch.minimal',
    likes: 2150
  },
  {
    id: 'post-4',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCZ98YQsK3TzYNTs4-eJzGdJLxSZOgFyHz51wjbobPleBPClU11o5yLbPERxkZI7wq3KpsgTsXEbvXIezFyo4vU0rJ2-2p84yLYvo-Nm5m-6Pjrywog7_CL25JVEHIx7LThRsAIPfHUta03Ku9cbKWWBrZ7HIRbAyqBeqkfHbANwqMpXDPKhfW5B5MAwVSLwlgKWSAjofPv-tnBdQGD8gUw109MAhDiCFwHCUlvdLNPkPgQ7U2HlDt',
    alt: 'Minimalist street style portrait featuring wide leg wool trousers paired with ankle boots strolling in Milan.',
    caption: 'Milanese strides in pleated amber merino wool.',
    author: '@elena.studiomilano',
    likes: 1670
  }
];

export const INITIAL_CART: { product: Product; size: string; color: string; quantity: number }[] = [
  {
    product: PRODUCTS[0], // Alpaca Cocoon Coat (€480)
    size: '38 FR',
    color: 'Sandstone',
    quantity: 1
  },
  {
    product: PRODUCTS[1], // Cashmere Ribbed Turtleneck (€260)
    size: 'S',
    color: 'Ivory',
    quantity: 1
  }
];
