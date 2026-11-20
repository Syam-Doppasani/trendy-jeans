// Shop configuration constants
// All shop details live ONLY in this file

export const SHOP_NAME = 'Trendy Jeans';
export const TAGLINE = 'Denim, redefined.';
export const PHONE = '+91 98765 43210';
export const WHATSAPP_NUMBER = '919876543210'; // digits only, no plus
export const EMAIL = 'hello@trendyjeans.example';
export const ADDRESS = 'Shop No. 12, Main Market Road, Your City, State - 560000';
export const HOURS = 'Mon-Sat 10:00 AM - 9:00 PM, Sun 11:00 AM - 7:00 PM';
export const INSTAGRAM = '@trendyjeans.official'; // plain text, not a link

export const WHITESEA_NAME = 'Whitesea Labs';
// TODO: replace with real URL
export const WHITESEA_URL = '#';

export const DELIVERY_FEE = 49;
export const FREE_DELIVERY_ABOVE = 1999;

export interface CouponDefinition {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  description: string;
}

export const COUPONS: Record<string, CouponDefinition> = {
  TRENDY10: {
    code: 'TRENDY10',
    type: 'percent',
    value: 10,
    minOrder: 999,
    description: '10% off on orders above ₹999',
  },
  WELCOME150: {
    code: 'WELCOME150',
    type: 'flat',
    value: 150,
    minOrder: 1499,
    description: '₹150 off on orders above ₹1,499',
  },
};
