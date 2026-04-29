import type { BucketDef, Customer, EnergyType, Maturity, Stage } from "./types";

export interface EnergyMeta {
  id: EnergyType;
  label: string;
  blurb: string;
  // tailwind hue used for the maturity dot baseline / very subtle accents.
  accent: string;
}

export const ENERGY_TYPES: EnergyType[] = [
  "nuclear",
  "solar",
  "wind",
  "hydro",
  "geothermal",
  "storage",
  "hydrogen",
];

export const ENERGY_META: Record<EnergyType, EnergyMeta> = {
  nuclear: {
    id: "nuclear",
    label: "Nuclear",
    blurb: "Fission and fusion reactors, fuel cycle, plant operations.",
    accent: "amber",
  },
  solar: {
    id: "solar",
    label: "Solar",
    blurb: "Cells, modules, balance of system, deployment.",
    accent: "yellow",
  },
  wind: {
    id: "wind",
    label: "Wind",
    blurb: "Onshore, offshore, components, operations.",
    accent: "sky",
  },
  hydro: {
    id: "hydro",
    label: "Hydro",
    blurb: "Generation, components, pumped storage.",
    accent: "blue",
  },
  geothermal: {
    id: "geothermal",
    label: "Geothermal",
    blurb: "Drilling, EGS, surface power, direct heat.",
    accent: "orange",
  },
  storage: {
    id: "storage",
    label: "Storage",
    blurb: "Cells, BESS, long-duration storage.",
    accent: "violet",
  },
  hydrogen: {
    id: "hydrogen",
    label: "Hydrogen",
    blurb: "Production, distribution, end-use.",
    accent: "teal",
  },
};

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

