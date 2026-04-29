"use client";

import { useMemo, useState } from "react";
import { Grid } from "./Grid";
import { FilterBar } from "./FilterBar";
import { MobileList } from "./MobileList";
import { Legend } from "./Legend";
import { EMPTY_FILTERS, type ActiveFilters, type Company, type EnergyType } from "@/lib/types";
import { filterCompany, hasAnyFilters } from "@/lib/filter";
import { getBuckets } from "@/lib/energy";

interface Props {
  energyType: EnergyType;
  companies: Company[];
}

export function MarketMap({ energyType, companies }: Props) {
  const buckets = useMemo(() => getBuckets(energyType), [energyType]);
  const [filters, setFilters] = useState<ActiveFilters>(EMPTY_FILTERS);

  const activeCount = useMemo(
    () => companies.filter((c) => filterCompany(c, filters)).length,
    [companies, filters],
  );

  const total = companies.length;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">
          No companies tracked yet for this energy type.
        </p>
        <p className="max-w-md text-xs text-muted-foreground">
          Sign in at <code className="rounded bg-background px-1 py-0.5">/admin</code>{" "}
          and submit a company name — the AI will research it and open a PR
          adding the entry.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        energyType={energyType}
        filters={filters}
        onChange={setFilters}
        activeCount={activeCount}
        total={total}
        hasFilters={hasAnyFilters(filters)}
      />
      <Grid buckets={buckets} companies={companies} filters={filters} />
      <MobileList buckets={buckets} companies={companies} filters={filters} />
      <Legend />
    </div>
  );
}
