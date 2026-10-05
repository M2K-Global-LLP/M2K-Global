import { renderToReadableStream } from "react-dom/server";
import { ServerRouter, type EntryContext } from "react-router";

// Build-time rendering only; the production client is served as static files.
export default async function handleRequest(
  request: Request,
  status: number,
  headers: Headers,
  context: EntryContext,
) {
  const stream = await renderToReadableStream(<ServerRouter context={context} url={request.url} />);
  await stream.allReady;
  headers.set("Content-Type", "text/html; charset=utf-8");
  return new Response(stream, { status, headers });
}
