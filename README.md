# Energy Map

A market map of the companies and labs that make energy — nuclear, solar, wind, hydro, geothermal, storage, hydrogen — across funding stage and tech maturity. Built as an on-ramp for the curious and as an internal tracker for companies worth following. Inspired by [topology.vc/robotics](https://app.topology.vc/robotics).

(The repo is still named `nuclear-eng-map` — that's where this started, before the scope grew.)

## Stack

- Next.js 16 (App Router) on Vercel
- TypeScript, Tailwind CSS v4
- shadcn/ui (`new-york`/`base-nova` style on Base UI primitives)
- Inter via `next/font`
- AI agent: AI SDK v6 + **Vercel AI Gateway** routing to **Perplexity Sonar Pro** (single grounded call with citations — no separate search tool)
- PR opener: `@octokit/rest`

## Local development

```bash
npm install
npm run dev          # http://localhost:3000  (redirects to /nuclear)
npm run build        # production build
npm run lint
```

## Routes

- `/` redirects to `/nuclear`
- `/nuclear`, `/solar`, `/wind`, `/hydro`, `/geothermal`, `/storage`, `/hydrogen` — per-energy market map (subsector × stage grid + filters)
- `/admin` — gated admin (signed cookie); submit a company name → AI researches → opens a PR adding it to the right `data/<energy>.ts`

## Editing data

Each energy type has its own file: `data/nuclear.ts`, `data/solar.ts`, etc. Each file declares a `<ENERGY>_RAW` array of `Omit<Company, "energyType">[]`, then maps to a typed `<ENERGY>_COMPANIES: Company[]` with `energyType` set automatically. Add or remove entries inside the `_RAW` array.

Subsector taxonomies live in `lib/energy.ts` under `BUCKETS_BY_ENERGY`. Filter unions live in `lib/types.ts`. Filter logic is a pure predicate in `lib/filter.ts` — non-matching chips render greyed-out rather than being removed (matches topology and preserves spatial memory).

## Environment variables

The public maps run with no env vars. The admin flow at `/admin` requires:

```bash
# Admin sign-in
ADMIN_PASSWORD=             # what you type in the login form
ADMIN_COOKIE_SECRET=        # any 32+ random chars; HMAC key for the auth cookie

# AI research (via Vercel AI Gateway)
AI_GATEWAY_API_KEY=         # only needed for local dev — Vercel deployments use OIDC automatically
AI_MODEL_ID=perplexity/sonar-pro   # optional override; any AI Gateway provider/model string

# PR opener
GITHUB_TOKEN=               # fine-grained PAT, contents:write + pull-requests:write on this repo only
GITHUB_OWNER=               # e.g. aneeshsimha
GITHUB_REPO=                # e.g. nuclear-eng-map
GITHUB_BASE_BRANCH=main     # optional, default 'main'
```

Put them in `.env.local` for `npm run dev`, and in Vercel project settings (`vercel env add ...`) for previews/production. `.env*` is gitignored.

## Admin flow

1. `/admin` is gated by a signed cookie. First visit redirects to `/admin/login` — enter the password.
2. The form takes a company name (required), website URL (optional), and freeform notes (optional).
3. The agent calls Perplexity Sonar through the Vercel AI Gateway; Sonar searches the live web and returns a structured `Company` record (validated against a Zod schema with required source URLs).
4. On success, Octokit opens a PR against the right `data/<energy>.ts`. PR body includes the model's reasoning, sources, and a review checklist.
5. Merge the PR → Vercel redeploys → company shows up on the public map.

Jobs only live in the browser session — refreshing the admin page clears the list. The PR itself is the durable record.
