# M2K Global — deployment and operations

The canonical domain is **https://www.m2kglobal.com**. This document prepares deployment; no production deployment or DNS change has been performed. Legal pages deliberately retain **DRAFT — review before launch** until counsel approves replacement text.

## 1. Prepare the release

1. Use Node 24 and npm 11. Commit the single package-lock.json, source, migrations, server/certs and generated-build scripts. Never commit .env files or credentials. This working folder currently needs a Git repository and remote configured before GitHub Actions can run.
2. Supply the final logo, review all text, approve legal terms, verify SMTP delivery, and choose the Node API HTTPS origin. Keep project examples unapproved and article/job examples draft until separately approved. Confirm the Tender Saar app URL and commercial pricing before replacing its labelled fallback/sample content.
3. Run the full README verification sequence. Retain the report and immutable build artifacts for rollback. Run fixture suites serially: they temporarily edit content and restore it in finally blocks; never deploy while a fixture suite is running.
4. Use distinct staging and production Supabase projects where possible. Tests create and delete a uniquely named schema and temporary resume objects; give live CI only an isolated test project's credentials.

## 2. Provision Supabase

1. Create the production project in the agreed region. Record the Postgres Connect URL and API URL. URL-encode special characters in the database password. The API service-role key is a different credential from the database password.
2. Store DATABASE_URL and SUPABASE_SERVICE_ROLE_KEY only in the Node host's secret manager. Set DATABASE_SCHEMA=m2k, SUPABASE_STORAGE_BUCKET=resumes and the project's SUPABASE_URL. Keep m2k out of the Data API's exposed schemas.
3. From the complete workspace with server environment variables loaded, run:

   ```sh
   npm ci
   npm run build -w @m2k/contracts
   npm run migrate -w @m2k/server
   npm run setup:storage -w @m2k/server
   npm run check:readiness -w @m2k/server
   ```

4. Migration 001_submissions.sql enables RLS on both submissions and notifications, revokes PUBLIC privileges and intentionally adds **no browser access policies**. The trusted database connection performs transactions; browser clients must use the Express API. Verify no anon/authenticated grants have subsequently been introduced. Avoid broad permissive policies on either table.
5. The resumes bucket must remain private, with application/pdf and 5 MiB limits. Do not add anonymous/authenticated SELECT policies for resume objects. The service key is used only server-side; random object keys are not a substitute for privacy. The readiness command refuses to certify a project with Storage SELECT/ALL policies until those policies are reviewed (including policies for unrelated buckets).
6. Run npm run test:integration against the isolated test project. It proves unsigned downloads fail and server-generated signed URLs work. Signed URLs expire after at most 600 seconds; treat them as bearer links and do not log or publish them. The application has no public endpoint issuing download URLs.
7. Configure backup/PITR appropriate to the project plan and separately verify Storage object backup/restore. Obtain an approved retention/deletion policy for resumes and enquiries before launch. No retention automation is currently implemented.

