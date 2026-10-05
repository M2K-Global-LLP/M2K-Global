import type { Pool } from "pg";
import { randomUUID } from "node:crypto";
import type { NewSubmission, SubmissionStore } from "../services/interfaces.js";
export function safeSchema(schema: string) {
  if (!/^[a-z][a-z0-9_]{0,62}$/.test(schema)) throw new Error("Invalid database schema identifier");
  return '"' + schema + '"';
}
export class PostgresSubmissionStore implements SubmissionStore {
  private readonly schema: string;
  constructor(private readonly pool: Pool, schema = "m2k") { this.schema = safeSchema(schema); }
  async createWithNotification(submission: NewSubmission) {
    const connection = await this.pool.connect();
    const submissionId = randomUUID(); const notificationId = randomUUID();
    const { website: _honeypot, ...payload } = submission.payload; void _honeypot;
    try {
      await connection.query("BEGIN");
      await connection.query(`INSERT INTO ${this.schema}.submissions (id, kind, payload, resume_key, request_id) VALUES ($1,$2,$3,$4,$5)`, [submissionId, submission.kind, JSON.stringify(payload), submission.kind === "application" ? submission.resumeKey : null, submission.requestId]);
      await connection.query(`INSERT INTO ${this.schema}.notifications (id, submission_id) VALUES ($1,$2)`, [notificationId, submissionId]);
      await connection.query("COMMIT"); return { submissionId, notificationId };
    } catch (error) { await connection.query("ROLLBACK").catch(() => undefined); throw error; }
    finally { connection.release(); }
  }
  async markNotificationSent(id: string) { await this.pool.query(`UPDATE ${this.schema}.notifications SET status='sent', attempts=attempts+1, sent_at=now(), updated_at=now() WHERE id=$1`, [id]); }
  async markNotificationFailed(id: string) { await this.pool.query(`UPDATE ${this.schema}.notifications SET status='pending', attempts=attempts+1, updated_at=now() WHERE id=$1`, [id]); }
}
