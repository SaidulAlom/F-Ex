# Brand & animation tuning

## Colours

All brand colours are CSS channel variables at the top of `app/globals.css`, then mapped to Tailwind 4 theme tokens. This keeps utility classes such as `bg-navy`, `text-electric`, `border-line` and `shadow-soft` swappable from one place.

```css
:root {
  --navy-rgb: 11 18 32;      /* #0B1220 */
  --electric-rgb: 37 99 235; /* #2563EB */
  --orange-rgb: 255 107 44;  /* #FF6B2C */
  --cloud-rgb: 247 248 250;  /* #F7F8FA */
  --ink-rgb: 71 85 105;
  --line-rgb: 222 228 238;
}
```

To rebrand, change the channel values. Tailwind 4 automatically supports opacity modifiers such as `bg-electric/10` through the `--color-*` theme mapping.

## Fonts

`app/layout.tsx` loads two `next/font/google` faces:

- `Sora` → `--font-sora` → `font-display`
- `Inter` → `--font-inter` → `font-body`

Headings use the display font globally; body copy uses Inter. To swap a face, change the import and the `--font-display` / `--font-body` variables in `app/globals.css`.

## Animation timing map

| Effect | Location | What to change |
|---|---|---|
| Global default Framer duration | `components/motion/MotionProvider.tsx` | `transition.duration` |
| Reduced-motion policy | `MotionProvider.tsx`, `app/globals.css` | `reducedMotion="user"` + media query |
| Page route fade | `components/motion/PageTransition.tsx` | `transition.duration` |
| Scroll reveal / stagger | `components/motion/Reveal.tsx` and `delay` props | `duration`, `y`, stagger values |
| Hero word reveal | `components/motion/HeroMotion.tsx` | `delay: 0.12 + index * 0.07` |
| Hero phone parallax | `components/motion/HeroMotion.tsx` | `useTransform(..., [0, -70])` and `[0, -120]` |
| Gradient orbs | `app/globals.css` | `fex-drift-a`, `fex-drift-b` keyframes/durations |
| Float effect | `app/globals.css` | `fex-float` duration and translate |
| Brand/payment marquee | `app/globals.css` | `fex-marquee 34s` |
| Repair pinned scroll | `components/motion/RepairProcess.tsx` | section height, `offset`, progress ranges |
| Count-up | `components/motion/CountUp.tsx` | `duration = 1.4` |
| Card hover / image zoom | `components/products/ProductCard.tsx` | Tailwind `duration-200`, `duration-500` |
| Quick-view panel | `ProductCard.tsx` | `duration-300` |
| Search debounce | `components/layout/SearchBox.tsx` | `useDebounce(query, 250)` |
| Sticky header shrink | `components/layout/SiteHeader.tsx` | scroll threshold `24`, scale `0.96` |

## Motion constraints

- Heavy animation sections (`HeroMotion`, `RepairProcess`, `BrandMarquee`) are dynamically imported from `components/motion/LazyMotionSections.tsx`.
- Only `transform` and `opacity` are animated; colour changes are instant class swaps.
- `prefers-reduced-motion` disables CSS animations globally and Framer Motion is configured with `reducedMotion="user"`. Components also branch on `useReducedMotion()` for parallax, stagger, page transitions and count-up.

## Card/badge conventions

- Product cards: large rounded corners, soft shadow, hover lift and image zoom.
- Pre-owned condition: `Grade A/B/C` badges.
- Stock status: `Available`, `Reserved`, `Sold` badges plus a corner ribbon for Reserved/Sold.
- Branch pills: live open/closed state calculated in IST and refreshed every minute.
