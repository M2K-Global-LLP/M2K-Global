export type SectionCopy = { eyebrow?: string; title: string; description?: string };
export function SectionHeading({ eyebrow, title, description, light = false, className = "" }: SectionCopy & { light?: boolean; className?: string }) {
  return <div className={"section-heading " + (light ? "section-heading-light " : "") + className}>
    {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
    <h2>{title}</h2>{description ? <p className="section-description">{description}</p> : null}
  </div>;
}

