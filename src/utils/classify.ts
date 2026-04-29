import type { DevPhase, EnergyType, FundingStage, MarketSegment } from '../types/startup';

export const ENERGY_TYPE_META: Record<EnergyType, { label: string; color: string; bgColor: string; order: number }> = {
  nuclear:     { label: 'Nuclear',     color: 'text-violet-700', bgColor: 'bg-violet-100',  order: 0 },
  solar:       { label: 'Solar',       color: 'text-yellow-700', bgColor: 'bg-yellow-100',  order: 1 },
  wind:        { label: 'Wind',        color: 'text-sky-700',    bgColor: 'bg-sky-100',     order: 2 },
  hydro:       { label: 'Hydro',       color: 'text-blue-700',   bgColor: 'bg-blue-100',    order: 3 },
  geothermal:  { label: 'Geothermal',  color: 'text-orange-700', bgColor: 'bg-orange-100',  order: 4 },
  hydrogen:    { label: 'Hydrogen',    color: 'text-cyan-700',   bgColor: 'bg-cyan-100',    order: 5 },
  storage:     { label: 'Storage',     color: 'text-green-700',  bgColor: 'bg-green-100',   order: 6 },
  grid:        { label: 'Grid Tech',   color: 'text-indigo-700', bgColor: 'bg-indigo-100',  order: 7 },
  other:       { label: 'Other',       color: 'text-gray-700',   bgColor: 'bg-gray-100',    order: 8 },
};

export const DEV_PHASE_META: Record<DevPhase, { label: string; color: string; bgColor: string; order: number }> = {
  rd_concept:  { label: 'R&D / Concept', color: 'text-purple-700', bgColor: 'bg-purple-100', order: 0 },
  pilot_beta:  { label: 'Pilot / Beta',  color: 'text-blue-700',   bgColor: 'bg-blue-100',   order: 1 },
  commercial:  { label: 'Commercial',    color: 'text-green-700',   bgColor: 'bg-green-100',  order: 2 },
  public_ipo:  { label: 'Public / IPO',  color: 'text-amber-700',  bgColor: 'bg-amber-100',  order: 3 },
};

export const MARKET_SEGMENT_META: Record<MarketSegment, { label: string; color: string; bgColor: string }> = {
  government_defense: { label: 'Government / Defense', color: 'text-red-700',    bgColor: 'bg-red-100'    },
  utility_grid:       { label: 'Utility / Grid',       color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  commercial_b2b:     { label: 'Commercial / B2B',     color: 'text-teal-700',   bgColor: 'bg-teal-100'   },
  consumer:           { label: 'Consumer',              color: 'text-pink-700',   bgColor: 'bg-pink-100'   },
};

export const FUNDING_STAGE_META: Record<FundingStage, { label: string; color: string; bgColor: string; order: number }> = {
  pre_seed:    { label: 'Pre-Seed',  color: 'text-gray-600',   bgColor: 'bg-gray-100',   order: 0 },
  seed:        { label: 'Seed',      color: 'text-lime-700',   bgColor: 'bg-lime-100',   order: 1 },
  series_a:    { label: 'Series A',  color: 'text-cyan-700',   bgColor: 'bg-cyan-100',   order: 2 },
  series_b:    { label: 'Series B',  color: 'text-blue-700',   bgColor: 'bg-blue-100',   order: 3 },
  series_c:    { label: 'Series C',  color: 'text-violet-700', bgColor: 'bg-violet-100', order: 4 },
  series_d_plus: { label: 'Series D+', color: 'text-purple-700', bgColor: 'bg-purple-100', order: 5 },
  ipo_public:  { label: 'IPO / Public', color: 'text-amber-700', bgColor: 'bg-amber-100', order: 6 },
  acquired:    { label: 'Acquired',  color: 'text-orange-700', bgColor: 'bg-orange-100', order: 7 },
  unknown:     { label: 'Unknown',   color: 'text-gray-500',   bgColor: 'bg-gray-50',    order: 8 },
};

export function formatFunding(usd?: number): string {
  if (!usd) return '—';
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(0)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
