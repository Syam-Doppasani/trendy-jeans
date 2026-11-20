import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../store/cart';
import { formatPrice, generateOrderId, buildWhatsAppOrderUrl, OrderData } from '../lib/format';
import { Button } from '../components/ui/Button';
import { FREE_DELIVERY_ABOVE } from '../config/shop';

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  pincode?: string;
  notes?: string;
}

export default function Checkout(): React.ReactElement {
  const navigate = useNavigate();
  const {
    items,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTotal,
  } = useCart();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop', { replace: true });
    }
  }, [items.length, navigate]);

  useEffect(() => {
    document.title = 'Checkout — Trendy Jeans';
  }, []);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'Home delivery' | 'Store pickup'>('Home delivery');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [payment, setPayment] = useState<'Cash on delivery' | 'UPI on delivery' | 'Pay at store'>('Cash on delivery');
  const [notes, setNotes] = useState('');

  // Coupon state
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Errors & touch states
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If method changes, adjust payment if needed
  useEffect(() => {
    if (deliveryMethod === 'Home delivery' && payment === 'Pay at store') {
      setPayment('Cash on delivery');
    }
  }, [deliveryMethod, payment]);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee(deliveryMethod);
  const total = getTotal(deliveryMethod);

  // Validation functions
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return undefined;
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[6-9]\d{9}$/.test(value.trim())) return 'Enter a valid 10-digit Indian phone number';
        return undefined;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Enter a valid email address';
        }
        return undefined;
      case 'address':
        if (deliveryMethod === 'Home delivery' && !value.trim()) {
          return 'Address is required for delivery';
        }
        return undefined;
      case 'pincode':
        if (deliveryMethod === 'Home delivery') {
          if (!value.trim()) return 'Pincode is required';
          if (!/^\d{6}$/.test(value.trim())) return 'Enter a valid 6-digit pincode';
        }
        return undefined;
      case 'notes':
        if (value.length > 200) return 'Notes cannot exceed 200 characters';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponError(null);
      setInputCoupon('');
    } else {
      setCouponError(res.message);
      setCouponSuccess(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {
      name: validateField('name', name),
      phone: validateField('phone', phone),
      email: validateField('email', email),
      address: validateField('address', address),
      pincode: validateField('pincode', pincode),
      notes: validateField('notes', notes),
    };

    setTouched({
      name: true,
      phone: true,
      email: true,
      address: true,
      pincode: true,
      notes: true,
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== undefined);
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    // 1. Generate order id TJ-YYMMDD-XXXX
    const orderId = generateOrderId();

    const orderData: OrderData = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
      },
      delivery: {
        method: deliveryMethod,
        address: deliveryMethod === 'Home delivery' ? address.trim() : undefined,
        landmark: deliveryMethod === 'Home delivery' && landmark.trim() ? landmark.trim() : undefined,
        pincode: deliveryMethod === 'Home delivery' ? pincode.trim() : undefined,
      },
      payment,
      notes: notes.trim() || undefined,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        color: i.color,
        size: i.size,
        qty: i.qty,
        price: i.price,
      })),
      subtotal,
      discount,
      deliveryFee,
      total,
      couponCode: couponCode || undefined,
    };

    // 2. Save to localStorage key 'tj_orders'
    try {
      const existing = localStorage.getItem('tj_orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.push(orderData);
      localStorage.setItem('tj_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }

    // 3. Fire and forget optional webhook
    const webhookUrl = import.meta.env.VITE_ORDER_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        }).catch(() => {});
      } catch {
        // ignore
      }
    }

    // Build WhatsApp URL
    const whatsappUrl = buildWhatsAppOrderUrl(orderData);

    // 4. Clear the cart
    clearCart();

    // 5. Navigate to /order/:id
    navigate(`/order/${orderId}`);

    // 6. Open WhatsApp URL in a new tab (silent fallback if popup blocked)
    try {
      window.open(whatsappUrl, '_blank');
    } catch {
      // Popup blocked; user can tap button on OrderSuccess page
    }
  };

  return (
    <div className="page-container py-8 md:py-12 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-heading font-semibold text-ink mb-8">
        Checkout
      </h1>

      {/* Mobile Collapsible Order Summary Panel */}
      <div className="lg:hidden mb-8 border border-line rounded-card bg-surface overflow-hidden shadow-soft">
        <button
          type="button"
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          className="w-full flex items-center justify-between p-4 bg-bg/60 text-ink font-medium text-sm"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-gold" />
            <span>{showMobileSummary ? 'Hide order summary' : 'Show order summary'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base">{formatPrice(total)}</span>
            {showMobileSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showMobileSummary && (
          <div className="p-4 divide-y divide-line/60">
            <div className="space-y-3 pb-4">
              {items.map((i) => (
                <div key={i.key} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-ink">{i.name}</span>
                    <span className="text-xs text-muted block">
                      {i.color} · Size {i.size} × {i.qty}
                    </span>
                  </div>
                  <span className="font-medium">{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 space-y-1.5 text-xs text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-ink">{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-ink pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          {/* Customer Information */}
          <div className="bg-surface rounded-card p-6 border border-line shadow-soft space-y-4">
            <h2 className="text-lg font-heading font-semibold text-ink pb-2 border-b border-line">
              1. Customer Information
            </h2>

            <div>
              <label htmlFor="customer-name" className="label-caps text-xs text-muted block mb-1.5">
                Full Name *
              </label>
              <input
                id="customer-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name', name)}
                placeholder="e.g. Rahul Sharma"
                className="w-full min-h-[48px] px-4 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold"
              />
              {touched.name && errors.name && (
                <p className="text-xs text-danger mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="customer-phone" className="label-caps text-xs text-muted block mb-1.5">
                Phone Number (10 digits) *
              </label>
              <input
                id="customer-phone"
                type="tel"
                inputMode="numeric"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onBlur={() => handleBlur('phone', phone)}
                placeholder="9876543210"
                className="w-full min-h-[48px] px-4 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold"
              />
              {touched.phone && errors.phone && (
                <p className="text-xs text-danger mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="customer-email" className="label-caps text-xs text-muted block mb-1.5">
                Email Address (Optional)
              </label>
              <input
                id="customer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email', email)}
                placeholder="rahul@example.com"
                className="w-full min-h-[48px] px-4 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold"
              />
              {touched.email && errors.email && (
                <p className="text-xs text-danger mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Delivery Method & Address */}
          <div className="bg-surface rounded-card p-6 border border-line shadow-soft space-y-4">
            <h2 className="text-lg font-heading font-semibold text-ink pb-2 border-b border-line">
              2. Delivery Method
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-card border cursor-pointer flex flex-col gap-1 transition-all ${
                  deliveryMethod === 'Home delivery'
                    ? 'border-ink bg-ink/5'
                    : 'border-line bg-surface hover:border-ink/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="Home delivery"
                    checked={deliveryMethod === 'Home delivery'}
                    onChange={() => setDeliveryMethod('Home delivery')}
                    className="accent-ink"
                  />
                  <span className="font-semibold text-sm">Home delivery</span>
                </div>
                <span className="text-xs text-muted">₹49 (Free above ₹1,999)</span>
              </label>

              <label
                className={`p-4 rounded-card border cursor-pointer flex flex-col gap-1 transition-all ${
                  deliveryMethod === 'Store pickup'
                    ? 'border-ink bg-ink/5'
                    : 'border-line bg-surface hover:border-ink/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="Store pickup"
                    checked={deliveryMethod === 'Store pickup'}
                    onChange={() => setDeliveryMethod('Store pickup')}
                    className="accent-ink"
                  />
                  <span className="font-semibold text-sm">Store pickup</span>
                </div>
                <span className="text-xs text-success font-medium">FREE</span>
              </label>
            </div>

            {deliveryMethod === 'Home delivery' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label htmlFor="delivery-address" className="label-caps text-xs text-muted block mb-1.5">
                    Address Line *
                  </label>
                  <input
                    id="delivery-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={() => handleBlur('address', address)}
                    placeholder="House/Flat No, Street, Area"
                    className="w-full min-h-[48px] px-4 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold"
                  />
                  {touched.address && errors.address && (
                    <p className="text-xs text-danger mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="delivery-landmark" className="label-caps text-xs text-muted block mb-1.5">
                      Landmark (Optional)
                    </label>
                    <input
                      id="delivery-landmark"
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Near City Mall"
                      className="w-full min-h-[48px] px-4 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label htmlFor="delivery-pincode" className="label-caps text-xs text-muted block mb-1.5">
                      Pincode (6 digits) *
                    </label>
                    <input
                      id="delivery-pincode"
                      type="text"
                      inputMode="numeric"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      onBlur={() => handleBlur('pincode', pincode)}
                      placeholder="560000"
                      className="w-full min-h-[48px] px-4 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold"
                    />
                    {touched.pincode && errors.pincode && (
                      <p className="text-xs text-danger mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-surface rounded-card p-6 border border-line shadow-soft space-y-4">
            <h2 className="text-lg font-heading font-semibold text-ink pb-2 border-b border-line">
              3. Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3.5 rounded-card border border-line cursor-pointer hover:border-ink/40">
                <input
                  type="radio"
                  name="payment"
                  value="Cash on delivery"
                  checked={payment === 'Cash on delivery'}
                  onChange={() => setPayment('Cash on delivery')}
                  className="accent-ink"
                />
                <span className="text-sm font-medium">Cash on delivery</span>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-card border border-line cursor-pointer hover:border-ink/40">
                <input
                  type="radio"
                  name="payment"
                  value="UPI on delivery"
                  checked={payment === 'UPI on delivery'}
                  onChange={() => setPayment('UPI on delivery')}
                  className="accent-ink"
                />
                <span className="text-sm font-medium">UPI on delivery</span>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-card border transition-all ${
                  deliveryMethod === 'Store pickup'
                    ? 'border-line cursor-pointer hover:border-ink/40'
                    : 'border-line/40 opacity-40 cursor-not-allowed'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Pay at store"
                  disabled={deliveryMethod !== 'Store pickup'}
                  checked={payment === 'Pay at store'}
                  onChange={() => setPayment('Pay at store')}
                  className="accent-ink"
                />
                <span className="text-sm font-medium">Pay at store (In-store pickup only)</span>
              </label>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-surface rounded-card p-6 border border-line shadow-soft">
            <label htmlFor="order-notes" className="label-caps text-xs text-muted block mb-2">
              Order Notes (Optional, max 200 chars)
            </label>
            <textarea
              id="order-notes"
              rows={2}
              maxLength={200}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any fit preferences, delivery instructions, or questions..."
              className="w-full p-3.5 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold resize-none"
            />
            <div className="flex justify-end mt-1 text-[11px] text-muted">
              <span>{notes.length}/200</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full text-base py-4"
          >
            <span>Place order request</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>

        {/* Desktop Sidebar: Order Summary */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="sticky top-[90px] bg-surface rounded-card p-6 border border-line shadow-soft space-y-6">
            <h2 className="text-xl font-heading font-semibold text-ink pb-4 border-b border-line">
              Order Summary
            </h2>

            {/* Line items */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border border-line flex-shrink-0"
                    style={{ backgroundColor: item.colorHex }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-ink truncate">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.color} · Size {item.size} × {item.qty}
                    </p>
                  </div>
                  <span className="font-semibold text-sm text-ink">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="pt-4 border-t border-line space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  className="flex-1 min-h-[44px] px-3.5 text-xs uppercase rounded-btn border border-line bg-bg focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="px-4 min-h-[44px] text-xs font-semibold rounded-btn bg-ink text-surface hover:bg-black transition-colors"
                >
                  Apply
                </button>
              </div>
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
            </form>

            {/* Financial totals */}
            <div className="space-y-2 pt-4 border-t border-line text-xs text-muted">
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
                  {deliveryFee === 0 ? <span className="text-success font-semibold">FREE</span> : formatPrice(deliveryFee)}
                </span>
              </div>
              {deliveryMethod === 'Home delivery' && subtotal < FREE_DELIVERY_ABOVE && (
                <p className="text-[11px] text-muted text-right">
                  Add {formatPrice(FREE_DELIVERY_ABOVE - subtotal)} more for free delivery
                </p>
              )}
              <div className="flex justify-between text-base font-semibold text-ink pt-3 border-t border-line">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-[11px] text-muted text-right">All prices include taxes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
