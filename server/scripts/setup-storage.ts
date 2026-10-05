import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
const { data, error } = await client.storage.getBucket("resumes");
if (error && error.message !== "Bucket not found") throw error;
if (data?.public) throw new Error("Existing resumes bucket is public. Make it private before enabling applications.");
if (!data) {
  const result = await client.storage.createBucket("resumes", { public: false, fileSizeLimit: 5 * 1024 * 1024, allowedMimeTypes: ["application/pdf"] });
  if (result.error) throw result.error;
}
console.log("resumes bucket verified private.");
