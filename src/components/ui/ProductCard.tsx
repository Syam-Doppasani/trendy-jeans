import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { Product } from '../../data/products';
import { formatPrice } from '../../lib/format';

export interface ProductCardProps {
  product: Product;
  onQuickAdd: (product: Product) => void;
}

export function ProductCard({ product, onQuickAdd }: ProductCardProps): React.ReactElement {
  const [activeColor, setActiveColor] = useState(product.colors[0]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const isNew = product.tags.includes('new');

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -py * 4,
      y: px * 4,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.2s ease-out',
      }}
      className="group relative flex flex-col bg-surface rounded-card p-3 md:p-4 border border-line shadow-soft transition-all duration-200 hover:shadow-lg"
    >
      {/* Real Product Image Area */}
      <div className="relative aspect-[3/4] w-full rounded-card overflow-hidden bg-bg/50">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badge: "NEW" or "-xx%" */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 pointer-events-none">
          {isNew ? (
            <span className="bg-ink text-surface text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
              NEW
            </span>
          ) : discountPercent > 0 ? (
            <span className="bg-gold text-ink text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-xs">
              -{discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onQuickAdd(product);
          }}
          aria-label={`Quick add ${product.name} to cart`}
          className="absolute bottom-2.5 right-2.5 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-surface/90 backdrop-blur-xs text-ink border border-line shadow-soft flex items-center justify-center hover:bg-ink hover:text-surface transition-all duration-150 cursor-pointer"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Info details */}
      <div className="pt-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Color dots (max 4) */}
          <div className="flex items-center gap-1.5 mb-2">
            {product.colors.slice(0, 4).map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setActiveColor(c)}
                aria-label={`Select color ${c.name}`}
                className={`w-3.5 h-3.5 rounded-full border border-black/15 transition-transform ${
                  activeColor.name === c.name ? 'scale-125 ring-1 ring-gold ring-offset-1' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-muted">+{product.colors.length - 4}</span>
            )}
          </div>

          <Link to={`/product/${product.slug}`} className="block group-hover:text-gold transition-colors">
            <h3 className="font-medium text-sm text-ink line-clamp-1">{product.name}</h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs text-muted">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="font-semibold text-ink">{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
        </div>

        {/* Price row */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-semibold text-sm md:text-base text-ink">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-muted line-through font-normal">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
