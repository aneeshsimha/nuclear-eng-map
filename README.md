# Nuclear Engineering Map

A market map of the companies and labs that make nuclear power — fission and fusion, fuel-cycle, and plant services. Built as an on-ramp for the curious and as an internal tracker for companies worth following. Inspired by [topology.vc/robotics](https://app.topology.vc/robotics).

## Stack

- Next.js 16 (App Router) on Vercel
- TypeScript, Tailwind CSS v4
- shadcn/ui (`new-york`/`base-nova` style on Base UI primitives)
- Inter via `next/font`

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

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
