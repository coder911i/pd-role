# Production readiness checklist

Use this checklist before sharing GCC Intel with reviewers or real users. A successful build is necessary, but does not by itself establish production readiness.

## Deployment and configuration

- [ ] Confirm the latest Vercel deployment is **Ready** and serves the intended Git commit.
- [ ] Set `GROQ_API_KEY` only in server-side Vercel environment variables.
- [ ] Confirm `GROQ_MODEL` is supported by the active Groq account; leave unset to use the current API default if appropriate.
- [ ] Configure `DATABASE_URL_POOLED` and `SESSION_SECRET` if saved data is part of the demo.
- [ ] Redeploy after environment-variable changes.
- [ ] Verify `GET /api/health` does not expose secrets.

## Core user journeys

- [ ] Directory loads; search and city/sector filters work together.
- [ ] Company names, source links, and logo fallbacks work when an image provider fails.
- [ ] News feed handles empty results, provider errors, and slow responses.
- [ ] Every article link opens the intended source in a new tab.
- [ ] City comparison clearly labels article mentions as media signals, not market-size facts.
- [ ] AI analyst handles missing configuration, provider errors, empty prompts, and long responses.
- [ ] Save/remove a company and refresh; verify expected persistence.
- [ ] Save/open/delete a research report if database persistence is enabled.
- [ ] Test responsive layouts at mobile, tablet, and desktop widths.
- [ ] Test keyboard navigation, focus visibility, accessible names, and reduced-motion settings.

## Security and reliability

- [ ] Never commit API keys, database URLs, or session secrets.
- [ ] Confirm serverless routes validate input and return safe error messages.
- [ ] Review anonymous session behavior; do not treat it as user authentication.
- [ ] Replace per-instance in-memory rate limiting with a durable shared limiter before public scale.
- [ ] Add production error monitoring and alerts.
- [ ] Establish database backups, retention, and recovery procedures where persistence is enabled.
- [ ] Review third-party provider terms, quotas, and failure modes.
- [ ] Run dependency/security checks and review lockfile changes.

## Release gate

- [ ] `npm run build` passes.
- [ ] `npm test` passes.
- [ ] GitHub Actions is green for the exact release commit.
- [ ] Live smoke tests pass against the production deployment.
- [ ] Known limitations and unverified metrics are documented.
- [ ] Reviewer-facing README and screenshots accurately represent the shipped product.

**Release rule:** Do not describe the app as production-ready until the relevant checks above have been completed and evidenced.
