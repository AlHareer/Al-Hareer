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
  description: string;
  fabric: string;
  inStock: boolean;
  details?: {
    material?: string;
    color?: string;
    setIncludes?: string;
    work?: string;
    occasion?: string;
    fit?: string;
    care?: string;
  };
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
  id: string;
  title: string;
  image: string;
  tag: string;
}
