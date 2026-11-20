import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../store/cart';
import { formatPrice } from '../../lib/format';
import { QtyStepper } from '../ui/QtyStepper';
import { Button } from '../ui/Button';
import { FREE_DELIVERY_ABOVE } from '../../config/shop';

export function CartDrawer(): React.ReactElement | null {
  const navigate = useNavigate();
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    setQty,
    couponCode,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTotal,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const delivery = getDeliveryFee('Home delivery');
  const total = getTotal('Home delivery');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyCoupon(inputCode);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponError(null);
      setInputCode('');
    } else {
      setCouponError(res.message);
      setCouponSuccess(null);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-50 flex justify-end animate-fade-in"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
      />

      {/* Sheet: slide from right on desktop (max-w-md), bottom sheet on mobile (85dvh) */}
      <div className="relative z-10 w-full md:max-w-md bg-surface h-[85dvh] md:h-full mt-auto md:mt-0 rounded-t-[20px] md:rounded-none flex flex-col shadow-soft overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-heading font-semibold text-ink">Your Cart</h2>
            <span className="text-xs bg-bg text-muted px-2.5 py-0.5 rounded-full font-medium">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="w-10 h-10 inline-flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-bg flex items-center justify-center mb-4 text-muted">
                <Tag className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-lg mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted mb-6">Discover our curated denim & everyday fits.</p>
              <Button
                variant="primary"
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
              >
                Shop Collection
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className="flex items-start gap-4 p-3 rounded-card bg-bg/50 border border-line"
              >
                {/* Product thumbnail / image */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-card object-cover border border-line flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-card border border-line flex-shrink-0 flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: item.colorHex }}
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm text-ink truncate">{item.name}</h4>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Remove ${item.name}`}
                      className="text-muted hover:text-danger p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-muted mt-0.5 mb-2">
                    {item.color} · Size {item.size}
                  </p>

                  <div className="flex items-center justify-between">
                    <QtyStepper
                      value={item.qty}
                      onChange={(newQty) => setQty(item.key, newQty)}
                      min={1}
                      max={10}
                    />
                    <div className="text-right">
                      <span className="font-semibold text-sm text-ink">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary if items > 0 */}
        {items.length > 0 && (
          <div className="p-4 md:p-6 border-t border-line bg-surface flex flex-col gap-3">
            {/* Coupon field */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code (TRENDY10)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="flex-1 min-h-[44px] px-3.5 text-xs uppercase rounded-btn border border-line bg-bg focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="px-4 min-h-[44px] text-xs font-semibold rounded-btn bg-ink text-surface hover:bg-black transition-colors"
              >
                Apply
              </button>
            </form>

            {couponError && <p className="text-xs text-danger">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-success">{couponSuccess}</p>}

            {couponCode && (
              <div className="flex items-center justify-between bg-gold/15 px-3 py-1.5 rounded-btn text-xs text-ink">
                <span>Code <strong>{couponCode}</strong> applied</span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-danger hover:underline font-medium text-[11px]"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-muted pt-2 border-t border-line/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-ink font-medium">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-ink font-medium">
                  {delivery === 0 ? (
                    <span className="text-success font-semibold">FREE</span>
                  ) : (
                    formatPrice(delivery)
                  )}
                </span>
              </div>

              {subtotal < FREE_DELIVERY_ABOVE && (
                <p className="text-[11px] text-muted text-right">
                  Add {formatPrice(FREE_DELIVERY_ABOVE - subtotal)} more for free delivery
                </p>
              )}

              <div className="flex justify-between text-base font-semibold text-ink pt-2 border-t border-line">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-[11px] text-muted text-right">All prices include taxes.</p>
            </div>

            <Button
              variant="primary"
              onClick={handleCheckout}
              className="w-full justify-between"
            >
              <span>Checkout</span>
              <div className="flex items-center gap-1.5">
                <span>{formatPrice(total)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
