import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, MessageCircle } from 'lucide-react';
import { OrderData, formatPrice, buildWhatsAppOrderUrl } from '../lib/format';

export default function OrderSuccess(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Order Request Sent — Trendy Jeans';
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem('tj_orders');
      if (stored) {
        const orders: OrderData[] = JSON.parse(stored);
        const match = orders.find((o) => o.id === id);
        if (match) {
          setOrder(match);
        }
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50dvh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-line border-t-ink animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container py-24 text-center max-w-md mx-auto">
        <h1 className="text-3xl font-heading mb-4 text-ink">Order not found</h1>
        <p className="text-muted text-sm mb-8 leading-relaxed">
          We couldn't locate this order request in your browser's history. If you recently placed an order, please contact us on WhatsApp.
        </p>
        <Link to="/shop" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppOrderUrl(order);

  return (
    <div className="page-container py-12 md:py-16 max-w-2xl mx-auto">
      <div className="bg-surface rounded-card p-6 md:p-10 border border-line shadow-soft text-center flex flex-col items-center">
        {/* Animated check icon (single scale-in, 400ms) */}
        <div
          className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center mb-6 animate-[scaleIn_400ms_ease-out]"
          style={{ animationFillMode: 'backwards' }}
        >
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-ink mb-3">
          Order request sent!
        </h1>

        <p className="text-sm md:text-base text-muted max-w-lg mb-8 leading-relaxed">
          Thank you, <strong className="text-ink">{order.customer.name}</strong>. Please tap the button below to confirm your order with Trendy Jeans on WhatsApp. We'll reach out shortly.
        </p>

        {/* Primary and secondary action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-8">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary flex-1 justify-center bg-[#25D366] hover:bg-[#20ba59] text-white border-none"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span>Confirm on WhatsApp</span>
          </a>

          <Link to="/shop" className="btn-secondary flex-1 justify-center">
            <span>Continue shopping</span>
          </Link>
        </div>

        {/* Order Details Card */}
        <div className="w-full text-left border-t border-line pt-6 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted">Order ID</span>
            <span className="font-mono font-bold text-ink bg-bg px-2.5 py-1 rounded-btn border border-line">
              {order.id}
            </span>
          </div>

          <div className="divide-y divide-line/60">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium text-ink">{item.name}</span>
                  <span className="text-xs text-muted block">
                    {item.color} · Size {item.size} × {item.qty}
                  </span>
                </div>
                <span className="font-semibold text-ink">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-line space-y-1.5 text-xs text-muted">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-ink">
                {order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-ink pt-2 border-t border-line">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-line text-xs text-muted space-y-1">
            <p><strong>Delivery:</strong> {order.delivery.method}</p>
            {order.delivery.address && (
              <p>
                <strong>Address:</strong> {order.delivery.address}
                {order.delivery.landmark ? `, ${order.delivery.landmark}` : ''}
                {order.delivery.pincode ? ` - ${order.delivery.pincode}` : ''}
              </p>
            )}
            <p><strong>Payment:</strong> {order.payment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
