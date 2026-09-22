'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, X, ShoppingBag } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { PRODUCTS } from '@/data/products';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, openQuickView } = useUI();
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return PRODUCTS.slice(0, 4);
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-cream-100 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-cream-300 z-10 animate-in zoom-in-95 duration-200 p-6 space-y-6">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-cream-300 pb-4">
          <Search className="w-5 h-5 text-brand-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search kurtas, pajamas, fabrics, colors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-base text-brand-700 placeholder:text-muted focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted hover:text-brand-700 text-xs px-2 py-1 bg-cream-200 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-muted hover:text-brand-700 rounded-full hover:bg-cream-200 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted font-medium">
            <span>
              {query.trim()
                ? `Results for "${query}" (${filteredProducts.length})`
                : 'Suggested Styles'}
            </span>
            <span>Click any item for details</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm text-brand-700 font-medium">No traditional outfits matched your query.</p>
              <p className="text-xs text-muted">Try searching &ldquo;Silk&rdquo;, &ldquo;White&rdquo;, &ldquo;Festive&rdquo;, or &ldquo;Linen&rdquo;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    openQuickView(product);
                  }}
                  className="flex gap-3 p-2.5 rounded-lg border border-cream-300 bg-cream-50 hover:bg-cream-200 hover:border-brand-500 cursor-pointer transition-all group"
                >
                  <div className="relative w-16 h-20 rounded overflow-hidden flex-shrink-0 bg-cream-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h5 className="font-heading text-sm font-semibold text-brand-700 line-clamp-1 group-hover:text-brand-500">
                      {product.name}
                    </h5>
                    <p className="text-[11px] text-muted line-clamp-1">{product.fabric}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-brand-700">₹{product.price}</span>
                      <span className="text-[10px] text-brand-500 font-semibold uppercase flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> View
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
