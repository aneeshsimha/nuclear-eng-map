import 'dotenv/config';
import type { RawCandidate } from './lib/exa.js';
import { enrichStartup } from './lib/perplexity.js';
import { readCache, writeCache, readStartupsFile, getExistingDomains } from './lib/storage.js';
import type { EnergyStartup } from '../src/types/startup.js';

const MIN_CONFIDENCE = parseFloat(process.env.PIPELINE_MIN_CONFIDENCE ?? '0.4');
const DELAY_MS = parseInt(process.env.PIPELINE_ENRICHMENT_DELAY_MS ?? '500', 10);
const BATCH_SIZE = 5;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const candidates = readCache<RawCandidate[]>('raw-candidates.json');
  if (!candidates || candidates.length === 0) {
    console.error('❌ No candidates found. Run run-discovery.ts first.');
    process.exit(1);
  }

  const existingFile = readStartupsFile();
  const existingDomains = getExistingDomains(existingFile.startups);

  const toEnrich = candidates.filter((c) => {
    try {
      const domain = new URL(c.website).hostname.replace(/^www\./, '');
      return !existingDomains.has(domain);
    } catch {
      return true;
    }
  });

  console.log(`📋 ${candidates.length} candidates total, ${toEnrich.length} new to enrich`);

  const enriched: EnergyStartup[] = [];
  const reviewQueue: EnergyStartup[] = [];

  for (let i = 0; i < toEnrich.length; i += BATCH_SIZE) {
    const batch = toEnrich.slice(i, i + BATCH_SIZE);
    console.log(`\n🔬 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(toEnrich.length / BATCH_SIZE)}`);

    const results = await Promise.allSettled(
      batch.map(async (candidate) => {
        await delay(DELAY_MS * (batch.indexOf(candidate)));
        console.log(`  → ${candidate.name}`);
        return enrichStartup(candidate);
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { startup, confidence } = result.value;
        if (confidence >= MIN_CONFIDENCE) {
          enriched.push(startup);
        } else {
          reviewQueue.push(startup);
          console.log(`  ⚠ Low confidence (${confidence.toFixed(2)}): ${startup.name}`);
        }
      } else {
        console.warn(`  ✗ Failed:`, result.reason);
      }
    }

    if (i + BATCH_SIZE < toEnrich.length) {
      await delay(DELAY_MS);
    }
  }

  writeCache('enriched.json', enriched);
  writeCache('review-queue.json', reviewQueue);

  console.log(`\n✅ Enriched: ${enriched.length} startups`);
  console.log(`⚠  Review queue: ${reviewQueue.length} low-confidence entries`);
}

main().catch((e) => { console.error(e); process.exit(1); });
