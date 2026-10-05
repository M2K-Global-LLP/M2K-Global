import { startTransition, StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { routeManifest } from "./generated/route-manifest.js";

startTransition(() => {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const app = <StrictMode><HydratedRouter /></StrictMode>;
  if (routeManifest.some((page) => page.path === path)) {
    hydrateRoot(document, app);
  } else {
    // Static hosts serve the same prerendered 404 document for every unknown URL.
    // Its route bootstrap describes /404, so mount the requested route instead
    // of attempting to hydrate a document generated for a different location.
    createRoot(document).render(app);
  }
});
