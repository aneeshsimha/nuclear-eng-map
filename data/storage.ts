import type { Company } from "@/lib/types";

const STORAGE_RAW: Omit<Company, "energyType">[] = [
  // companies will be added here by the admin agent.
];

export const STORAGE_COMPANIES: Company[] = STORAGE_RAW.map((c) => ({
  ...c,
  energyType: "storage" as const,
}));
