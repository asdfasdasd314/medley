# Spotify Client

## Summary
Connects a Spotify account via Authorization Code + PKCE (Client ID + Redirect URI only) and browses the signed-in user's playlists on `/`. Expanding a playlist loads and shows its tracks (name + artists) from the Spotify Web API. Tokens live in HTTP-only cookies; page sizes come from the feature parameter file.

## Key Points
- **OAuth**: PKCE public-client flow — no Client Secret. Scopes: `playlist-read-private`, `playlist-read-collaborative`.
- **Secrets**: `SPOTIFY_CLIENT_ID` and `SPOTIFY_REDIRECT_URI` live in `.env.local` only; never in parameter files.
- **Playlists**: `GET /v1/me/playlists` (owned + followed as Spotify returns them), paginated with `playlist_limit`.
- **Tracks**: `GET /v1/playlists/{id}/tracks` on expand, paginated with `tracks_limit`. No Liked Songs endpoint in this slice.
- **UI**: Accordion list on home — N playlist rows, expand to see M_i tracks; Connect / Disconnect controls.

## Relevant Files
- `src/app/page.tsx`: Home playlist browser entry (auth gate + list).
- `src/app/playlist-browser.tsx`: Client accordion for playlists and on-demand tracks.
- `src/lib/spotify/params.ts`: Reads `playlist_limit` / `tracks_limit` from the parameter file.
- `src/lib/spotify/auth.ts`: PKCE helpers, cookie token read/refresh.
- `src/lib/spotify/api.ts`: `listPlaylists` / `listPlaylistTracks`.
- `src/app/api/spotify/login/route.ts`: Starts OAuth authorize redirect.
- `src/app/api/spotify/callback/route.ts`: Exchanges code for tokens.
- `src/app/api/spotify/logout/route.ts`: Clears auth cookies.
- `src/app/api/spotify/playlists/[id]/tracks/route.ts`: Track fetch for expanded rows.
- `parameter_files/spotify_client.toml`: Playlist/track page sizes.
- `.env.example`: Placeholder env vars for local Spotify app setup.

## Dev Mode
HACKING

## State Log
- 2026-09-05: Initialized feature file for the Spotify playlist browser client.
- 2026-09-05: Removed interview hello-world; shipped PKCE OAuth, playlist/track API helpers, and accordion browser on `/`.
