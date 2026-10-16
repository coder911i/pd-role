# GCC Intel — Intelligence, in orbit

A responsive GCC research workspace built with React, Vite, Three.js, and Vercel serverless APIs. The interface is designed for mobile and desktop, with an animated 3D globe, company discovery, city comparison, saved research, and a Groq-powered analyst.

## Product areas

- **Overview:** dashboard, city comparison preview, and research signals.
- **GCC directory:** searchable company list with city/sector filters and official-source links.
- **City intelligence:** interactive city selection and comparison. Scores are clearly illustrative.
- **Market signals:** sample research prompts and sector themes.
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
| `GROQ_MODEL` | Optional | Defaults to `llama-3.3-70b-versatile` |
| `DATABASE_URL` | For cloud persistence | Neon PostgreSQL connection string |
| `SESSION_SECRET` | For saved-data sessions | Long random secret used to sign the HTTP-only session cookie |

After adding variables, redeploy. Never create a `VITE_GROQ_API_KEY` variable; Vite-exposed values are public.

## API reference

- `GET /api/health` — service and AI configuration status (does not expose secrets).
- `GET /api/directory?q=&city=&sector=` — filter the demo company directory.
- `POST /api/chat` — body: `{ "question": "..." }`; returns a Groq answer when configured.
- `GET /api/session` — creates or reads an anonymous signed session cookie.
- `GET /api/saved` — list saved companies for the current session.
- `POST /api/saved` — body: `{ "id": "...", "name": "...", "city": "...", "sector": "..." }`.
- `DELETE /api/saved` — body: `{ "id": "...", "name": "..." }`.
- `GET /api/reports` — list up to 50 saved research reports.
- `POST /api/reports` — body: `{ "title": "...", "prompt": "...", "body": "...", "model": "..." }`.
- `DELETE /api/reports` — body: `{ "id": "report-uuid" }`.

The saved-company and report endpoints require `DATABASE_URL`; their tables are created lazily. The SQL schema is also available at `api/schema.sql`. The anonymous signed cookie is session separation, **not account authentication**. Add a real identity provider before storing sensitive or tenant-specific data. Configure `SESSION_SECRET` in production.

## Quality and data integrity

GitHub Actions runs `npm install`, `npm run build`, and `npm test` on pushes and pull requests. The test suite currently checks session cookie signing and rejection of malformed signatures. A green CI run is required before calling a change verified; check the Actions tab after a push.

The company list, dashboard KPIs, city scores, momentum markers, and signal summaries are **illustrative prototype data**, not verified live market intelligence. Links point to official company websites/newsrooms for further research. Do not use demo scores as real market facts. For a research-grade product, add sourced records with publisher, publication date, methodology, confidence, and refresh timestamps.

## Current scope and production follow-ups

- Cloud persistence for saved companies and research reports requires a Neon database and environment variables.
- Saved records are isolated by a signed anonymous browser session; there is no user account/login system yet.
- Directory and city intelligence data remain demo data; there is no live external market-data ingestion pipeline yet.
- The in-memory chat rate guard is best-effort per serverless instance, not a shared distributed rate limiter.
- Before broad public launch, add durable rate limiting (for example Upstash), authentication, monitoring, backups, database migrations, and end-to-end/browser tests.
