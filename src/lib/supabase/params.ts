import fs from "fs";
import path from "path";

// HACKING: tiny TOML reader for this feature's parameter shape only.
export function loadSupabaseAuthParams() {
  const filePath = path.join(
    process.cwd(),
    "parameter_files",
    "supabase_auth.toml",
  );
  const raw = fs.readFileSync(filePath, "utf8");

  const postLoginRedirect =
    raw.match(/post_login_redirect\s*=\s*"([^"]+)"/)?.[1] ?? "/";

  return { postLoginRedirect };
}
