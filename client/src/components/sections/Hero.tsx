import { useEffect, useState, type ReactNode } from "react";
import { Button } from "../ui/Button.js";
import { Breadcrumb, type Crumb } from "../ui/Breadcrumb.js";
type HeroProps = {
  eyebrow: string; title: string; description: string; visual?: ReactNode;
  backgroundImage?: { src: string };
  primary?: { label: string; href: string }; secondary?: { label: string; href: string };
  crumbs?: Crumb[]; className?: string; typewriterTitle?: boolean;
};
export function Hero({ eyebrow, title, description, visual, backgroundImage, primary, secondary, crumbs, className = "", typewriterTitle = false }: HeroProps) {
  const [displayedTitle, setDisplayedTitle] = useState(typewriterTitle ? "" : title);
  const [isTyping, setIsTyping] = useState(typewriterTitle);

  useEffect(() => {
    if (!typewriterTitle) {
      setDisplayedTitle(title);
      setIsTyping(false);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayedTitle(title);
      setIsTyping(false);
      return;
    }

    const characters = Array.from(title);
    let index = 0;
    setDisplayedTitle("");
    setIsTyping(true);
    const timer = window.setInterval(() => {
      index += 1;
      setDisplayedTitle(characters.slice(0, index).join(""));
      if (index >= characters.length) {
        window.clearInterval(timer);
        setIsTyping(false);
      }
    }, 36);

    return () => window.clearInterval(timer);
  }, [title, typewriterTitle]);

  return <section className={"hero " + className + (backgroundImage ? " hero-with-background" : "")}>{backgroundImage ? <div className="hero-backdrop" aria-hidden="true"><img src={backgroundImage.src} alt="" fetchPriority="high" /></div> : null}<div className="container">
    {crumbs ? <Breadcrumb items={crumbs} /> : null}
    <div className={visual ? "hero-grid" : "hero-single"}>
      <div className="hero-copy"><p className="eyebrow">{eyebrow}</p><h1 {...(typewriterTitle ? { "aria-label": title } : {})}>{typewriterTitle ? <><span className="sr-only">{title}</span><span className={"typewriter-title" + (isTyping ? " is-typing" : "")} aria-hidden="true">{displayedTitle}</span></> : title}</h1><p className="hero-description">{description}</p>
        {primary || secondary ? <div className="button-row">{primary ? <Button href={primary.href}>{primary.label}</Button> : null}{secondary ? <Button href={secondary.href} variant="secondary">{secondary.label}</Button> : null}</div> : null}
      </div>{visual ? <div className="hero-visual">{visual}</div> : null}
    </div>
  </div></section>;
}

