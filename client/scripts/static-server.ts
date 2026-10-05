import { gzipSync } from "node:zlib";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { outputRoot } from "./content.js";
import { routeManifest } from "../src/generated/route-manifest.js";
const pages = new Set(routeManifest.map((page) => page.path));
const mime: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain", ".data": "text/x-script" };
export function createStaticServer() {
  return createServer((req, res) => { void (async () => {
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); res.end(); return; }
    let pathname: string;
    try { pathname = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname); }
    catch { res.writeHead(400); res.end(); return; }
    const normalized = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    let file = resolve(outputRoot, normalized.slice(1), "index.html");
    let status = normalized === "/404" ? 404 : 200;
    if (!pages.has(normalized)) {
      file = resolve(outputRoot, pathname.slice(1));
      const inside = file.startsWith(outputRoot + sep);
      const publicAsset = pathname.startsWith("/assets/") || pathname.startsWith("/placeholders/") || pathname.startsWith("/images/") || pathname === "/robots.txt" || pathname === "/sitemap.xml" || pathname.endsWith(".data");
      if (!inside || !publicAsset || !(await stat(file).catch(() => undefined))?.isFile()) { file = resolve(outputRoot, "404.html"); status = 404; }
    }
    const raw = await readFile(file);
    const compressed = /gzip/.test(req.headers["accept-encoding"] ?? "") && /\.(html|js|css|svg|xml|txt|data)$/.test(file);
    const body = compressed ? gzipSync(raw) : raw;
    res.writeHead(status, { "Content-Type": mime[extname(file)] ?? "application/octet-stream", "X-Content-Type-Options": "nosniff", "Vary": "Accept-Encoding", "Cache-Control": pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache", ...(compressed ? { "Content-Encoding": "gzip" } : {}) });
    res.end(req.method === "HEAD" ? undefined : body);
  })().catch(() => { res.writeHead(500); res.end("Preview server error."); }); });
}

