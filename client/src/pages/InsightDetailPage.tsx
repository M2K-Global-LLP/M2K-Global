import { collections as c, insights } from "../lib/content.js";
import type { Insight } from "../schemas/content.schema.js";
import { Hero } from "../components/sections/Hero.js";
import { CTASection } from "../components/sections/CTASection.js";
import { Button } from "../components/ui/Button.js";
import { MarkdownContent } from "../components/content/MarkdownContent.js";
import { InsightCard, readingMinutes } from "../components/cards/InsightCard.js";
import { crumbs } from "./collection-shared.js";
export function InsightDetailPage({ insight }: { insight: Insight }) {
  const related = insights.filter((item) => item.slug !== insight.slug && item.tags.some((tag) => insight.tags.includes(tag))).slice(0, 3);
  return <><Hero eyebrow={c.ui.insights} title={insight.title} description={insight.excerpt} crumbs={crumbs(c.ui.insights, "/insights", insight.title, "/insights/" + insight.slug)} /><article className="container detail-content"><div className="article-meta"><span>{c.ui.published} <time dateTime={insight.publishedAt}>{insight.publishedAt}</time></span>{insight.updatedAt ? <span>{c.ui.updated} <time dateTime={insight.updatedAt}>{insight.updatedAt}</time></span> : null}<span>{readingMinutes(insight.bodyMarkdown)} {c.ui.readingTime}</span>{insight.authorName ? <span>{insight.authorName}</span> : null}</div><div className="tag-list">{insight.tags.map((tag) => <Button key={tag} href={"/insights?tag=" + encodeURIComponent(tag)} variant="text">{tag}</Button>)}</div><MarkdownContent>{insight.bodyMarkdown}</MarkdownContent></article>{related.length ? <section className="section section-muted"><div className="container"><h2>{c.ui.relatedArticles}</h2><div className="editorial-grid">{related.map((item) => <InsightCard key={item.slug} insight={item} />)}</div></div></section> : null}<CTASection /></>;
}
