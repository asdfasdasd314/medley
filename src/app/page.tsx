import Link from "next/link";
import { PlaylistBrowser } from "./playlist-browser";
import { listPlaylists } from "@/lib/spotify/api";
import { hasSpotifySession } from "@/lib/spotify/auth";

export default async function Home() {
  const connected = await hasSpotifySession();

  if (!connected) {
    return (
      <main className="home-page">
        <div className="home-panel">
          <p className="eyebrow">Medley</p>
          <h1>Playlists</h1>
          <p className="lede">
            Connect your Spotify account to browse your playlists and the songs
            inside them.
          </p>
          <Link className="primary-link" href="/api/spotify/login">
            Connect Spotify
          </Link>
        </div>
      </main>
    );
  }

  const playlists = await listPlaylists();

  return (
    <main className="browse-page">
      <header className="browse-header">
        <div>
          <p className="eyebrow">Medley</p>
          <h1>Your playlists</h1>
          <p className="lede">
            {playlists.length} playlist{playlists.length === 1 ? "" : "s"}. Open
            one to see its tracks.
          </p>
        </div>
        <Link className="ghost-link" href="/api/spotify/logout">
          Disconnect
        </Link>
      </header>

      <PlaylistBrowser playlists={playlists} />
    </main>
  );
}
