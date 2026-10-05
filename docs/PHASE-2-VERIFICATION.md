# Phase 2 verification

Completed locally on 2026-09-28 in `D:\M2K GLOBAL`. Phase 3 has not started.

## Delivered

- Navy/teal design system, local SVG artwork and responsive typography/spacing.
- Button, SectionHeading, Breadcrumb, Hero, ServiceCard, IndustryCard, CTASection, FAQ, TenderSaarFeature and EmptyState components.
- Sticky shrinking navbar, five-service disclosure, active links, keyboard controls, mobile dialog focus trap and Escape handling.
- Four-column footer, company placeholders, conditional app/Login links, skip link, scroll restoration and reduced-motion-aware hash scrolling.
- Home, About, Services overview, five data-driven service detail pages and Tender Saar.
- Clearly labelled sample tender dashboard with working sample search, official procurement-portal links and bid/no-bid considerations.
- Unconfirmed pricing/contact state and a single app/API URL configuration module.
- Route metadata and BreadcrumbList JSON-LD. Organization JSON-LD is omitted until real company identity and a public canonical origin are configured.

Projects, Insights and Careers retain placeholder content. Contact/legal routes also remain placeholders. No form, API, storage or email processing was implemented in this phase.

## Exit checks

| Check | Result |
| --- | --- |
| `npm run lint` | Passed, no diagnostics |
| `npx tsc --noEmit` | Passed across the root's workspace source files |
| `npm run typecheck` | All three workspaces passed |
| `npm run validate-content` | Passed: five services, 19 public/placeholder routes |
| `npm run build` | Client, contracts and server passed; client rebuilt after the contrast correction |
| `npm run verify-prerender` | Passed: title, description, canonical and H1 in 19 raw HTML documents |
| `npm run verify:core -w @m2k/client` | Nine core pages passed copy, heading-order and breadcrumb checks |
| Publication grep | 38 build files scanned; three private draft examples excluded |
| `npm test` | Seven foundation tests passed |
| Playwright | 41 passed, zero failed; final run 49.2 seconds |

## Browser coverage

All nine core pages were tested in Chromium at **375, 768, 1024 and 1440px**: 36 page/viewport combinations.

Each combination passed:

- `document.documentElement.scrollWidth <= window.innerWidth`.
- No browser console errors or uncaught page errors during the page check.
- Exactly one H1.
- Automated axe WCAG 2 A/AA and WCAG 2.1 A/AA checks.
- Full-page screenshot capture.

One issue was found and fixed: About's leadership-placeholder body text was slightly below the required contrast. The final run passed at all widths. Desktop/mobile Home screenshots and the desktop dashboard were also reviewed visually.

Additional passing Playwright checks:

- **25 unique internal navigation/CTA URLs** return HTTP 200; linked hash targets exist, including `#pricing`.
- Services dropdown responds to Enter, Space, ArrowUp/Down, Home, End and Escape; link activation navigates correctly.
- Mobile menu opens by keyboard, traps forward/reverse Tab, exposes service links, closes on Escape and restores trigger focus.
- Sample search/filter and clear action work; native FAQ disclosures open by keyboard.
- Missing-app configuration hides Login and uses a clearly labelled contact fallback.
- Core content remains visible without JavaScript.
- Published page copy contains no `lorem ipsum`, `guaranteed`, `#1`, `100%` claims or the prohibited developer-positioning phrase. The copy scan excludes scripts/styles so CSS dimensions are not mistaken for claims.

## Screenshots

All **36 PNG files** are saved in `/screenshots` and linked individually in [the screenshot index](../screenshots/README.md).

| Page | Filename pattern; widths are 375, 768, 1024, 1440 |
| --- | --- |
| Home | `home-{width}.png` |
| About | `about-{width}.png` |
| Services overview | `services-{width}.png` |
| Social Impact | `services-social-impact-{width}.png` |
| Tender Advisory | `services-tender-advisory-{width}.png` |
| IT & Product Delivery | `services-it-product-delivery-{width}.png` |
| Language Training | `services-language-training-{width}.png` |
| Skill Development | `services-skill-development-{width}.png` |
| Tender Saar | `tender-saar-{width}.png` |

Machine-readable browser results are in `screenshots/playwright-results.json`.

## Review locally

Run `npm run preview`, then open `http://127.0.0.1:4173`. No deployment was performed. The default build remains noindex and uses the reserved `https://example.invalid` canonical origin until real production configuration is supplied.

Awaiting approval before Phase 3.
