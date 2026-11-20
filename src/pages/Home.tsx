import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  RefreshCw,
  Truck,
  MessageCircle,
  Copy,
  Star,
  MapPin,
  Clock,
  Phone,
  Box,
  ShoppingBag,
  MessageSquare,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';
import { VALUE_PROPS, TESTIMONIALS, FAQS, WHITESEA_SERVICES } from '../data/content';
import {
  ADDRESS,
  HOURS,
  PHONE,
  WHATSAPP_NUMBER,
  WHITESEA_URL,
} from '../config/shop';
import { HeroScene } from '../components/three/HeroScene';
import { GarmentView } from '../components/three/GarmentView';
import { ProductCard } from '../components/ui/ProductCard';
import { QuickAddModal } from '../components/ui/QuickAddModal';
import { Accordion } from '../components/ui/Accordion';
import { Swatch } from '../components/ui/Swatch';
import { Chip } from '../components/ui/Chip';
import { useToast } from '../store/toast';
import { Magnetic } from '../components/cursor/Magnetic';
import { SectionReveal } from '../components/ui/SectionReveal';

export default function Home(): React.ReactElement {
  const { showToast } = useToast();
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [heroMode, setHeroMode] = useState<'photo' | '3d'>('photo');
  const [lookbookMode, setLookbookMode] = useState<'photo' | '3d'>('photo');

  // New arrivals (tagged 'new')
  const newArrivals = PRODUCTS.filter((p) => p.tags.includes('new'));

  // 3D Try-View (Lookbook) state: selected category / product
  const tryViewProducts: Product[] = [
    PRODUCTS.find((p) => p.id === 'TJ-J01')!, // Jeans
    PRODUCTS.find((p) => p.id === 'TJ-T01')!, // Tee
    PRODUCTS.find((p) => p.id === 'TJ-S01')!, // Shirt
    PRODUCTS.find((p) => p.id === 'TJ-H01')!, // Hoodie
    PRODUCTS.find((p) => p.id === 'TJ-K01')!, // Jacket
  ];
  const [selectedTryProduct, setSelectedTryProduct] = useState<Product>(tryViewProducts[0]);
  const [selectedTryColor, setSelectedTryColor] = useState(tryViewProducts[0].colors[0]);

  const handleSelectTryProduct = (p: Product) => {
    setSelectedTryProduct(p);
    setSelectedTryColor(p.colors[0]);
  };

  const handleCopyOfferCode = () => {
    navigator.clipboard.writeText('WELCOME150');
    showToast('Code copied');
  };

  const valuePropIcons = {
    Sparkles: Sparkles,
    RefreshCw: RefreshCw,
    Truck: Truck,
    MessageCircle: MessageCircle,
  };

  const whiteseaIcons = {
    Box: Box,
    ShoppingBag: ShoppingBag,
    MessageSquare: MessageSquare,
    Layers: Layers,
  };

  const categories = [
    {
      name: 'Jeans',
      count: PRODUCTS.filter((p) => p.category === 'Jeans').length,
      iconPath: 'M 30 15 L 70 15 L 75 40 L 70 85 L 56 85 L 50 48 L 44 85 L 30 85 L 25 40 Z',
    },
    {
      name: 'T-Shirts',
      count: PRODUCTS.filter((p) => p.category === 'T-Shirts').length,
      iconPath: 'M 35 15 Q 50 25 65 15 L 90 32 L 80 50 L 72 42 L 72 85 L 28 85 L 28 42 L 20 50 L 10 32 Z',
    },
    {
      name: 'Shirts',
      count: PRODUCTS.filter((p) => p.category === 'Shirts').length,
      iconPath: 'M 38 18 L 50 28 L 62 18 L 88 32 L 82 75 L 74 72 L 72 85 L 28 85 L 26 72 L 18 75 L 12 32 Z',
    },
    {
      name: 'Hoodies & Jackets',
      count: PRODUCTS.filter((p) => p.category === 'Hoodies & Jackets').length,
      iconPath: 'M 40 10 Q 50 5 60 10 L 88 32 L 82 78 L 74 74 L 72 85 L 28 85 L 26 74 L 18 78 L 12 32 Z',
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO (dark, min-height 92dvh) */}
      <section
        aria-label="Hero showcase"
        className="relative min-h-[92dvh] bg-denim-deep text-surface flex items-center overflow-hidden"
      >
        {/* Faint radial glow of denim color */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 75% 45%, rgba(31, 58, 95, 0.55) 0%, rgba(11, 18, 32, 0.95) 70%)',
          }}
        />

        <div className="page-container relative z-10 w-full py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-start max-w-xl">
            <span className="label-caps text-gold px-3.5 py-1 rounded-full bg-gold/10 border border-gold/20 mb-6">
              NEW SEASON 2026
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading mb-6 tracking-tight leading-[1.05]">
              Denim, redefined.
            </h1>

            <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed max-w-lg">
              Premium everyday fits from your neighbourhood store. Pick it. Rotate it. Order it in minutes.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Magnetic strength={0.25} radius={80}>
                <Link
                  to="/shop"
                  className="btn-primary bg-surface text-ink hover:bg-white min-w-[160px] text-center"
                >
                  Shop Collection
                </Link>
              </Magnetic>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-white border-white/60 hover:bg-white/10 min-w-[170px] text-center"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Hero Real Image Showcase */}
          <div className="w-full min-h-[380px] md:min-h-[500px] lg:min-h-[540px] flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square rounded-[24px] overflow-hidden shadow-2xl border border-white/10 group bg-surface/5">
              {heroMode === 'photo' ? (
                <>
                  <img
                    src="/images/products/hero-denim-showcase.jpg"
                    alt="Trendy Jeans Premium Denim"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-denim-deep/80 via-transparent to-transparent pointer-events-none" />

                  {/* Floating spec tags */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-ink text-xs font-semibold shadow-soft">
                      Indigo Slim Fit · ₹1,799
                    </div>
                    <div className="bg-gold/90 backdrop-blur-md px-3 py-1.5 rounded-full text-ink text-[11px] font-bold uppercase tracking-wider shadow-soft">
                      100% Cotton Denim
                    </div>
                  </div>
                </>
              ) : (
                <HeroScene />
              )}
            </div>

            {/* Toggle button */}
            <div className="mt-4 inline-flex rounded-btn border border-white/20 bg-white/5 p-1 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => setHeroMode('photo')}
                className={`px-3.5 py-1 text-xs font-semibold rounded-btn transition-colors cursor-pointer ${
                  heroMode === 'photo'
                    ? 'bg-white text-ink shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Studio Photo
              </button>
              <button
                type="button"
                onClick={() => setHeroMode('3d')}
                className={`px-3.5 py-1 text-xs font-semibold rounded-btn transition-colors cursor-pointer ${
                  heroMode === '3d'
                    ? 'bg-white text-ink shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Interactive 3D
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MARQUEE STRIP (CSS-only infinite text marquee, 30s per loop) */}
      <div
        aria-hidden="true"
        className="w-full bg-ink text-surface py-3.5 overflow-hidden border-y border-line/20 select-none"
      >
        <div className="animate-marquee whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="label-caps text-xs tracking-[0.2em] text-white/90 font-medium mx-4"
            >
              JEANS • T-SHIRTS • SHIRTS • HOODIES • JACKETS •&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* 3. NEW ARRIVALS */}
      <SectionReveal>
        <section className="py-16 md:py-24 page-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="label-caps text-gold block mb-2">JUST IN</span>
              <h2 className="text-3xl md:text-4xl font-heading">New arrivals</h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-ink hover:text-gold transition-colors inline-flex items-center gap-1.5"
            >
              <span>View all styles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: horizontal scroll-snap carousel (card width 72vw, gap 16px). 1024px+: 4-column grid */}
          <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="w-[72vw] sm:w-[50vw] md:w-[40vw] lg:w-auto flex-shrink-0 snap-start"
              >
                <ProductCard product={product} onQuickAdd={setQuickAddProduct} />
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* 4. SHOP BY CATEGORY */}
      <SectionReveal>
        <section className="py-16 bg-surface border-y border-line">
          <div className="page-container">
            <h2 className="text-3xl md:text-4xl font-heading mb-8">Shop by category</h2>

            {/* 2x2 grid on mobile, 4 columns at 1024px+ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-card p-6 flex flex-col justify-between min-h-[160px] md:min-h-[200px] overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-soft"
                  style={{
                    background: 'linear-gradient(135deg, #1F3A5F 0%, #0B1220 100%)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-10 h-10 md:w-12 md:h-12 fill-gold/80 stroke-white/20 stroke-1 group-hover:scale-110 transition-transform"
                    >
                      <path d={cat.iconPath} />
                    </svg>
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-gold transition-colors" />
                  </div>

                  <div>
                    <h3 className="font-heading text-lg md:text-xl text-white font-semibold">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-white/60 mt-0.5 block">
                      {cat.count} {cat.count === 1 ? 'item' : 'styles'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 5. 3D TRY-VIEW (Lookbook anchor id="lookbook") */}
      <SectionReveal>
        <section id="lookbook" className="py-16 md:py-24 page-container scroll-mt-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="label-caps text-gold block mb-2">3D EXPERIENCE</span>
            <h2 className="text-3xl md:text-4xl font-heading">See it from every angle</h2>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {/* View Mode Toggle */}
            <div className="mb-5 inline-flex rounded-btn border border-line bg-surface p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setLookbookMode('photo')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-btn transition-colors cursor-pointer ${
                  lookbookMode === 'photo'
                    ? 'bg-ink text-surface shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Studio Photo
              </button>
              <button
                type="button"
                onClick={() => setLookbookMode('3d')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-btn transition-colors cursor-pointer ${
                  lookbookMode === '3d'
                    ? 'bg-ink text-surface shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Interactive 3D
              </button>
            </div>

            {/* Large interactive viewer or Real Product Image */}
            <div className="w-full bg-surface rounded-card border border-line shadow-soft p-4 md:p-6 mb-6">
              {lookbookMode === 'photo' ? (
                <div className="relative aspect-square md:aspect-[4/3] w-full rounded-card overflow-hidden bg-bg/40 flex items-center justify-center">
                  <img
                    src={selectedTryProduct.image}
                    alt={selectedTryProduct.name}
                    className="w-full h-full object-cover object-center transition-all duration-300"
                  />
                </div>
              ) : (
                <GarmentView
                  type={selectedTryProduct.garment}
                  colorHex={selectedTryColor.hex}
                  fit={selectedTryProduct.fit}
                  productId={selectedTryProduct.id}
                  name={selectedTryProduct.name}
                  mode="viewer"
                  aspect="aspect-square md:aspect-[4/3]"
                />
              )}
            </div>

            {/* Horizontally scrollable product chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full justify-start md:justify-center pb-2 mb-5">
              {tryViewProducts.map((p) => (
                <Chip
                  key={p.id}
                  label={p.name.split(' ')[0] || p.name}
                  active={selectedTryProduct.id === p.id}
                  onClick={() => handleSelectTryProduct(p)}
                />
              ))}
            </div>

            {/* Color swatches for selected product */}
            <div className="flex items-center gap-2 mb-6">
              {selectedTryProduct.colors.map((c) => (
                <Swatch
                  key={c.name}
                  color={c}
                  selected={selectedTryColor.name === c.name}
                  onClick={() => setSelectedTryColor(c)}
                  size="md"
                />
              ))}
            </div>

            {/* View details button */}
            <Link
              to={`/product/${selectedTryProduct.slug}`}
              className="btn-primary min-w-[200px] text-center"
            >
              View details
            </Link>
          </div>
        </section>
      </SectionReveal>

      {/* 6. WHY TRENDY JEANS (4 value props: 1 col mobile, 2x2 at 768px+) */}
      <SectionReveal>
        <section className="py-16 bg-surface border-y border-line">
          <div className="page-container">
            <h2 className="text-3xl md:text-4xl font-heading mb-10 text-center">
              Why Trendy Jeans
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {VALUE_PROPS.map((vp) => {
                const IconComp = valuePropIcons[vp.icon];
                return (
                  <div
                    key={vp.id}
                    className="flex items-start gap-4 p-6 rounded-card bg-bg/50 border border-line"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/15 text-gold flex items-center justify-center flex-shrink-0">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold mb-1 text-ink">
                        {vp.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">{vp.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 7. OFFER BANNER (Gold-bordered card) */}
      <SectionReveal>
        <section className="py-12 page-container">
          <div className="rounded-card border-2 border-gold bg-surface p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
            <div>
              <span className="label-caps text-gold block mb-1">SPECIAL OFFER</span>
              <h3 className="text-2xl md:text-3xl font-heading font-semibold text-ink">
                First order? Get ₹150 off
              </h3>
              <p className="text-sm text-muted mt-1">
                Use code <strong className="text-ink">WELCOME150</strong> on orders above ₹1,499.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyOfferCode}
              className="btn-primary bg-gold text-ink font-semibold hover:brightness-105 min-w-[150px] inline-flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy code</span>
            </button>
          </div>
        </section>
      </SectionReveal>

      {/* 8. TESTIMONIALS (Horizontal scroll-snap mobile, 3 cols 1024px+) */}
      <SectionReveal>
        <section className="py-16 md:py-24 page-container">
          <h2 className="text-3xl md:text-4xl font-heading mb-10 text-center">
            Loved by locals
          </h2>

          <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="w-[82vw] sm:w-[60vw] md:w-[45vw] lg:w-auto flex-shrink-0 snap-start bg-surface rounded-card p-6 border border-line shadow-soft flex flex-col justify-between"
              >
                <div>
                  {/* 5-star rating row */}
                  <div className="flex items-center gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s < t.rating ? 'fill-gold text-gold' : 'text-line'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-ink text-sm md:text-base leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>
                <span className="font-semibold text-sm text-ink">{t.name}</span>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* 9. WHITESEA LABS SHOWCASE (Section 10) */}
      <SectionReveal>
        <section className="py-20 bg-denim-deep text-surface border-t border-b border-line/10">
          <div className="page-container">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="label-caps text-gold px-3.5 py-1 rounded-full bg-gold/10 border border-gold/20 mb-4 inline-block">
                BUILT BY WHITESEA LABS
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4 text-white">
                A storefront that feels like the real thing.
              </h2>
              <p className="text-white/75 text-sm md:text-base leading-relaxed">
                This website was designed and engineered by Whitesea Labs: interactive 3D, fast mobile-first commerce, and ordering that works the way local shops actually sell.
              </p>
            </div>

            {/* 4 service cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {WHITESEA_SERVICES.map((s) => {
                const IconComp = whiteseaIcons[s.icon];
                return (
                  <div
                    key={s.id}
                    className="bg-white/5 border border-white/10 rounded-card p-6 flex flex-col justify-between"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-white mb-1.5">
                        {s.title}
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <a
                href={WHITESEA_URL}
                className="btn-primary bg-gold text-ink font-semibold hover:brightness-105 inline-flex items-center gap-2"
              >
                <span>Work with Whitesea Labs</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 10. VISIT THE STORE */}
      <SectionReveal>
        <section className="py-16 md:py-20 page-container">
          <div className="bg-surface rounded-card border border-line p-6 md:p-10 shadow-soft max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading mb-6 text-center">Visit the store</h2>

            <div className="space-y-4 text-sm text-ink mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>{ADDRESS}</span>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>{HOURS}</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <a href={`tel:${PHONE.replace(/\s+/g, '')}`} className="hover:text-gold transition-colors font-medium">
                  {PHONE}
                </a>
              </div>
            </div>

            <div className="text-center">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-gold" />
                <span>Open in Maps</span>
              </a>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 11. FAQ ACCORDION (6 items, one open at a time) */}
      <SectionReveal>
        <section id="faq" className="py-16 bg-surface border-t border-line scroll-mt-20">
          <div className="page-container max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-heading mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion
              items={FAQS.map((faq) => ({
                id: faq.id,
                title: faq.question,
                content: faq.answer,
              }))}
              allowMultiple={false}
            />
          </div>
        </section>
      </SectionReveal>

      {/* Quick Add Modal */}
      <QuickAddModal
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />
    </div>
  );
}
