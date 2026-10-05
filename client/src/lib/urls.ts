// Environment values are validated by the build scripts. Only public VITE values appear here.
const appUrl = import.meta.env?.VITE_TENDER_SAAR_URL as string | undefined;
export const urls = {
  api: (import.meta.env?.VITE_API_URL as string | undefined) || "http://localhost:4000",
  tenderSaarApp: appUrl || undefined,
  tenderSaarContact: "/contact?service=tender-saar",
};
export const tenderSaarDestination = urls.tenderSaarApp ?? urls.tenderSaarContact;
