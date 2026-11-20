import React from 'react';
import { Link } from 'react-router-dom';
import {
  SHOP_NAME,
  TAGLINE,
  PHONE,
  EMAIL,
  ADDRESS,
  HOURS,
  INSTAGRAM,
  WHITESEA_NAME,
  WHITESEA_URL,
} from '../../config/shop';

export function Footer(): React.ReactElement {
  return (
    <footer className="bg-denim-deep text-surface pt-16 pb-24 md:pb-12 border-t border-line/10">
      <div className="page-container">
        {/* Main 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div>
            <span className="font-heading text-2xl font-semibold tracking-wider block mb-2">
              {SHOP_NAME}
            </span>
            <p className="text-white/70 text-sm mb-4">{TAGLINE}</p>
            <p className="text-white/60 text-xs leading-relaxed">{ADDRESS}</p>
          </div>

          {/* Column 2: Shop links */}
          <div>
            <h2 className="label-caps text-gold mb-4 text-xs">Shop</h2>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/shop?category=Jeans" className="hover:text-gold transition-colors">
                  Jeans
                </Link>
              </li>
              <li>
                <Link to="/shop?category=T-Shirts" className="hover:text-gold transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Shirts" className="hover:text-gold transition-colors">
                  Shirts
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Hoodies%20%26%20Jackets"
                  className="hover:text-gold transition-colors"
                >
                  Hoodies & Jackets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h2 className="label-caps text-gold mb-4 text-xs">Help & Info</h2>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/#faq" className="hover:text-gold transition-colors">
                  FAQs & Exchange Policy
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-gold transition-colors">
                  Size Guide & Fits
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">
                  Contact Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Visit & Hours */}
          <div>
            <h2 className="label-caps text-gold mb-4 text-xs">Visit Us</h2>
            <div className="space-y-2 text-sm text-white/80">
              <p className="text-xs text-white/60">{HOURS}</p>
              <p>
                <a
                  href={`tel:${PHONE.replace(/\s+/g, '')}`}
                  className="hover:text-gold transition-colors"
                >
                  {PHONE}
                </a>
              </p>
              <p className="text-white/60">{EMAIL}</p>
              <p className="text-white/60 pt-2 font-mono text-xs">{INSTAGRAM}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 mb-8" />

        {/* Bottom row: Rights + Whitesea Labs credit */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2026 {SHOP_NAME}. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              3D experience by {WHITESEA_NAME}
            </span>
            <span>Designed & developed by </span>
            <a
              href={WHITESEA_URL}
              className="text-white font-medium hover:text-gold transition-colors underline decoration-gold/40 underline-offset-4"
            >
              {WHITESEA_NAME}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
