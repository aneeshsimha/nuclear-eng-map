import Exa from 'exa-js';
import type { EnergyType } from '../../src/types/startup.js';
import {
  buildDiscoveryQueries,
  DISCOVERY_EXCLUDE_DOMAINS,
  DISCOVERY_INCLUDE_DOMAINS,
} from '../prompts/discovery.js';

export interface RawCandidate {
  name: string;
  website: string;
  snippet: string;
  sourceUrl: string;
  retrievedAt: string;
  category: EnergyType;
}

let _exa: Exa | null = null;
function getExa(): Exa {
  if (!_exa) {
    const key = process.env.EXA_API_KEY;
    if (!key) throw new Error('EXA_API_KEY is not set');
    _exa = new Exa(key);
  }
  return _exa;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function extractCompanyName(title: string, url: string): string {
  const cleaned = title
    .replace(/\s*[-|–—]\s*.+$/, '')
    .replace(/\s*(Inc|LLC|Ltd|Corp|Co|GmbH|SAS|AB|AG)\.?$/i, '')
    .trim();
  if (cleaned.length > 2 && cleaned.length < 60) return cleaned;
  return extractDomain(url);
}

function deduplicateByDomain(candidates: RawCandidate[]): RawCandidate[] {
  const seen = new Set<string>();
  return candidates.filter((c) => {
    const domain = extractDomain(c.website);
    if (seen.has(domain)) return false;
    seen.add(domain);
    return true;
  });
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function discoverStartupsByCategory(
  category: EnergyType,
  maxResults = 25,
): Promise<RawCandidate[]> {
  const exa = getExa();
  const queries = buildDiscoveryQueries(category);
  const results: RawCandidate[] = [];
  const delayMs = 200;

  for (const query of queries) {
    try {
      const response = await exa.searchAndContents(query, {
        type: 'neural',
        numResults: maxResults,
        includeDomains: DISCOVERY_INCLUDE_DOMAINS,
        excludeDomains: DISCOVERY_EXCLUDE_DOMAINS,
        useAutoprompt: true,
        text: { maxCharacters: 800 },
      });

      for (const r of response.results) {
        if (!r.url) continue;
        results.push({
          name: extractCompanyName(r.title ?? '', r.url),
          website: r.url,
          snippet: r.text ?? '',
          sourceUrl: r.url,
          retrievedAt: new Date().toISOString(),
          category,
        });
      }
    } catch (err) {
      console.warn(`⚠ Exa query failed for "${query}":`, (err as Error).message);
    }
    await delay(delayMs);
  }

  return deduplicateByDomain(results);
}
