# Repository architecture

## Top-level layout

```text
pd-role/
├── api/                     # Vercel serverless API handlers
│   ├── lib/                 # Shared DB and signed-session utilities
│   ├── schema.sql           # PostgreSQL schema
│   └── *.js                 # One handler per API route
├── docs/                    # Product and engineering documentation
├── src/
│   ├── lib/                 # Small, testable frontend utilities
│   ├── App.jsx              # Main dashboard and page composition
│   ├── main.jsx             # React entry point
│   └── styles.css           # Global and component styles
├── tests/                   # Node built-in unit/API tests
├── .github/workflows/ci.yml # Build + test checks on push and PR
├── index.html
├── package.json
└── vite.config.js
```

## Runtime flow

- **UI:** React + Vite renders the dashboard; Three.js powers the decorative globe.
- **News:** the UI calls `GET /api/signals`; the serverless handler queries GDELT and returns publisher-linked results.
- **AI analyst:** the UI posts to `POST /api/chat`; Groq credentials stay on the server.
- **Directory:** `GET /api/directory` returns a reference dataset. It is not a verified census of current GCC offices.
- **Saved research:** `/api/session`, `/api/saved`, and `/api/reports` use a signed anonymous session and optional Neon PostgreSQL persistence.
- **Company logos and links:** `src/lib/companyLinks.js` centralizes logo-domain selection and article-link fallback logic so those behaviours can be unit tested.

## Local checks

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
```

Vercel API routes do not run under plain Vite's dev server. Use `npx vercel dev` when testing the complete API flow locally, with secrets in local environment variables and never committed to Git.

## CI and verification

GitHub Actions runs the production build and Node test suite for pushes to `main`, pull requests, and manual dispatches. Unit tests do not replace browser-level checks of a deployed site; verify live provider behaviour and external logo/news links separately.
