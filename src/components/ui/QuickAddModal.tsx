import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Product } from '../../data/products';
import { useCart } from '../../store/cart';
import { useToast } from '../../store/toast';
import { formatPrice } from '../../lib/format';
import { Swatch } from './Swatch';
import { SizeSelector } from './SizeSelector';
import { Button } from './Button';

export interface QuickAddModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickAddModal({ product, onClose }: QuickAddModalProps): React.ReactElement | null {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Initialize selected color when product opens
  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(null);
      setIsShaking(false);
    }
  }, [product]);

  if (!product) return null;

  const activeColorObj =
    product.colors.find((c) => c.name === selectedColor) || product.colors[0];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setIsShaking(true);
      showToast('Please select a size');
      setTimeout(() => setIsShaking(false), 200);
      return;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      color: activeColorObj.name,
      colorHex: activeColorObj.hex,
      size: selectedSize,
      qty: 1,
      price: product.price,
      mrp: product.mrp,
      garment: product.garment,
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Select size for ${product.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative z-10 w-full max-w-sm bg-surface rounded-card p-6 shadow-soft border border-line">
        <div className="flex items-start justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 rounded-card object-cover border border-line flex-shrink-0"
            />
            <div>
              <h3 className="font-heading font-semibold text-lg text-ink">{product.name}</h3>
              <p className="text-sm font-semibold text-ink mt-0.5">
                {formatPrice(product.price)}{' '}
                <span className="text-xs text-muted line-through font-normal">
                  {formatPrice(product.mrp)}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color selection */}
        <div className="py-4 border-b border-line">
          <div className="flex justify-between items-center mb-2">
            <span className="label-caps text-muted text-[11px]">Color</span>
            <span className="text-xs font-medium text-ink">{activeColorObj.name}</span>
          </div>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <Swatch
                key={color.name}
                color={color}
                selected={activeColorObj.name === color.name}
                onClick={() => setSelectedColor(color.name)}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Size selection */}
        <div className="py-4">
          <div className="flex justify-between items-center mb-2.5">
            <span className="label-caps text-muted text-[11px]">Select Size</span>
            {selectedSize && (
              <span className="text-xs font-semibold text-gold">Selected: {selectedSize}</span>
            )}
          </div>
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            outOfStock={product.outOfStock}
            onSelect={setSelectedSize}
            isShaking={isShaking}
          />
        </div>

        <Button variant="primary" onClick={handleAddToCart} className="w-full mt-2">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
