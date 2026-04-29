import { z } from "zod";
import { BUCKETS_BY_ENERGY, ENERGY_TYPES } from "@/lib/energy";

const allSubsectors = ENERGY_TYPES.flatMap((e) =>
  BUCKETS_BY_ENERGY[e].flatMap((b) => b.subsectors),
);

export const CompanyResearchSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, {
        message: "slug must be lowercase letters/numbers/hyphens",
      }),
    name: z.string().min(1),
    url: z.string().url(),
    logoUrl: z.string().url(),
    energyType: z.enum([
      "nuclear",
      "solar",
      "wind",
      "hydro",
      "geothermal",
      "storage",
      "hydrogen",
    ]),
    bucket: z.string().min(1),
    subsector: z.enum(allSubsectors as [string, ...string[]]),
    stage: z.enum(["non-commercial", "early", "late"]),
    types: z
      .array(
        z.enum([
          "private",
          "public",
          "big-tech",
          "china",
          "academic-oss",
          "declining",
        ]),
      )
      .min(1),
    region: z.enum([
      "us",
      "canada",
      "uk",
      "eu",
      "china",
      "russia",
      "japan",
      "other",
    ]),
    description: z.string().min(50).max(280),
    sources: z.array(z.string().url()).min(1),
    domain: z.enum(["fission", "fusion"]).optional(),
    reactorType: z
      .enum(["lwr", "htgr", "sfr", "msr", "smr", "micro", "fusion", "other"])
      .optional(),
    maturity: z
      .enum(["rnd", "pilot", "first-commercial", "mass-deployed"])
      .optional(),
    customer: z
      .enum(["government", "utility", "industrial", "consumer"])
      .optional(),
    funding: z
      .object({
        amount: z.string().optional(),
        round: z.string().optional(),
        lead: z.string().optional(),
      })
      .optional(),
    badge: z.string().optional(),
  })
  .refine(
    (c) => {
      const buckets = BUCKETS_BY_ENERGY[c.energyType];
      const bucket = buckets.find((b) => b.id === c.bucket);
      return bucket?.subsectors.includes(c.subsector) ?? false;
    },
    {
      message:
        "(energyType, bucket, subsector) triple must come from the taxonomy",
      path: ["subsector"],
    },
  )
  .refine((c) => c.energyType !== "nuclear" || !!c.domain, {
    message: "domain required when energyType === 'nuclear'",
    path: ["domain"],
  });

export type CompanyResearch = z.infer<typeof CompanyResearchSchema>;
