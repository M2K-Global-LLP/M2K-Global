import ReactMarkdown from "react-markdown";
export function MarkdownContent({ children }: { children: string }) {
  return <div className="markdown-content"><ReactMarkdown skipHtml components={{ h1: ({ children }) => <h2>{children}</h2>, img: ({ src, alt }) => src?.startsWith("/images/") || src?.startsWith("/placeholders/") ? <img src={src} alt={alt ?? ""} loading="lazy" /> : null }}>{children}</ReactMarkdown></div>;
}
