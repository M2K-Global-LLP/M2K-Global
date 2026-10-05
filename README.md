# M2K Global

React Router v7 prerendered TypeScript website and Express API, with shared Zod contracts. Phase 5 prepares production deployment; it does not deploy the site. The confirmed canonical URL is **https://www.m2kglobal.com**, and enquiries go to **inquiry@m2kglobal.com**.

## Local setup

Use Node 24 and npm 11 from the monorepo root:

```sh
npm ci
```

Copy client/.env.example to client/.env and server/.env.example to server/.env. Fill server credentials privately; never commit them. Keep SITE_INDEXABLE=false locally and on previews. Configure SITE_URL=https://www.m2kglobal.com for canonical verification. Production host variables override the files.

```sh
npm run build -w @m2k/contracts
npm run migrate -w @m2k/server
npm run setup:storage -w @m2k/server
npm run build
npm run dev
```

Run `npm run dev:server` in another terminal. Client is on localhost:5173, API on localhost:4000. `npm run preview` serves built HTML at http://127.0.0.1:4173 with real 404 responses.

## Environment reference

All examples are configuration guidance, not credentials. See each app's .env.example.

| Scope | Variables | Purpose |
| --- | --- | --- |
| Client build | SITE_URL, SITE_INDEXABLE | Canonical origin; explicit indexing switch. Production origin is https://www.m2kglobal.com. |
| Public client | VITE_API_URL | API origin; localhost:4000 for dev, actual HTTPS API host for launch. |
| Public client | VITE_TENDER_SAAR_URL | Confirmed app URL or empty for contact fallback. |
| Server | NODE_ENV, PORT, CLIENT_ORIGIN, TRUST_PROXY_HOPS | Runtime and exact trusted origin/proxy configuration. |
| Server | CONTACT_EMAIL | inquiry@m2kglobal.com |
| Server secrets | DATABASE_URL | Supabase Postgres connection URL with encoded password; verified TLS. |
| Server | DATABASE_SCHEMA | m2k by default; never expose schema via browser Data API. |
| Server | SUPABASE_URL, SUPABASE_STORAGE_BUCKET | Project URL; private resumes bucket. |
| Server secret | SUPABASE_SERVICE_ROLE_KEY | Server-only privileged Storage credential. |
| Server | EMAIL_DRIVER | console in dev; smtp required in production. |
| Server | SMTP_HOST, SMTP_PORT, EMAIL_FROM | SMTP endpoint and verified sender. |
| Server secrets | SMTP_USER, SMTP_PASSWORD | Paired SMTP authentication values. |

The API persists submissions and notification records atomically in Postgres, stores PDFs privately and attempts email after persistence. 202 means accepted/stored, not guaranteed inbox delivery. No worker, queue, Dockerfile, analytics or cookie tracking has been added. Resume links are generated server-side and expire within ten minutes.

## Verification by phase

Install Chromium with `npx playwright install chromium` (Linux CI: add --with-deps). Run suites serially; fixture commands temporarily publish examples and automatically restore source plus public build. Never deploy a fixture build.

```sh
npm run lint
npm run typecheck
npx tsc --noEmit
npm run validate-content
npm run build
npm run verify-prerender
npm test
npm run test:publication
npm run test:e2e
npm run test:publication-fixture
npm run test:integration
npm run test:forms-e2e
npm run test:readiness
npm run check:readiness -w @m2k/server
```

- Phase 1: lint/typecheck/content/build/verify-prerender and unit tests.
- Phase 2: `npm run test:e2e -w @m2k/client -- tests/e2e/phase2.spec.ts` (core pages, menus, links, responsiveness).
- Phase 3: corresponding phase3.spec.ts plus test:publication-fixture (approved project/published article routes, filtering, real 404s and restoration).
- Phase 4: test:integration uses a real Supabase project and disposable schema. test:forms-e2e starts the real API, temporarily opens a draft role, tests contact/application flows and cleans up. The regular E2E run skips these eight live cases unless launched by that runner. No SMTP email is sent by these fixtures.
- Phase 5: test:readiness temporarily publishes one project/article/job, builds, audits every route at 375/1024/1440 with axe, tests every page without JavaScript and measures four mobile Lighthouse pages. Reports go to reports/; original private content and the final build are restored.

GitHub Actions runs environment-free regression on each PR. Optional protected manual live tests require an isolated Supabase test project; credentials are never made available to fork PRs. See .github/workflows/ci.yml.

## Editing and publishing

All editorial content lives in client/src/content. Set a reviewed project's approved flag to true only with owner/client permission; outcomes require outcomesApproved as well. Edit an Insights Markdown file with valid frontmatter, real publication date and status: published after replacing the draft stub. For a real vacancy, replace the draft example, set status to open and provide approved role details, publishedAt and closing date. A previously published closed role stays available with its closed notice. Complete roles alone emit JobPosting JSON-LD. Run content validation, build and regression after changes; deploy client and server job catalog together.

The public site has no fabricated clients, outcomes, testimonials, certifications or vacancies. All three project examples, six article stubs and one job remain private. Tender Saar has labelled SAMPLE DATA and unconfirmed pricing; its app URL remains TBD. Legal templates visibly remain DRAFT and must be reviewed before launch. The provisional geometric brand mark is awaiting the final logo.

[Content guide](docs/content-guide.md) · [Deployment, monitoring and rollback](docs/deployment.md) · [Phase 5 verification](docs/PHASE-5-VERIFICATION.md) · [API setup](docs/phase4-api.md) · [Architecture](PHASE-0-ARCHITECTURE.md)
