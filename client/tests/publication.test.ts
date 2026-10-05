import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { clientRoot, loadContent, selectPublicContent } from "../scripts/content.js";
async function filesUnder(folder: string): Promise<string[]> {
  const entries = await readdir(folder, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? filesUnder(resolve(folder, entry.name)) : Promise.resolve([resolve(folder, entry.name)])))).flat();
}
test("dist contains no unapproved project, draft Insight or draft job text", async () => {
  const content = await loadContent();
  const privateRecords = [...content.projects.filter((item) => !item.approved), ...content.insights.filter((item) => item.status === "draft"), ...content.careers.filter((item) => item.status === "draft")];
  assert.ok(privateRecords.length >= 3, "Keep negative publication fixtures.");
  const publicText = JSON.stringify(selectPublicContent(content));
  const privatePaths = [...content.projects.filter((item) => !item.approved).map((item) => "/projects/" + item.slug), ...content.insights.filter((item) => item.status === "draft").map((item) => "/insights/" + item.slug), ...content.careers.filter((item) => item.status === "draft").map((item) => "/careers/" + item.slug)];
  const needles = privateRecords.flatMap((item) => [item.slug, item.title, item.seo.title, "summary" in item ? item.summary : item.excerpt]).filter((needle) => !publicText.includes(needle));
  const files = [...await filesUnder(resolve(clientRoot, "dist")), ...await filesUnder(resolve(clientRoot, "src/generated")), resolve(clientRoot, "../server/src/generated/job-catalog.json")];
  const generated = JSON.parse(await readFile(resolve(clientRoot, "src/generated/public-content.json"), "utf8"));
  assert.deepEqual(generated.projects.map((item: { slug: string }) => item.slug), content.projects.filter((item) => item.approved).map((item) => item.slug));
  assert.deepEqual(generated.insights.map((item: { slug: string }) => item.slug), content.insights.filter((item) => item.status === "published").map((item) => item.slug));
  assert.deepEqual(generated.careers.map((item: { slug: string }) => item.slug), content.careers.filter((item) => item.status !== "draft").map((item) => item.slug));
  assert.ok(files.some((file) => file.endsWith(".html")));
  assert.ok(files.some((file) => file.endsWith(".js")));
  // Grep every text artifact, including HTML, JS, .data, manifests and sitemap.
  for (const file of files.filter((file) => /\.(html|js|json|data|xml|txt|map|ts)$/.test(file))) {
    const text = await readFile(file, "utf8");
    for (const needle of [...needles, ...privatePaths]) assert.ok(!text.includes(needle), "Private text leaked into " + file + ": " + needle);
    assert.ok(!/PRIVATE_(PROJECT|INSIGHT|JOB)_[A-Z0-9_]+/.test(text), "Private body marker leaked into " + file);
  }
  console.log("Publication grep passed: " + files.length + " build files; " + privateRecords.length + " excluded records.");
});

test("project metrics are public only when both project and outcomes are approved", async () => {
  const content = await loadContent();
  const project = content.projects[0]!;
  project.outcomeMetrics = [{ value: "test-value", label: "test-label" }];
  assert.equal(selectPublicContent(content).projects.length, 0);
  project.approved = true;
  assert.equal(selectPublicContent(content).projects[0]?.outcomeMetrics, undefined);
  project.outcomesApproved = true;
  assert.deepEqual(selectPublicContent(content).projects[0]?.outcomeMetrics, [{ value: "test-value", label: "test-label" }]);
});
