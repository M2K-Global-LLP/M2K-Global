# Corporate website — Phase 0 architecture

Status: approved with amendments. Phases 1–4 are complete. Phase 5 production-readiness work is approved; deployment requires the launch prerequisites in docs/deployment.md. This document is a planning artifact, not application implementation.

## 1. Scope and positioning

A professional corporate website for consulting, technology, tender advisory and skill development, serving government bodies, PSUs, businesses and institutions.

Positioning: “We deliver technology products through managed delivery and technology partners.” Never claim in-house developers. Do not invent clients, statistics, testimonials, certifications, results, vacancies, product capabilities or prices.

| Brand input | Initial value |
| --- | --- |
| Company | M2K Global |
| Email | inquiry@m2kglobal.com |
| Phone | +91 97114 67375 |
| Address | 2nd floor Eros City Square Mall, Rosewood City Rd, Sector 49, Gurugram, Haryana 122018 |
| Logo | Typographic placeholder until supplied |
| Tagline | Omit until supplied |
| Primary | #102A43 — deep navy |
| Accent | #0F766E — restrained teal |
| Background | #F8FAFC and white |
| Footer | #081827 |
| Tender Saar app URL | Unset until supplied |

Company contact details are configured; only draft legal source tokens and explicitly labelled sample/TBD content remain. Hide the external app button until its URL is configured. Use local SVG patterns or named local placeholders, never hotlinked stock imagery.

## 2. Stack and architecture

- npm-workspace monorepo with one lockfile; strict TypeScript on client and server.
- Client: React, Vite, React Router v7 framework mode, Tailwind CSS, Lucide, subtle Framer Motion, react-hook-form and Zod. Do not use react-helmet-async.
- Use built-in `prerender` and route `meta` exports through Vite. SeoHead and StructuredData are TypeScript helpers returning route metadata/JSON-LD, not UI components. No production SSR server is required.
- Insights use Markdown files with frontmatter in `client/src/content/insights/*.md`, parsed and validated by build scripts. Disable raw HTML; no executable MDX is needed initially.
- Server: Node.js, Express, Zod, Helmet, environment-based CORS, express-rate-limit and route-scoped Multer.
- Shared API contracts package supplies form schemas and response types to both apps.
- Static website and Express API deploy independently. API data is not needed to render public pages.

```text
Visitor → Static host/CDN → Prerendered HTML + assets
Visitor → Express API → Submission database
                      → Private resume storage
                      → Transactional notification record → Synchronous email attempt
```

## 3. Planned folder tree

This is the target implementation tree. Only planning files are created in Phase 0.