Reference: [Supabase private buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals) and [server-side Storage access control](https://supabase.com/docs/guides/storage/security/access-control).

## 3. Deploy the Node API separately

1. Choose a Node 24 host supporting a long-running process, outbound Postgres/HTTPS/SMTP, and temporary writable disk. Upload/build from the monorepo root, not server alone, because it depends on packages/contracts and the generated job catalog.
2. Build command: `npm ci && npm run build`. Start command from root: `npm run start -w @m2k/server`. Preserve packages/contracts/dist, server/dist, server/certs/supabase-root.crt and production node_modules. Migrations/setup commands require the source scripts and tsx, so run them in a release stage before pruning development dependencies.
3. Set NODE_ENV=production, PORT from the host, CLIENT_ORIGIN=https://www.m2kglobal.com, CONTACT_EMAIL=inquiry@m2kglobal.com, and all database/storage variables. Configure SMTP as below. The process refuses production Console email and checks database connectivity/bucket privacy before listening.
4. Set TRUST_PROXY_HOPS to the host's documented exact trusted proxy count; never guess or use unrestricted trust. Verify the host overwrites forwarded headers and cannot bypass its trusted ingress. Rate limits are in memory, so deploy **one API instance** initially. Multiple instances/restarts weaken the aggregate 5-contact/3-application per 15-minute-IP limits; shared limiting is a future change.
5. Ensure the edge accepts 5 MiB PDFs plus multipart overhead (for example an 8 MiB request cap). Allow POST/OPTIONS, set a timeout long enough for storage/database/SMTP (at least 90 seconds initially), and terminate HTTPS. Do not cache API responses. CORS permits only the exact client origin.
6. Keep the bundled CA file; database TLS verifies certificates and does not accept insecure URL SSL overrides. Include its expiry review in maintenance (see server/certs/README.md).
7. Configure the host's health check to GET /health. This is process liveness, not a database/SMTP readiness assertion. Run the private readiness command during release and operations. Store request IDs with errors; never add request bodies, resume bytes, credentials or signed links to logs.

## 4. Configure SMTP

Set EMAIL_DRIVER=smtp, SMTP_HOST, SMTP_PORT (587 STARTTLS or 465 implicit TLS), SMTP_USER, SMTP_PASSWORD and EMAIL_FROM to a verified sender address. CONTACT_EMAIL=inquiry@m2kglobal.com is the recipient. Use the provider's domain verification instructions to configure SPF/DKIM and the owner's chosen DMARC policy. Restrict the credential to email sending and store it as a server secret.

Submit one owner-authorized test enquiry on staging, confirm inbox delivery and reply-to behavior, and record the request ID. A 202 response proves safe persistence, **not successful email delivery**. Email is attempted synchronously after the transaction. On failure the API still returns 202, logs the error, and leaves a pending notification. No retry worker or queue exists. An operator must review pending notifications and follow up manually; avoid duplicate sends. SMTP credentials/delivery remain a launch prerequisite.

## 5. Deploy the static client

1. Create a separate static-host project with monorepo root as working directory, Node 24, build command `npm ci && npm run build`, and **only** `client/dist/client` as the publish directory. Never publish the repository, server, source content, .env or source-generated JSON.
2. Configure client build variables:

   | Variable | Production value |
   | --- | --- |
   | SITE_URL | https://www.m2kglobal.com |
   | SITE_INDEXABLE | true only for approved public launch; false for preview/staging |
   | VITE_API_URL | TBD: the actual HTTPS Node API origin, with no trailing /api |
   | VITE_TENDER_SAAR_URL | Actual app HTTPS URL, or empty for labelled contact fallback |

   VITE_ variables are public and compiled into bundles. Never set database, SMTP or service-role secrets in the static project. Rebuild after changing any client variable. A local ignored .env.production is configured for the confirmed canonical origin; host environment configuration is the deployable source of truth. A clean checkout defaults to a non-indexable example.invalid preview unless env is supplied.
3. Map www.m2kglobal.com to the static host, issue TLS, and redirect the apex m2kglobal.com and HTTP to the canonical HTTPS www origin using permanent redirects. Wait for certificate readiness before enabling redirects. Set previews to SITE_INDEXABLE=false explicitly.
4. Serve each prerendered `route/index.html` on its extensionless path. Serve `404.html` **with status 404** for unknown paths. Do not apply a universal `/* /index.html 200` rule and do not serve __spa-fallback.html for unknown slugs. If the provider defaults to SPA fallback, turn it off.
5. A host with Nginx-equivalent control can use this route policy (adapt document root):

   ```nginx
   root /srv/m2k/client;
   index index.html;
   location / { try_files $uri $uri/index.html =404; }
   location = /404 { return 404; }
   location = /__spa-fallback.html { return 404; }
   error_page 404 /404.html;
   location = /404.html { internal; }
   location /assets/ { try_files $uri =404; expires 1y; add_header Cache-Control "public, immutable"; }
   ```

   Enable Brotli/gzip for HTML/CSS/JS/SVG/JSON and short/no-cache HTML so new asset references propagate. Cache hashed assets for a year; keep previous release assets available during rollback/rolling deployment. Serve images with correct MIME types. Add nosniff, strict-origin-when-cross-origin referrer policy, and HTTPS-only HSTS after all required subdomains support TLS. Do not invent a strict CSP that blocks React Router's inline hydration scripts; design hashes/nonces and test it separately.
6. Check Home, every sitemap path and at least /projects/unknown, /insights/unknown and /careers/unknown using curl/status inspection. Validate canonical/OG URLs, local OG image fetch, robots Allow/Sitemap and production sitemap's exact domain. Inspect page source with JavaScript disabled. Use React Router's [prerendering guide](https://reactrouter.com/how-to/pre-rendering) for host integration, preserving this project's stricter real-404 requirement.
7. After public release, verify domain ownership with the selected search console and submit https://www.m2kglobal.com/sitemap.xml. No analytics/cookie tracking script is installed; do not describe one in the legal policy until actually introduced.

## 6. Monitoring and release smoke checks

Configure these in the hosting/monitoring provider when accounts are selected; no external monitor has been provisioned:

- Every minute: client Home must return 200 and expected company heading; API /health must return 200. Alert the nominated operator after two consecutive failures.
- Each release and daily: run the authenticated, server-side `npm run check:readiness -w @m2k/server`; alert on database/bucket/RLS failure. It reports counts only, including pendingNotifications. Investigate pending counts greater than zero; no automatic retry is present.
- Observe API 5xx rates, upload failures, sustained 429s, latency, Postgres connections/storage capacity and SMTP failures. Correlate requestId; exclude PII from dashboards.
- Verify TLS certificate expiry and domain renewal, database/Storage backups, and test restoration periodically. Assign an owner and agreed retention period for logs, submissions and resumes.
- Test a real owner-authorized enquiry after deployment, verify persistence and inbox delivery; use a temporary job only in staging for application checks. Remove test records/objects through approved test cleanup, not broad deletes.

## 7. Rollback

1. Keep the previous immutable client and server release plus its env-variable names/version identifiers. Never put secret values in release reports.
2. If the client fails, switch the static host to the previous artifact and invalidate HTML caches. Preserve hashed assets until cached HTML ages out. Restore the matching public job catalog/API version if job publication changed.
3. If the API fails, route traffic to the previous compatible Node release and restart with the same private database/storage settings. Verify /health and run check:readiness. Keep submitted data and resumes intact.
4. The current migration is additive. Do not drop submissions/notifications or restore an old database snapshot merely to roll back code; this would lose accepted requests. Future incompatible schema changes require a reviewed forward/backward migration and backup plan.
5. Keep SITE_INDEXABLE=false for an unapproved replacement release, or take the release offline if necessary. Record the incident/request IDs, verify stored-but-unnotified enquiries, and notify the operations owner through the agreed channel.
