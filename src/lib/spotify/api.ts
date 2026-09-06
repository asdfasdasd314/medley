import { getAccessToken } from "./auth";
import { loadSpotifyParams } from "./params";

export type SpotifyPlaylist = {
  id: string;
  name: string;
  trackCount: number;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: string;
};

async function spotifyGet(url: string) {
  const token = await getAccessToken();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}

export async function listPlaylists() {
  const { playlistLimit } = loadSpotifyParams();
  const playlists: SpotifyPlaylist[] = [];
  let url: string | null =
    `https://api.spotify.com/v1/me/playlists?limit=${playlistLimit}`;

  while (url) {
    const data = await spotifyGet(url);
    for (const item of data.items ?? []) {
      playlists.push({
        id: item.id,
        name: item.name,
        trackCount: item.tracks?.total ?? 0,
      });
    }
    url = data.next;
  }

  return playlists;
}

export async function listPlaylistTracks(playlistId: string) {
  const { tracksLimit } = loadSpotifyParams();
  const tracks: SpotifyTrack[] = [];
  let url: string | null =
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${tracksLimit}`;

  while (url) {
    const data = await spotifyGet(url);
    for (const item of data.items ?? []) {
      const track = item.track;
      if (!track || track.type !== "track") continue;
      tracks.push({
        id: track.id,
        name: track.name,
        artists: (track.artists ?? []).map((a: { name: string }) => a.name).join(", "),
      });
    }
    url = data.next;
  }

  return tracks;
}
