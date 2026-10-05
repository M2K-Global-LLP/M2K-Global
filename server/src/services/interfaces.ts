import type { ApplicationRequest, ContactRequest } from "@m2k/contracts";
export type NewSubmission = { requestId: string } & (
  | { kind: "contact"; payload: ContactRequest }
  | { kind: "application"; payload: ApplicationRequest; resumeKey: string }
);
export interface PendingNotification { id: string; submissionId: string; attempts: number; retryAt: string | null }
export interface SubmissionStore {
  createWithNotification(submission: NewSubmission): Promise<{ submissionId: string; notificationId: string }>;
  markNotificationSent(id: string): Promise<void>;
  markNotificationFailed(id: string): Promise<void>;
}
export interface StorageService {
  put(file: { bytes: Uint8Array; contentType: "application/pdf" }): Promise<{ key: string; size: number }>;
  delete(key: string): Promise<void>;
  createDownloadUrl(key: string, expiresInSeconds: number): Promise<string>;
}
export interface EmailMessage { notificationId: string; subject: string; text: string; replyTo?: string }
export interface EmailService { send(message: EmailMessage): Promise<void> }
export interface JobCatalogEntry { slug: string; status: "open" | "closed"; closesAt?: string }
export interface Services { store: SubmissionStore; storage: StorageService; email: EmailService; jobs: JobCatalogEntry[] }
