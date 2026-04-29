import type { EnergyStartup, SourceRecord } from '../../src/types/startup.js';
import type { RawCandidate } from './exa.js';
import { buildSystemPrompt, buildUserPrompt } from '../prompts/enrichment.js';

const PERPLEXITY_BASE = 'https://api.perplexity.ai';

interface PerplexityResponse {
  choices: Array<{
    message: { content: string };
  }>;
}

interface RawClassification {
  name?: string;
  website?: string;
  energyTypes?: unknown[];
  devPhase?: string;
  marketSegments?: unknown[];
  fundingStage?: string;
  description?: string;
  keyTechnology?: string;
  country?: string;
  city?: string;
  totalFundingUsd?: number;
  latestRoundUsd?: number;
  latestRoundDate?: string;
  investors?: string[];
  founded?: number;
  employees?: string;
  linkedinUrl?: string;
  crunchbaseUrl?: string;
  confidence?: number;
}

export interface EnrichmentResult {
  startup: EnergyStartup;
  confidence: number;
}

function getPerplexityKey(): string {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) throw new Error('PERPLEXITY_API_KEY is not set');
  return key;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function coerceStringArray<T extends string>(val: unknown, allowed: T[]): T[] {
  if (!Array.isArray(val)) return [];
  return val.filter((v): v is T => typeof v === 'string' && allowed.includes(v as T));
}

const VALID_ENERGY_TYPES = ['nuclear','solar','wind','hydro','geothermal','hydrogen','storage','grid','other'] as const;
const VALID_DEV_PHASES = ['rd_concept','pilot_beta','commercial','public_ipo'] as const;
const VALID_MARKET_SEGS = ['government_defense','utility_grid','commercial_b2b','consumer'] as const;
const VALID_FUNDING = ['pre_seed','seed','series_a','series_b','series_c','series_d_plus','ipo_public','acquired','unknown'] as const;

function normalizeToStartup(raw: RawClassification, candidate: RawCandidate): EnergyStartup {
  const source: SourceRecord = {
    provider: 'perplexity',
    url: candidate.sourceUrl,
    retrievedAt: new Date().toISOString(),
    snippet: candidate.snippet.slice(0, 300),
  };

  const energyTypes = coerceStringArray(raw.energyTypes, [...VALID_ENERGY_TYPES]);
  const devPhase = VALID_DEV_PHASES.includes(raw.devPhase as typeof VALID_DEV_PHASES[number])
    ? (raw.devPhase as typeof VALID_DEV_PHASES[number])
    : 'rd_concept';
  const marketSegments = coerceStringArray(raw.marketSegments, [...VALID_MARKET_SEGS]);
  const fundingStage = VALID_FUNDING.includes(raw.fundingStage as typeof VALID_FUNDING[number])
    ? (raw.fundingStage as typeof VALID_FUNDING[number])
    : 'unknown';

  return {
    id: slugify(raw.name ?? candidate.name),
    name: raw.name ?? candidate.name,
    website: raw.website ?? candidate.website,
    energyTypes: energyTypes.length > 0 ? energyTypes : [candidate.category],
    devPhase,
    marketSegments: marketSegments.length > 0 ? marketSegments : ['utility_grid'],
    fundingStage,
    description: raw.description ?? candidate.snippet.slice(0, 300),
    keyTechnology: raw.keyTechnology ?? undefined,
    country: raw.country ?? 'US',
    city: raw.city ?? undefined,
    totalFundingUsd: raw.totalFundingUsd ?? undefined,
    latestRoundUsd: raw.latestRoundUsd ?? undefined,
    latestRoundDate: raw.latestRoundDate ?? undefined,
    investors: raw.investors ?? undefined,
    founded: raw.founded ?? undefined,
    employees: raw.employees ?? undefined,
    linkedinUrl: raw.linkedinUrl ?? undefined,
    crunchbaseUrl: raw.crunchbaseUrl ?? undefined,
    sources: [source],
    classificationConfidence: raw.confidence ?? 0.5,
    lastUpdated: new Date().toISOString(),
    pipelineVersion: process.env.PIPELINE_VERSION ?? '1.0.0',
  };
}

export async function enrichStartup(candidate: RawCandidate): Promise<EnrichmentResult> {
  const model = process.env.PERPLEXITY_MODEL ?? 'sonar-pro';
  const apiKey = getPerplexityKey();

  const response = await fetch(`${PERPLEXITY_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(candidate) },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error ${response.status}: ${await response.text()}`);
  }

  const data = (await response.json()) as PerplexityResponse;
  const content = data.choices[0]?.message?.content ?? '{}';
  const raw = JSON.parse(content) as RawClassification;
  const startup = normalizeToStartup(raw, candidate);

  return { startup, confidence: startup.classificationConfidence };
}