```text
/
├── package.json
├── package-lock.json
├── tsconfig.base.json
├── eslint.config.js
├── .gitignore
├── README.md
├── PHASE-0-ARCHITECTURE.md
├── .github/workflows/ci.yml
├── docs/
│   ├── content-guide.md
│   └── deployment.md
├── packages/contracts/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── identifiers.ts
│       ├── contact.schema.ts
│       ├── application.schema.ts
│       └── responses.ts
├── client/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── react-router.config.ts
│   ├── .env.example
│   ├── public/placeholders/
│   │   ├── brand-mark.svg
│   │   ├── hero-grid.svg
│   │   ├── service-abstract.svg
│   │   ├── project-placeholder.svg
│   │   └── insight-placeholder.svg
│   ├── scripts/
│   │   ├── validate-content.ts
│   │   ├── generate-public-content.ts
│   │   ├── generate-job-catalog.ts
│   │   ├── generate-seo-files.ts
│   │   └── verify-prerender.ts
│   ├── src/
│   │   ├── root.tsx
│   │   ├── entry.client.tsx
│   │   ├── entry.server.tsx
│   │   ├── routes.ts
│   │   ├── vite-env.d.ts
│   │   ├── content/
│   │   │   ├── company.ts
│   │   │   ├── nav.ts
│   │   │   ├── services.ts
│   │   │   ├── projects.ts
│   │   │   ├── insights/
│   │   │   │   └── example-draft.md
│   │   │   ├── careers.ts
│   │   │   ├── industries.ts
│   │   │   ├── faq.ts
│   │   │   ├── pages.ts
│   │   │   ├── tender-saar.ts
│   │   │   ├── forms.ts
│   │   │   ├── legal.ts
│   │   │   └── seo.ts
│   │   ├── schemas/
│   │   │   ├── content.schema.ts
│   │   │   └── env.schema.ts
│   │   ├── generated/
│   │   │   ├── public-content.ts
│   │   │   └── route-manifest.ts
│   │   ├── layouts/SiteLayout.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   ├── ServiceDetailPage.tsx
│   │   │   ├── TenderSaarPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   ├── InsightsPage.tsx
│   │   │   ├── InsightDetailPage.tsx
│   │   │   ├── CareersPage.tsx
│   │   │   ├── CareerDetailPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── PrivacyPolicyPage.tsx
│   │   │   ├── TermsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Breadcrumb.tsx
│   │   │   │   └── SectionHeading.tsx
│   │   │   ├── sections/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── CTASection.tsx
│   │   │   │   ├── FAQ.tsx
│   │   │   │   └── TenderSaarFeature.tsx
│   │   │   ├── cards/
│   │   │   │   ├── ServiceCard.tsx
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── InsightCard.tsx
│   │   │   │   └── IndustryCard.tsx
│   │   │   ├── forms/
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── ApplicationForm.tsx
│   │   │   │   ├── FormField.tsx
│   │   │   │   └── FormStatus.tsx
│   │   │   ├── content/
│   │   │   │   ├── MarkdownContent.tsx
│   │   │   │   └── EmptyState.tsx
│   │   ├── lib/
│   │   │   ├── seo/
│   │   │   │   ├── SeoHead.ts
│   │   │   │   └── StructuredData.ts
│   │   │   ├── api.ts
│   │   │   ├── env.ts
│   │   │   ├── content.ts
│   │   │   └── urls.ts
│   │   └── styles/
│   │       ├── globals.css
│   │       └── tokens.css
│   └── tests/
│       ├── content-publication.test.ts
│       ├── seo.test.ts
│       └── e2e/
│           ├── navigation.spec.ts
│           └── forms.spec.ts
└── server/
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    ├── src/
    │   ├── app.ts
    │   ├── index.ts
    │   ├── config/env.ts
    │   ├── routes/
    │   │   ├── contact.routes.ts
    │   │   ├── careers.routes.ts
    │   │   └── health.routes.ts
    │   ├── controllers/
    │   │   ├── contact.controller.ts
    │   │   └── careers.controller.ts
    │   ├── middleware/
    │   │   ├── request-id.ts
    │   │   ├── security.ts
    │   │   ├── rate-limit.ts
    │   │   ├── validate.ts
    │   │   ├── honeypot.ts
    │   │   ├── upload.ts
    │   │   └── error-handler.ts
    │   ├── services/
    │   │   ├── interfaces/
    │   │   │   ├── EmailService.ts
    │   │   │   ├── StorageService.ts
    │   │   │   └── SubmissionStore.ts
    │   │   ├── submission.service.ts
    │   │   ├── job-catalog.service.ts
    │   │   └── notification.service.ts
    │   ├── adapters/
    │   │   ├── email/
    │   │   │   ├── ConsoleEmailService.ts
    │   │   │   └── SmtpEmailService.ts
    │   │   ├── SupabaseStorageService.ts
    │   │   └── submissions/
    │   │       └── PostgresSubmissionStore.ts
    │   ├── generated/job-catalog.json
    │   ├── templates/
    │   │   ├── contact-email.ts
    │   │   └── application-email.ts
    │   └── lib/
    │       ├── logger.ts
    │       ├── file-validation.ts
    │       └── errors.ts
    ├── migrations/
    │   └── 001_submissions.sql
    └── tests/
        ├── contact.test.ts
        ├── applications.test.ts
        ├── upload-security.test.ts
        └── notification-failure.test.ts
```

## 4. Content contracts

Editable content lives in `client/src/content/*.ts`, except Insights in `client/src/content/insights/*.md` (frontmatter plus Markdown body), including CTA labels, form messages, empty states, SEO and legal drafts. Generated files are never editorial sources. Implementation will derive types from Zod with `z.infer`; the following defines the proposed shapes.

