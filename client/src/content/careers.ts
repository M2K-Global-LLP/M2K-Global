import type { Job } from "../schemas/content.schema.js";
// Draft example only; not an advertised vacancy.
export const careers: Job[] = [{
  slug: "programme-coordinator-example", title: "Programme Coordinator — Draft Example", status: "draft",
  department: "Programme coordination", location: "Gurugram, Haryana", workMode: "onsite", employmentType: "full-time",
  summary: "An unpublished example of a role supporting engagement planning, documentation and coordination.",
  responsibilities: ["Coordinate agreed activities and review points", "Maintain clear engagement documentation", "Support communication among stakeholders"],
  requirements: ["Clear written communication", "An organized approach to documentation", "Experience relevant to the final approved role scope"],
  descriptionMarkdown: "## About this example\n\nThis editorial role outline is not an active vacancy. Responsibilities, eligibility and employment terms must be confirmed before publication.",
  seo: { title: "Programme Coordinator Example | M2K Global", description: "An unpublished role outline for editorial review." },
}];
