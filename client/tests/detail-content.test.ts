import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { MarkdownContent } from "../src/components/content/MarkdownContent.js";
import { JobDetailPage } from "../src/pages/CollectionPages.js";
import { jobPosting, roleIsOpen } from "../src/lib/seo/job-posting.js";
import { loadContent, selectPublicContent, publicPages } from "../scripts/content.js";
test("Markdown cannot execute raw HTML, unsafe URLs or hotlinked images", () => {
  const html = renderToStaticMarkup(createElement(MarkdownContent, { children: '# Heading\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))\n\n![remote](https://example.com/a.jpg)\n\n## Content' }));
  assert.ok(!html.includes("<script")); assert.ok(!html.includes("javascript:")); assert.ok(!html.includes("<img")); assert.ok(!html.includes("<h1")); assert.ok(html.includes("<h2>Content"));
});
test("publication policy strips unapproved outcomes and preserves closed job routes", async () => {
  const content = await loadContent(); const project = content.projects[0]!;
  const publicContent = selectPublicContent({ ...content, projects: [{ ...project, approved: true, outcomesApproved: false, outcomes: ["PRIVATE_OUTCOME_TEST"] }] });
  assert.equal(publicContent.projects[0]?.outcomes, undefined);
  const closed = { ...content.careers[0]!, status: "closed" as const, publishedAt: "2026-01-01" };
  assert.ok(publicPages({ ...content, careers: [closed] }).some((page) => page.path === "/careers/" + closed.slug));
});
test("open and closed job templates and structured data respect completeness", async () => {
  const content = await loadContent();
  const job = { ...content.careers[0]!, status: "open" as const, publishedAt: "2026-01-01", closesAt: "2099-12-31" };
  const render = (item: typeof job) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(JobDetailPage, { job: item })));
  assert.ok(render(job).includes('id="apply"'));
  assert.ok(render(job).includes("Apply for this role"));
  const expired = { ...job, closesAt: "2000-01-01" };
  assert.ok(render(expired).includes("This role is closed")); assert.ok(!render(expired).includes('id="apply"'));
  assert.equal(roleIsOpen(expired), false);
  assert.equal(jobPosting(job, content.company, "https://example.com"), undefined);
  const complete = { ...job, locationAddress: { streetAddress: "Test street", addressLocality: "Test city", addressRegion: "Test region", postalCode: "000000", addressCountry: "IN" } };
  assert.equal(jobPosting(complete, content.company, "https://example.com")?.["@type"], "JobPosting");
  assert.equal(jobPosting({ ...complete, status: "closed" }, content.company, "https://example.com"), undefined);
  assert.equal(jobPosting(complete, content.company, "https://example.invalid"), undefined);
  const remote = { ...job, workMode: "remote" as const, applicantCountries: ["India"] };
  assert.equal(jobPosting(remote, content.company, "https://example.com")?.jobLocationType, "TELECOMMUTE");
});
