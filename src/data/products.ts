import { Product } from '@/types';

// Base 8 primary products exactly matching the mockup screenshot
const PRIMARY_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Classic White Kurta Pajama',
    price: 2499,
    originalPrice: 3299,
    rating: 4.9,
    reviewCount: 142,
    image: '/images/your-image-19.jpg',
    images: ['/images/your-image-19.jpg', '/images/shopby/everyday.jpg', '/images/your-image-13.jpg'],
    category: 'daily',
    productType: 'Kurta Sets',
    tag: 'BESTSELLER',
    colors: [
      { name: 'Pure White', hex: '#FFFFFF', image: '/images/your-image-19.jpg' },
      { name: 'Midnight Black', hex: '#111111', image: '/images/your-image-16.jpg' },
      { name: 'Soft Beige', hex: '#D2B48C', image: '/images/shopby/wedding.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Crisp, handcrafted pure cotton kurta pajama set featuring a classic mandarin collar and tailored silhouette for everyday elegance and festivities.',
    fabric: '100% Breathable Cotton Slub',
    inStock: true,
    details: {
      material: 'Cotton',
      color: 'Pure White',
      setIncludes: 'Kurta with Pajama',
      work: 'Handcrafted subtle thread stitch with mandarin collar',
      occasion: 'Casual, Festive',
      fit: 'Regular Tailored Fit',
      care: 'Machine wash cold with similar colors',
    },
  },
  {
    id: 'prod-2',
    name: 'Emerald Green Festive Kurta Set',
    price: 2799,
    originalPrice: 3599,
    rating: 5.0,
    reviewCount: 98,
    image: '/images/shopby/festive.jpg',
    images: ['/images/shopby/festive.jpg', '/images/your-image-14.jpg'],
    category: 'festive',
    productType: 'Kurta Sets',
    tag: 'TRENDING',
    colors: [
      { name: 'Emerald Green', hex: '#1E4620', image: '/images/shopby/festive.jpg' },
      { name: 'Midnight Black', hex: '#111111', image: '/images/your-image-16.jpg' },
      { name: 'Royal Navy', hex: '#182945', image: '/images/your-image-17.jpg' },
      { name: 'Soft Beige', hex: '#D2B48C', image: '/images/shopby/wedding.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Opulent festive kurta crafted with subtle sheen and textured weave. Accented with brass buttons for weddings and festive gatherings.',
    fabric: 'Silk-Cotton Blend',
    inStock: true,
    details: {
      material: 'Silk',
      color: 'Emerald Green',
      setIncludes: 'Kurta with Pajama',
      work: 'Subtle woven texture with premium gold finish',
      occasion: 'Festive, Wedding',
      fit: 'Regular Fit',
      care: 'Dry clean only',
    },
  },
  {
    id: 'prod-3',
    name: 'Beige Elegance Kurta Pajama',
    price: 2699,
    originalPrice: 3499,
    rating: 4.8,
    reviewCount: 115,
    image: '/images/shopby/wedding.jpg',
    images: ['/images/shopby/wedding.jpg', '/images/your-image-20.jpg'],
    category: 'daily',
    productType: 'Kurta Sets',
    tag: 'POPULAR',
    colors: [
      { name: 'Warm Beige', hex: '#D2B48C', image: '/images/shopby/wedding.jpg' },
      { name: 'Classic Ivory', hex: '#FAF6F0', image: '/images/your-image-19.jpg' },
      { name: 'Midnight Black', hex: '#111111', image: '/images/your-image-16.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Understated luxury in a warm beige hue. Perfect balance of traditional roots and modern aesthetic, suited for daytime events.',
    fabric: 'Linen-Cotton Weave',
    inStock: true,
    details: {
      material: 'Linen',
      color: 'Warm Beige',
      setIncludes: 'Kurta with Pajama',
      work: 'Intricate collar embroidery & soft wash',
      occasion: 'Casual, Wedding',
      fit: 'Comfort Fit',
      care: 'Hand wash or dry clean',
    },
  },
  {
    id: 'prod-4',
    name: 'Midnight Black Regal Kurta Set',
    price: 2799,
    originalPrice: 3699,
    rating: 4.9,
    reviewCount: 84,
    image: '/images/your-image-16.jpg',
    images: ['/images/your-image-16.jpg', '/images/shopby/formal.jpg'],
    category: 'royal',
    productType: 'Kurta Sets',
    tag: 'EXCLUSIVE',
    colors: [
      { name: 'Midnight Black', hex: '#111111', image: '/images/your-image-16.jpg' },
      { name: 'Deep Navy', hex: '#182945', image: '/images/your-image-17.jpg' },
      { name: 'Charcoal Black', hex: '#1F1F1F', image: '/images/your-image-16.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Sophisticated midnight black kurta ensemble with fine tone-on-tone detailing. An iconic statement piece for evening receptions.',
    fabric: 'Premium Viscose Rayon',
    inStock: true,
    details: {
      material: 'Blended',
      color: 'Midnight Black',
      setIncludes: 'Kurta Set',
      work: 'Tone-on-tone fine stitch work',
      occasion: 'Formal, Wedding',
      fit: 'Tailored Comfort Fit',
      care: 'Gentle wash inside out or dry clean',
    },
  },
  {
    id: 'prod-5',
    name: 'Maroon Festive Kurta',
    price: 2399,
    originalPrice: 2999,
    rating: 4.8,
    reviewCount: 76,
    image: '/images/your-image-13.jpg',
    images: ['/images/your-image-13.jpg', '/images/shopby/festive.jpg'],
    category: 'festive',
    productType: 'Kurtas',
    tag: '20% OFF',
    colors: [
      { name: 'Maroon', hex: '#7A1C24', image: '/images/your-image-13.jpg' },
      { name: 'Midnight Black', hex: '#111111', image: '/images/your-image-16.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Rich royal maroon kurta with delicate self-weave texture and graceful mandarin collar. Ideal for celebrations and family gatherings.',
    fabric: 'Silk Blend',
    inStock: true,
    details: {
      material: 'Silk',
      color: 'Royal Maroon',
      setIncludes: 'Festive Kurta',
      work: 'Fine woven self-pattern with buttons',
      occasion: 'Festive, Wedding',
      fit: 'Regular Fit',
      care: 'Dry clean recommended',
    },
  },
  {
    id: 'prod-6',
    name: 'Sky Blue Kurta',
    price: 2499,
    originalPrice: 3199,
    rating: 4.9,
    reviewCount: 89,
    image: '/images/your-image-14.jpg',
    images: ['/images/your-image-14.jpg', '/images/shopby/comfort-kurta.jpg'],
    category: 'daily',
    productType: 'Kurtas',
    tag: 'NEW',
    colors: [
      { name: 'Sky Blue', hex: '#3B6E96', image: '/images/your-image-14.jpg' },
      { name: 'Ice Blue', hex: '#87CEEB', image: '/images/your-image-14.jpg' },
      { name: 'Ivory White', hex: '#FFFFFF', image: '/images/your-image-19.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Refreshing sky blue shade tailored in light, breathable cotton. Keeps you cool and comfortable while looking effortlessly suave.',
    fabric: 'Pure Cotton',
    inStock: true,
    details: {
      material: 'Cotton',
      color: 'Sky Blue',
      setIncludes: 'Casual Kurta',
      work: 'Handspun cotton slub with subtle placket',
      occasion: 'Casual, Formal',
      fit: 'Comfort Fit',
      care: 'Machine wash gentle',
    },
  },
  {
    id: 'prod-7',
    name: 'Embroidered Kurta Set',
    price: 3499,
    originalPrice: 4299,
    rating: 5.0,
    reviewCount: 142,
    image: '/images/your-image-15.jpg',
    images: ['/images/your-image-15.jpg', '/images/shopby/wedding.jpg'],
    category: 'wedding',
    productType: 'Kurta Sets',
    tag: 'BESTSELLER',
    colors: [
      { name: 'Sage Green', hex: '#2E5A44', image: '/images/your-image-15.jpg' },
      { name: 'Soft Cream', hex: '#FAF6F0', image: '/images/your-image-19.jpg' },
      { name: 'Midnight Black', hex: '#111111', image: '/images/your-image-16.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Artisanal masterpiece with delicate tonal thread embroidery across the chest and cuffs. Designed for weddings and hallmark celebrations.',
    fabric: 'Premium Cotton',
    inStock: true,
    details: {
      material: 'Cotton',
      color: 'Sage Green',
      setIncludes: 'Embroidered Kurta & Pajama',
      work: 'Intricate handmade chikankari-inspired threadwork',
      occasion: 'Wedding, Festive',
      fit: 'Tailored Fit',
      care: 'Dry clean only',
    },
  },
  {
    id: 'prod-8',
    name: 'Navy Waistcoat Set',
    price: 3299,
    originalPrice: 4199,
    rating: 4.9,
    reviewCount: 96,
    image: '/images/your-image-17.jpg',
    images: ['/images/your-image-17.jpg', '/images/shopby/formal.jpg'],
    category: 'royal',
    productType: 'Waistcoats',
    tag: 'BESTSELLER',
    colors: [
      { name: 'Navy Blue', hex: '#182945', image: '/images/your-image-17.jpg' },
      { name: 'Midnight Black', hex: '#111111', image: '/images/your-image-16.jpg' },
      { name: 'Champagne Beige', hex: '#D2B48C', image: '/images/shopby/wedding.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Distinguished 3-piece waistcoat ethnic set. Deep navy textured bandhgala waistcoat over a crisp kurta for ceremonies and receptions.',
    fabric: 'Premium Blend',
    inStock: true,
    details: {
      material: 'Blended',
      color: 'Navy Blue',
      setIncludes: 'Waistcoat, Kurta & Pajama',
      work: 'Textured jacquard weave with metal crested buttons',
      occasion: 'Wedding, Formal, Festive',
      fit: 'Slim Tailored Fit',
      care: 'Professional dry clean only',
    },
  },
];

// Additional products to reach exactly 48 items:
// Kurtas: 24 total (we need 22 more Kurtas)
// Kurta Sets: 12 total (we need 7 more Kurta Sets)
// Pajamas: 6 total (we need 6 Pajamas)
// Waistcoats: 4 total (we need 3 more Waistcoats)
// Accessories: 2 total (we need 2 Accessories)

const EXTRA_KURTAS: Product[] = [
  'Ivory Royal Silk Kurta',
  'Mustard Haldi Festive Kurta',
  'Mint Green Pastel Linen Kurta',
  'Deep Wine Handloom Cotton Kurta',
  'Peach Blossom Chikankari Kurta',
  'Charcoal Gray Mandarin Kurta',
  'Royal Rust Tussar Silk Kurta',
  'Olive Drab Textured Slub Kurta',
  'Pistachio Green Summer Kurta',
  'Burgundy Self Jacquard Kurta',
  'Pure White Lucknowi Kurta',
  'Indigo Block Printed Kurta',
  'Turquoise Blue Festive Kurta',
  'Saffron Orange Temple Kurta',
  'Sand Beige Linen Kurta',
  'Blush Pink Celebratory Kurta',
  'Teal Blue Zari Neck Kurta',
  'Golden Ochre Raw Silk Kurta',
  'Slate Gray Minimalist Kurta',
  'Coral Peach Short Festive Kurta',
  'Forest Green Asymmetric Kurta',
  'Off-White Subtle Embroidered Kurta',
].map((name, i) => {
  const imagesPool = [
    '/images/your-image-20.jpg',
    '/images/shopby/newarrivals.jpg',
    '/images/shopby/comfort-kurta.jpg',
    '/images/your-image-14.jpg',
    '/images/your-image-19.jpg',
    '/images/your-image-13.jpg',
    '/images/shopby/festive.jpg',
    '/images/your-image-21.jpg',
  ];
  const fabrics = ['Pure Cotton', 'Silk Blend', 'Linen-Cotton Weave', '100% Breathable Cotton Slub'];
  const tags = ['NEW', 'TRENDING', 'POPULAR', 'BESTSELLER', 'EXCLUSIVE'];
  const prices = [1999, 2199, 2399, 2499, 2599, 2799, 2999];
  const price = prices[i % prices.length];
  const img = imagesPool[i % imagesPool.length];
  const mat = i % 2 === 0 ? 'Cotton' : i % 3 === 0 ? 'Silk' : 'Linen';

  return {
    id: `kurta-${i + 1}`,
    name,
    price,
    originalPrice: price + 700,
    rating: Number((4.7 + (i % 4) * 0.1).toFixed(1)),
    reviewCount: 40 + i * 5,
    image: img,
    category: i % 2 === 0 ? 'festive' : 'daily',
    productType: 'Kurtas',
    tag: tags[i % tags.length],
    colors: [
      { name: 'Beige', hex: '#D2B48C', image: img },
      { name: 'White', hex: '#FFFFFF', image: '/images/your-image-19.jpg' },
      { name: 'Green', hex: '#1E4620', image: '/images/shopby/festive.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: `Exquisitely woven traditional ${name.toLowerCase()} designed for hallmark Indian celebrations and everyday grace.`,
    fabric: fabrics[i % fabrics.length],
    inStock: true,
    details: {
      material: mat,
      occasion: i % 2 === 0 ? 'Festive, Wedding' : 'Casual, Formal',
      care: 'Gentle wash',
    },
  };
});

const EXTRA_KURTA_SETS: Product[] = [
  'Royal Cream Groom Kurta Set',
  'Deep Emerald Silk Kurta Set',
  'Pearl White Chikankari Kurta Set',
  'Amber Yellow Haldi Kurta Set',
  'Rose Quartz Pastel Kurta Set',
  'Midnight Navy Resham Kurta Set',
  'Imperial Maroon Zardozi Kurta Set',
].map((name, i) => {
  const imagesPool = [
    '/images/shopby/wedding.jpg',
    '/images/your-image-15.jpg',
    '/images/your-image-19.jpg',
    '/images/shopby/festive.jpg',
  ];
  const prices = [2999, 3299, 3499, 3699, 3999];
  const price = prices[i % prices.length];
  const img = imagesPool[i % imagesPool.length];

  return {
    id: `set-${i + 1}`,
    name,
    price,
    originalPrice: price + 900,
    rating: 4.9,
    reviewCount: 65 + i * 8,
    image: img,
    category: 'wedding',
    productType: 'Kurta Sets',
    tag: i % 2 === 0 ? 'EXCLUSIVE' : 'BESTSELLER',
    colors: [
      { name: 'White', hex: '#FFFFFF', image: '/images/your-image-19.jpg' },
      { name: 'Beige', hex: '#D2B48C', image: '/images/shopby/wedding.jpg' },
      { name: 'Navy', hex: '#182945', image: '/images/your-image-17.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: `Complete 2-piece regal kurta pajama ensemble tailored to perfection for celebratory milestones.`,
    fabric: 'Silk Blend',
    inStock: true,
    details: {
      material: 'Silk',
      occasion: 'Wedding, Festive',
      care: 'Dry clean only',
    },
  };
});

const EXTRA_PAJAMAS: Product[] = [
  'Pure White Cotton Churidar Pajama',
  'Straight Fit Beige Linen Aligarhi',
  'Pleated Off-White Dhoti Pants',
  'Midnight Black Relaxed Salwar',
  'Ivory Silk Blend Churidar Pajama',
  'Comfort Elasticated Cotton Pajama',
].map((name, i) => {
  const imagesPool = [
    '/images/shopby/everyday.jpg',
    '/images/your-image-21.jpg',
    '/images/your-image-19.jpg',
    '/images/your-image-16.jpg',
  ];
  const prices = [899, 999, 1199, 1299, 1499, 999];
  const price = prices[i % prices.length];
  const img = imagesPool[i % imagesPool.length];
  const mat = i % 2 === 0 ? 'Cotton' : 'Linen';

  return {
    id: `pajama-${i + 1}`,
    name,
    price,
    originalPrice: price + 400,
    rating: 4.8,
    reviewCount: 88 + i * 11,
    image: img,
    category: 'daily',
    productType: 'Pajamas',
    tag: i === 0 ? 'BESTSELLER' : 'POPULAR',
    colors: [
      { name: 'White', hex: '#FFFFFF', image: img },
      { name: 'Beige', hex: '#D2B48C', image: '/images/your-image-21.jpg' },
      { name: 'Black', hex: '#111111', image: '/images/your-image-16.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Designed for utmost breathability and ease, featuring an adjustable waist and tailored ethnic fit.',
    fabric: i % 2 === 0 ? 'Pure Cotton' : 'Linen-Cotton Weave',
    inStock: true,
    details: {
      material: mat,
      occasion: 'Casual, Festive, Formal',
      care: 'Machine wash',
    },
  };
});

const EXTRA_WAISTCOATS: Product[] = [
  'Raw Silk Cream Bandhgala Nehru Jacket',
  'Charcoal Black Textured Jacquard Waistcoat',
  'Deep Maroon Velvet Festive Waistcoat',
].map((name, i) => {
  const imagesPool = [
    '/images/shopby/formal.jpg',
    '/images/your-image-17.jpg',
    '/images/your-image-16.jpg',
  ];
  const prices = [2699, 2999, 3199];
  const price = prices[i % prices.length];
  const img = imagesPool[i % imagesPool.length];

  return {
    id: `waistcoat-${i + 1}`,
    name,
    price,
    originalPrice: price + 800,
    rating: 4.9,
    reviewCount: 72 + i * 9,
    image: img,
    category: 'royal',
    productType: 'Waistcoats',
    tag: 'EXCLUSIVE',
    colors: [
      { name: 'Black', hex: '#111111', image: img },
      { name: 'Navy', hex: '#182945', image: '/images/your-image-17.jpg' },
      { name: 'Beige', hex: '#D2B48C', image: '/images/shopby/wedding.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Sharp silhouette with structured chest pockets and ornamental crested metal buttons.',
    fabric: 'Silk Blend',
    inStock: true,
    details: {
      material: 'Blended',
      occasion: 'Wedding, Formal',
      care: 'Dry clean only',
    },
  };
});

const EXTRA_ACCESSORIES: Product[] = [
  {
    id: 'acc-1',
    name: 'Zari Bordered Silk Stole Dupatta',
    price: 1299,
    originalPrice: 1799,
    rating: 4.9,
    reviewCount: 45,
    image: '/images/shopby/comfort-kurta.jpg',
    category: 'wedding',
    productType: 'Accessories',
    tag: 'POPULAR',
    colors: [
      { name: 'Beige', hex: '#D2B48C', image: '/images/shopby/comfort-kurta.jpg' },
      { name: 'White', hex: '#FFFFFF', image: '/images/your-image-19.jpg' },
    ],
    sizes: ['Free Size'],
    description: 'Opulent accessory draped over the shoulder to accentuate formal kurta sets.',
    fabric: 'Silk Blend',
    inStock: true,
    details: {
      material: 'Silk',
      occasion: 'Wedding, Festive',
      care: 'Dry clean only',
    },
  },
  {
    id: 'acc-2',
    name: 'Antique Gold Crested Brooch',
    price: 699,
    originalPrice: 999,
    rating: 4.8,
    reviewCount: 68,
    image: '/images/your-image-22.jpg',
    category: 'royal',
    productType: 'Accessories',
    tag: 'TRENDING',
    colors: [
      { name: 'Gold', hex: '#D4AF37', image: '/images/your-image-22.jpg' },
    ],
    sizes: ['Standard'],
    description: 'Vintage-inspired brooch crafted in brass alloy with ruby crystal stone centerpiece.',
    fabric: 'Brass Alloy',
    inStock: true,
    details: {
      material: 'Blended',
      occasion: 'Wedding, Formal',
      care: 'Wipe with soft cloth',
    },
  },
];

// Combine all into exactly 48 items:
// PRIMARY: 8 (prod-1..prod-8)
// EXTRA_KURTAS: 22 (giving 2 + 22 = 24 Kurtas)
// EXTRA_KURTA_SETS: 7 (giving 5 + 7 = 12 Kurta Sets)
// EXTRA_PAJAMAS: 6 (giving 6 Pajamas)
// EXTRA_WAISTCOATS: 3 (giving 1 + 3 = 4 Waistcoats)
// EXTRA_ACCESSORIES: 2 (giving 2 Accessories)
// Total: 8 + 22 + 7 + 6 + 3 + 2 = 48 products!
export const PRODUCTS: Product[] = [
  ...PRIMARY_PRODUCTS,
  ...EXTRA_KURTAS,
  ...EXTRA_KURTA_SETS,
  ...EXTRA_PAJAMAS,
  ...EXTRA_WAISTCOATS,
  ...EXTRA_ACCESSORIES,
];
