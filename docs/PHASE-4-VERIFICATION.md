# Phase 4 verification

Completed 2026-09-30 in D:\M2K GLOBAL. Phase 5 has not started.

## Delivered

- Company and server recipient email changed to inquiry@m2kglobal.com.
- Contact form with shared Zod validation, react-hook-form, service query prefill, consent and visually hidden honeypot.
- Multipart application form for open roles, LinkedIn validation, PDF metadata checks, inline accessible errors and preserved input on failure.
- Pending/success/error status announcements; submit disabled while pending; no raw server error text displayed. Forms use POST even without JavaScript to prevent personal information entering query strings.
- Contact and careers controllers with JSON/multipart validation, silent honeypot acceptance, separate 5/15-minute and 3/15-minute IP limits, Retry-After, generated request IDs and safe centralized errors.
- Multer single-file uploads with a 5 MiB limit, extension/MIME/PDF-byte checks, strict fields and immediate temporary-directory cleanup.
- Supabase Postgres submission and notification tables, a transactional store, and private Supabase resume storage. Generated keys omit original filenames. Database connections use certificate-verified TLS with the bundled public Supabase CA.
- Synchronous post-commit notification attempts, Console and SMTP adapters. Email failure preserves the accepted submission and leaves a pending notification. No queue or worker runs.
- Architecture, environment examples, legal drafts and setup documentation updated to the Supabase decision. Previous storage adapters/settings removed from the active plan and code.

## Verification results

| Check | Result |
| --- | --- |
| npm run lint | Passed |
| npx tsc --noEmit | Passed |
| npm run typecheck | Passed for all workspaces, including server tooling |
| npm run build | Passed: contracts, client and server |
| Content / prerender checks | Passed: 16 current routes with title, description, canonical and H1 in raw HTML |
| npm test | 15 passed; live integration intentionally skipped in this environment-free command |
| npm run test:integration | 1 real Supabase suite passed, separately with server environment loaded |
| npm run test:forms-e2e | 8 passed against the real API and Supabase |
| npm run test:e2e | 68 existing browser regressions passed; 8 live-form tests intentionally gated here and passed separately above |
| Client secret-reference grep | Passed across 31 client artifacts: no SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL or SMTP_ references |
| Publication grep | Passed: 10 draft/unapproved records absent; 41 artifacts scanned |

The live Supabase suite verifies a valid submission, missing/invalid fields, silent honeypot with unchanged row count, oversized upload rejection, renamed text rejected as PDF, closed job rejection, 429 with Retry-After, atomic rollback when the notification insert fails, private storage, denied public download and signed URL expiry within ten minutes. Tests use random private schemas and clean only their own records/objects.

Additional API tests cover MIME/extension mismatch, extra fields/files, expired/unknown jobs, all eight multipart text fields, temporary-file cleanup, independent application rate limits, 202 despite email failure, stored-resume deletion after DB failure, and sanitized error responses. Malformed LinkedIn URLs return validation failures instead of throwing.

Live browser tests prove successful contact submission without reload, service prefill, a disabled pending button, invalid email shown inline without submission, a complete PDF application accepted, fake-signature PDF rejected with entered data retained, and overflow/accessibility checks at 375/768/1024/1440. The temporary public job was restored to its original draft source and the full production build regenerated.

## Confirmed Supabase state

- resumes bucket: private.
- No storage object SELECT/ALL policies permit alternative browser reads.
- Public resume URL denied; server-generated ten-minute signed URL retrieved the expected PDF.
- submissions and notifications: row-level security enabled.
- anon and authenticated roles: no submission SELECT privilege.
- Remaining temporary test schemas: 0.
- Remaining test resume prefixes: 0.
- Original example job: draft; generated open-job catalog: empty.

## Evidence and boundaries

[Live form results](../screenshots/phase4-playwright-results.json), [regression results](../screenshots/playwright-results.json), [screenshots](../screenshots/README.md), [API and setup guide](phase4-api.md), [public CA provenance](../server/certs/README.md).

EMAIL_DRIVER is currently console. Real SMTP delivery was not exercised because SMTP credentials are not configured; the adapter is implemented and production configuration requires SMTP. Console tests do not send messages to real recipients. No retry worker, queue, Dockerfile or deployment was added. Legal templates still require review before launch. Current rate limits assume one API process. Test-only application screenshots do not advertise a real vacancy.

Build output includes non-failing upstream Zod PURE-comment annotation warnings; runtime, typing and validation checks pass.

Stop here and await Phase 5 approval.
