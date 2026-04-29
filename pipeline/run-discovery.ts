import 'dotenv/config';
import { ENERGY_TYPES, type EnergyType } from '../src/types/startup.js';
import { discoverStartupsByCategory } from './lib/exa.js';
import { readCache, writeCache } from './lib/storage.js';
import type { RawCandidate } from './lib/exa.js';

const args = process.argv.slice(2);
const categoryArg = args.find((a) => a.startsWith('--category='))?.split('=')[1];

const categories: EnergyType[] = categoryArg
  ? [categoryArg as EnergyType]
  : [...ENERGY_TYPES];

async function main() {
  console.log(`🔍 Discovering startups for: ${categories.join(', ')}`);

  const existing = readCache<RawCandidate[]>('raw-candidates.json') ?? [];
  const existingByUrl = new Set(existing.map((c) => c.website));
  const all: RawCandidate[] = [...existing];

  for (const category of categories) {
    console.log(`\n📡 Searching Exa for: ${category}`);
    const found = await discoverStartupsByCategory(category);
    const newOnes = found.filter((c) => !existingByUrl.has(c.website));
    console.log(`  Found ${found.length} total, ${newOnes.length} new`);
    for (const c of newOnes) {
      all.push(c);
      existingByUrl.add(c.website);
    }
  }

  writeCache('raw-candidates.json', all);
  console.log(`\n✅ Total candidates cached: ${all.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
