import { z } from "zod";
const httpUrl = z.url().refine((value) => URL.canParse(value) && ["http:", "https:"].includes(new URL(value).protocol), "Expected an HTTP(S) URL");
export const clientEnvSchema = z.object({
  VITE_API_URL: httpUrl.default("http://localhost:4000"),
  VITE_TENDER_SAAR_URL: z.preprocess((value) => value === "" ? undefined : value, httpUrl.optional()),
});
export const buildEnvSchema = z.object({
  SITE_URL: httpUrl.default("https://example.invalid").transform((value) => new URL(value).origin),
  SITE_INDEXABLE: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
}).superRefine((value, ctx) => {
  if (!URL.canParse(value.SITE_URL)) return;
  const host = new URL(value.SITE_URL).hostname;
  if (value.SITE_INDEXABLE && (new URL(value.SITE_URL).protocol !== "https:" || host.endsWith(".invalid") || host === "localhost" || host.endsWith(".localhost") || /^\d+\./.test(host) || host.startsWith("["))) {
    ctx.addIssue({ code: "custom", message: "Indexable builds require a real public SITE_URL." });
  }
});

const productionOrigin = "https://www.m2kglobal.com";

/**
 * Vercel does not receive the ignored local .env.production file. Fail a
 * production deployment early if its build variables are missing or wrong,
 * rather than silently publishing preview SEO metadata.
 */
export function resolveBuildEnv(variables: Record<string, unknown>) {
  const isVercelProduction = variables.VERCEL === "1" && variables.VERCEL_ENV === "production";
  if (isVercelProduction) {
    const missing = ["SITE_URL", "SITE_INDEXABLE"].filter((name) => typeof variables[name] !== "string" || variables[name] === "");
    if (missing.length) throw new Error("Vercel production builds require these environment variables: " + missing.join(", "));
  }

  const parsed = buildEnvSchema.parse(variables);
  if (isVercelProduction && parsed.SITE_URL !== productionOrigin) {
    throw new Error("Vercel production SITE_URL must be " + productionOrigin + ".");
  }
  if (isVercelProduction && !parsed.SITE_INDEXABLE) {
    throw new Error("Vercel production SITE_INDEXABLE must be true.");
  }
  return parsed;
}

