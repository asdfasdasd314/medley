import { AuthForm } from "./auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { loadSupabaseAuthParams } from "@/lib/supabase/params";

type LoginProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function LoginPage({ searchParams }: LoginProps) {
  const configured = isSupabaseConfigured();
  const { postLoginRedirect } = loadSupabaseAuthParams();
  const { error } = await searchParams;
  const showMissingConfig = !configured || error === "missing_config";

  return (
    <main className="home-page">
      <div className="home-panel">
        <p className="eyebrow">Medley</p>
        <h1>Log in</h1>
        <p className="lede">
          Sign in with your Medley email and password to use the app.
        </p>
        {showMissingConfig && (
          <p className="config-notice">
            Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, disable Confirm email
            in the Supabase Auth settings, then restart the dev server.
          </p>
        )}
        <AuthForm
          mode="login"
          redirectTo={postLoginRedirect}
          configured={configured}
        />
      </div>
    </main>
  );
}
