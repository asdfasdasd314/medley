import { NextRequest, NextResponse } from "next/server";
import {
  createCodeChallenge,
  createCodeVerifier,
  createOAuthState,
  getSpotifyEnv,
  pkceCookieOptions,
  spotifyCookieNames,
} from "@/lib/spotify/auth";

export async function GET(request: NextRequest) {
  const { clientId, redirectUri } = getSpotifyEnv();

  if (!clientId || !redirectUri) {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("spotify_error", "missing_config");
    return NextResponse.redirect(homeUrl);
  }

  const verifier = createCodeVerifier();
  const challenge = createCodeChallenge(verifier);
  const state = createOAuthState();

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "playlist-read-private playlist-read-collaborative",
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`,
  );

  response.cookies.set(
    spotifyCookieNames.VERIFIER_COOKIE,
    verifier,
    pkceCookieOptions(),
  );
  response.cookies.set(
    spotifyCookieNames.STATE_COOKIE,
    state,
    pkceCookieOptions(),
  );

  return response;
}
