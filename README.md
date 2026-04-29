# Nuclear Engineering Map

A market map of the companies and labs that make nuclear power — fission and fusion, fuel-cycle, and plant services. Built as an on-ramp for the curious and as an internal tracker for companies worth following. Inspired by [topology.vc/robotics](https://app.topology.vc/robotics).

## Stack

- Next.js 16 (App Router) on Vercel
- TypeScript, Tailwind CSS v4
- shadcn/ui (`new-york`/`base-nova` style on Base UI primitives)
- Inter via `next/font`
- AI agent: AI SDK v6 + Hugging Face Inference Providers (OpenAI-compatible router) + Exa search
- PR opener: `@octokit/rest`

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

## Environment variables

The public map at `/` runs with no env vars. The admin flow at `/admin` requires:

```bash
# Admin sign-in
ADMIN_PASSWORD=             # what you type in the login form
ADMIN_COOKIE_SECRET=        # any 32+ random chars; HMAC key for the auth cookie

# AI research
HF_TOKEN=                   # Hugging Face access token (settings → Access Tokens)
HF_MODEL_ID=meta-llama/Llama-3.3-70B-Instruct   # optional; can pin :nebius / :hyperbolic / etc.
EXA_API_KEY=                # https://exa.ai (1k free searches/mo)

# PR opener
GITHUB_TOKEN=               # fine-grained PAT, contents:write + pull-requests:write on this repo only
GITHUB_OWNER=               # e.g. aneesh
GITHUB_REPO=                # e.g. nuclear-eng-map
GITHUB_BASE_BRANCH=main     # optional, default 'main'
```

Put them in `.env.local` for `npm run dev`, and in Vercel project settings (`vercel env add ...`) for previews/production. `.env*` is gitignored.

## Admin flow

1. `/admin` is gated by a signed cookie. First visit redirects to `/admin/login` — enter the password.
2. The form takes a company name (required), website URL (optional), and freeform notes (optional).
3. The agent uses Exa to search the web, then HF Inference Providers to produce a structured `Company` record (validated against a Zod schema with required source URLs).
4. On success, Octokit opens a PR against `data/companies.ts`. PR body includes the model's reasoning, sources, and a review checklist.
5. Merge the PR → Vercel redeploys → company shows up on `/`.

Jobs only live in the browser session — refreshing the admin page clears the list. The PR itself is the durable record.

## Editing data

Companies live in `data/companies.ts` as a single typed array. Each entry needs a slug, name, URL, logo, bucket, subsector, stage, types, domain, and region; reactor type, funding, and badge are optional.

Filters and category labels are defined in `lib/types.ts` (BUCKETS / STAGES / filter unions). Filter behaviour is a pure predicate in `lib/filter.ts` — non-matching chips render greyed-out rather than being removed (matches the topology pattern and preserves spatial memory).

## Project layout

```
app/page.tsx                       RSC – loads data, renders <MarketMap>
app/layout.tsx                     header, body, fonts, TooltipProvider
components/market-map/
  MarketMap.tsx                    client – holds filter state
  FilterBar.tsx                    chip toggles
  Grid.tsx                         desktop grid (subsector × stage)
  MobileList.tsx                   stacked-list fallback below md
  CompanyChip.tsx                  chip + tooltip
  Legend.tsx                       badge legend
data/companies.ts                  source of truth for v1
lib/types.ts                       Stage, MacroBucket, Company, ActiveFilters …
lib/filter.ts                      pure filter predicate + toggleInList
```

## Deploy

`vercel` will pick this up out of the box (no Vercel-specific config needed). Use a preview deploy for review before promoting to production.
