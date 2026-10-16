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
The AI analyst is local/demo-only right now. **Do not put a Groq API key in frontend code or a Vite `VITE_*` variable** because browser bundles expose those values.

Recommended next step:
1. Add a server-side API route (for example, a Vercel serverless function).
2. Store `GROQ_API_KEY` as a server-side environment variable in Vercel.
3. Call Groq from that server route and return the assistant response to React.
4. Add rate limiting, request-size limits, error handling, and a safe system prompt.
5. Replace the local `ask()` demo handler in `src/App.jsx` with a fetch to the server route.

When sharing API details, send only the model name and desired endpoint behavior. Never paste a live secret into a public repository or frontend file.

## Data integrity
This is a UI prototype. KPI figures, city scores, indices, and momentum labels are illustrative placeholders and **must not be presented as verified market data**. Company entries link to official company sites/newsrooms as starting points; verify current India footprint, hiring, and role details from primary sources before using them for a decision. For a research-grade assignment, replace demo values with sourced data and show source, publication date, methodology, and confidence for each signal.

## Stack
- React 18
- Vite 6
- Three.js
- Lucide React
- Vanilla CSS