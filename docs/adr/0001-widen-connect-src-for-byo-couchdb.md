# 1. Widen CSP connect-src for bring-your-own CouchDB

Date: 2026-10-03. Status: accepted.

## Context

Optional multi-device sync replicates the local PouchDB to a CouchDB database the user runs or rents (Cloudant, self-hosted, a local Docker container). The app can't know that host in advance.

The CSP is a `<meta http-equiv>` tag in `index.html`, so it is fixed when the page parses. Script can only make a meta policy stricter, never add a host the user types in at runtime. The old policy was `connect-src 'self'`, which blocks every remote database.

Research: `.scratch/roadmap/research/pouchdb-sync.md`, sections 2, 4 and 5.

## Decision

`connect-src 'self' https: http://localhost:5984 http://127.0.0.1:5984`

Any HTTPS endpoint is allowed, plus a CouchDB on the loopback default port for development. Plain `http://` to anything else stays blocked; the browser would block it as mixed content on GitHub Pages anyway.

We rejected an allowlist of known hosts (it breaks self-hosting) and asking users to fork and edit the tag (it breaks "no setup").

## Consequences

- CSP no longer stops injected script from sending data to an arbitrary HTTPS host. Little is lost: `script-src` already has `'unsafe-inline'`, so CSP was never much of an XSS defence here. The real defence is still having no injection sinks: content is static and first-party, and nothing feeds user data into `innerHTML`.
- Saved sync credentials are readable by any page on the same origin, and every GitHub Pages project site of one user shares `<user>.github.io`. Another repo published there could read a remembered password. That's why credentials default to `sessionStorage`, "Remember on this device" is opt-in, and the README asks for a dedicated non-admin user that can reach only the one progress database.
- A self-hosted CouchDB on a port other than 5984 over plain http won't work. Put it behind HTTPS.
- If the app is ever served with real HTTP headers, revisit: drop `'unsafe-inline'` first, then consider narrowing `connect-src`.
