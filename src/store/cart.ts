import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COUPONS, DELIVERY_FEE, FREE_DELIVERY_ABOVE } from '../config/shop';

export interface CartItem {
  key: string; // `${productId}|${colorName}|${size}`
  productId: string;
  slug: string;
  name: string;
  image?: string;
  color: string;
  colorHex: string;
  size: string;
  qty: number;
  price: number;
  mrp: number;
  garment: string;
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  isCartOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'key'>) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed helpers
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: (method?: 'Home delivery' | 'Store pickup') => number;
  getTotal: (method?: 'Home delivery' | 'Store pickup') => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      isCartOpen: false,

      addItem: (itemData) => {
        const key = `${itemData.productId}|${itemData.color}|${itemData.size}`;
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.key === key);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const newQty = Math.min(10, updated[existingIndex].qty + itemData.qty);
            updated[existingIndex] = { ...updated[existingIndex], qty: newQty };
            return { items: updated, isCartOpen: true };
          } else {
            const newItem: CartItem = {
              ...itemData,
              key,
              qty: Math.min(10, Math.max(1, itemData.qty)),
            };
            return { items: [...state.items, newItem], isCartOpen: true };
          }
        });
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        }));
      },

      setQty: (key, qty) => {
        if (qty <= 0) {
          get().removeItem(key);
          return;
        }
        const boundedQty = Math.min(10, Math.max(1, qty));
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key ? { ...item, qty: boundedQty } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null });
      },

      applyCoupon: (rawCode: string) => {
        const code = rawCode.trim().toUpperCase();
        const coupon = COUPONS[code];
        if (!coupon) {
          return { success: false, message: 'Invalid coupon code' };
        }
        const subtotal = get().getSubtotal();
        if (subtotal < coupon.minOrder) {
          return {
            success: false,
            message: `Minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')} required for ${code}`,
          };
        }
        set({ couponCode: code });
        return { success: true, message: `Coupon ${code} applied successfully!` };
      },

      removeCoupon: () => {
        set({ couponCode: null });
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.qty, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const code = get().couponCode;
        if (!code) return 0;
        const coupon = COUPONS[code];
        if (!coupon || subtotal < coupon.minOrder) return 0;

        if (coupon.type === 'percent') {
          return Math.round((subtotal * coupon.value) / 100);
        } else if (coupon.type === 'flat') {
          return Math.min(subtotal, coupon.value);
        }
        return 0;
      },

      getDeliveryFee: (method = 'Home delivery') => {
        if (method === 'Store pickup') return 0;
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
      },

      getTotal: (method = 'Home delivery') => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const delivery = get().getDeliveryFee(method);
        return Math.max(0, Math.round(subtotal - discount + delivery));
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.qty, 0);
      },
    }),
    {
      name: 'tj_cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
      }),
    }
  )
);
