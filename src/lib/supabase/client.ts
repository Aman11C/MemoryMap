import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";
import { getSupabaseEnv } from "./config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  const { url, anonKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return null;
  }

  if (browserClient) return browserClient;

  browserClient = createBrowserClient<Database>(url, anonKey);
  return browserClient;
}
