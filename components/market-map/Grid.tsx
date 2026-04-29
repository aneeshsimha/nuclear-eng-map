"use client";

import { CompanyChip } from "./CompanyChip";
import { BUCKETS, STAGES, type Company } from "@/lib/types";
import { filterCompany } from "@/lib/filter";
import type { ActiveFilters } from "@/lib/types";

interface Props {
  companies: Company[];
  filters: ActiveFilters;
}

export function Grid({ companies, filters }: Props) {
  return (
    <div className="hidden md:flex md:flex-col md:divide-y md:divide-border md:border md:border-border md:rounded-md md:bg-background">
      <header className="grid grid-cols-[minmax(220px,260px)_repeat(3,1fr)] divide-x divide-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
        <div className="px-4 py-3 font-semibold text-foreground/80">Subsector</div>
        {STAGES.map((stage) => (
          <div key={stage.id} className="px-4 py-3">
            <div className="font-semibold text-foreground/80">{stage.label}</div>
            <div className="mt-0.5 text-[10px] normal-case tracking-normal text-muted-foreground/80">
              {stage.tagline}
            </div>
          </div>
        ))}
      </header>

      {BUCKETS.map((bucket) => (
        <section
          key={bucket.id}
          className="grid grid-cols-[minmax(220px,260px)_repeat(3,1fr)] divide-x divide-border"
        >
          <div className="border-b border-border bg-muted/20 px-4 py-3 col-span-4">
            <div className="flex items-baseline gap-2">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                {bucket.label}
              </h2>
              <span className="text-xs text-muted-foreground">{bucket.blurb}</span>
            </div>
          </div>

          {bucket.subsectors.map((subsector) => (
            <SubsectorRow
              key={subsector}
              bucket={bucket.id}
              subsector={subsector}
              companies={companies}
              filters={filters}
            />
          ))}
        </section>
      ))}
    </div>
  );
}

function SubsectorRow({
  bucket,
  subsector,
  companies,
  filters,
}: {
  bucket: Company["bucket"];
  subsector: string;
  companies: Company[];
  filters: ActiveFilters;
}) {
  const inRow = companies.filter(
    (c) => c.bucket === bucket && c.subsector === subsector,
  );

  return (
    <>
      <div className="border-t border-border bg-muted/10 px-4 py-3 text-xs font-medium text-foreground/80">
        {subsector}
      </div>
      {STAGES.map((stage, i) => {
        const cellCompanies = inRow.filter((c) => c.stage === stage.id);
        return (
          <div
            key={stage.id}
            data-stage={stage.id}
            className="border-t border-border px-3 py-3"
            style={{
              backgroundColor: ["transparent", "rgba(0,0,0,0.012)", "rgba(0,0,0,0.025)"][i],
            }}
          >
            {cellCompanies.length === 0 ? (
              <span className="text-[11px] italic text-muted-foreground/50">—</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {cellCompanies.map((c) => (
                  <CompanyChip
                    key={c.slug}
                    company={c}
                    active={filterCompany(c, filters)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
