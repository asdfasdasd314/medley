import fs from "fs";
import path from "path";

export type SongRatingParams = {
  minRating: number;
  maxRating: number;
  songs: string[];
};

// HACKING: tiny TOML reader for this feature's parameter shape only.
export function loadSongRatingParams(): SongRatingParams {
  const filePath = path.join(
    process.cwd(),
    "parameter_files",
    "song_rating_interview.toml",
  );
  const raw = fs.readFileSync(filePath, "utf8");

  const minRating = Number(raw.match(/min_rating\s*=\s*(\d+)/)?.[1] ?? 0);
  const maxRating = Number(raw.match(/max_rating\s*=\s*(\d+)/)?.[1] ?? 10);
  const songsBlock = raw.match(/songs\s*=\s*\[([\s\S]*?)\]/)?.[1] ?? "";
  const songs = [...songsBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  return { minRating, maxRating, songs };
}
