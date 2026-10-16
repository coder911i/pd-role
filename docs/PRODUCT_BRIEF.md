# Product brief — GCC Intel

## One-line thesis
GCC Intel is an evidence-led research workspace that helps strategy and site-selection teams move from fragmented public information to a defensible first-pass shortlist of Indian cities for a Global Capability Centre (GCC).

## Target user and job
**Initial ICP hypothesis:** corporate strategy / location advisory teams at multinationals or consultancies supporting a new or expanding India capability centre.

**Job to be done:** “Help me compare two to four Indian cities with traceable evidence so I can defend a shortlist to finance, talent, real estate and leadership.”

This ICP is a hypothesis; no customer interviews or willingness-to-pay study have been claimed.

## Problem
Research spans company announcements, news, policy documents, annual reports, broker material and consultant reports. Analysts manually reconcile definitions, dates, geography and conflicting claims. A generic AI answer can make this worse if it obscures provenance or uncertainty.

## MVP
- Reference company directory with search and filters.
- Public news signals linked to original publishers.
- City comparison, with media mentions explicitly labelled as media signals—not GCC counts, talent supply or cost benchmarks.
- AI research synthesis via server-side provider integration, where configured.
- Save/revisit research where database persistence is configured.

## Deliberately out of scope
- A definitive census of every GCC or a guaranteed real-time pipeline.
- Salary, office rent, talent supply, or incentive-savings benchmarks without reliable datasets and methodology.
- Provider “performance” ratings inferred from marketing claims.
- Automated location selection or legal/tax advice.

## Value proposition
Reduce the time required for first-pass research while keeping evidence, dates, source type and uncertainty visible. The product supports a decision; it does not make the decision.

## Differentiation hypothesis
A cross-functional city shortlist with traceable source claims and explicit uncertainty is more useful than a generic news feed or ungrounded chatbot. Validate this through observed tasks and comparison against current workflows.

## Monetization hypothesis
Team workspaces, exportable decision briefs, alerts, and higher-confidence curated datasets. Pricing and willingness to pay are unvalidated.

## North-star metric
Active teams that produce and revisit a source-linked shortlist during a defined period.

Supporting metrics: comparison activation, source-open rate, repeat brief creation, citation coverage, freshness, duplicate rate, unsupported-claim rate, and time to a defensible shortlist.

## Validation plan
1. Interview 5–8 target users about the last location-research decision they completed.
2. Observe an actual or reconstructed shortlist task and time the workflow.
3. Test the prototype with a realistic city-comparison brief.
4. Measure whether users open sources, find the evidence credible, and share the result.
5. Test willingness to pay only after identifying a budget owner and recurring trigger.

## Known product constraints
The repository describes a React 18 + Vite frontend, Vercel serverless API routes, GDELT public-news retrieval, Groq chat, a reference directory, and optional Neon PostgreSQL persistence with signed anonymous sessions. The directory is not a verified census. The news feed depends on external provider coverage and availability. Anonymous sessions are not account authentication.

## Disclaimer
Independent assignment project. Not affiliated with or endorsed by Flexiple or Swiggy.
