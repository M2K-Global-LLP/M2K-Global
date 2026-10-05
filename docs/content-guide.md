# Content and publication

The browser imports only `client/src/generated/public-content.ts`. Never import editorial source files into route or component code. Run `npm run validate-content` and `npm run build` after editing. Generated files are not hand edited.

## Projects

Edit `client/src/content/projects.ts`. Three generic examples are intentionally `approved: false`. Obtain permission, replace the outline with accurate approved copy, and change `approved` to `true`. A public route is generated at `/projects/<slug>`. Keep slugs stable once published. Service slugs determine filter categories. Optional methodology is omitted when absent. Outcomes require both project approval and `outcomesApproved: true`; unapproved outcomes are stripped from generated data. For a verified client-approved metric, add an `outcomeMetrics` item with `value` and `label`; it is emitted only when both approval flags are true. Do not add client names, figures or outcomes without permission and evidence.

## Insights

Add a UTF-8 `.md` file in `client/src/content/insights/`. Use frontmatter:

```yaml
---
title: Your reviewed title
slug: your-reviewed-title
status: draft
excerpt: A short factual summary.
tags: [Government Procurement]\ncontentType: Guide
publishedAt: "2026-09-28"
seo:
  title: Your reviewed title | M2K Global
  description: A concise unique description.
---
## A descriptive heading

Write the article here.
```

Use an actual publication date, not the example date. `publishedAt` is required for published articles. Optional `updatedAt` cannot precede it. Optional `authorName` must identify the actual author. Review copy and references, then change `status` to `published`. The build parses frontmatter and Markdown; drafts never reach public modules or routes. Raw HTML is disabled. Use Markdown headings beginning at `##`, descriptive links, and local `/images/` or `/placeholders/` assets. Remote article images are not rendered. Reading time is estimated at 200 words per minute. Tags drive filtering and related articles. Set `contentType` to `Article` or `Guide` for the card corner label; it defaults to `Article`.

## Careers

Edit `client/src/content/careers.ts`. Keep examples `draft`. Publish only real vacancies with `status: open`, a publication date, responsibilities and requirements. Include location, work mode and employment type. Set a real closing date when known. Mark a previously public job `closed` to retain its canonical detail route and closure notice. Expired roles stop appearing in the open list; rebuild on closing dates so static HTML stays current. Drafting a formerly public role removes its route. Phase 4 supplies the application form for open roles. Rebuild and restart the API after catalog changes.

JobPosting data requires a complete open role, publication and closing dates, a real SITE_URL and `locationAddress` with `streetAddress`, `addressLocality`, `addressRegion`, `postalCode` and `addressCountry`. Do not copy the company address unless it is the actual job location. For fully remote roles, supply applicantCountries with the actual eligible countries instead of a physical job address. Incomplete, closed and expired roles receive no JobPosting data. Closing dates are evaluated at the end of the stated UTC date.

## Branding and legal drafts

Company details and real social profile URLs live in `company.ts`; add only social links that belong to M2K Global. Editorial labels live in `site.ts` and `collections.ts`. Legal Markdown lives in `legal.ts` with `[COMPANY NAME]` and `[EMAIL]` tokens resolved from the company configuration. Both legal pages remain prominently marked DRAFT and excluded from the sitemap until reviewed. They describe the implemented contact and resume handling, including private Supabase storage and email notification attempts. Obtain legal review and confirm the implemented practices before launch.

## Build and verification

Only approved projects, published articles, and open/closed jobs get detail routes and sitemap entries. `/404`, draft legal pages, and removed placeholder detail URLs are excluded. Query filters are not canonical routes. The canonical domain is confirmed as https://www.m2kglobal.com. Set SITE_URL to that value and explicitly enable SITE_INDEXABLE only for approved production launch; the default example.invalid origin is deliberately non-indexable.

Run `npm run test:publication-fixture` to temporarily approve one project and publish one article, build, verify HTML/meta/sitemap and filtering, then restore original sources and rebuild. Do not interrupt that test; its `finally` block restores the source files even after a failed assertion.
