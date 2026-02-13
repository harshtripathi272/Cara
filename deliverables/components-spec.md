# Component Specification — Cara Next.js + Tailwind

## Header
- **Purpose**: Sticky navigation bar with logo, nav links, cart icon, and mobile hamburger menu
- **Props**: `navItems: NavItem[]`, `cartCount: number`, `isSticky: boolean`
- **Animation hooks**: 
  - Nav link underline slide on hover (CSS transition)
  - Mobile menu slide-in from right (GSAP or CSS)
  - Header shadow appears on scroll (intersection observer / ScrollTrigger)

---

## Hero
- **Purpose**: Full-viewport split hero with promotional text (left) and model image (right)
- **Props**: `headline: string`, `subheadline: string`, `cta: { text: string, href: string }`, `heroImage: AssetManifestEntry`
- **Layout**: 2-column grid — left (text + CTA), right (model cutout with transparent bg)
- **Animation hooks**:
  - `hero-bg` — fade in on page load (opacity 0→1, 0.6s)
  - `.hero-title .line` — staggered Y+opacity entry per line (0.12s stagger, 0.6s each)
  - `.hero-cta` — scale+opacity pop (0.25s)
  - `#hero-model` — mask-reveal using hero-reveal-frames (8 frames, 0.9s, canvas-based)
  - `#hero-model` — breathing loop (Y oscillation ±3px, 6s, yoyo, sine.inOut)
- **a11y**: `prefers-reduced-motion` guard — skip loops and stagger, use simple fades
- **Performance**: Hero image uses `next/image` with `priority` for LCP; `<canvas>` for frame sequence

---

## ProductCard
- **Purpose**: Individual product card with image, brand, title, stars, price, and add-to-cart button
- **Props**: `product: Product` (image, altImage, brand, title, rating, price, slug)
- **Layout**: Vertical card with rounded border, image top, description bottom
- **Animation hooks**:
  - Scroll-enter: y+opacity+scale stagger via parent's ScrollTrigger.batch()
  - Hover: micro-parallax on product image (mousemove → GSAP quickTo)
  - Hover: image swap crossfade (if altImage exists)
  - Add-to-cart: pulse sprite animation (cart-pulse-001..005)
- **a11y**: Alt text from assets-manifest; keyboard-focusable cart button with ARIA label

---

## ProductGrid
- **Purpose**: Responsive grid container for ProductCard components
- **Props**: `products: Product[]`, `title: string`, `subtitle: string`, `columns?: 3 | 4`
- **Layout**: CSS Grid — 4 cols desktop, 3 cols tablet, 2 cols mobile
- **Animation hooks**:
  - ScrollTrigger.batch() on `.product-card` children
  - Stagger: 0.08s, from y:12 opacity:0 scale:0.98
  - Batch enter/leave callbacks for performance
- **a11y**: Section heading, role="list" on grid container

---

## FeatureBoxes
- **Purpose**: Row of feature icons (Free Shipping, Online Order, Save Money, etc.)
- **Props**: `features: Feature[]` (icon, title, color)
- **Layout**: Flex row with wrap, centered, 180px per box
- **Animation hooks**:
  - Scroll-enter: staggered fade+scale (0.1s stagger)
  - Hover: box-shadow elevation + icon SVG fill color change
- **a11y**: Icons have aria-hidden="true", text labels visible

---

## PromoBanner
- **Purpose**: Full-width promotional banner with background image, headline, discount, and CTA
- **Props**: `headline: string`, `discount: string`, `backgroundImage: string`, `cta: { text: string, href: string }`
- **Layout**: Centered flex column over background image with overlay
- **Animation hooks**:
  - Scroll-enter: clip-path reveal (circle expand from center, 0.8s)
  - Discount number: counter pulse animation (scale 1→1.1→1, 1.5s loop)
- **a11y**: Sufficient contrast for text over image (dark overlay); prefers-reduced-motion skip

---

## SmallBannerGrid
- **Purpose**: 2-column and 3-column promotional banner grids (deals, seasonal, categories)
- **Props**: `banners: Banner[]` (title, subtitle, backgroundImage, cta)
- **Animation hooks**:
  - Scroll-enter: staggered slide-up from y:20 (0.15s stagger)
  - Hover: slight scale (1.02) with shadow elevation

---

## Newsletter
- **Purpose**: Email signup section with dark background
- **Props**: `heading: string`, `description: string`, `onSubmit: (email: string) => void`
- **Layout**: 2-column — text left, form right
- **Animation hooks**:
  - Scroll-enter: text slides from left, form slides from right (0.4s)
  - Submit: button success pulse animation
- **a11y**: Input has proper label, form has accessible name, success/error alerts

---

## Footer
- **Purpose**: Multi-column footer with contact info, links, social icons, and app/payment badges
- **Props**: `columns: FooterColumn[]`, `socialLinks: SocialLink[]`
- **Layout**: 4-column flex with wrap
- **Animation hooks**: Minimal — fade in on scroll-enter
- **a11y**: Proper heading hierarchy (h4), social link labels, external link indicators

---

## ProductDetail (product/[slug].tsx)
- **Purpose**: Single product page with image gallery, details, size selector, quantity, and add-to-cart
- **Props**: `product: ProductFull` (images[], description, sizes, price, sku)
- **Layout**: 2-column — image gallery (left 40%), details (right)
- **Animation hooks**:
  - Gallery: image carousel reveal with crossfade
  - Small images: hover scale + border highlight
  - Add-to-cart button: ripple effect on click
  - Optional: R3F viewer for 360° (lazy-loaded, with static fallback) — pending r3f-decision.json
