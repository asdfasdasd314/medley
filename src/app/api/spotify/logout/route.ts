import { NextRequest, NextResponse } from "next/server";
import {
  clearAuthCookieOptions,
  spotifyCookieNames,
} from "@/lib/spotify/auth";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  const clear = clearAuthCookieOptions();

  response.cookies.set(spotifyCookieNames.ACCESS_COOKIE, "", clear);
  response.cookies.set(spotifyCookieNames.REFRESH_COOKIE, "", clear);
  response.cookies.set(spotifyCookieNames.EXPIRES_COOKIE, "", clear);
  response.cookies.set(spotifyCookieNames.VERIFIER_COOKIE, "", clear);
  response.cookies.set(spotifyCookieNames.STATE_COOKIE, "", clear);

  return response;
}

export async function POST(request: NextRequest) {
  return GET(request);
}
