import type { EnergyType } from '../../src/types/startup.js';
import type { RawCandidate } from '../lib/exa.js';

export function buildSystemPrompt(): string {
  return `You are an expert analyst of the global energy technology startup ecosystem.
Given information about an energy startup, return ONLY a JSON object classifying it
according to the exact schema below. Be conservative — if unsure, use null rather than guessing.
Set "confidence" between 0.0 (very uncertain) and 1.0 (highly certain).

Required JSON keys (do not add extras):
{
  "name": string,
  "website": string,
  "energyTypes": array of one or more from: ["nuclear","solar","wind","hydro","geothermal","hydrogen","storage","grid","other"],
  "devPhase": one of: "rd_concept" | "pilot_beta" | "commercial" | "public_ipo",
  "marketSegments": array of one or more from: ["government_defense","utility_grid","commercial_b2b","consumer"],
  "fundingStage": one of: "pre_seed" | "seed" | "series_a" | "series_b" | "series_c" | "series_d_plus" | "ipo_public" | "acquired" | "unknown",
  "description": "1-3 sentence summary",
  "keyTechnology": string or null,
  "country": "ISO alpha-2 country code or null",
  "city": string or null,
  "totalFundingUsd": number or null,
  "latestRoundUsd": number or null,
  "latestRoundDate": "YYYY-MM-DD" or null,
  "investors": array of strings (notable investors only),
  "founded": integer year or null,
  "employees": one of: "1-10" | "11-50" | "51-200" | "201-500" | "500+" | null,
  "linkedinUrl": string or null,
  "crunchbaseUrl": string or null,
  "confidence": number between 0.0 and 1.0
}

devPhase guide:
- rd_concept: still in research, pre-prototype, or early concept phase
- pilot_beta: has a working prototype, pilot deployment, or demo plant
- commercial: generating revenue from deployed products/services
- public_ipo: publicly traded company

Return ONLY the JSON object. No markdown, no explanation.`;
}

export function buildUserPrompt(candidate: RawCandidate): string {
  return `Classify this energy company:
Company name: ${candidate.name}
Website: ${candidate.website}
Hint category: ${candidate.category as EnergyType}
Context snippet: ${candidate.snippet.slice(0, 1200)}

Return JSON only.`;
}