const NUCLEAR_BUCKETS: BucketDef[] = [
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

const SOLAR_BUCKETS: BucketDef[] = [
  {
    id: "cells",
    label: "Cells & Modules",
    blurb: "What turns photons into electrons.",
    subsectors: [
      "Silicon PV",
      "Perovskite / Tandem",
      "Thin-film",
      "Concentrator / CPV",
    ],
  },
  {
    id: "bos",
    label: "Balance of System",
    blurb: "Everything else in the array.",
    subsectors: [
      "Inverters & Power Electronics",
      "Mounting & Tracking",
      "Software & Monitoring",
    ],
  },
  {
    id: "project",
    label: "Project & Deployment",
    blurb: "Who builds and finances installations.",
    subsectors: [
      "Utility-scale developers",
      "C&I rooftop",
      "Residential",
      "Community / DG",
    ],
  },
];

const WIND_BUCKETS: BucketDef[] = [
  {
    id: "turbines",
    label: "Turbines",
    blurb: "The whole machine.",
    subsectors: [
      "Onshore",
      "Offshore Fixed",
      "Offshore Floating",
      "Vertical-axis / alternative",
    ],
  },
  {
    id: "components",
    label: "Components",
    blurb: "Sub-assemblies and materials.",
    subsectors: [
      "Blades & Materials",
      "Drivetrains & Generators",
      "Towers & Foundations",
    ],
  },
  {
    id: "project",
    label: "Project & O&M",
    blurb: "Build, operate, maintain.",
    subsectors: [
      "Developers",
      "Operations & Maintenance",
      "Inspection & Robotics",
    ],
  },
];

const HYDRO_BUCKETS: BucketDef[] = [
  {
    id: "generation",
    label: "Generation",
    blurb: "Where the water meets the turbine.",
    subsectors: [
      "Large hydro",
      "Small hydro / Run-of-river",
      "Pumped storage",
      "Marine / Tidal / Wave",
    ],
  },
  {
    id: "components",
    label: "Components & Services",
    blurb: "Hardware and operations.",
    subsectors: [
      "Turbines & Generators",
      "Operations & Maintenance",
      "Refurbishment & Lifetime extension",
    ],
  },
];

const GEOTHERMAL_BUCKETS: BucketDef[] = [
  {
    id: "subsurface",
    label: "Subsurface",
    blurb: "Drilling, exploration, the rock.",
    subsectors: [
      "Drilling & Exploration",
      "Enhanced Geothermal (EGS)",
      "Closed-loop / Advanced",
    ],
  },
  {
    id: "surface",
    label: "Surface",
    blurb: "Above-ground systems.",
    subsectors: [
      "Power generation (binary, flash)",
      "Direct use / District heat",
      "Heat pumps",
    ],
  },
];

const STORAGE_BUCKETS: BucketDef[] = [
  {
    id: "cells",
    label: "Cells & Chemistry",
    blurb: "The fundamental building block.",
    subsectors: [
      "Li-ion",
      "Sodium-ion",
      "Flow batteries",
      "Solid-state",
      "Other chemistries",
    ],
  },
  {
    id: "systems",
    label: "Systems",
    blurb: "Packaging and integration.",
    subsectors: [
      "BESS / Front-of-meter",
      "Behind-the-meter",
      "EV-grade packs",
    ],
  },
  {
    id: "longduration",
    label: "Long-Duration",
    blurb: "10+ hour discharge.",
    subsectors: [
      "Iron-air / metal-air",
      "Gravity & mechanical",
      "Thermal",
      "Compressed air / hydrogen-coupled",
    ],
  },
];

const HYDROGEN_BUCKETS: BucketDef[] = [
  {
    id: "production",
    label: "Production",
    blurb: "Where the H2 comes from.",
    subsectors: [
      "Electrolyzers (PEM / Alkaline / SOEC)",
      "Blue / Methane reforming with CCS",
      "Natural / geologic",
      "Pyrolysis / turquoise",
    ],
  },
  {
    id: "distribution",
    label: "Storage & Distribution",
    blurb: "Moving and holding hydrogen.",
    subsectors: [
      "Storage (compressed, liquid, salt cavern)",
      "Pipelines & Transport",
      "Carriers (ammonia, LOHC)",
    ],
  },
  {
    id: "enduse",
    label: "End-use",
    blurb: "Where hydrogen does work.",
    subsectors: [
      "Industrial (steel, refining, fertilizer)",
      "Mobility / Fuel cells",
      "Power generation",
    ],
  },
];

export const BUCKETS_BY_ENERGY: Record<EnergyType, BucketDef[]> = {
  nuclear: NUCLEAR_BUCKETS,
  solar: SOLAR_BUCKETS,
  wind: WIND_BUCKETS,
  hydro: HYDRO_BUCKETS,
  geothermal: GEOTHERMAL_BUCKETS,
  storage: STORAGE_BUCKETS,
  hydrogen: HYDROGEN_BUCKETS,
};

export function getBuckets(energyType: EnergyType): BucketDef[] {
  return BUCKETS_BY_ENERGY[energyType];
}

export function isValidEnergy(value: string): value is EnergyType {
  return (ENERGY_TYPES as string[]).includes(value);
}

// flat list of all (energyType, bucketId, subsector) triples — useful for AI prompt + schema validation.
export const ALL_SUBSECTORS: {
  energyType: EnergyType;
  bucket: string;
  subsector: string;
}[] = ENERGY_TYPES.flatMap((energyType) =>
  BUCKETS_BY_ENERGY[energyType].flatMap((b) =>
    b.subsectors.map((subsector) => ({
      energyType,
      bucket: b.id,
      subsector,
    })),
  ),
);

export const MATURITIES: { id: Maturity; label: string; dot: string }[] = [
  { id: "rnd", label: "R&D", dot: "bg-zinc-400" },
  { id: "pilot", label: "Pilot", dot: "bg-amber-500" },
  { id: "first-commercial", label: "First commercial", dot: "bg-emerald-500" },
  { id: "mass-deployed", label: "Mass-deployed", dot: "bg-emerald-700" },
];

export const CUSTOMERS: { id: Customer; label: string }[] = [
  { id: "government", label: "Government" },
  { id: "utility", label: "Utility" },
  { id: "industrial", label: "Industrial / B2B" },
  { id: "consumer", label: "Consumer" },
];
