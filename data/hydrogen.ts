import type { Company } from "@/lib/types";

const HYDROGEN_RAW: Omit<Company, "energyType">[] = [
  // companies will be added here by the admin agent.
];

export const HYDROGEN_COMPANIES: Company[] = HYDROGEN_RAW.map((c) => ({
  ...c,
  energyType: "hydrogen" as const,
}));
