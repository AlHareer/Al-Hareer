export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  category: 'all' | 'daily' | 'festive' | 'wedding' | 'royal' | string;
  productType?: 'Kurtas' | 'Kurta Sets' | 'Pajamas' | 'Waistcoats' | 'Accessories' | string;
  tag?: string;
  colors: ProductColor[];
  sizes: string[];
  sizesOutOfStock?: string[];
  variantPrices?: { size: string; price: number; originalPrice?: number }[];
  description: string;
  fabric: string;
  inStock: boolean;
  videoUrl?: string;
  details?: {
    material?: string;
    color?: string;
    setIncludes?: string;
    work?: string;
    occasion?: string;
    fit?: string;
    care?: string;
  };
  // Detail-page-only field — undefined in list views (shop grid, related
  // products, etc.) since fetching it there would be wasted work.
  faqs?: { question: string; answer: string }[];
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
}

export interface OccasionItem {
  id?: string;
  title: string;
  image: string;
  tag: string;
  link?: string;
}
