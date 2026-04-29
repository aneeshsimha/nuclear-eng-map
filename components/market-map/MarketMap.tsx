"use client";

import { useMemo, useState } from "react";
import { Grid } from "./Grid";
import { FilterBar } from "./FilterBar";
import { MobileList } from "./MobileList";
import { Legend } from "./Legend";
import { EMPTY_FILTERS, type ActiveFilters, type Company } from "@/lib/types";
import { filterCompany, hasAnyFilters } from "@/lib/filter";

interface Props {
  companies: Company[];
}

export function MarketMap({ companies }: Props) {
  const [filters, setFilters] = useState<ActiveFilters>(EMPTY_FILTERS);

  const activeCount = useMemo(
    () => companies.filter((c) => filterCompany(c, filters)).length,
    [companies, filters],
  );

  const total = companies.length;

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        filters={filters}
        onChange={setFilters}
        activeCount={activeCount}
        total={total}
        hasFilters={hasAnyFilters(filters)}
      />
      <Grid companies={companies} filters={filters} />
      <MobileList companies={companies} filters={filters} />
      <Legend />
    </div>
  );
}
