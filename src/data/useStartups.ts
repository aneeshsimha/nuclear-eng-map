import { useEffect, useState } from 'react';
import type { EnergyStartup, StartupsDataFile } from '../types/startup';

interface UseStartupsResult {
  startups: EnergyStartup[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  count: number;
}

export function useStartups(): UseStartupsResult {
  const [startups, setStartups] = useState<EnergyStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/startups.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load startups data: ${r.status}`);
        return r.json() as Promise<StartupsDataFile>;
      })
      .then((data) => {
        setStartups(data.startups);
        setLastUpdated(data.generatedAt);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { startups, loading, error, lastUpdated, count: startups.length };
}
