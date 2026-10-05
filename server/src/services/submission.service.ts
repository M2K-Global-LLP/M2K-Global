import { HttpError } from "../lib/errors.js";
import type { NewSubmission, Services } from "./interfaces.js";
export async function persistAndNotify(services: Services, submission: NewSubmission) {
  const result = await services.store.createWithNotification(submission).catch((error: unknown) => { console.error("Submission persistence failed", { requestId: submission.requestId, error }); throw new HttpError(503, "SERVICE_UNAVAILABLE", "Submissions are temporarily unavailable. Please try again later."); });
  // The transaction has committed. Notification failure must never turn this
  // accepted submission into a client retry (and duplicate submission).
  try {
    const download = submission.kind === "application" ? await services.storage.createDownloadUrl(submission.resumeKey, 600) : undefined;
    const { website: _honeypot, ...payload } = submission.payload; void _honeypot;
    await services.email.send({ notificationId: result.notificationId, subject: submission.kind === "contact" ? "New M2K Global enquiry" : "New M2K Global application", text: JSON.stringify(payload, null, 2) + (download ? "\nResume (expires in ten minutes): " + download : ""), replyTo: payload.email });
    await services.store.markNotificationSent(result.notificationId);
  } catch (error) {
    console.error("Notification failed after persistence", { requestId: submission.requestId, notificationId: result.notificationId, error });
    await services.store.markNotificationFailed(result.notificationId).catch((error: unknown) => console.error("Notification status update failed", { requestId: submission.requestId, error }));
    // TODO: retry worker with idempotent delivery and fresh signed URLs, in a later phase.
  }
  return result;
}
