import { test } from "node:test";
import assert from "node:assert/strict";
import { loadContent, selectPublicContent } from "../scripts/content.js";
import { insightSchema } from "../src/schemas/content.schema.js";
test("Markdown frontmatter is parsed, drafts are excluded, and publication requires a date", async () => {
  const content = await loadContent();
  const draft = content.insights[0];
  assert.ok(draft);
  assert.match(draft.bodyMarkdown, /Editorial outline/);
  const publicContent = selectPublicContent(content);
  assert.equal(publicContent.projects.length, 0);
  assert.equal(publicContent.insights.length, 0);
  assert.equal(publicContent.careers.length, 0);
  assert.equal(insightSchema.safeParse({ ...draft, status: "published", publishedAt: undefined }).success, false);
  const published = insightSchema.parse({ ...draft, status: "published", publishedAt: "2026-09-28" });
  assert.equal(selectPublicContent({ ...content, insights: [published] }).insights.length, 1);
});

