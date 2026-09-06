export type Song = {
  id: string;
  name: string;
  author: string;
  album: string | null;
  playlists: string[];
  genre: string | null;
  duration_ms: number | null;
  spotify_track_id?: string;
  liked_musical_attributes: string[];
  personal_attributes: string[];
};

export type SongDatabase = {
  songs: Song[];
};

export type SongInput = {
  id?: string;
  name: string;
  author: string;
  album?: string | null;
  playlists?: string[];
  genre?: string | null;
  duration_ms?: number | null;
  spotify_track_id?: string;
  liked_musical_attributes?: string[];
  personal_attributes?: string[];
};

export type SongFindFilter = {
  album?: string;
  playlist?: string;
  author?: string;
  musicalAttr?: string;
  personalAttr?: string;
};

export type SongAttributeUpdate = {
  liked_musical_attributes?: string[];
  personal_attributes?: string[];
};
