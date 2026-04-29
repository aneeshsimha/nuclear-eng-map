import type { Company } from "@/lib/types";

const WIND_RAW: Omit<Company, "energyType">[] = [
  // companies will be added here by the admin agent.
];

export const WIND_COMPANIES: Company[] = WIND_RAW.map((c) => ({
  ...c,
  energyType: "wind" as const,
}));
