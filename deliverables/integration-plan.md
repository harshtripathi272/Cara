# Integration Plan — Cara Next.js + Tailwind Upgrade

## Step 1: Initialize Next.js Project
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

## Step 2: Install Dependencies
```bash
npm install gsap lenis
npm install -D @types/node
```

## Step 3: Wire Tailwind Config
Copy `deliverables/sample-code/tailwind.config.ts` → `tailwind.config.ts` (root)

## Step 4: Add Google Fonts
In `src/app/layout.tsx`, add:
```tsx
import { League_Spartan, Inter, Source_Serif_4 } from 'next/font/google';

const leagueSpartan = League_Spartan({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-accent' });
```

## Step 5: Copy Components
```
deliverables/sample-code/components/ → src/components/
deliverables/sample-code/hooks/     → src/hooks/
deliverables/sample-code/pages/     → src/app/ (adapt to App Router pattern)
```

### App Router Adaptation
- `pages/index.tsx` → `src/app/page.tsx`
- `pages/product/[slug].tsx` → `src/app/product/[slug]/page.tsx`

## Step 6: Copy Assets
```
img/                    → public/img/  (existing product images)
stitch_outputs/         → public/stitch_outputs/  (Stitch-generated assets)
```

## Step 7: Wire GSAP & Lenis
In `src/app/layout.tsx`, the `useLenis()` hook should be called once at the layout level.
Individual components already call `useGSAP()` internally.

## Step 8: Verify
```bash
npm run dev
# Visit http://localhost:3000
# ✓ Hero renders with split layout + clip-path reveal
# ✓ Product cards appear with staggered scroll animation
# ✓ Newsletter slides in from sides
# ✓ Smooth scrolling active via Lenis
# ✓ Mobile menu toggles correctly
# ✓ Reduced motion: animations skipped gracefully
```

## Dependencies Summary
| Package | Purpose | Bundle Impact |
|---------|---------|---------------|
| `gsap` | Animation engine + ScrollTrigger | ~45KB gzipped |
| `lenis` | Smooth scrolling | ~5KB gzipped |
| `next` | Framework | - (already included) |
| `tailwindcss` | Utility CSS | 0KB runtime (purged) |

## Component Tree
```
Layout (useLenis)
├── Header (sticky, scroll shadow)
├── Hero (GSAP timeline, breathing loop)
├── ProductGrid (ScrollTrigger.batch)
│   └── ProductCard × N (micro-parallax, cart pulse)
├── Newsletter (slide-in reveal)
└── Footer (static)
```