```ts
type ServiceSlug =
  | "social-impact" | "tender-advisory" | "it-product-delivery"
  | "language-training" | "skill-development";
type LocalImagePath = `/placeholders/${string}` | `/images/${string}`;
interface SeoContent {
  title: string;
  description: string;
  image?: LocalImagePath;
  noIndex?: boolean;
}
interface ImageAsset { src: LocalImagePath; alt: string }
interface ContentSection { id: string; heading: string; bodyMarkdown: string }
interface Service {
  slug: ServiceSlug;
  title: string;
  summary: string;
  icon: string;
  audience: string[];
  offerings: string[];
  deliverySteps: string[];
  sections: ContentSection[];
  faqIds: string[];
  seo: SeoContent;
}
interface Project {
  slug: string;
  title: string;
  approved: boolean;
  summary: string;
  serviceSlugs: ServiceSlug[];
  industryId: string;
  clientDisplayName?: string;
  image?: ImageAsset;
  sections: ContentSection[];
  outcomes?: string[]; // Verified and approved only
  seo: SeoContent;
}
interface Insight {
  slug: string;
  title: string;
  status: "draft" | "published";
  excerpt: string;
  bodyMarkdown: string;
  authorName?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags: string[];
  image?: ImageAsset;
  seo: SeoContent;
}
interface Job {
  slug: string;
  title: string;
  status: "draft" | "open" | "closed";
  department: string;
  location: string;
  workMode: "onsite" | "hybrid" | "remote";
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  summary: string;
  responsibilities: string[];
  requirements: string[];
  descriptionMarkdown: string;
  publishedAt?: string;
  closesAt?: string;
  seo: SeoContent;
}
interface CompanyConfig {
  name: string;
  email: string;
  phone: string;
  address: string;
  tagline?: string;
  logo?: ImageAsset;
  siteUrl?: string;
  brand: { primary: string; accent: string; background: string; footer: string };
  positioning: string;
}
interface PublicRuntimeConfig { apiUrl: string; tenderSaarUrl?: string }
interface Industry { id: string; name: string; description: string; icon: string }
interface FaqItem { id: string; question: string; answerMarkdown: string }
interface NavItem { label: string; href: string; children?: NavItem[] }
interface TenderSaarContent {
  title: string;
  summary: string;
  features: Array<{ id: string; title: string; description: string }>;
  pricing: {
    status: "unconfirmed" | "published";
    introduction: string;
    plans: Array<{ id: string; name: string; priceLabel: string; features: string[] }>;
  };
  seo: SeoContent;
}
```

Build validation enforces unique lowercase hyphenated slugs, valid references, allowed Lucide icons, local image existence, valid ISO dates, URLs and colors. Published Insights require publication dates; open jobs require complete details. Production SEO requires a real site URL. Unconfirmed pricing has no invented plans.

Only approved projects enter the generated public module. Unapproved projects, draft Insights and draft jobs must be absent from HTML, browser bundles, route data and sitemaps. Runtime components never import raw editorial datasets. Unknown or unpublished slugs return 404.

## 5. API contract

### POST /api/contact

Content-Type: application/json. Reject unknown fields. Client and server validate with shared Zod schemas.

```ts
interface ContactRequest {
  name: string;           // Trimmed; 2–100 characters
  email: string;          // Valid email; maximum 254 characters
  phone?: string;         // Maximum 30 characters
  organization?: string;  // Maximum 200 characters
  service?: ServiceSlug;
  message: string;        // Trimmed; 20–5,000 characters
  privacyConsent: true;
  website: string;        // Honeypot; normally empty
}
```

### POST /api/careers/apply

Content-Type: multipart/form-data; let the browser set the boundary.

| Field | Validation |
| --- | --- |
| jobSlug | Required, currently open job |
| name | Required, trimmed, 2–100 characters |
| email | Required, valid email, maximum 254 characters |
| phone | Optional, maximum 30 characters |
| coverLetter | Optional, maximum 5,000 characters |
| privacyConsent | Exact multipart string `true` |
| website | Honeypot, normally empty |
| resume | Exactly one PDF, maximum 5 MiB |

PDF-only is the initial upload policy. Check extension, MIME and signature server-side; browser MIME alone is insufficient. Limit file count, multipart field count and field sizes. Reject unexpected file fields. Validate job status and closing date using the generated server catalog.

### Response shapes

HTTP 202 means the submission has been persisted and email attempted; email failure does not invalidate acceptance. Honeypots receive the same response without persistence.

```ts
interface SubmissionAccepted {
  ok: true;
  data: { status: "received"; message: string };
  requestId: string;
}
type ApiErrorCode =
  | "INVALID_REQUEST" | "VALIDATION_ERROR" | "ORIGIN_NOT_ALLOWED"
  | "JOB_NOT_AVAILABLE" | "PAYLOAD_TOO_LARGE" | "UNSUPPORTED_MEDIA_TYPE"
  | "INVALID_FILE" | "RATE_LIMITED" | "SERVICE_UNAVAILABLE" | "INTERNAL_ERROR";
interface ApiErrorResponse {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
  requestId: string;
}
```

