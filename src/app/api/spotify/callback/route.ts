import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  clearAuthCookieOptions,
  exchangeCodeForTokens,
  spotifyCookieNames,
  tokenCookieOptions,
} from "@/lib/spotify/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") ?? "";
  const state = request.nextUrl.searchParams.get("state") ?? "";
  const jar = await cookies();
  const expectedState = jar.get(spotifyCookieNames.STATE_COOKIE)?.value ?? "";
  const verifier = jar.get(spotifyCookieNames.VERIFIER_COOKIE)?.value ?? "";

  // HACKING: trust the happy path; mismatch just bounces home
  if (!code || !verifier || state !== expectedState) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const data = await exchangeCodeForTokens(code, verifier);
  const access = data.access_token as string;
  const refresh = data.refresh_token as string;
  const expiresIn = Number(data.expires_in ?? 3600);
  const expiresAt = Date.now() + expiresIn * 1000;

  const response = NextResponse.redirect(new URL("/", request.url));
  const longLived = tokenCookieOptions(60 * 60 * 24 * 30);

  response.cookies.set(spotifyCookieNames.ACCESS_COOKIE, access, longLived);
  response.cookies.set(spotifyCookieNames.REFRESH_COOKIE, refresh, longLived);
  response.cookies.set(
    spotifyCookieNames.EXPIRES_COOKIE,
    String(expiresAt),
    longLived,
  );
  response.cookies.set(
    spotifyCookieNames.VERIFIER_COOKIE,
    "",
    clearAuthCookieOptions(),
  );
  response.cookies.set(
    spotifyCookieNames.STATE_COOKIE,
    "",
    clearAuthCookieOptions(),
  );

  return response;
}
