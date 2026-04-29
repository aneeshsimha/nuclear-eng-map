import { z } from "zod";
import { BUCKETS } from "@/lib/types";

const subsectorIds = BUCKETS.flatMap((b) => b.subsectors);

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
    bucket: z.enum(["reactor", "fuel", "plant"]),
    subsector: z.enum(subsectorIds as [string, ...string[]]),
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
    domain: z.enum(["fission", "fusion"]),
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
    reactorType: z
      .enum(["lwr", "htgr", "sfr", "msr", "smr", "micro", "fusion", "other"])
      .optional(),
    funding: z
      .object({
        amount: z.string().optional(),
        round: z.string().optional(),
        lead: z.string().optional(),
      })
      .optional(),
    badge: z.string().optional(),
    description: z.string().min(50).max(280),
    sources: z.array(z.string().url()).min(1),
  })
  .refine(
    (c) => {
      const bucket = BUCKETS.find((b) => b.id === c.bucket);
      return bucket?.subsectors.includes(c.subsector) ?? false;
    },
    { message: "subsector must belong to bucket", path: ["subsector"] },
  );

export type CompanyResearch = z.infer<typeof CompanyResearchSchema>;
