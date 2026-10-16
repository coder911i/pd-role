# GCC Intel — Intelligence, in orbit

A premium dark-mode prototype for a GCC (Global Capability Centre) intelligence platform, built with React, Vite, Three.js, and Lucide.

## Included
- Animated Three.js 3D globe with network nodes and arcs
- Responsive, Apple-inspired typography and dark glass UI
- Overview dashboard with illustrative KPI cards and city comparison
- Searchable/filterable company directory with official-source links
- Interactive city intelligence comparison
- Saved company state for the current browser session
- AI analyst chat prototype with local demo responses
- Mobile layout and reduced-motion styling

## Run locally
```bash
npm install
npm run dev
```

Production build: `npm run build`

## Deploy to Vercel
Import this repository into Vercel. Select the **Vite** framework preset. Build command: `npm run build`; output directory: `dist`. No environment variables are required for the visual prototype.

## Connect Groq safely
The analyst chat is wired to `/api/chat`, a Vercel serverless endpoint in `api/chat.js`. If the server key is missing, the UI falls back to a clearly labelled local demo answer.

To enable live Groq responses:
1. In Vercel, open **Project → Settings → Environment Variables**.
2. Add `GROQ_API_KEY` with your secret value. Keep it server-side; never add a `VITE_GROQ_API_KEY` variable.
3. Optionally add `GROQ_MODEL` (defaults to `llama-3.3-70b-versatile`).
4. Redeploy the project so the function receives the environment variables.

The endpoint includes request validation, an explicit research system prompt, a response-token cap, timeout handling, and server-side error logging. Add rate limiting before exposing the app broadly. You do not need to send the API key in chat; set it directly in Vercel's environment settings.

## Data integrity
This is a UI prototype. KPI figures, city scores, indices, and momentum labels are illustrative placeholders and **must not be presented as verified market data**. Company entries link to official company sites/newsrooms as starting points; verify current India footprint, hiring, and role details from primary sources before using them for a decision. For a research-grade assignment, replace demo values with sourced data and show source, publication date, methodology, and confidence for each signal.

## Stack
- React 18
- Vite 6
- Three.js
- Lucide React
- Vanilla CSS