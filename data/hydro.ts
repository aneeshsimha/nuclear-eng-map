import type { Company } from "@/lib/types";

const HYDRO_RAW: Omit<Company, "energyType">[] = [
  // companies will be added here by the admin agent.
];

export const HYDRO_COMPANIES: Company[] = HYDRO_RAW.map((c) => ({
  ...c,
  energyType: "hydro" as const,
}));
