import type { Company } from "@/lib/types";

const GEOTHERMAL_RAW: Omit<Company, "energyType">[] = [
  // companies will be added here by the admin agent.
];

export const GEOTHERMAL_COMPANIES: Company[] = GEOTHERMAL_RAW.map((c) => ({
  ...c,
  energyType: "geothermal" as const,
}));
