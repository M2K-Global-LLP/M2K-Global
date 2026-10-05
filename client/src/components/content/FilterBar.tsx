import { useSyncExternalStore } from "react";
import { useSearchParams } from "react-router";
const subscribe = () => () => {};
export function useContentFilter(key: string, options: { id: string; label: string }[]) {
  const [params, setParams] = useSearchParams();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const requested = params.get(key) ?? "";
  const value = hydrated && options.some((option) => option.id === requested) ? requested : "";
  const select = (id: string) => { const next = new URLSearchParams(params); if (id) next.set(key, id); else next.delete(key); setParams(next, { preventScrollReset: true }); };
  return { value, select };
}
export function FilterBar({ label, all, options, value, select }: { label: string; all: string; options: { id: string; label: string }[]; value: string; select: (id: string) => void }) {
  return <div className="filter-bar" role="group" aria-label={label}>{[{ id: "", label: all }, ...options].map((option) => <button key={option.id} type="button" aria-pressed={value === option.id} onClick={() => select(option.id)}>{option.label}</button>)}</div>;
}
