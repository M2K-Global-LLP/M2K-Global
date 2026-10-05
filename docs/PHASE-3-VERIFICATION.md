# Phase 3 verification

Completed 2026-09-29 in D:\M2K GLOBAL. Phase 4 has not started.

## Delivered

- M2K Global company name and supplied email, telephone and Gurugram address configured throughout the shared site.
- Projects grid with URL category filters and a reusable detail template; three generic project outlines remain unapproved. Outcomes require separate approval and are stripped from generated data otherwise.
- Markdown Insights with build-time frontmatter parsing, tag filters, safe article rendering, reading time, related articles and factual Article JSON-LD. All six stubs remain draft.
- Careers listing, open/closed job details, future application section and completeness-gated JobPosting data. The example role remains draft.
- Content-driven legal drafts with visible counsel-review notices and resolved company/email tokens.
- Polished 404 document and HTTP 404 for unknown paths, unknown detail slugs and removed placeholder detail URLs. Unknown locations mount cleanly instead of hydrating the /404 route bootstrap.
- Home collections use generated public content. Sitemap contains only public canonical routes; legal drafts and /404 are excluded.

## Checks and results

| Check | Result |
| --- | --- |
| npm run lint | Passed |
| npx tsc --noEmit | Passed |
| npm run typecheck | Passed for client, server and contracts |
| Content validation | Passed: five services and 16 current public/error routes |
| npm run build | Passed for contracts, client and server |
| npm run verify-prerender | Passed: all 16 routes have their own title, description, canonical and H1 in raw HTML; 404.html exists; sitemap matches the public canonical route set |
| npm test | 10 tests passed |
| Publication scan | Passed: 10 private records excluded from HTML, JS, generated JSON, manifests and sitemap; 43 artifacts scanned |
| npm run test:publication-fixture | Passed: one project temporarily approved and one article published; 18 routes verified, metadata and sitemap checked, Article JSON-LD and populated keyboard filtering verified; sources restored and full production build regenerated |
| npm run test:e2e | 68 passed, zero failures |

Browser checks cover 375, 768, 1024 and 1440 pixels. All six Phase 3 pages pass horizontal overflow, application console-error and automated accessibility checks. The browser's expected network diagnostic for the deliberately missing HTTP 404 document is excluded; application/hydration errors are not suppressed. Filters work with keyboard input, URL deep links and browser history. Link crawls passed for 25 core navigation/CTA URLs and 18 collection links, plus six removed/unknown detail routes. Unknown detail documents also recover through their Home link without browser errors.

Additional tests verify raw HTML and unsafe Markdown URLs cannot execute, hotlinked article images are omitted, unapproved outcomes are removed, closed job routes remain public, and incomplete/closed/expired jobs do not emit JobPosting data.

Evidence: [browser results](../screenshots/playwright-results.json), [60 screenshots](../screenshots/README.md), [content guide](content-guide.md).

## Boundaries

No form submission, upload, persistence or email delivery was implemented. Existing submission endpoints remain 501 stubs. Content examples are private and the public collections show honest empty states. The genuine website origin and Tender Saar app URL have not been supplied; default builds remain non-indexable at example.invalid. Production hosting must preserve HTTP 404 as described in [deployment notes](deployment.md). Legal drafts require review before launch. Rebuild when content publication or vacancy closing dates change.

Stop here; Phase 4 requires the owner's approval.
