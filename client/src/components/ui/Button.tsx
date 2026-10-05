import type { ButtonHTMLAttributes, PointerEventHandler, ReactNode } from "react";
import { Link } from "react-router";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
type Common = { children: ReactNode; variant?: "primary" | "secondary" | "light" | "text"; className?: string; loading?: boolean; disabled?: boolean; arrow?: boolean; onPointerMove?: PointerEventHandler<HTMLElement>; onPointerLeave?: PointerEventHandler<HTMLElement> };
type Props = Common & ({ href: string; onClick?: () => void } | ({ href?: never } & ButtonHTMLAttributes<HTMLButtonElement>));
export function Button({ children, variant = "primary", className = "", loading = false, disabled = false, arrow = true, ...props }: Props) {
  const classes = "button button-" + variant + " " + className;
  const content = <>{loading ? <LoaderCircle className="button-spinner" aria-hidden="true" size={17} /> : null}<span>{children}</span>{arrow && !loading ? <ArrowUpRight size={17} aria-hidden="true" /> : null}</>;
  if ("href" in props && props.href) {
    if (disabled || loading) return <span className={classes} role="link" aria-disabled="true" aria-busy={loading}>{content}</span>;
    if (/^https?:/.test(props.href)) return <a className={classes} href={props.href} target="_blank" rel="noopener noreferrer" data-cta onClick={props.onClick} onPointerMove={props.onPointerMove} onPointerLeave={props.onPointerLeave}>{content}</a>;
    return <Link className={classes} to={props.href} data-cta onClick={props.onClick} onPointerMove={props.onPointerMove} onPointerLeave={props.onPointerLeave}>{content}</Link>;
  }
  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type="button" {...buttonProps} className={classes} disabled={disabled || loading} aria-busy={loading} aria-label={buttonProps["aria-label"]}>{content}</button>;
}

