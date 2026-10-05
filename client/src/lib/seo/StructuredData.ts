import type { MetaDescriptor } from "react-router";
export type JsonLdValue = string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue };
export function structuredData(value: { [key: string]: JsonLdValue }): MetaDescriptor {
  return { "script:ld+json": value };
}
// Route meta exports may use this helper once verified factual data is available.

