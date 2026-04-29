import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { EnergyStartup, StartupsDataFile } from '../../src/types/startup.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '../../public/data/startups.json');
const CACHE_DIR = resolve(__dirname, '../cache');

export function readStartupsFile(): StartupsDataFile {
  if (!existsSync(DATA_PATH)) {
    return {
      version: '1',
      generatedAt: new Date().toISOString(),
      pipelineVersion: process.env.PIPELINE_VERSION ?? '1.0.0',
      count: 0,
      startups: [],
    };
  }
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8')) as StartupsDataFile;
}

export function writeStartupsFile(startups: EnergyStartup[]): void {
  const sorted = [...startups].sort((a, b) => a.name.localeCompare(b.name));
  const data: StartupsDataFile = {
    version: '1',
    generatedAt: new Date().toISOString(),
    pipelineVersion: process.env.PIPELINE_VERSION ?? '1.0.0',
    count: sorted.length,
    startups: sorted,
  };
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Wrote ${sorted.length} startups to ${DATA_PATH}`);
}

export function readCache<T>(filename: string): T | null {
  const path = resolve(CACHE_DIR, filename);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
}

export function writeCache<T>(filename: string, data: T): void {
  mkdirSync(CACHE_DIR, { recursive: true });
  const path = resolve(CACHE_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}

export function getExistingDomains(startups: EnergyStartup[]): Set<string> {
  return new Set(
    startups.map((s) => {
      try {
        return new URL(s.website).hostname.replace(/^www\./, '');
      } catch {
        return s.website;
      }
    }),
  );
}
