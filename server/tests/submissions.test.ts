import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { contact, fakeServices, multipart, pdf, serve } from "./fixtures.js";
const post = (origin: string, body: unknown) => fetch(origin + "/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
test("contact validation, silent honeypot and independent rate limiting", async () => {
  const fake = fakeServices(); const server = await serve(fake.services);
  try {
    assert.equal((await post(server.origin, contact)).status, 202);
    assert.equal((await post(server.origin, { ...contact, email: "invalid" })).status, 422);
    assert.equal((await post(server.origin, { website: "bot" })).status, 202);
    assert.equal(fake.records.length, 1); assert.equal(fake.sent.length, 1);
    assert.equal((await post(server.origin, { ...contact, privacyConsent: false })).status, 422);
    assert.equal((await post(server.origin, { ...contact, unexpected: true })).status, 422);
    const limited = await post(server.origin, contact); assert.equal(limited.status, 429); assert.ok(Number(limited.headers.get("retry-after")) > 0);
    assert.equal((await fetch(server.origin + "/api/careers/apply", { method: "POST", body: multipart() })).status, 202);
  } finally { await server.close(); }
});
test("upload validation rejects fake PDFs, oversized uploads, extra fields/files and unavailable roles; temp files removed", async () => {
  const before = (await readdir(tmpdir())).filter((name) => name.startsWith("m2k-resume-"));
  const cases: [FormData, number][] = [
    [multipart(), 202], [multipart(pdf, "resume.pdf", "application/pdf", { phone: "", linkedInUrl: "", coverLetter: "" }), 202], [multipart(Buffer.from("plain text renamed pdf")), 422],
    [multipart(pdf, "resume.txt"), 422], [multipart(pdf, "resume.pdf", "text/plain"), 422],
    [multipart(new Uint8Array(5 * 1024 * 1024 + 1)), 413],
    [multipart(pdf, "resume.pdf", "application/pdf", { extra: "not allowed" }), 422],
    ...["test-closed-role", "test-expired-role", "unknown-role"].map((jobSlug): [FormData, number] => [multipart(pdf, "resume.pdf", "application/pdf", { jobSlug }), 409]),
    [multipart(pdf, "resume.pdf", "application/pdf", { website: "bot", jobSlug: "unknown" }), 202],
  ];
  const extraFile = multipart(); extraFile.append("extra", new Blob([pdf]), "other.pdf"); cases.push([extraFile, 400]);
  for (const [body, expected] of cases) {
    const fake = fakeServices(); const server = await serve(fake.services);
    try { const response = await fetch(server.origin + "/api/careers/apply", { method: "POST", body }); assert.equal(response.status, expected, await response.text()); }
    finally { await server.close(); }
  }
  const after = (await readdir(tmpdir())).filter((name) => name.startsWith("m2k-resume-")); assert.deepEqual(after.sort(), before.sort());
});
test("application limiter is 3 per 15 minutes with Retry-After", async () => {
  const fake = fakeServices(); const server = await serve(fake.services);
  try { for (let i = 0; i < 3; i++) assert.equal((await fetch(server.origin + "/api/careers/apply", { method: "POST", body: multipart() })).status, 202); const result = await fetch(server.origin + "/api/careers/apply", { method: "POST", body: multipart() }); assert.equal(result.status, 429); assert.ok(Number(result.headers.get("retry-after")) > 0); }
  finally { await server.close(); }
});
test("email failure returns 202 after persistence, DB failure cleans uploaded resume and hides internal details", async () => {
  const fake = fakeServices(); fake.services.email.send = async () => { throw new Error("PRIVATE_SMTP_TEST_FAILURE"); };
  const server = await serve(fake.services);
  try {
    assert.equal((await post(server.origin, contact)).status, 202); assert.equal(fake.records.length, 1);
    fake.services.store.createWithNotification = async () => { throw new Error("PRIVATE_DATABASE_TEST_FAILURE"); };
    const response = await fetch(server.origin + "/api/careers/apply", { method: "POST", body: multipart() });
    assert.equal(response.status, 503); assert.ok(!(await response.text()).includes("PRIVATE_DATABASE_TEST_FAILURE")); assert.equal(fake.files.size, 0);
  } finally { await server.close(); }
});
