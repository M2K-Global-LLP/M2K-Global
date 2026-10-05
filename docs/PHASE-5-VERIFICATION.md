# Phase 5 verification and launch handover

Date: 2026-10-01. Canonical origin: https://www.m2kglobal.com. Build tested with indexing enabled and raw HTML prerendering. No site has been deployed.

## Verification results

- `npm run lint`: pass, 0 ESLint errors.
- `npm run typecheck`: pass across contracts, client and server; root `npx tsc --noEmit`: pass.
- `npm run validate-content`: pass; 5 services; source editorial entries validate. Final generated catalog has 0 open jobs.
- `npm run build`: pass for contracts, 16-route static client and Express server.
- `npm run verify-prerender`: pass; every one of 16 final routes has its own raw-HTML title, description, canonical URL and H1. Sitemap contains only canonical indexable paths; robots.txt allows crawling and references the confirmed domain. Unknown routes receive the real 404 document/status.
- Unit suite: 16 passed, 0 failed, 1 live integration case skipped in the unit-only run. The same Supabase integration ran separately and passed.
- Default Playwright run: 132 passed, 0 failed, 8 live-form cases skipped because they require a real Supabase project. All 8 live cases were then run through `npm run test:forms-e2e`: 8 passed in 18.1 seconds.
- Approved-project/published-article fixture: passed route, HTML, metadata, sitemap, Article JSON-LD and keyboard filter checks. Sources and final build were restored afterward.
- Full Phase 5 route audit: 76 passed, 0 failed. At 375, 1024 and 1440 CSS pixels, all 19 routes had no horizontal overflow, console errors, heading-level skips or axe violations; skip-link focus and primary landmarks passed. JavaScript-disabled checks passed on all 19 routes, including raw metadata, canonical URLs, internal links and actual 404 behavior. Privacy and Terms showed `DRAFT — review before launch`.
- Publication and secret scans passed on the final artifacts. The final 16-route public build contains none of the unapproved project, draft article or draft job content; no server credential names were found in 60 client output artifacts.
- Live Supabase API tests: 1 integration suite passed. It covered valid and invalid requests, honeypot behavior, rate limits, transaction rollback, PDF signature and size rejection, closed jobs, private bucket access and short-lived signed URLs. Temporary schemas/files were cleaned up.
- Supabase readiness check: database reachable; both submission tables have RLS; 0 browser table grants; 0 Storage read policies; `resumes` is private; 0 pending notifications at check time.

## Lighthouse and bundle review

Single local Lighthouse run per page using default mobile simulated throttling against the gzip-enabled static preview server. The project detail is the temporary mine-closure editorial fixture and was restored to unapproved after the audit. Scores can vary on the eventual host and network.

| Page | Performance | Accessibility | Best practices | SEO | FCP / LCP | TBT / CLS | Total transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 94 | 100 | 100 | 100 | 2.47 / 2.47 s | 0 ms / 0 | 197 KB |
| Tender Saar | 97 | 100 | 100 | 100 | 2.17 / 2.17 s | 0 ms / 0 | 165 KB |
| Social Impact service | 97 | 100 | 100 | 100 | 2.17 / 2.17 s | 0 ms / 0 | 162 KB |
| Project detail | 95 | 100 | 100 | 100 | 2.32 / 2.32 s | 0 ms / 0 | 194 KB |

Route modules are split, non-hero images load locally, the hero illustration is prioritized, and the preview/server edge path applies gzip. Lighthouse estimates 64 KB unused JavaScript on the service page and 93 KB on the project page; interactive-page code still leaves room for later tree-shaking. CSS is about 41 KB uncompressed and the largest form-validation asset is about 125 KB raw / 39 KB gzip. Browser/system fonts avoid third-party font requests. Full JSON reports are in `reports/lighthouse/`.

## SEO, legal and privacy state

The local production build uses SITE_URL=https://www.m2kglobal.com and SITE_INDEXABLE=true. Invalid, local and HTTP origins are rejected for indexable builds; preview defaults remain non-indexable. Each page has canonical and Open Graph metadata, the share card is local, and Organization JSON-LD uses only configured M2K Global identity/contact fields. The final build contains no placeholder identity in public body text or Organization structured data.

Privacy Policy and Terms remain clearly marked `DRAFT — review before launch`. No legal notice was removed. Submission data practices now describe the implemented contact form, application/resume handling, Supabase storage and notification attempts; retention and privacy-request procedures still need an owner and legal approval.

## Still required before public launch

1. **Logo file:** supply the approved logo to replace the provisional typographic mark.
2. **SMTP:** provide production SMTP credentials and verified sender, configure production email, then verify an owner-approved real inbox delivery. Until then EMAIL_DRIVER is `console`.
3. **Legal review:** counsel must approve final Privacy Policy and Terms text. The draft notices stay visible until that review is complete.
4. **Project permissions:** obtain client approval for each project before setting `approved: true`. All 3 supplied project outlines currently remain unapproved; no project detail is in the public build.
5. **Domain/hosting setup:** the final domain is confirmed and canonicalized. Production DNS/TLS/static hosting, Node API hosting and its HTTPS origin still need provisioning/configuration. Set VITE_API_URL to the real API origin, CLIENT_ORIGIN to the website origin and SITE_INDEXABLE=true only at release. The workflow file is present, but this workspace has no initialized Git repository or remote, so GitHub Actions cannot run until one is configured.
6. **Tender Saar:** the app URL and pricing remain unconfirmed; the public CTA therefore uses the labelled contact fallback and sample dashboard stays marked SAMPLE DATA.
7. **Operations:** choose hosting/alert accounts, notification owners and submission/resume retention periods. Deployment instructions include health checks, database/storage readiness, SMTP failure review, backup checks and rollback steps; no third-party uptime monitor has been provisioned.

No clients, figures, testimonials, certifications, project outcomes or job openings were invented or published. All three project examples, six article stubs and the one role example are private/draft in the final artifacts.
