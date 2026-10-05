import type { Service } from "../schemas/content.schema.js";

export type ServiceVisual = { src: string; alt: string };

export const homeServiceVisuals: Record<Service["slug"], ServiceVisual> = {
  "social-impact": { src: "/images/home/social-impact-team.webp", alt: "A South Asian team joining hands in a collaborative huddle" },
  "tender-advisory": { src: "/images/home/tender-advisory-workspace.webp", alt: "Tender Saar advisory workspace concept with a laptop and tender documents" },
  "it-product-delivery": { src: "/images/home/service-support.png", alt: "Service support and solutions concept" },
  "language-training": { src: "/images/home/language-services.jpg", alt: "Language learning and global communication concept" },
  "skill-development": { src: "/images/home/skill-development-workshop.webp", alt: "A practical skills workshop in a training environment" },
  "export-readiness": { src: "/images/home/export-readiness.png", alt: "Indian suppliers preparing products and documentation for domestic and international trade" },
};

export const serviceDetailVisuals: Record<Service["slug"], ServiceVisual> = {
  ...homeServiceVisuals,
  "it-product-delivery": { src: "/images/home/analytics-interface.jpeg", alt: "A person using a tablet to review digital product analytics" },
  "export-readiness": { src: "/images/home/export-readiness.png", alt: "Indian suppliers preparing products and documentation for domestic and international trade" },
};
