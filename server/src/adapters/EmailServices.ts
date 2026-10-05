import nodemailer from "nodemailer";
import type { ServerEnv } from "../config/env.js";
import type { EmailMessage, EmailService } from "../services/interfaces.js";
export class ConsoleEmailService implements EmailService {
  async send(message: EmailMessage) {
    // Never log the resume, signed URL, message body or applicant personal data.
    console.info("Development notification", { notificationId: message.notificationId, subject: message.subject });
  }
}
export class SmtpEmailService implements EmailService {
  private readonly transport;
  constructor(private readonly env: ServerEnv) {
    this.transport = nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_PORT === 465, requireTLS: env.SMTP_PORT !== 465, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000, ...(env.SMTP_USER ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } } : {}) });
  }
  async send(message: EmailMessage) {
    await this.transport.sendMail({ from: this.env.EMAIL_FROM, to: this.env.CONTACT_EMAIL, replyTo: message.replyTo, subject: message.subject, text: message.text, messageId: `<${message.notificationId}@notifications.m2kglobal.com>` });
  }
}
