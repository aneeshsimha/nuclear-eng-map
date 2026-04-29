export type Stage = "non-commercial" | "early" | "late";

export type EnergyType =
  | "nuclear"
  | "solar"
  | "wind"
  | "hydro"
  | "geothermal"
  | "storage"
  | "hydrogen";

export type Maturity =
  | "rnd"
  | "pilot"
  | "first-commercial"
  | "mass-deployed";

export type Customer =
  | "government"
  | "utility"
  | "industrial"
  | "consumer";

// nuclear-specific. left here for typing, but only meaningful for energyType === 'nuclear'.
export type Domain = "fission" | "fusion";

export type CompanyType =
  | "private"
  | "public"
  | "big-tech"
  | "china"
  | "academic-oss"
  | "declining";

export type Region =
  | "us"
  | "canada"
  | "uk"
  | "eu"
  | "china"
  | "russia"
  | "japan"
  | "other";

// nuclear-specific.
export type ReactorType =
  | "lwr"
  | "htgr"
  | "sfr"
  | "msr"
  | "smr"
  | "micro"
  | "fusion"
  | "other";

export interface Funding {
  amount?: string;
  round?: string;
  lead?: string;
}

export interface Company {
  slug: string;
  name: string;
  url: string;
  logoUrl: string;
  energyType: EnergyType;
  bucket: string;
  subsector: string;
  stage: Stage;
  types: CompanyType[];
  region: Region;
  description: string;
  // optional / context-dependent
  domain?: Domain;
  reactorType?: ReactorType;
  maturity?: Maturity;
  customer?: Customer;
  funding?: Funding;
  badge?: string;
}

export interface BucketDef {
  id: string;
  label: string;
  blurb: string;
  subsectors: string[];
}

export interface ActiveFilters {
  types: CompanyType[];
  domains: Domain[];
  regions: Region[];
  reactorTypes: ReactorType[];
  maturities: Maturity[];
  customers: Customer[];
}

export const EMPTY_FILTERS: ActiveFilters = {
  types: [],
  domains: [],
  regions: [],
  reactorTypes: [],
  maturities: [],
  customers: [],
};
