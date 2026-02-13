# Performance & Accessibility Checklist — Cara

## Performance

### Images
- [ ] All product images converted to WebP with fallback (next/image handles this automatically)
- [ ] Hero model image: `priority` prop set for LCP optimization
- [ ] Product card images: responsive `sizes` attribute configured (`50vw mobile, 33vw tablet, 25vw desktop`)
- [ ] Promo banner images: lazy-loaded (`loading="lazy"`)
- [ ] Stitch-generated assets optimized to ≤100KB each

### JavaScript Bundle
- [ ] GSAP imported via tree-shakeable named imports (`gsap/ScrollTrigger`)
- [ ] No R3F/Three.js in bundle (per r3f-decision.json)
- [ ] Lenis: ~5KB gzipped, loaded once in layout
- [ ] GSAP: ~45KB gzipped total (core + ScrollTrigger)
- [ ] Total animation JS: <50KB gzipped
- [ ] Dynamic imports used for any future heavy components (`dynamic(() => import(...), { ssr: false })`)

### Rendering
- [ ] Product cards use `will-change: transform` only during active animation (removed after)
- [ ] Micro-parallax disabled on touch devices (no unnecessary mousemove listeners)
- [ ] ScrollTrigger.batch() used instead of individual triggers (reduces observer count)
- [ ] Breathing loop paused when hero section leaves viewport
- [ ] No layout thrash: all GSAP animations use transform/opacity only (GPU-composited)

### Core Web Vitals Targets
- [ ] LCP: < 2.5s (hero image with `priority` loading)
- [ ] FID/INP: < 100ms (no heavy JS on main thread during interaction)
- [ ] CLS: < 0.1 (all images have explicit width/height, no content shift from animations)

### Fonts
- [ ] Google Fonts loaded via `next/font/google` (self-hosted, no external request)
- [ ] Font display: `swap` to prevent invisible text
- [ ] Critical fonts preloaded (League Spartan for hero headline)

---

## Accessibility

### Motion
- [ ] `prefers-reduced-motion: reduce` respected in all GSAP timelines
- [ ] Breathing loop, parallax, and stagger animations skipped for reduced motion users
- [ ] Fallback: content shown immediately with `opacity:1, y:0, scale:1`

### Semantic HTML
- [ ] Single `<h1>` per page (hero headline on home, product title on PDP)
- [ ] Proper heading hierarchy (`h1 > h2 > h3 > h4`) throughout
- [ ] `<nav>` element for navigation with `aria-label`
- [ ] `<main>` element wrapping page content
- [ ] `<footer>` element for footer section
- [ ] `<address>` element for contact information

### Interactive Elements
- [ ] All interactive elements have unique IDs for testing
- [ ] Cart button has `aria-label="Add {product name} to cart"`
- [ ] Cart icon shows item count with `aria-label="Cart with N items"`
- [ ] Mobile menu toggle has `aria-expanded` attribute
- [ ] All `<a>` tags opening external links have `target="_blank" rel="noopener noreferrer"`
- [ ] Focus indicators visible on all interactive elements (default browser + custom styling)

### Images
- [ ] All `<img>` tags have descriptive `alt` text (from assets-manifest.json)
- [ ] Decorative images use `alt=""` or `aria-hidden="true"`
- [ ] SVG icons have `aria-hidden="true"` with adjacent text labels

### Forms
- [ ] Newsletter email input has associated `<label>` or `aria-label`
- [ ] Form has `aria-label="Newsletter signup"`
- [ ] Success/error messages use `role="alert"` for screen reader announcement
- [ ] Quantity input has explicit `<label>`

### Color Contrast
- [ ] Text on white background: #222222 on #FFFFFF → contrast ratio 16.3:1 ✓
- [ ] Text on dark newsletter: #FFFFFF on #041E42 → contrast ratio 15.7:1 ✓
- [ ] Primary CTA: #FFFFFF on #0A968C → contrast ratio 3.9:1 (AA for large text) ✓
- [ ] Accent text on white: #E8735A on #FFFFFF → contrast ratio 3.2:1 (verify large text only)
- [ ] Neutral body on surface: #8C9AA8 on #F5F0EB → verify ≥ 4.5:1

### Keyboard Navigation
- [ ] Tab order flows logically through page sections
- [ ] Skip-to-content link present (hidden until focused)
- [ ] Product cards are keyboard-navigable (link + button)
- [ ] Mobile menu is keyboard-accessible when open
- [ ] Escape key closes mobile menu
