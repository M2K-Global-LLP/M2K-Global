import { createStaticServer } from "./static-server.js";
const server = createStaticServer();
server.listen(4173, "127.0.0.1", () => console.log("Static preview: http://127.0.0.1:4173 (unknown paths return HTTP 404)"));
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => server.close());

