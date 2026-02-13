# Cara Upgrade — Deliverables Package

## Overview
Complete deliverables for upgrading the Cara fashion e-commerce site from static HTML/CSS/JS to a modern Next.js + Tailwind CSS + GSAP production skeleton.

## Deliverables Index

| # | File | Phase | Description |
|---|------|-------|-------------|
| 1 | `design-research.json` | Research | 12 reference sites with patterns, fonts, colors |
| 2 | `design-system.json` | Design | Full token system (palette, typography, shadows) |
| 3 | `components-spec.md` | Design | 10 components with props & animation hooks |
| 4 | `assets-manifest.json` | Assets | All assets with variants, alt text, Stitch IDs |
| 5 | `gsap-timelines.json` | Motion | 6 section timelines with triggers & fallbacks |
| 6 | `gsap-snippets.js` | Motion | Drop-in GSAP code (ScrollTrigger + Lenis) |
| 7 | `r3f-decision.json` | Evaluation | R3F decision: NOT recommended |
| 8 | `integration-plan.md` | Skeleton | Step-by-step setup instructions |
| 9 | `performance-a11y-checklist.md` | Quality | Performance + accessibility checklist |

## Sample Code

| File | Purpose |
|------|---------|
| `sample-code/tailwind.config.ts` | Tailwind wired with design tokens |
| `sample-code/hooks/useGSAP.ts` | Safe GSAP hook with cleanup + batch reveal |
| `sample-code/hooks/useLenis.ts` | Lenis smooth scroll + GSAP sync |
| `sample-code/components/Header.tsx` | Sticky nav, mobile drawer, scroll shadow |
| `sample-code/components/Hero.tsx` | Split hero with GSAP clip-path + breathing loop |
| `sample-code/components/ProductCard.tsx` | Card with micro-parallax + cart pulse |
| `sample-code/components/ProductGrid.tsx` | Grid with ScrollTrigger.batch reveal |
| `sample-code/components/Newsletter.tsx` | Email signup with slide-in animation |
| `sample-code/components/Footer.tsx` | 4-column footer with social links |
| `sample-code/pages/index.tsx` | Home page composing all components |
| `sample-code/pages/product/[slug].tsx` | Product detail with gallery + crossfade |

## Stitch MCP Outputs

| Screen | ID | Purpose |
|--------|----|---------|
| Hero | `7eba316671754c6c91471ad2a2416657` | Split-layout hero with model |
| Product Grid | `cee25b60860a45a7b92dcaf7ceeea049` | 4-column product card grid |
| Features + Promo | `4596857e425a40c4ac65efe7b4902412` | Feature boxes + 70% off banner |
| Newsletter + Footer | `ca419a85439342e7b8c3757ecdbc69e8` | Dark newsletter + full footer |
| Product Detail | `5ca4a7e78d4d46d28d646d12dd23db10` | Single product with gallery |

**Stitch Project ID:** `7110657721294532215`

## Generated Assets

| Asset | Location | Purpose |
|-------|----------|---------|
| Hero model | `stitch_outputs/hero-model/` | Editorial fashion model for hero |
| Icon set | `stitch_outputs/icons/` | 12 teal e-commerce icons |

## Quick Start
See `integration-plan.md` for step-by-step setup instructions.
