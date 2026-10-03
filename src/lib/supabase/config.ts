export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.trim() !== "" &&
    anonKey.trim() !== "" &&
    !url.includes("your-project-id.supabase.co") &&
    !anonKey.includes("your-anon-key") &&
    url.startsWith("http")
  );

  return {
    url: url || "",
    anonKey: anonKey || "",
    isConfigured,
  };
}
