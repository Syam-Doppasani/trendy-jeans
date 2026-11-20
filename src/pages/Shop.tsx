import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';
import { QuickAddModal } from '../components/ui/QuickAddModal';
import { Chip } from '../components/ui/Chip';
import { formatPrice } from '../lib/format';

const CATEGORIES = ['All', 'Jeans', 'T-Shirts', 'Shirts', 'Hoodies & Jackets'];
const ALL_SIZES = ['28', '30', '32', '34', '36', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Shop(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Read URL params
  const activeCategory = searchParams.get('category') || 'All';
  const activeSort = searchParams.get('sort') || 'featured';

  // Local filter states
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3000);

  // Update document title and reset scroll position to top
  useEffect(() => {
    document.title = activeCategory === 'All' 
      ? 'Shop All Styles — Trendy Jeans' 
      : `${activeCategory} — Trendy Jeans`;
    window.scrollTo(0, 0);
  }, [activeCategory]);

  const handleCategoryChange = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (sort === 'featured') {
      newParams.delete('sort');
    } else {
      newParams.set('sort', sort);
    }
    setSearchParams(newParams);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setMaxPrice(3000);
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (activeCategory !== 'All' && product.category !== activeCategory) {
        return false;
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // Size filter (must match at least one selected size)
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => product.sizes.includes(s));
        if (!hasSize) return false;
      }
      return true;
    }).sort((a, b) => {
      if (activeSort === 'price-asc') return a.price - b.price;
      if (activeSort === 'price-desc') return b.price - a.price;
      if (activeSort === 'rating') return b.rating - a.rating;
      return 0; // featured / default
    });
  }, [activeCategory, activeSort, selectedSizes, maxPrice]);

  return (
    <div className="w-full min-h-screen">
      {/* Sticky Filter Bar under Header */}
      <div className="sticky top-[60px] z-30 bg-surface/90 backdrop-blur-md border-b border-line py-3">
        <div className="page-container flex items-center justify-between gap-4">
          {/* Category Chips scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[calc(100vw-140px)] md:max-w-none">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => handleCategoryChange(cat)}
              />
            ))}
          </div>

          {/* Controls: Filter Button & Sort */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={activeSort}
              onChange={(e) => handleSortChange(e.target.value)}
              aria-label="Sort products"
              className="hidden sm:block min-h-[44px] px-3 rounded-btn border border-line bg-surface text-xs font-medium text-ink focus:outline-none focus:border-gold"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(true)}
              aria-label="Open filter options"
              className="min-h-[44px] px-4 rounded-btn border border-line bg-surface text-ink text-xs font-medium inline-flex items-center gap-1.5 hover:border-ink transition-colors relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {(selectedSizes.length > 0 || maxPrice < 3000) && (
                <span className="w-2 h-2 rounded-full bg-gold ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-muted">
            Showing <strong className="text-ink">{filteredProducts.length}</strong> styles
          </p>
        </div>

        {/* Product Grid: 2 cols on mobile (gap 12px), 3 cols at 768px+, 4 at 1280px+ */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <p className="text-muted text-base mb-4">No styles match your filters.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={setQuickAddProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      {isFilterSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
          className="fixed inset-0 z-50 flex justify-center items-end animate-fade-in"
        >
          <div
            onClick={() => setIsFilterSheetOpen(false)}
            className="fixed inset-0 bg-ink/60 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-lg bg-surface rounded-t-[20px] p-6 shadow-soft max-h-[80dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
              <h3 className="font-heading text-lg font-semibold text-ink">Filters</h3>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-bg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Sort options inside sheet */}
            <div className="sm:hidden mb-6">
              <span className="label-caps text-muted text-[11px] block mb-2.5">Sort by</span>
              <select
                value={activeSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-btn border border-line bg-surface text-sm font-medium"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Max Price Slider (₹500 to ₹3,000) */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="label-caps text-muted text-[11px]">Max Price</span>
                <span className="text-sm font-semibold text-ink">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-ink"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>₹500</span>
                <span>₹3,000</span>
              </div>
            </div>

            {/* Size multi-select */}
            <div className="mb-8">
              <span className="label-caps text-muted text-[11px] block mb-3">Sizes</span>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`min-w-[44px] min-h-[44px] px-3 rounded-btn text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-ink text-surface shadow-soft'
                          : 'bg-bg text-ink border border-line hover:border-ink/50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="btn-secondary flex-1"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="btn-primary flex-1"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />
    </div>
  );
}
