import { createClient, SupabaseClient } from "@supabase/supabase-js";

declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * Creates a configured Supabase client.
 * When a Clerk JWT token is provided, requests are authenticated with Bearer <token>,
 * enabling PostgreSQL Row Level Security (RLS) to enforce user isolation.
 */
export function createSupabaseClient(
  clerkToken?: string | null,
  customUrl?: string,
  customKey?: string
): SupabaseClient {
  const supabaseUrl =
    customUrl ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const supabaseAnonKey =
    customKey ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_KEY ||
    process.env.SUPABASE_KEY ||
    "";

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return dummy client if environment variables are not yet populated
    // allowing offline/mock development mode to function without crashing
    return createClient("https://placeholder.supabase.co", "placeholder-key", {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: clerkToken
        ? {
            Authorization: `Bearer ${clerkToken}`,
          }
        : {},
    },
  });
}

/**
 * Checks whether valid Supabase environment variables are available.
 */
export function isSupabaseConfigured(): boolean {
  const url =
    process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_KEY ||
    process.env.SUPABASE_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("placeholder") &&
      url.startsWith("https://")
  );
}
