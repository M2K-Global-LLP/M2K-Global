import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { StorageService } from "../services/interfaces.js";
export class SupabaseStorageService implements StorageService {
  constructor(private readonly client: SupabaseClient, private readonly bucket: string) {}
  async assertPrivate() {
    const { data, error } = await this.client.storage.getBucket(this.bucket);
    if (error) throw error;
    if (!data || data.public) throw new Error("Resume bucket must exist and be private");
  }
  async put(file: { bytes: Uint8Array; contentType: "application/pdf" }) {
    await this.assertPrivate();
    const key = "applications/" + randomUUID() + "/" + randomUUID() + ".pdf";
    const { error } = await this.client.storage.from(this.bucket).upload(key, file.bytes, { contentType: file.contentType, upsert: false, cacheControl: "0" });
    if (error) throw error;
    return { key, size: file.bytes.byteLength };
  }
  async delete(key: string) { const { error } = await this.client.storage.from(this.bucket).remove([key]); if (error) throw error; }
  async createDownloadUrl(key: string, expiresInSeconds: number) {
    await this.assertPrivate();
    if (!Number.isInteger(expiresInSeconds) || expiresInSeconds < 1 || expiresInSeconds > 600) throw new Error("Resume links may last at most ten minutes");
    const { data, error } = await this.client.storage.from(this.bucket).createSignedUrl(key, expiresInSeconds, { download: "resume.pdf" });
    if (error) throw error;
    return data.signedUrl;
  }
}
