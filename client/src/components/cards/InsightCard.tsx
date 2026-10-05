import type { Insight } from "../../schemas/content.schema.js";
import { collections } from "../../lib/content.js";
import { Button } from "../ui/Button.js";
export const readingMinutes = (body: string) => Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200));
export function InsightCard({ insight }: { insight: Insight }) {
  return <article className="editorial-card insight-card" data-reveal-item><span className="insight-content-type">{insight.contentType ?? "Article"}</span><div className="card-kicker">{insight.tags[0]}</div><h3>{insight.title}</h3><p>{insight.excerpt}</p><p className="article-meta"><time dateTime={insight.publishedAt}>{insight.publishedAt}</time><span>{readingMinutes(insight.bodyMarkdown)} {collections.ui.readingTime}</span></p><Button href={"/insights/" + insight.slug} variant="text">{collections.ui.readArticle}</Button></article>;
}
