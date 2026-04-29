import type { Company } from "@/lib/types";

const SOLAR_RAW: Omit<Company, "energyType">[] = [
  // companies will be added here by the admin agent.
];

export const SOLAR_COMPANIES: Company[] = SOLAR_RAW.map((c) => ({
  ...c,
  energyType: "solar" as const,
}));
