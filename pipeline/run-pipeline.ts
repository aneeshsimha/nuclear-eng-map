/**
 * Full pipeline orchestrator.
 *
 * Usage:
 *   npx tsx pipeline/run-pipeline.ts
 *   npx tsx pipeline/run-pipeline.ts --category=nuclear
 *   npx tsx pipeline/run-pipeline.ts --skip-discovery   (re-enrich cached candidates only)
 */
import 'dotenv/config';
import { ENERGY_TYPES, type EnergyType } from '../src/types/startup.js';
import { discoverStartupsByCategory } from './lib/exa.js';
import type { RawCandidate } from './lib/exa.js';
import { enrichStartup } from './lib/perplexity.js';
import {
  readCache,
  writeCache,
  readStartupsFile,
  writeStartupsFile,
  getExistingDomains,
} from './lib/storage.js';
import type { EnergyStartup } from '../src/types/startup.js';

const args = process.argv.slice(2);
const categoryArg = args.find((a) => a.startsWith('--category='))?.split('=')[1];
const skipDiscovery = args.includes('--skip-discovery');
const providerArg = (args.find((a) => a.startsWith('--provider='))?.split('=')[1] ?? 'perplexity') as 'exa' | 'perplexity';

const MIN_CONFIDENCE = parseFloat(process.env.PIPELINE_MIN_CONFIDENCE ?? '0.4');
const DELAY_MS = parseInt(process.env.PIPELINE_ENRICHMENT_DELAY_MS ?? '500', 10);
const BATCH_SIZE = 5;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const categories: EnergyType[] = categoryArg
  ? [categoryArg as EnergyType]
  : [...ENERGY_TYPES];

async function runDiscovery(): Promise<RawCandidate[]> {
  const existingCandidates = readCache<RawCandidate[]>('raw-candidates.json') ?? [];
  const existingUrls = new Set(existingCandidates.map((c) => c.website));
  const all: RawCandidate[] = [...existingCandidates];

  for (const category of categories) {
    console.log(`\n📡 Discovering: ${category}`);
    const found = await discoverStartupsByCategory(category);
    const newOnes = found.filter((c) => !existingUrls.has(c.website));
    console.log(`  ${found.length} found, ${newOnes.length} new`);
    for (const c of newOnes) { all.push(c); existingUrls.add(c.website); }
  }

  writeCache('raw-candidates.json', all);
  return all;
}

async function runEnrichment(candidates: RawCandidate[], existingDomains: Set<string>) {
  const toEnrich = candidates.filter((c) => {
    try { return !existingDomains.has(new URL(c.website).hostname.replace(/^www\./, '')); }
    catch { return true; }
  });

  console.log(`\n🔬 Enriching ${toEnrich.length} new candidates via ${providerArg}...`);

  const enriched: EnergyStartup[] = [];
  const reviewQueue: EnergyStartup[] = [];

  for (let i = 0; i < toEnrich.length; i += BATCH_SIZE) {
    const batch = toEnrich.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toEnrich.length / BATCH_SIZE);
    console.log(`\n  Batch ${batchNum}/${totalBatches}`);

    const results = await Promise.allSettled(
      batch.map(async (candidate, idx) => {
        await delay(DELAY_MS * idx);
        console.log(`    → ${candidate.name}`);
        return enrichStartup(candidate);
      }),
    );

    for (const r of results) {
      if (r.status === 'fulfilled') {
        const { startup, confidence } = r.value;
        if (confidence >= MIN_CONFIDENCE) enriched.push(startup);
        else { reviewQueue.push(startup); console.log(`    ⚠ Low conf: ${startup.name}`); }
      } else {
        console.warn(`    ✗`, (r.reason as Error).message);
      }
    }
    if (i + BATCH_SIZE < toEnrich.length) await delay(DELAY_MS);
  }

  writeCache('enriched.json', enriched);
  writeCache('review-queue.json', reviewQueue);
  return { enriched, reviewQueue };
}

async function main() {
  console.log('⚡ Energy Startup Pipeline');
  console.log(`   categories: ${categories.join(', ')}`);
  console.log(`   provider:   ${providerArg}`);
  console.log(`   discovery:  ${skipDiscovery ? 'skipped' : 'enabled'}`);

  let candidates: RawCandidate[];
  if (skipDiscovery) {
    candidates = readCache<RawCandidate[]>('raw-candidates.json') ?? [];
    if (candidates.length === 0) {
      console.error('❌ No cached candidates. Remove --skip-discovery to run discovery first.');
      process.exit(1);
    }
    console.log(`\n📂 Loaded ${candidates.length} cached candidates`);
  } else {
    candidates = await runDiscovery();
  }

  const existingFile = readStartupsFile();
  const existingDomains = getExistingDomains(existingFile.startups);
  console.log(`\n📚 Existing database: ${existingFile.startups.length} startups`);

  const { enriched, reviewQueue } = await runEnrichment(candidates, existingDomains);

  const merged = [...existingFile.startups, ...enriched];
  writeStartupsFile(merged);

  console.log(`\n🎉 Done!`);
  console.log(`   Added: ${enriched.length} new startups`);
  console.log(`   Total: ${merged.length} in database`);
  console.log(`   Review queue: ${reviewQueue.length} low-confidence entries (pipeline/cache/review-queue.json)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
