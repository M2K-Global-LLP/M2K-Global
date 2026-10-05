import { loadEnv } from "vite";
import { clientRoot } from "./content.js";
import { buildEnvSchema, clientEnvSchema } from "../src/schemas/env.schema.js";
const variables = { ...loadEnv("production", clientRoot, ""), ...process.env };
export const buildEnv = buildEnvSchema.parse(variables);
clientEnvSchema.parse(variables);

