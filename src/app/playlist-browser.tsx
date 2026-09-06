"use client";

import { useState } from "react";
import type { SpotifyPlaylist, SpotifyTrack } from "@/lib/spotify/api";

type PlaylistBrowserProps = {
  playlists: SpotifyPlaylist[];
};

export function PlaylistBrowser({ playlists }: PlaylistBrowserProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [tracksById, setTracksById] = useState<Record<string, SpotifyTrack[]>>(
    {},
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function togglePlaylist(playlist: SpotifyPlaylist) {
    if (openId === playlist.id) {
      setOpenId(null);
      return;
    }

    setOpenId(playlist.id);

    if (tracksById[playlist.id]) return;

    setLoadingId(playlist.id);
    const res = await fetch(`/api/spotify/playlists/${playlist.id}/tracks`);
    const data = await res.json();
    setTracksById((prev) => ({ ...prev, [playlist.id]: data.tracks ?? [] }));
    setLoadingId(null);
  }

  return (
    <div className="playlist-browser">
      <ul className="playlist-list">
        {playlists.map((playlist, index) => {
          const open = openId === playlist.id;
          const tracks = tracksById[playlist.id] ?? [];
          const loading = loadingId === playlist.id;

          return (
            <li
              key={playlist.id}
              className="playlist-row"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <button
                type="button"
                className="playlist-toggle"
                aria-expanded={open}
                onClick={() => togglePlaylist(playlist)}
              >
                <span className="playlist-chevron" aria-hidden>
                  {open ? "▾" : "▸"}
                </span>
                <span className="playlist-name">{playlist.name}</span>
                <span className="playlist-count">
                  {playlist.trackCount} tracks
                </span>
              </button>

              {open ? (
                <div className="track-panel">
                  {loading ? (
                    <p className="track-status">Loading tracks…</p>
                  ) : tracks.length === 0 ? (
                    <p className="track-status">No tracks in this playlist.</p>
                  ) : (
                    <ol className="track-list">
                      {tracks.map((track, trackIndex) => (
                        <li key={`${track.id}-${trackIndex}`} className="track-row">
                          <span className="song-index">
                            {String(trackIndex + 1).padStart(2, "0")}
                          </span>
                          <div className="track-meta">
                            <span className="song-title">{track.name}</span>
                            <span className="track-artists">{track.artists}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
