import type { ActiveFilters, Company } from "./types";

export function filterCompany(company: Company, filters: ActiveFilters): boolean {
  if (filters.types.length > 0) {
    const hit = company.types.some((t) => filters.types.includes(t));
    if (!hit) return false;
  }

  if (filters.domains.length > 0) {
    if (!company.domain || !filters.domains.includes(company.domain)) return false;
  }

  if (filters.regions.length > 0 && !filters.regions.includes(company.region)) {
    return false;
  }

  if (filters.reactorTypes.length > 0) {
    if (!company.reactorType) return false;
    if (!filters.reactorTypes.includes(company.reactorType)) return false;
  }

  if (filters.maturities.length > 0) {
    if (!company.maturity) return false;
    if (!filters.maturities.includes(company.maturity)) return false;
  }

  if (filters.customers.length > 0) {
    if (!company.customer) return false;
    if (!filters.customers.includes(company.customer)) return false;
  }

  return true;
}

export function hasAnyFilters(filters: ActiveFilters): boolean {
  return (
    filters.types.length > 0 ||
    filters.domains.length > 0 ||
    filters.regions.length > 0 ||
    filters.reactorTypes.length > 0 ||
    filters.maturities.length > 0 ||
    filters.customers.length > 0
  );
}

export function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
