import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  DevPhase,
  EnergyStartup,
  EnergyType,
  FilterState,
  FundingStage,
  MarketSegment,
} from '../../types/startup';
import { EMPTY_FILTERS } from '../../types/startup';

const PARAM = {
  energyTypes: 'et',
  devPhases: 'dp',
  marketSegments: 'ms',
  fundingStages: 'fs',
  countries: 'co',
  searchQuery: 'q',
} as const;

function parseArray<T extends string>(value: string | null): T[] {
  if (!value) return [];
  return value.split(',').filter(Boolean) as T[];
}

export function useFilters(startups: EnergyStartup[]) {
  const [params, setParams] = useSearchParams();

  const filters: FilterState = useMemo(
    () => ({
      energyTypes: parseArray<EnergyType>(params.get(PARAM.energyTypes)),
      devPhases: parseArray<DevPhase>(params.get(PARAM.devPhases)),
      marketSegments: parseArray<MarketSegment>(params.get(PARAM.marketSegments)),
      fundingStages: parseArray<FundingStage>(params.get(PARAM.fundingStages)),
      countries: parseArray<string>(params.get(PARAM.countries)),
      searchQuery: params.get(PARAM.searchQuery) ?? '',
    }),
    [params],
  );

  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        const paramKey = PARAM[key];
        if (Array.isArray(value)) {
          if (value.length === 0) next.delete(paramKey);
          else next.set(paramKey, (value as string[]).join(','));
        } else {
          const strVal = value as string;
          if (strVal === '') next.delete(paramKey);
          else next.set(paramKey, strVal);
        }
        return next;
      }, { replace: true });
    },
    [setParams],
  );

  const toggleArrayFilter = useCallback(
    <T extends string>(key: keyof FilterState, item: T) => {
      const current = filters[key] as T[];
      const next = current.includes(item)
        ? current.filter((v) => v !== item)
        : [...current, item];
      setFilter(key, next as FilterState[typeof key]);
    },
    [filters, setFilter],
  );

  const clearFilters = useCallback(() => {
    setParams({}, { replace: true });
  }, [setParams]);

  const hasActiveFilters = useMemo(
    () =>
      filters.energyTypes.length > 0 ||
      filters.devPhases.length > 0 ||
      filters.marketSegments.length > 0 ||
      filters.fundingStages.length > 0 ||
      filters.countries.length > 0 ||
      filters.searchQuery !== '',
    [filters],
  );

  const filteredStartups = useMemo(() => {
    return startups.filter((s) => {
      if (
        filters.energyTypes.length > 0 &&
        !filters.energyTypes.some((t) => s.energyTypes.includes(t))
      )
        return false;
      if (filters.devPhases.length > 0 && !filters.devPhases.includes(s.devPhase))
        return false;
      if (
        filters.marketSegments.length > 0 &&
        !filters.marketSegments.some((m) => s.marketSegments.includes(m))
      )
        return false;
      if (filters.fundingStages.length > 0 && !filters.fundingStages.includes(s.fundingStage))
        return false;
      if (filters.countries.length > 0 && !filters.countries.includes(s.country))
        return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.description.toLowerCase().includes(q) &&
          !(s.keyTechnology ?? '').toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [startups, filters]);

  const availableCountries = useMemo(
    () => [...new Set(startups.map((s) => s.country))].sort(),
    [startups],
  );

  return {
    filters,
    setFilter,
    toggleArrayFilter,
    clearFilters,
    hasActiveFilters,
    filteredStartups,
    availableCountries,
    EMPTY_FILTERS,
  };
}
