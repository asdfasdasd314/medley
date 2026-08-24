# Song Rating Interview

## Summary
A simple Next.js interview page that presents a fixed playlist of 10 songs and lets the user rate each out of 10. Ratings are local UI state only—nothing is persisted. This is the first interactive surface of the Medley personal music web app.

## Key Points
- **Static playlist**: Ten placeholder songs are defined in the feature parameter file and loaded into the page; no Spotify or backend calls yet.
- **Rating scale**: Integer scores from 0–10 (or unset) per song; no submit/save behavior in HACKING.
- **Personal tool UI**: Functional and clean—no marketing copy or product branding fluff.

## Relevant Files
- `src/app/interview/page.tsx`: Server page that loads params and renders the interview.
- `src/app/interview/interview-form.tsx`: Client form for local 0–10 ratings.
- `src/lib/song-rating-params.ts`: Reads `parameter_files/song_rating_interview.toml`.
- `src/app/page.tsx`: Home entry that links to the interview.
- `src/app/layout.tsx`: Root layout and fonts.
- `src/app/globals.css`: Global styles and interview theme tokens.
- `parameter_files/song_rating_interview.toml`: Playlist songs and rating scale bounds.

## Dev Mode
HACKING

## State Log
- 2026-08-24: Initialized feature file for the song rating interview page.
- 2026-08-24: Scaffolded Next.js app and shipped a local-only `/interview` rating UI loaded from the feature parameter file.
