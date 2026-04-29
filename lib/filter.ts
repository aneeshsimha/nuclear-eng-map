import type { ActiveFilters, Company } from "./types";

export function filterCompany(company: Company, filters: ActiveFilters): boolean {
  if (filters.types.length > 0) {
    const hit = company.types.some((t) => filters.types.includes(t));
    if (!hit) return false;
  }

  if (filters.domains.length > 0 && !filters.domains.includes(company.domain)) {
    return false;
  }

  if (filters.regions.length > 0 && !filters.regions.includes(company.region)) {
    return false;
  }

  if (filters.reactorTypes.length > 0) {
    if (!company.reactorType) return false;
    if (!filters.reactorTypes.includes(company.reactorType)) return false;
  }

  return true;
}

export function hasAnyFilters(filters: ActiveFilters): boolean {
  return (
    filters.types.length > 0 ||
    filters.domains.length > 0 ||
    filters.regions.length > 0 ||
    filters.reactorTypes.length > 0
  );
}

export function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
