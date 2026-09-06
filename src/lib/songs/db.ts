import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

import { loadSongDatabaseParams } from "./params";
import type {
  Song,
  SongAttributeUpdate,
  SongDatabase,
  SongFindFilter,
  SongInput,
} from "./types";

function resolveDbPath() {
  const { databasePath } = loadSongDatabaseParams();
  return path.join(process.cwd(), databasePath);
}

function unionStrings(existing: string[], incoming: string[]) {
  const seen = new Set(existing);
  const out = [...existing];
  for (const value of incoming) {
    if (!seen.has(value)) {
      seen.add(value);
      out.push(value);
    }
  }
  return out;
}

function findExistingIndex(db: SongDatabase, entry: SongInput) {
  if (entry.id) {
    const byId = db.songs.findIndex((song) => song.id === entry.id);
    if (byId !== -1) return byId;
  }

  if (entry.spotify_track_id) {
    const bySpotify = db.songs.findIndex(
      (song) => song.spotify_track_id === entry.spotify_track_id,
    );
    if (bySpotify !== -1) return bySpotify;
  }

  return -1;
}

function mergeSong(existing: Song, entry: SongInput): Song {
  const merged: Song = {
    ...existing,
    name: entry.name,
    author: entry.author,
    playlists: unionStrings(existing.playlists, entry.playlists ?? []),
  };

  if (entry.album != null) {
    merged.album = entry.album;
  }

  if (entry.genre != null) {
    merged.genre = entry.genre;
  }

  if (entry.duration_ms != null) {
    merged.duration_ms = entry.duration_ms;
  }

  if (entry.spotify_track_id && !existing.spotify_track_id) {
    merged.spotify_track_id = entry.spotify_track_id;
  }

  if (entry.liked_musical_attributes) {
    merged.liked_musical_attributes = unionStrings(
      existing.liked_musical_attributes,
      entry.liked_musical_attributes,
    );
  }

  if (entry.personal_attributes) {
    merged.personal_attributes = unionStrings(
      existing.personal_attributes,
      entry.personal_attributes,
    );
  }

  return merged;
}

function songFromInput(entry: SongInput): Song {
  return {
    id: entry.id ?? randomUUID(),
    name: entry.name,
    author: entry.author,
    album: entry.album ?? null,
    playlists: entry.playlists ?? [],
    genre: entry.genre ?? null,
    duration_ms: entry.duration_ms ?? null,
    spotify_track_id: entry.spotify_track_id,
    liked_musical_attributes: entry.liked_musical_attributes ?? [],
    personal_attributes: entry.personal_attributes ?? [],
  };
}

export function loadDatabase(): SongDatabase {
  const filePath = resolveDbPath();
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as SongDatabase;
}

export function saveDatabase(db: SongDatabase) {
  const filePath = resolveDbPath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2) + "\n", "utf8");
}

export function listSongs(): Song[] {
  return loadDatabase().songs;
}

export function getSongById(id: string): Song | undefined {
  return loadDatabase().songs.find((song) => song.id === id);
}

export function findSongs(filter: SongFindFilter = {}): Song[] {
  const songs = loadDatabase().songs;

  return songs.filter((song) => {
    if (filter.album && !song.album?.includes(filter.album)) {
      return false;
    }

    if (filter.playlist && !song.playlists.includes(filter.playlist)) {
      return false;
    }

    if (
      filter.author &&
      !song.author.toLowerCase().includes(filter.author.toLowerCase())
    ) {
      return false;
    }

    if (
      filter.musicalAttr &&
      !song.liked_musical_attributes.some((attr) =>
        attr.toLowerCase().includes(filter.musicalAttr!.toLowerCase()),
      )
    ) {
      return false;
    }

    if (
      filter.personalAttr &&
      !song.personal_attributes.some((attr) =>
        attr.toLowerCase().includes(filter.personalAttr!.toLowerCase()),
      )
    ) {
      return false;
    }

    return true;
  });
}

export function populateSongs(entries: SongInput[]): Song[] {
  const db = loadDatabase();
  const written: Song[] = [];

  for (const entry of entries) {
    const index = findExistingIndex(db, entry);

    if (index === -1) {
      const created = songFromInput(entry);
      db.songs.push(created);
      written.push(created);
      continue;
    }

    const merged = mergeSong(db.songs[index], entry);
    db.songs[index] = merged;
    written.push(merged);
  }

  saveDatabase(db);
  return written;
}

// HACKING: append-by-default — pass replace: true to overwrite a list.
export function updateSongAttributes(
  id: string,
  update: SongAttributeUpdate,
  options: { replace?: boolean } = {},
): Song | undefined {
  const db = loadDatabase();
  const index = db.songs.findIndex((song) => song.id === id);
  if (index === -1) return undefined;

  const song = { ...db.songs[index] };
  const replace = options.replace === true;

  if (update.liked_musical_attributes) {
    song.liked_musical_attributes = replace
      ? update.liked_musical_attributes
      : unionStrings(
          song.liked_musical_attributes,
          update.liked_musical_attributes,
        );
  }

  if (update.personal_attributes) {
    song.personal_attributes = replace
      ? update.personal_attributes
      : unionStrings(song.personal_attributes, update.personal_attributes);
  }

  db.songs[index] = song;
  saveDatabase(db);
  return song;
}

export function addSongPlaylists(
  id: string,
  playlists: string[],
): Song | undefined {
  const db = loadDatabase();
  const index = db.songs.findIndex((song) => song.id === id);
  if (index === -1) return undefined;

  const song = {
    ...db.songs[index],
    playlists: unionStrings(db.songs[index].playlists, playlists),
  };

  db.songs[index] = song;
  saveDatabase(db);
  return song;
}
