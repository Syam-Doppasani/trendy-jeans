export interface ValueProp {
  id: string;
  title: string;
  text: string;
  icon: 'Sparkles' | 'RefreshCw' | 'Truck' | 'MessageCircle';
}

export interface Testimonial {
  name: string;
  rating: number;
  quote: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface WhiteseaService {
  id: string;
  title: string;
  text: string;
  icon: 'Box' | 'ShoppingBag' | 'MessageSquare' | 'Layers';
}

export const VALUE_PROPS: ValueProp[] = [
  {
    id: 'vp-1',
    title: 'Premium fabrics',
    text: 'Carefully chosen cotton and denim that feel good and last long.',
    icon: 'Sparkles',
  },
  {
    id: 'vp-2',
    title: 'Try before you trust',
    text: 'Visit our store to try any style. Easy size exchange within 7 days.',
    icon: 'RefreshCw',
  },
  {
    id: 'vp-3',
    title: 'Fast local delivery',
    text: 'Delivery within 24 to 48 hours in our service area.',
    icon: 'Truck',
  },
  {
    id: 'vp-4',
    title: 'Order on WhatsApp',
    text: 'Share your order in seconds and talk to us directly.',
    icon: 'MessageCircle',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rahul S.',
    rating: 5,
    quote: 'Perfect fit and the denim quality is far better than what I found online.',
  },
  {
    name: 'Priya M.',
    rating: 5,
    quote: 'Loved the oversized tee. Ordered on the website and it arrived the next day.',
  },
  {
    name: 'Arjun K.',
    rating: 4,
    quote: 'Great collection and very helpful staff. The 3D view helped me pick a colour.',
  },
  {
    name: 'Sneha R.',
    rating: 5,
    quote: 'The hoodie is so soft and warm. Will definitely order again.',
  },
  {
    name: 'Imran A.',
    rating: 5,
    quote: 'Smooth ordering and honest pricing. My go-to shop for jeans now.',
  },
];

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I place an order?',
    answer: 'Browse our collection, select your size and color, add items to your cart, and proceed to checkout. Once submitted, your order request opens directly in WhatsApp for quick confirmation with the shop.',
  },
  {
    id: 'faq-2',
    question: 'Do you take online payments?',
    answer: 'No online payment is processed on the website. You can pay via Cash on delivery, UPI on delivery, or Pay at store when you pick up your order.',
  },
  {
    id: 'faq-3',
    question: 'What is the delivery fee?',
    answer: 'Local delivery is ₹49, or completely FREE on orders above ₹1,999. In-store pickup is always free.',
  },
  {
    id: 'faq-4',
    question: 'Can I exchange a size?',
    answer: 'Yes, we offer an easy size exchange within 7 days of purchase, provided the garment is unworn and tags remain intact.',
  },
  {
    id: 'faq-5',
    question: 'How do I find my size?',
    answer: 'Check the size guide table on each product page for exact waist and chest measurements, or drop by our retail store to try styles in person.',
  },
  {
    id: 'faq-6',
    question: 'Do you deliver outside the city?',
    answer: 'We currently provide fast local delivery within our city service area. For requests beyond this area, please contact us directly on WhatsApp.',
  },
];

export const WHITESEA_SERVICES: WhiteseaService[] = [
  {
    id: 'ws-1',
    title: '3D Web Experiences',
    text: 'Interactive visuals that make products unforgettable.',
    icon: 'Box',
  },
  {
    id: 'ws-2',
    title: 'E-commerce Development',
    text: 'Fast, mobile-first stores built to convert.',
    icon: 'ShoppingBag',
  },
  {
    id: 'ws-3',
    title: 'WhatsApp-ready Ordering',
    text: 'Orders land where your customers already chat.',
    icon: 'MessageSquare',
  },
  {
    id: 'ws-4',
    title: 'UI / UX Design',
    text: 'Premium interfaces tuned for every screen.',
    icon: 'Layers',
  },
];

export const SIZE_GUIDE_DATA = {
  jeans: [
    { size: '28', waistIn: '28"', waistCm: '71 cm' },
    { size: '30', waistIn: '30"', waistCm: '76 cm' },
    { size: '32', waistIn: '32"', waistCm: '81 cm' },
    { size: '34', waistIn: '34"', waistCm: '86 cm' },
    { size: '36', waistIn: '36"', waistCm: '91 cm' },
  ],
  tops: [
    { size: 'S', chestIn: '38"' },
    { size: 'M', chestIn: '40"' },
    { size: 'L', chestIn: '42"' },
    { size: 'XL', chestIn: '44"' },
    { size: 'XXL', chestIn: '46"' },
  ],
};
