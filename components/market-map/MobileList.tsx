"use client";

import { CompanyChip } from "./CompanyChip";
import { BUCKETS, STAGES, type Company } from "@/lib/types";
import { filterCompany } from "@/lib/filter";
import type { ActiveFilters } from "@/lib/types";

interface Props {
  companies: Company[];
  filters: ActiveFilters;
}

export function MobileList({ companies, filters }: Props) {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {BUCKETS.map((bucket) => {
        const inBucket = companies.filter((c) => c.bucket === bucket.id);
        if (inBucket.length === 0) return null;
        return (
          <section key={bucket.id} className="rounded-md border border-border bg-background">
            <header className="border-b border-border bg-muted/30 px-3 py-2">
              <div className="flex items-baseline gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  {bucket.label}
                </h2>
                <span className="text-xs text-muted-foreground">{bucket.blurb}</span>
              </div>
            </header>
            <div className="flex flex-col divide-y divide-border">
              {bucket.subsectors.map((subsector) => {
                const inSub = inBucket.filter((c) => c.subsector === subsector);
                if (inSub.length === 0) return null;
                return (
                  <div key={subsector} className="px-3 py-3">
                    <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {subsector}
                    </div>
                    {STAGES.map((stage) => {
                      const inStage = inSub.filter((c) => c.stage === stage.id);
                      if (inStage.length === 0) return null;
                      return (
                        <div key={stage.id} className="mb-2 last:mb-0">
                          <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                            {stage.label}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {inStage.map((c) => (
                              <CompanyChip
                                key={c.slug}
                                company={c}
                                active={filterCompany(c, filters)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
