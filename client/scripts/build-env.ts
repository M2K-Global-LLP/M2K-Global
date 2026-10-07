import { loadEnv } from "vite";
import { clientRoot } from "./content.js";
import { resolveBuildEnv, clientEnvSchema } from "../src/schemas/env.schema.js";
const variables = { ...loadEnv("production", clientRoot, ""), ...process.env };
export const buildEnv = resolveBuildEnv(variables);
clientEnvSchema.parse(variables);

