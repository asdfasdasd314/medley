import fs from "fs";
import path from "path";

// HACKING: tiny TOML reader for this feature's parameter shape only.
export function loadSpotifyParams() {
  const filePath = path.join(
    process.cwd(),
    "parameter_files",
    "spotify_client.toml",
  );
  const raw = fs.readFileSync(filePath, "utf8");

  const playlistLimit = Number(
    raw.match(/playlist_limit\s*=\s*(\d+)/)?.[1] ?? 50,
  );
  const tracksLimit = Number(
    raw.match(/tracks_limit\s*=\s*(\d+)/)?.[1] ?? 100,
  );

  return { playlistLimit, tracksLimit };
}
