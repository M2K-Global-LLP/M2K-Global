import type { CompanyConfig, Job } from "../../schemas/content.schema.js";
import type { JsonLdValue } from "./StructuredData.js";
export const roleIsOpen = (job: Job, today = new Date().toISOString().slice(0, 10)) => job.status === "open" && (!job.closesAt || job.closesAt >= today);
export function jobPosting(job: Job, company: CompanyConfig, origin: string): Record<string, JsonLdValue> | undefined {
  const host = new URL(origin).hostname;
  if (!roleIsOpen(job) || !job.publishedAt || !job.closesAt || !job.responsibilities.length || !job.requirements.length || host.endsWith(".invalid") || host === "localhost" || company.name.includes("[")) return undefined;
  if (job.workMode === "remote" ? !job.applicantCountries?.length : !job.locationAddress) return undefined;
  return {
    "@context": "https://schema.org", "@type": "JobPosting", title: job.title,
    description: [job.summary, job.descriptionMarkdown, ...job.responsibilities, ...job.requirements].join("\n"),
    datePosted: job.publishedAt, validThrough: job.closesAt + "T23:59:59Z",
    employmentType: ({ "full-time": "FULL_TIME", "part-time": "PART_TIME", contract: "CONTRACTOR", internship: "INTERN" })[job.employmentType],
    hiringOrganization: { "@type": "Organization", name: company.name, sameAs: origin },
    ...(job.workMode === "remote" ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: job.applicantCountries!.map((name) => ({ "@type": "Country", name })) } : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", ...job.locationAddress } } }),
  };
}
