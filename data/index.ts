import type { Company, EnergyType } from "@/lib/types";
import { NUCLEAR_COMPANIES } from "./nuclear";
import { SOLAR_COMPANIES } from "./solar";
import { WIND_COMPANIES } from "./wind";
import { HYDRO_COMPANIES } from "./hydro";
import { GEOTHERMAL_COMPANIES } from "./geothermal";
import { STORAGE_COMPANIES } from "./storage";
import { HYDROGEN_COMPANIES } from "./hydrogen";

const COMPANIES_BY_ENERGY: Record<EnergyType, Company[]> = {
  nuclear: NUCLEAR_COMPANIES,
  solar: SOLAR_COMPANIES,
  wind: WIND_COMPANIES,
  hydro: HYDRO_COMPANIES,
  geothermal: GEOTHERMAL_COMPANIES,
  storage: STORAGE_COMPANIES,
  hydrogen: HYDROGEN_COMPANIES,
};

export function getCompanies(energyType: EnergyType): Company[] {
  return COMPANIES_BY_ENERGY[energyType];
}

export const ALL_COMPANIES: Company[] = (
  Object.values(COMPANIES_BY_ENERGY) as Company[][]
).flat();
