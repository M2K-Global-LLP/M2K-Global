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

