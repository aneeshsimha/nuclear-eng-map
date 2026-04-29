export const ENERGY_TYPES = [
  'nuclear',
  'solar',
  'wind',
  'hydro',
  'geothermal',
  'hydrogen',
  'storage',
  'grid',
  'other',
] as const;
export type EnergyType = typeof ENERGY_TYPES[number];

export const DEV_PHASES = [
  'rd_concept',
  'pilot_beta',
  'commercial',
  'public_ipo',
] as const;
export type DevPhase = typeof DEV_PHASES[number];

export const MARKET_SEGMENTS = [
  'government_defense',
  'utility_grid',
  'commercial_b2b',
  'consumer',
] as const;
export type MarketSegment = typeof MARKET_SEGMENTS[number];

export const FUNDING_STAGES = [
  'pre_seed',
  'seed',
  'series_a',
  'series_b',
  'series_c',
  'series_d_plus',
  'ipo_public',
  'acquired',
  'unknown',
] as const;
export type FundingStage = typeof FUNDING_STAGES[number];

export const VIEW_MODES = ['card', 'matrix', 'table'] as const;
export type ViewMode = typeof VIEW_MODES[number];

export interface SourceRecord {
  provider: 'exa' | 'perplexity' | 'manual';
  url: string;
  retrievedAt: string;
  snippet?: string;
}

export interface EnergyStartup {
  id: string;
  name: string;
  website: string;
  logoUrl?: string;
  energyTypes: EnergyType[];
  devPhase: DevPhase;
  marketSegments: MarketSegment[];
  fundingStage: FundingStage;
  description: string;
  keyTechnology?: string;
  country: string;
  city?: string;
  totalFundingUsd?: number;
  latestRoundUsd?: number;
  latestRoundDate?: string;
  investors?: string[];
  founded?: number;
  employees?: string;
  linkedinUrl?: string;
  crunchbaseUrl?: string;
  sources: SourceRecord[];
  classificationConfidence: number;
  lastUpdated: string;
  pipelineVersion: string;
}

export interface StartupsDataFile {
  version: string;
  generatedAt: string;
  pipelineVersion: string;
  count: number;
  startups: EnergyStartup[];
}

export interface FilterState {
  energyTypes: EnergyType[];
  devPhases: DevPhase[];
  marketSegments: MarketSegment[];
  fundingStages: FundingStage[];
  countries: string[];
  searchQuery: string;
}

export const EMPTY_FILTERS: FilterState = {
  energyTypes: [],
  devPhases: [],
  marketSegments: [],
  fundingStages: [],
  countries: [],
  searchQuery: '',
};