| Status | Meaning |
| --- | --- |
| 400 | Malformed JSON or multipart request |
| 403 | Disallowed browser origin |
| 409 | Job unavailable or closed |
| 413 | Request or file too large |
| 415 | Unsupported request type or file format |
| 422 | Invalid fields or invalid PDF |
| 429 | Rate limited; include Retry-After |
| 503 | Required persistence unavailable |
| 500 | Unexpected failure; no internal details exposed |

A populated honeypot returns the same generic 202 response but creates no submission, stored file or email. Remove any temporary upload on rejected or discarded requests.

### Service interfaces

```ts
interface EmailService {
  send(message: {
    notificationId: string;
    subject: string;
    text: string;
    replyTo?: string;
  }): Promise<void>;
}
interface StorageService {
  put(file: { bytes: Uint8Array; contentType: "application/pdf" }):
    Promise<{ key: string; size: number }>;
  delete(key: string): Promise<void>;
  createDownloadUrl(key: string, expiresInSeconds: number): Promise<string>;
}
interface SubmissionStore {
  createWithNotification(submission: NewSubmission):
    Promise<{ submissionId: string; notificationId: string }>;
  markNotificationSent(id: string): Promise<void>;
  markNotificationFailed(id: string): Promise<void>;
}
```

`NewSubmission` is a contact/application discriminated union; applications store an opaque resume key. `PendingNotification` contains the notification ID, submission reference, attempt count and retry time. These are conceptual contracts to finalize during implementation.

- Development and production use Supabase Postgres and a private resumes bucket. Development uses console notification summaries. Never log resume contents or signed URLs.
- Backend scope is PostgresSubmissionStore using pg, SupabaseStorageService and SMTP/Console EmailService. No ORM, queue, worker or Dockerfile is included.
- Persist the submission and notification in one transaction. Email is attempted synchronously after commit. Failure leaves a pending notification; a retry worker is deferred.
- Clean up uploads if database persistence fails, and log any failed cleanup for operational review.
- Use generated storage keys, private downloads and expiring links. Never expose uploads through static hosting.
- Notification recipients come from server configuration. User email is a validated reply-to only.
- Use Helmet, env-based CORS, small body limits, honeypots and correctly configured proxy trust.
- Proposed configurable limits: contact 5 requests/15 minutes/IP; applications 3 requests/15 minutes/IP. The current in-memory limits require a single API process; shared limits are required before replication. CORS is not bot protection.

## 6. Route map and components

| Route | Content |
| --- | --- |
| / | Positioning, services, audiences, delivery approach, approved highlights, CTA |
| /about | Organization, values, operating model |
| /services | Five service areas |
| /services/social-impact | Scope, audiences, delivery process |
| /services/tender-advisory | Advisory scope and Tender Saar link |
| /services/it-product-delivery | Managed delivery and technology partners |
| /services/language-training | Scope and delivery formats |
| /services/skill-development | Scope and engagement process |
| /tender-saar | Verified features, FAQ and pricing at #pricing |
| /projects | Approved projects or honest empty state |
| /projects/:slug | Approved project detail |
| /insights | Published articles |
| /insights/:slug | Published Markdown article |
| /careers | Open roles or honest empty state |
| /careers/:slug | Published role; application enabled only while open |
| /contact | Contact details and enquiry form |
| /privacy-policy | Actual data-handling practices |
| /terms | Approved website terms |
| * | Accessible 404, with HTTP 404 |

Previously published closed jobs may retain their URLs with a closed notice and no form. Draft jobs are never public. The pricing anchor is not a separate route.

| Component | Responsibility |
| --- | --- |
| Navbar | Responsive navigation, active state, keyboard support |
| Footer | Contact, navigation and legal links |
| Hero | Page introduction, optional CTA and local art |
| SectionHeading | Consistent heading hierarchy |
| ServiceCard | Service summary and link |
| ProjectCard | Approved project summary |
| InsightCard | Article excerpt and publication information |
| CTASection | Reusable enquiry prompt |
| ContactForm | Validation, submission and feedback states |
| Button | Button/link variants, loading and disabled states |
| Breadcrumb | Accessible hierarchy and matching structured data |
| FAQ | Accessible disclosure controls |
| TenderSaarFeature | Verified product feature |
| IndustryCard | Audience or industry description |

Supporting components: ApplicationForm, FormField, FormStatus, MarkdownContent and EmptyState. SeoHead and StructuredData are non-visual metadata helpers. Motion respects reduced-motion settings; essential content is visible before JavaScript executes.

## 7. SEO plan

