import { isSupabaseConfigured } from "./env";
import { createServerSupabaseClient } from "./server";

export async function getMedleyUser() {
  if (!isSupabaseConfigured()) {
    return { user: null, error: "missing_config" as const };
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  return { user: data.user, error: null };
}
