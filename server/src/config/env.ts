import { z } from "zod";
export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  CLIENT_ORIGIN: z.url().refine((value) => { try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && url.origin === value; } catch { return false; } }).default("http://localhost:5173"),
  CONTACT_EMAIL: z.email().default("inquiry@m2kglobal.com"),
  DATABASE_URL: z.string().url().refine((value) => { try { return ["postgres:", "postgresql:"].includes(new URL(value).protocol); } catch { return false; } }),
  DATABASE_SCHEMA: z.string().regex(/^[a-z][a-z0-9_]{0,62}$/).default("m2k"),
  SUPABASE_URL: z.url().refine((value) => { try { return new URL(value).protocol === "https:"; } catch { return false; } }),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  SUPABASE_STORAGE_BUCKET: z.literal("resumes").default("resumes"),
  EMAIL_DRIVER: z.enum(["console", "smtp"]).default("console"),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
  SMTP_HOST: z.string().optional(), SMTP_PORT: z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().int().min(1).max(65535).optional()),
  SMTP_USER: z.string().optional(), SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.preprocess((value) => value === "" ? undefined : value, z.email().optional()),
}).superRefine((value, ctx) => {
  if (value.NODE_ENV === "production" && value.EMAIL_DRIVER !== "smtp") ctx.addIssue({ code: "custom", path: ["EMAIL_DRIVER"], message: "Production requires SMTP." });
  if (value.EMAIL_DRIVER === "smtp" && (!value.SMTP_HOST || !value.SMTP_PORT || !value.EMAIL_FROM)) ctx.addIssue({ code: "custom", message: "SMTP requires host, port and sender." });
  if (!!value.SMTP_USER !== !!value.SMTP_PASSWORD) ctx.addIssue({ code: "custom", message: "SMTP username and password must be provided together." });
});
export type ServerEnv = z.infer<typeof serverEnvSchema>;