1. Validate content and generate public-only records.
2. Generate all concrete static and eligible dynamic routes plus the server job catalog.
3. Prerender pages with route meta exports rendered by React Router's Meta in the root document.
4. Generate sitemap.xml, robots.txt and the custom 404 document.
5. Verify original HTML, canonical URLs, links and excluded content.

- Unique title, description and H1 per page; absolute canonical URLs use the production origin.
- Local Open Graph images and social metadata; omit unprovided imagery rather than inventing branding.
- Sitemap contains public canonical routes only, without hashes, drafts, unapproved projects or 404 pages.
- Organization, BreadcrumbList and Article structured data only with real supported fields. JobPosting only for genuine complete open roles. No placeholder identity in structured data.
- Preview deployments use noindex and access controls where practical.
- Stable trailing-slash policy and redirects for renamed published slugs.
- Serve generated files first; unknown paths return HTTP 404, not a universal HTTP 200 homepage fallback.
- Semantic Markdown, image dimensions, alt text, route splitting and limited animation.
- Check representative pages with JavaScript disabled; content edits trigger rebuilds.

Reference documentation consulted for this proposal:

- [React Router prerendering](https://reactrouter.com/how-to/pre-rendering)
- [vite-react-ssg maintainer guidance](https://github.com/Daydreamer-riri/vite-react-ssg)
- [React Router route modules](https://reactrouter.com/7.18.4/start/framework/route-module)
- [Express Multer](https://expressjs.com/en/resources/middleware/multer/)

## 8. Separate deployment and environment plan

The client goes to a static host/CDN with custom 404 support. Build from the monorepo root and publish only static output. Cache fingerprinted assets long-term and revalidate HTML. Configure static-host security headers separately from Express Helmet.

The server runs as a single Node process with Supabase Postgres and a private Supabase Storage bucket. Disk is used only for temporary upload validation and is cleaned immediately. No durable upload volume, queue, worker or Dockerfile is required.

```dotenv
# Planned client/.env.example
VITE_API_URL=http://localhost:4000
VITE_TENDER_SAAR_URL=
```

```dotenv
# Planned server/.env.example
NODE_ENV=development
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
CONTACT_EMAIL=inquiry@m2kglobal.com
EMAIL_DRIVER=console
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
DATABASE_SCHEMA=m2k
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=resumes
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=
```

All VITE variables are public. Production secrets stay in server hosting configuration. Production startup rejects missing required configuration and placeholder recipient addresses. Set resume retention/deletion and align legal copy with real practices before collecting applications.

CI: type checks, lint, content validation, targeted API tests, prerender build and navigation/form smoke tests. Deploy client and server from the same content revision for job-catalog consistency. Release the compatible API first, then client. Observe failures and support rollback.

## 9. Phase 1–5 breakdown

| Phase | Work | Exit criteria |
| --- | --- | --- |
| 1 — Foundation | Workspace, strict TS, version pinning, schemas, contracts, env validation, prerender foundation | Both builds work; HTML/head extraction verified; unpublished content excluded |
| 2 — Core website | Tokens, shared components, navigation, home, about, services, Tender Saar | Responsive and accessible; correct positioning and honest placeholders |
| 3 — Content pages | Projects, Markdown Insights, careers, detail pages, legal and 404 | Publication gates, dynamic URLs, empty states and metadata verified |
| 4 — Forms/API | Forms, upload checks, adapters, persistence, synchronous email, abuse controls | Submissions persist; invalid uploads rejected; email failures remain pending; closed roles reject applications |
| 5 — Release | Production configuration, SEO, accessibility, deployment, monitoring and handover | Deep links/statuses and delivery verified; approved content and retention configured |

Phases 1–3 are approved and implemented. Phase 3 removes the three reserved placeholder detail URLs; only approved projects and published articles/jobs generate detail routes. Unknown URLs return a real 404. Phase 4 is complete with Supabase Postgres/private Storage; Phase 5 adds production SEO, audits, CI and handover.


## Phase 2 implementation note

The approved design system, shell and nine core pages are implemented. Shared editorial copy is in client/src/content/site.ts; service and Tender Saar schemas include the detail-page fields. Core routes use route meta exports and non-visual JSON-LD helpers. Phase 3 subsequently adds Projects, Insights and Careers collections and detail templates, plus legal drafts and the polished 404 page. Phase 4 adds contact and application forms backed by Supabase; see the Phase 4 verification report. See docs/PHASE-2-VERIFICATION.md and screenshots/README.md for evidence.
