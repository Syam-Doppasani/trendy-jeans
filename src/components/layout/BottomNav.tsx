import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, ShoppingBag, MessageSquare } from 'lucide-react';
import { useCart } from '../../store/cart';

export function BottomNav(): React.ReactElement {
  const { getItemCount, openCart } = useCart();
  const itemCount = getItemCount();

  const navItemClass = (isActive: boolean) =>
    `flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors ${
      isActive ? 'text-ink font-semibold' : 'text-muted'
    }`;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-surface/95 backdrop-blur-md border-t border-line safe-bottom flex items-center justify-around"
    >
      <NavLink to="/" end className={({ isActive }) => navItemClass(isActive)}>
        <Home className="w-5 h-5 mb-1" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/shop" className={({ isActive }) => navItemClass(isActive)}>
        <Compass className="w-5 h-5 mb-1" />
        <span>Shop</span>
      </NavLink>

      <button
        type="button"
        onClick={openCart}
        aria-label={`Cart (${itemCount} items)`}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium text-muted hover:text-ink relative transition-colors"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 mb-1" />
          {itemCount > 0 && (
            <span
              aria-live="polite"
              className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-ink font-bold text-[10px] flex items-center justify-center shadow-soft"
            >
              {itemCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <NavLink to="/contact" className={({ isActive }) => navItemClass(isActive)}>
        <MessageSquare className="w-5 h-5 mb-1" />
        <span>Contact</span>
      </NavLink>
    </nav>
  );
}
