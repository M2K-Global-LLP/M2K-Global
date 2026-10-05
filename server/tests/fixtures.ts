import { pdfFixture } from "../../packages/contracts/tests/pdf-fixture.js";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { createApp } from "../src/app.js";
import { serverEnvSchema } from "../src/config/env.js";
import type { NewSubmission, Services } from "../src/services/interfaces.js";
export const contact = { name: "API Test Person", email: "phase4-test@example.invalid", phone: "+1 555 0100", service: "other", message: "Automated Phase 4 integration test enquiry.", privacyConsent: true as const, website: "" };
export const pdf = pdfFixture;
export const testJobs = [{ slug: "test-open-role", status: "open" as const, closesAt: "2099-12-31" }, { slug: "test-closed-role", status: "closed" as const }, { slug: "test-expired-role", status: "open" as const, closesAt: "2000-01-01" }];
export function multipart(bytes: Uint8Array = pdf, name = "resume.pdf", type = "application/pdf", fields: Record<string, string> = {}) {
  const body = new FormData();
  for (const [key, value] of Object.entries({ jobSlug: "test-open-role", name: contact.name, email: contact.email, privacyConsent: "true", website: "", ...fields })) body.append(key, value);
  body.append("resume", new Blob([new Uint8Array(bytes)], { type }), name); return body;
}
export function fakeServices() {
  const records: NewSubmission[] = []; const files = new Map<string, Uint8Array>(); const sent: string[] = [];
  const services: Services = {
    store: { async createWithNotification(submission) { records.push(submission); return { submissionId: randomUUID(), notificationId: randomUUID() }; }, async markNotificationSent() {}, async markNotificationFailed() {} },
    storage: { async put(file) { const key = randomUUID(); files.set(key, file.bytes); return { key, size: file.bytes.length }; }, async delete(key) { files.delete(key); }, async createDownloadUrl() { return "https://example.invalid/signed-test-url"; } },
    email: { async send(message) { sent.push(message.notificationId); } }, jobs: testJobs,
  };
  return { services, records, files, sent };
}
export async function serve(services: Services) {
  const env = serverEnvSchema.parse({ NODE_ENV: "test", DATABASE_URL: "postgresql://test:test@localhost/test", SUPABASE_URL: "https://example.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "test-key-never-used-000000" });
  const server = createApp(env, services).listen(0, "127.0.0.1"); await once(server, "listening");
  return { origin: "http://127.0.0.1:" + (server.address() as AddressInfo).port, close: async () => { server.closeAllConnections(); await new Promise<void>((done) => server.close(() => done())); } };
}
