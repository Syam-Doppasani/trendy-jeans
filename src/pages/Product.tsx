import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MessageCircle, ShoppingBag, Ruler, X, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { SIZE_GUIDE_DATA } from '../data/content';
import { SHOP_NAME } from '../config/shop';
import { formatPrice, buildWhatsAppProductUrl } from '../lib/format';
import { GarmentView } from '../components/three/GarmentView';
import { Swatch } from '../components/ui/Swatch';
import { SizeSelector } from '../components/ui/SizeSelector';
import { QtyStepper } from '../components/ui/QtyStepper';
import { Accordion } from '../components/ui/Accordion';
import { ProductCard } from '../components/ui/ProductCard';
import { QuickAddModal } from '../components/ui/QuickAddModal';
import { Button } from '../components/ui/Button';
import { Magnetic } from '../components/cursor/Magnetic';
import { useCart } from '../store/cart';
import { useToast } from '../store/toast';
import NotFound from './NotFound';

export default function Product(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return <NotFound />;
  }

  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<typeof product | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');

  const mainAddBtnRef = useRef<HTMLButtonElement>(null);

  // Update selected color when product changes
  useEffect(() => {
    setSelectedColor(product.colors[0]);
    setSelectedSize(null);
    setQty(1);
  }, [product.id]);

  // SEO: Update page title and description
  useEffect(() => {
    document.title = `${product.name} — ${SHOP_NAME}`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${product.name} - ${product.description}`);
    }
  }, [product]);

  // Observer to show/hide sticky bottom bar on mobile when main button scrolls out
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (mainAddBtnRef.current) {
      observer.observe(mainAddBtnRef.current);
    }
    return () => observer.disconnect();
  }, []);

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
      color: selectedColor.name,
      colorHex: selectedColor.hex,
      size: selectedSize,
      qty,
      price: product.price,
      mrp: product.mrp,
      garment: product.garment,
    });
  };

  const discountAmount = product.mrp - product.price;

  // "You may also like": 4 products from same category or others
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id)
    .sort((a) => (a.category === product.category ? -1 : 1))
    .slice(0, 4);

  // JSON-LD Product schema
  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: SHOP_NAME,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };

  const accordionItems = [
    {
      id: 'desc',
      title: 'Description',
      content: <p>{product.description}</p>,
    },
    {
      id: 'fabric',
      title: 'Fabric & care',
      content: (
        <div className="space-y-1">
          <p><strong>Composition:</strong> {product.fabric}</p>
          <p><strong>Fit:</strong> {product.fit}</p>
          <p>Machine wash cold with like colors. Do not bleach. Tumble dry low.</p>
        </div>
      ),
    },
    {
      id: 'delivery',
      title: 'Delivery & returns',
      content: (
        <div className="space-y-1">
          <p>Local delivery within 24 to 48 hours in our service area.</p>
          <p>Easy size exchange within 7 days of delivery at our retail store or via local pickup.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container py-6 md:py-12">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted flex items-center gap-2">
        <Link to="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-ink transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate">{product.name}</span>
      </nav>

      {/* Main product showcase: 1 col on mobile, 2 cols at 1024px+ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left: Product Showcase (Real Photo by default, with 3D Toggle) */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[90px] w-full bg-surface rounded-card border border-line shadow-soft p-4 md:p-6">
            {/* View Mode Switcher */}
            <div className="flex items-center justify-between mb-4">
              <span className="label-caps text-xs text-muted">
                {viewMode === 'photo' ? 'Studio Photography' : 'Interactive 3D'}
              </span>
              <div className="inline-flex rounded-btn border border-line bg-bg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={`px-3 py-1 text-xs font-semibold rounded-btn transition-colors cursor-pointer ${
                    viewMode === 'photo'
                      ? 'bg-ink text-surface shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  Photo View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1 text-xs font-semibold rounded-btn transition-colors cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-ink text-surface shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  3D View
                </button>
              </div>
            </div>

            {viewMode === 'photo' ? (
              <div className="relative aspect-square w-full rounded-card overflow-hidden bg-bg/40 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              </div>
            ) : (
              <GarmentView
                type={product.garment}
                colorHex={selectedColor.hex}
                fit={product.fit}
                productId={product.id}
                name={product.name}
                mode="viewer"
                aspect="aspect-square"
              />
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 flex flex-col">
          <h1 className="text-2xl md:text-4xl font-heading font-semibold text-ink mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-muted mb-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-line'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-ink ml-1">{product.rating}</span>
            <span>({product.reviews} reviews)</span>
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-line">
            <span className="text-2xl md:text-3xl font-semibold text-ink">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm md:text-base text-muted line-through">
              {formatPrice(product.mrp)}
            </span>
            {discountAmount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold">
                You save {formatPrice(discountAmount)}
              </span>
            )}
          </div>

          {/* Color swatches */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2.5">
              <span className="label-caps text-muted text-xs">Color</span>
              <span className="text-xs font-medium text-ink">{selectedColor.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {product.colors.map((c) => (
                <Swatch
                  key={c.name}
                  color={c}
                  selected={selectedColor.name === c.name}
                  onClick={() => setSelectedColor(c)}
                  size="md"
                />
              ))}
            </div>
          </div>

          {/* Size selector & Size guide link */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2.5">
              <span className="label-caps text-muted text-xs">Select Size</span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-ink underline font-medium hover:text-gold inline-flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              outOfStock={product.outOfStock}
              onSelect={setSelectedSize}
              isShaking={isShaking}
            />
          </div>

          {/* Quantity Stepper */}
          <div className="mb-6">
            <span className="label-caps text-muted text-xs block mb-2.5">Quantity</span>
            <QtyStepper value={qty} onChange={setQty} min={1} max={10} />
          </div>

          {/* Action buttons: Add to Cart & WhatsApp */}
          <div className="flex flex-col gap-3 mb-6">
            <Magnetic strength={0.25} radius={80}>
              <Button
                ref={mainAddBtnRef}
                variant="primary"
                onClick={handleAddToCart}
                className="w-full text-base font-semibold"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to cart
              </Button>
            </Magnetic>

            <a
              href={buildWhatsAppProductUrl(
                product.name,
                selectedColor.name,
                selectedSize || 'Not selected',
                qty
              )}
              target="_blank"
              rel="noreferrer"
              className="w-full h-[52px] rounded-full border-1.5 border-[#25D366]/70 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-ink font-semibold text-sm inline-flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <span>Order on WhatsApp</span>
            </a>

            {/* Quick trust strip */}
            <div className="mt-2 p-3.5 rounded-card bg-[#F8F6F1] border border-line flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-gold" />
                24–48h Dispatch
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-gold" />
                7-Day Free Exchange
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                100% Genuine
              </span>
            </div>
          </div>

          {/* Accordion: Description, Fabric & Care, Delivery & Returns */}
          <Accordion items={accordionItems} />
        </div>
      </div>

      {/* "You may also like" */}
      <section className="mt-20 pt-12 border-t border-line">
        <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">
          You may also like
        </h2>
        <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          {relatedProducts.map((p) => (
            <div
              key={p.id}
              className="w-[72vw] sm:w-[50vw] md:w-[40vw] lg:w-auto flex-shrink-0 snap-start"
            >
              <ProductCard product={p} onQuickAdd={setQuickAddProduct} />
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Mobile Action Bar (above BottomNav, visible once main button scrolls out of view) */}
      {showStickyBar && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-line px-4 py-3 flex items-center justify-between shadow-soft animate-fade-in">
          <div>
            <span className="text-xs text-muted block">Price</span>
            <span className="text-base font-semibold text-ink">{formatPrice(product.price)}</span>
          </div>
          <Button variant="primary" onClick={handleAddToCart} className="min-h-[44px] px-6 text-sm">
            Add to cart
          </Button>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Size Guide"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={() => setIsSizeGuideOpen(false)}
            className="fixed inset-0 bg-ink/60 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-md bg-surface rounded-card p-6 shadow-soft border border-line">
            <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
              <h3 className="font-heading font-semibold text-lg text-ink">Size Guide</h3>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-8 h-8 inline-flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-bg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {product.garment === 'jeans' ? (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                  Jeans Waist Measurements
                </h4>
                <div className="border border-line rounded-card overflow-hidden text-xs">
                  <div className="grid grid-cols-3 bg-bg p-2.5 font-semibold text-ink border-b border-line">
                    <span>Size</span>
                    <span>Waist (Inches)</span>
                    <span>Waist (cm)</span>
                  </div>
                  {SIZE_GUIDE_DATA.jeans.map((row) => (
                    <div
                      key={row.size}
                      className="grid grid-cols-3 p-2.5 border-b border-line/60 last:border-b-0 text-muted"
                    >
                      <span className="font-semibold text-ink">{row.size}</span>
                      <span>{row.waistIn}</span>
                      <span>{row.waistCm}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                  Tops Chest Measurements
                </h4>
                <div className="border border-line rounded-card overflow-hidden text-xs">
                  <div className="grid grid-cols-2 bg-bg p-2.5 font-semibold text-ink border-b border-line">
                    <span>Size</span>
                    <span>Chest (Inches)</span>
                  </div>
                  {SIZE_GUIDE_DATA.tops.map((row) => (
                    <div
                      key={row.size}
                      className="grid grid-cols-2 p-2.5 border-b border-line/60 last:border-b-0 text-muted"
                    >
                      <span className="font-semibold text-ink">{row.size}</span>
                      <span>{row.chestIn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted mt-4">
              Measurements reflect garment sizing. Visit our store to try in person or exchange within 7 days.
            </p>
          </div>
        </div>
      )}

      {/* Quick Add Modal for related products */}
      <QuickAddModal
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />
    </div>
  );
}
