# GCC Intel — Intelligence, in orbit

A responsive GCC research workspace built with React, Vite, Three.js, and Vercel serverless APIs. The interface is designed for mobile and desktop, with an animated 3D globe, company discovery, city comparison, saved research, and a Groq-powered analyst.

## Product areas

- **Overview:** live GCC-related news headlines fetched through the public GDELT DOC 2.0 API.
- **GCC directory:** searchable company list with city/sector filters and official-source links.
- **City intelligence:** city-level news mention counts from the live feed; no fabricated talent, cost, or momentum scores.
- **Market signals:** current article headlines with source domains, publication timestamps when available, and direct links.
- **AI analyst:** server-side Groq chat through `/api/chat`.
- **Research library:** saved company shortlist and saved analyst answers.
- **Mobile and desktop:** responsive navigation, compact mobile cards, reduced-motion support.

## Stack

- React 18 + Vite 6
- Three.js + Lucide React
- Vercel serverless API routes
- Groq Chat Completions API
- Neon PostgreSQL via `@neondatabase/serverless`
- Node built-in test runner + GitHub Actions CI

## Local development

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Build and tests:

```bash
npm run build
npm test
```

Vite serves the frontend locally. Vercel-style `/api/*` functions do not run under plain Vite by default; use Vercel CLI (`npx vercel dev`) to test the API routes locally.

## Vercel deployment

Import this repository into Vercel. Framework preset: **Vite**. Build command: `npm run build`; output directory: `dist`. The `api/` directory contains Vercel serverless functions.

Configure these environment variables in **Vercel → Project → Settings → Environment Variables**. Do not paste secrets into source files, commit them, or send them in chat.

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | For live AI | Groq API key, server-side only |
| `GROQ_MODEL` | Optional | Defaults to `openai/gpt-oss-120b` |
| `DATABASE_URL_POOLED` | Recommended for Vercel | Neon pooled PostgreSQL connection string |
| `DATABASE_URL` | Optional fallback | Neon direct PostgreSQL connection string |
| `SESSION_SECRET` | For saved-data sessions | Long random secret used to sign the HTTP-only session cookie |

After adding variables, redeploy. Never create a `VITE_GROQ_API_KEY` variable; Vite-exposed values are public.

## API reference

- `GET /api/health` — service and AI configuration status (does not expose secrets).
- `GET /api/directory?q=&city=&sector=` — filter the reference company list (not a live census of GCC footprints).
- `GET /api/signals` — retrieve current GCC-related news articles from GDELT DOC 2.0 (last 7 days).
- `POST /api/chat` — body: `{ "question": "..." }`; returns a Groq answer when configured.
- `GET /api/session` — creates or reads an anonymous signed session cookie.
- `GET /api/saved` — list saved companies for the current session.
- `POST /api/saved` — body: `{ "id": "...", "name": "...", "city": "...", "sector": "..." }`.
- `DELETE /api/saved` — body: `{ "id": "...", "name": "..." }`.
- `GET /api/reports` — list up to 50 saved research reports.
- `POST /api/reports` — body: `{ "title": "...", "prompt": "...", "body": "...", "model": "..." }`.
- `DELETE /api/reports` — body: `{ "id": "report-uuid" }`.

The saved-company and report endpoints require `DATABASE_URL_POOLED` or `DATABASE_URL`; the pooled URL is preferred for serverless deployments. Their tables are created lazily. The SQL schema is also available at `api/schema.sql`. The anonymous signed cookie is session separation, **not account authentication**. Add a real identity provider before storing sensitive or tenant-specific data. Configure `SESSION_SECRET` in production.

## Quality and data integrity

GitHub Actions runs `npm install`, `npm run build`, and `npm test` on pushes and pull requests. The test suite currently checks session cookie signing and rejection of malformed signatures. A green CI run is required before calling a change verified; check the Actions tab after a push.

The overview's article feed is live and sourced from GDELT DOC 2.0. Article availability depends on external provider coverage and rate limits. City coverage counts are only keyword matches against article titles/domains, not validated city market metrics. The directory is still a reference list of real companies with official links; its city/sector fields are not continuously verified. Salary, office footprint, hiring totals, cost, and growth metrics are intentionally not fabricated and need authoritative data sources before they can be shown as live facts.

## Current scope and production follow-ups

- Cloud persistence for saved companies and research reports requires a Neon database and environment variables.
- Saved records are isolated by a signed anonymous browser session; there is no user account/login system yet.
- GCC-related news is ingested live from GDELT through `/api/signals`; the company directory is a static reference list, not a live footprint census.
- The in-memory chat rate guard is best-effort per serverless instance, not a shared distributed rate limiter.
- Before broad public launch, add durable rate limiting (for example Upstash), authentication, monitoring, backups, database migrations, and end-to-end/browser tests.
