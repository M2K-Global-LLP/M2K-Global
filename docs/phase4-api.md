# Phase 4 forms and API

The contact recipient is **inquiry@m2kglobal.com**. No worker, queue or Dockerfile is included.

## Local setup

1. Install with `npm ci` from the root.
2. Configure `server/.env` from `server/.env.example`. Use the Supabase Connect panel's Postgres URL. Replace password template brackets completely and URL-encode special characters. Never use an API key as the database password.
3. Configure `SUPABASE_URL`, the server-only `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET=resumes`. Never put them in client files or VITE variables.
4. Run `npm run migrate -w @m2k/server`, then `npm run setup:storage -w @m2k/server`. Remote database connections enforce certificate-verified TLS using the bundled public Supabase CA; include server/certs when deploying. URL SSL options cannot disable verification. The migration creates the private `m2k` schema, submission and notification tables, and enables RLS without browser access policies. It is repeatable.
5. Run `npm run build`, `npm run dev:server`, and `npm run dev` in separate terminals. Match `CLIENT_ORIGIN` to the client origin exactly. For static preview, use `http://127.0.0.1:4173`.

Development uses `EMAIL_DRIVER=console`: notification identifiers and subjects are logged, without message bodies, resume contents or signed URLs. Production requires `EMAIL_DRIVER=smtp`, SMTP host/port and EMAIL_FROM; supply paired SMTP_USER/SMTP_PASSWORD when the provider requires authentication. Port 465 uses TLS; other ports require STARTTLS. Live SMTP delivery is separate from ConsoleEmailService testing.

## Endpoints

`POST /api/contact`, JSON:

```json
{
  "name": "Your name",
  "email": "person@example.org",
  "phone": "",
  "organization": "",
  "service": "other",
  "message": "A message containing at least twenty characters.",
  "privacyConsent": true,
  "website": ""
}
```

Service identifiers: `social-impact`, `tender-advisory`, `tender-saar`, `language-training`, `skill-development`, `other`. Service remains optional in the contract for compatibility; the UI always selects one. Phone and organization are optional. The UI maps an existing IT service CTA to Other.

`POST /api/careers/apply`, multipart:

- Text: jobSlug, name, email, optional phone, optional linkedInUrl (HTTPS LinkedIn), optional coverLetter, privacyConsent (literal string `true`), website.
- Exactly one `resume` file: `.pdf` extension, `application/pdf` MIME, non-empty, at most 5 MiB, and PDF magic bytes. Client checks metadata before sending; server checks actual bytes.
- The generated catalog must contain an open job whose closing date has not passed. Dates close at the end of the stated UTC date. Rebuild the site/catalog when jobs change.

Both endpoints return HTTP 202:

```json
{"ok":true,"data":{"status":"received","message":"Your submission has been received."},"requestId":"generated-id"}
```

The same response is returned for a filled honeypot without persistence, storage or notification. Resource limits still apply before honeypot evaluation. Normal acceptance means the submission and notification record were committed, followed by a synchronous email attempt. Email failure is logged with requestId, leaves the notification pending, and does not turn a persisted submission into a failed response. A future retry worker must generate fresh signed URLs; none runs now.

Errors have this shape; no internal error text or stack is sent:

```json
{"ok":false,"error":{"code":"VALIDATION_ERROR","message":"Please check the highlighted fields.","fieldErrors":{"email":["Please check this field."]}},"requestId":"generated-id"}
```

| HTTP | Code | Meaning |
| --- | --- | --- |
| 400 | INVALID_REQUEST | Malformed JSON/multipart or multipart limits other than file size |
| 403 | ORIGIN_NOT_ALLOWED | Disallowed browser origin |
| 404 | NOT_FOUND | Unknown API endpoint |
| 409 | JOB_NOT_AVAILABLE | Unknown, closed or expired job |
| 413 | PAYLOAD_TOO_LARGE | Oversized body or resume |
| 415 | UNSUPPORTED_MEDIA_TYPE | Wrong endpoint request content type |
| 422 | VALIDATION_ERROR / INVALID_FILE | Invalid fields or invalid/missing PDF |
| 429 | RATE_LIMITED | Includes Retry-After; contact 5 and application 3 requests per 15 minutes/IP |
| 503 | SERVICE_UNAVAILABLE | Persistence or resume storage unavailable |
| 500 | INTERNAL_ERROR | Unexpected server failure |

## Storage and operations

Resume keys contain two generated UUIDs and never contain user filenames. The adapter checks that the bucket is private before upload or signing. Signed download links are generated server-side for the internal notification, expire after ten minutes, and are not returned to applicants. Public URLs do not grant access. Service-role credentials can administer the bucket and must remain secret.

Multer uses a new OS temporary directory per upload. Bytes are read only after the 5 MiB limit succeeds; the directory is removed before the controller proceeds, or on parser failure. If database persistence fails after upload, the stored resume is deleted. Cleanup failures are logged for operational follow-up.

The current API uses one process and in-memory rate limiting. Configure TRUST_PROXY_HOPS only to the exact trusted proxy topology. Shared limits are required before replication. Set retention, deletion, backup and staff access procedures before public launch; no automatic retention or retry job is claimed. Legal pages remain drafts requiring review.

## Verification

- `npm test`: isolated unit/API regression cases; live integration is skipped unless database environment variables are supplied.
- `npm run test:integration`: real Supabase/Postgres tests using a random private test schema; verifies atomic rollback, validation, honeypot, limits, private storage and signed URL expiry, then deletes only its test objects/schema.
- `npm run test:forms-e2e`: temporarily opens the draft example job, builds, starts the real API with a random test schema and console email, runs Playwright forms tests, cleans its test records/resumes, restores the exact draft source, and rebuilds. Do not interrupt this script.
- `npm run verify:secrets -w @m2k/client`: scans production HTML, JS, JSON and related artifacts for server-only environment references. It also runs during every client build.

The public build must finish with the example job draft and no open vacancies until a real role is approved.
