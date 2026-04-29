export type Stage = "non-commercial" | "early" | "late";

export type MacroBucket = "reactor" | "fuel" | "plant";

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
  bucket: MacroBucket;
  subsector: string;
  stage: Stage;
  types: CompanyType[];
  domain: Domain;
  region: Region;
  reactorType?: ReactorType;
  funding?: Funding;
  badge?: string;
  description: string;
}

export interface BucketDef {
  id: MacroBucket;
  label: string;
  blurb: string;
  subsectors: string[];
}

export const BUCKETS: BucketDef[] = [
  {
    id: "reactor",
    label: "The Reactor",
    blurb: "The technology that makes the power.",
    subsectors: [
      "Fission — Large (Gen III+ / Gen IV)",
      "Fission — SMR",
      "Fission — Microreactor",
      "Fusion — Magnetic confinement",
      "Fusion — Inertial / alternative",
    ],
  },
  {
    id: "fuel",
    label: "The Fuel",
    blurb: "What feeds the reactor.",
    subsectors: [
      "Mining & Conversion",
      "Enrichment",
      "Fabrication (HALEU, TRISO, MOX)",
      "Recycling & Waste",
    ],
  },
  {
    id: "plant",
    label: "The Plant",
    blurb: "What makes it operate.",
    subsectors: [
      "Materials & Components",
      "Instrumentation & Robotics",
      "Simulation & Digital",
      "Services & EPC",
    ],
  },
];

export const STAGES: { id: Stage; label: string; tagline: string }[] = [
  {
    id: "non-commercial",
    label: "Non-Commercial",
    tagline: "national labs · academic · open source · big-co R&D",
  },
  {
    id: "early",
    label: "Early Stage",
    tagline: "seed through Series B · roughly < $100M raised",
  },
  {
    id: "late",
    label: "Late Stage",
    tagline: "Series C+ · public · mature incumbents",
  },
];

export interface ActiveFilters {
  types: CompanyType[];
  domains: Domain[];
  regions: Region[];
  reactorTypes: ReactorType[];
}

export const EMPTY_FILTERS: ActiveFilters = {
  types: [],
  domains: [],
  regions: [],
  reactorTypes: [],
};
