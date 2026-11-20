import { WHATSAPP_NUMBER } from '../config/shop';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount);
}

/**
 * Generate order id in format TJ-YYMMDD-XXXX
 * where XXXX is 4 random uppercase alphanumerics
 */
export function generateOrderId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TJ-${yy}${mm}${dd}-${rand}`;
}

export interface OrderItem {
  productId: string;
  name: string;
  color: string;
  size: string;
  qty: number;
  price: number;
}

export interface OrderData {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  delivery: {
    method: 'Home delivery' | 'Store pickup';
    address?: string;
    landmark?: string;
    pincode?: string;
  };
  payment: 'Cash on delivery' | 'UPI on delivery' | 'Pay at store';
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
}

/**
 * Format exact WhatsApp order message according to section 11:
 * "🛍️ *New Order - Trendy Jeans*\nOrder ID: {id}\n\n*Customer*\nName: {name}\nPhone: {phone}\n\n*Items*\n1. {name} | {color} | Size {size} | Qty {qty} | ₹{lineTotal}\n...\n\nSubtotal: ₹{x}\nDiscount: -₹{x}\nDelivery: ₹{x}\n*Total: ₹{x}*\n\n*Delivery*\n{Home delivery: address, landmark, pincode | Store pickup}\nPayment: {method}\nNotes: {notes or '-'}"
 */
export function buildWhatsAppOrderMessage(order: OrderData): string {
  const itemsText = order.items
    .map((item, idx) => {
      const lineTotal = item.price * item.qty;
      return `${idx + 1}. ${item.name} | ${item.color} | Size ${item.size} | Qty ${item.qty} | ₹${lineTotal}`;
    })
    .join('\n');

  let deliveryText = '';
  if (order.delivery.method === 'Home delivery') {
    const parts = [
      order.delivery.address,
      order.delivery.landmark ? `Landmark: ${order.delivery.landmark}` : null,
      order.delivery.pincode ? `Pincode: ${order.delivery.pincode}` : null,
    ].filter(Boolean);
    deliveryText = `Home delivery: ${parts.join(', ')}`;
  } else {
    deliveryText = 'Store pickup';
  }

  const notesText = order.notes && order.notes.trim() ? order.notes.trim() : '-';

  return (
    `🛍️ *New Order - Trendy Jeans*\n` +
    `Order ID: ${order.id}\n\n` +
    `*Customer*\n` +
    `Name: ${order.customer.name}\n` +
    `Phone: ${order.customer.phone}\n\n` +
    `*Items*\n` +
    `${itemsText}\n\n` +
    `Subtotal: ₹${order.subtotal}\n` +
    `Discount: -₹${order.discount}\n` +
    `Delivery: ₹${order.deliveryFee}\n` +
    `*Total: ₹${order.total}*\n\n` +
    `*Delivery*\n` +
    `${deliveryText}\n` +
    `Payment: ${order.payment}\n` +
    `Notes: ${notesText}`
  );
}

export function buildWhatsAppOrderUrl(order: OrderData): string {
  const message = buildWhatsAppOrderMessage(order);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Product-page "Order on WhatsApp" message:
 * "Hi Trendy Jeans, I'd like to order: {product} | {color} | Size {size} | Qty {qty}. Please confirm availability."
 */
export function buildWhatsAppProductUrl(productName: string, color: string, size: string, qty: number): string {
  const message = `Hi Trendy Jeans, I'd like to order: ${productName} | ${color} | Size ${size} | Qty ${qty}. Please confirm availability.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
