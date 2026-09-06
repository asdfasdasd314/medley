import fs from "fs";
import path from "path";

// HACKING: tiny TOML reader for this feature's parameter shape only.
export function loadSongDatabaseParams() {
  const filePath = path.join(
    process.cwd(),
    "parameter_files",
    "song_database.toml",
  );
  const raw = fs.readFileSync(filePath, "utf8");

  const databasePath =
    raw.match(/database_path\s*=\s*"([^"]+)"/)?.[1] ?? "data/songs.json";

  return { databasePath };
}
