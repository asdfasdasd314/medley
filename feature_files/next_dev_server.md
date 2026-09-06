# Next.js Development Server

## Summary
Configures the Next.js development server to accept requests from both local loopback hostnames used to open Medley. This keeps the browser's injected Hot Module Replacement (HMR) WebSocket endpoint available when Next initializes with `localhost` but the app is opened at `127.0.0.1`, or vice versa.

## Key Points
- **Loopback aliases**: `localhost` and `127.0.0.1` are explicitly allowed through Next's `allowedDevOrigins` development-only setting.
- **HMR scope**: This addresses the development WebSocket origin check; it does not change production behavior or the Spotify OAuth redirect URI.
- **Browser URL**: Local development should use one of the two allowed loopback hostnames consistently, with the configured Spotify redirect URI remaining an exact match.

## Relevant Files
- `next.config.ts`: Allows both local development origins for Next.js dev-server requests.
- `README.md`: Documents the loopback-origin behavior alongside local Spotify setup.
- `parameter_files/next_dev_server.toml`: Reserved feature parameter file; this feature currently has no tunable runtime values.

## Dev Mode
HACKING

## State Log
- 2026-09-06: Added explicit loopback development origins to prevent Next.js HMR WebSocket connection failures between `localhost` and `127.0.0.1`.
