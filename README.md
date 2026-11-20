# Trendy Jeans — 3D Clothing E-Commerce Website
**Showcase engineered by WHITESEA LABS**

"Trendy Jeans" is a premium, modern, mobile-first 3D clothing e-commerce website built for a local clothing shop. It enables visitors to interact with procedural 3D models of jeans, t-shirts, casual shirts, hoodies, and trucker jackets from every angle, customize swatches in real-time, add items to cart with coupon validation, and place direct order requests transmitted instantly via WhatsApp.

---

## 1. Quick Start

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+ or v10+)

### Setup Commands
```bash
# 1. Install pinned dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production (type-checked)
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 2. Configuration & Customization

### Where to Edit Shop Details
All shop information lives exclusively in **`src/config/shop.ts`**:
- **`SHOP_NAME`**: Store business name (e.g. `"Trendy Jeans"`)
- **`TAGLINE`**: Editorial tagline (e.g. `"Denim, redefined."`)
- **`PHONE`**: Display telephone number
- **`WHATSAPP_NUMBER`**: Clean digits only without `+` (e.g. `"919876543210"`)
- **`EMAIL`**: Contact email
- **`ADDRESS`**: Physical street address
- **`HOURS`**: Operating days and hours
- **`INSTAGRAM`**: Instagram handle
- **`DELIVERY_FEE`**: Local delivery fee (`49`)
- **`FREE_DELIVERY_ABOVE`**: Free shipping threshold (`1999`)
- **`COUPONS`**: Promo code definitions (`TRENDY10` for 10% off above ₹999, `WELCOME150` for ₹150 off above ₹1,499)
- **`WHITESEA_NAME`** & **`WHITESEA_URL`**: Agency credit constants

### Optional Webhook Integration
To send incoming orders to an external CRM or webhook endpoint, copy `.env.example` to `.env`:
```env
VITE_ORDER_WEBHOOK_URL=https://your-crm.example/api/orders
```
When submitted, the order payload is dispatched asynchronously via `POST` as a JSON object.

---

## 3. How to Add Real GLB Models in the Future

Each product in `src/data/products.ts` includes an optional `modelUrl: string | null` property (currently set to `null` to use the high-performance procedural 2.4×2.4 displacement geometry).

To replace the procedural garment with a custom 3D file (`.glb` / `.gltf`):
1. Place your optimized `.glb` file into the `public/models/` folder (e.g., `public/models/tj-j01-indigo.glb`).
2. Update the product entry in `src/data/products.ts`:
   ```typescript
   {
     id: 'TJ-J01',
     slug: 'indigo-slim-fit-jeans',
     name: 'Indigo Slim Fit Jeans',
     // ...
     modelUrl: '/models/tj-j01-indigo.glb',
   }
   ```
3. In `src/components/three/Garment.tsx`, the model loader will automatically utilize Drei's `useGLTF(modelUrl)` when present, allowing seamless drop-in upgrades without changing any layout or viewport logic.

---

## 4. Architectural Highlights

- **Shared Single WebGL Canvas**: Uses one persistent Three.js `<Canvas>` with `@react-three/drei`'s `<View>` system, tracking DOM rectangles with automatic viewport culling.
- **Pure Local Assets**: Zero runtime CDNs or external fonts. Playfair Display and Inter are self-hosted via `@fontsource`.
- **Zero Layout Shifts**: Pre-calculated CSS aspect ratios (`aspect-[3/4]`, `aspect-square`, `aspect-[4/3]`) ensure zero cumulative layout shift (CLS).
- **Graceful WebGL Fallback**: If WebGL is unsupported or blocked, an inline SVG illustration is rendered seamlessly.
- **Accessibility & Motion Compliance**: Respects `prefers-reduced-motion`, includes keyboard rotation (`ArrowLeft`/`ArrowRight` / `R`), semantic HTML landmarks, and WCAG AA contrast.
- **Direct WhatsApp Protocol**: Built-in order payload encoder formats lines, subtotal, discounts, delivery method, and address into WhatsApp click-to-chat links.

---

Crafted with precision by **Whitesea Labs**.
