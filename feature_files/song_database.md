# Song Database

## Summary
File-backed JSON song store for Medley. Each song holds catalog fields (name, author, album, playlists, genre, duration) plus per-user musical and personal attribute string lists. Lives at `data/songs.json`; helpers under `src/lib/songs/` load, filter, populate, and update attributes. Not wired to Spotify or agent tools yet — Spotify is a future import source via optional `spotify_track_id`.

## Key Points
- **Schema**: UUID primary `id`; optional `spotify_track_id`; `playlists: string[]` membership; `album` is the release name; `genre` / `duration_ms` / `album` may be null.
- **Attributes**: Single-user for now — `liked_musical_attributes` and `personal_attributes` are `string[]` on each song (not keyed by userId).
- **Upsert**: Match by `id` → else `spotify_track_id` → else append with a new UUID. Union-merge playlists; set album/genre/duration only when incoming value is non-null; always refresh name/author when provided; merge attribute lists (append by default).
- **Config**: `database_path` comes from `parameter_files/song_database.toml`. No secrets.

## Relevant Files
- `src/lib/songs/types.ts`: `Song`, `SongDatabase`, `SongInput` types.
- `src/lib/songs/params.ts`: Reads `database_path` from the parameter file.
- `src/lib/songs/db.ts`: Load/save, list/get/find, populate, attribute and playlist helpers.
- `src/lib/songs/index.ts`: Re-exports for later imports.
- `data/songs.json`: JSON store scaffold (`{ "songs": [] }`).
- `parameter_files/song_database.toml`: Path to the JSON file.
- `feature_files/spotify_client.md`: Future data source for populate (not a dependency yet).

## Dev Mode
HACKING

## State Log
- 2026-09-05: Initialized feature file for the file-backed song JSON database.
- 2026-09-05: Shipped Song schema, empty `data/songs.json`, params loader, and load/find/populate/attribute helpers under `src/lib/songs/`.
