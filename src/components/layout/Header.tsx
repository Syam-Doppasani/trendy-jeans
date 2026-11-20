import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../store/cart';

export function Header(): React.ReactElement {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount, openCart } = useCart();
  const itemCount = getItemCount();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Lookbook', path: '/#lookbook' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-surface/85 backdrop-blur-md border-b border-line/60 transition-all duration-200 ${
          isScrolled ? 'h-[52px]' : 'h-[60px]'
        }`}
      >
        <div className="page-container h-full flex items-center justify-between">
          {/* Left: Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="w-11 h-11 inline-flex items-center justify-center rounded-full text-ink hover:bg-bg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left / Center Wordmark */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="font-heading font-semibold text-lg md:text-xl tracking-wider text-ink hover:opacity-90 transition-opacity"
            >
              TRENDY JEANS
            </Link>

            {/* Desktop inline nav at 1024px+ */}
            <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-gold ${
                    location.pathname === link.path && !link.path.includes('#')
                      ? 'text-ink font-semibold'
                      : 'text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Cart button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open shopping cart with ${itemCount} items`}
              className="relative w-11 h-11 inline-flex items-center justify-center rounded-full text-ink hover:bg-bg transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span
                  aria-live="polite"
                  className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 rounded-full bg-gold text-ink font-semibold text-xs flex items-center justify-center shadow-soft tabular-nums"
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 bg-denim-deep text-surface flex flex-col p-6 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-6 border-b border-line/20">
            <span className="font-heading text-xl tracking-wider">TRENDY JEANS</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="w-11 h-11 inline-flex items-center justify-center rounded-full text-surface hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 py-8" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="font-heading text-2xl hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-line/20 text-muted text-xs flex flex-col gap-1">
            <span>Shop No. 12, Main Market Road</span>
            <span>Mon-Sat 10:00 AM - 9:00 PM</span>
          </div>
        </div>
      )}
    </>
  );
}
