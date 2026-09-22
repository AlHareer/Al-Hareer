import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat, Caveat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { UIProvider } from '@/context/UIContext';
import Toast from '@/components/ui/Toast';
import CartDrawer from '@/components/modals/CartDrawer';
import ProductQuickViewModal from '@/components/modals/ProductQuickViewModal';
import SearchModal from '@/components/modals/SearchModal';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AL HAREER - Tradition in Style | Premium Ethnic Wear',
  description: 'Premium Kurta Pajama Sets for Every Occasion. Where timeless style meets modern comfort.',
  keywords: 'Kurta Pajama, Ethnic Wear, Indian Traditional Wear, Festive Kurta, Wedding Kurta, AL HAREER',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable} ${caveat.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream-100 text-brand-700 antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <UIProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <CartDrawer />
                <ProductQuickViewModal />
                <SearchModal />
                <FloatingWhatsApp />
                <MobileBottomNav />
                <Toast />
              </WishlistProvider>
            </CartProvider>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
