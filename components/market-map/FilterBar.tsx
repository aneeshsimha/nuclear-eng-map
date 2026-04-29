"use client";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
  EMPTY_FILTERS,
  type ActiveFilters,
  type CompanyType,
  type Customer,
  type Domain,
  type EnergyType,
  type Maturity,
  type ReactorType,
  type Region,
} from "@/lib/types";
import { CUSTOMERS, MATURITIES } from "@/lib/energy";
import { toggleInList } from "@/lib/filter";

const TYPE_OPTIONS: { value: CompanyType; label: string }[] = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
  { value: "big-tech", label: "Big Tech" },
  { value: "china", label: "China ecosystem" },
  { value: "academic-oss", label: "Academic / OSS" },
  { value: "declining", label: "Declining" },
];

const DOMAIN_OPTIONS: { value: Domain; label: string }[] = [
  { value: "fission", label: "Fission" },
  { value: "fusion", label: "Fusion" },
];

const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: "us", label: "US" },
  { value: "canada", label: "Canada" },
  { value: "uk", label: "UK" },
  { value: "eu", label: "EU" },
  { value: "china", label: "China" },
  { value: "russia", label: "Russia" },
  { value: "japan", label: "Japan" },
  { value: "other", label: "Other" },
];

const REACTOR_OPTIONS: { value: ReactorType; label: string }[] = [
  { value: "lwr", label: "LWR" },
  { value: "htgr", label: "HTGR" },
  { value: "sfr", label: "SFR" },
  { value: "msr", label: "MSR" },
  { value: "smr", label: "SMR" },
  { value: "micro", label: "Microreactor" },
  { value: "fusion", label: "Fusion" },
  { value: "other", label: "Other" },
];

const MATURITY_OPTIONS: { value: Maturity; label: string }[] = MATURITIES.map(
  (m) => ({ value: m.id, label: m.label }),
);

const CUSTOMER_OPTIONS: { value: Customer; label: string }[] = CUSTOMERS.map(
  (c) => ({ value: c.id, label: c.label }),
);

interface Props {
  energyType: EnergyType;
  filters: ActiveFilters;
  onChange: (next: ActiveFilters) => void;
  activeCount: number;
  total: number;
  hasFilters: boolean;
}

export function FilterBar({
  energyType,
  filters,
  onChange,
  activeCount,
  total,
  hasFilters,
}: Props) {
  const isNuclear = energyType === "nuclear";

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-background p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Showing <span className="font-semibold text-foreground">{activeCount}</span>{" "}
          of {total} companies
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="text-foreground/70 underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <FilterRow
        label="Type"
        options={TYPE_OPTIONS}
        active={filters.types}
        onToggle={(value) =>
          onChange({ ...filters, types: toggleInList(filters.types, value) })
        }
      />
      <FilterRow
        label="Maturity"
        options={MATURITY_OPTIONS}
        active={filters.maturities}
        onToggle={(value) =>
          onChange({ ...filters, maturities: toggleInList(filters.maturities, value) })
        }
      />
      <FilterRow
        label="Customer"
        options={CUSTOMER_OPTIONS}
        active={filters.customers}
        onToggle={(value) =>
          onChange({ ...filters, customers: toggleInList(filters.customers, value) })
        }
      />
      <FilterRow
        label="Region"
        options={REGION_OPTIONS}
        active={filters.regions}
        onToggle={(value) =>
          onChange({ ...filters, regions: toggleInList(filters.regions, value) })
        }
      />
      {isNuclear && (
        <>
          <FilterRow
            label="Domain"
            options={DOMAIN_OPTIONS}
            active={filters.domains}
            onToggle={(value) =>
              onChange({ ...filters, domains: toggleInList(filters.domains, value) })
            }
          />
          <FilterRow
            label="Reactor"
            options={REACTOR_OPTIONS}
            active={filters.reactorTypes}
            onToggle={(value) =>
              onChange({
                ...filters,
                reactorTypes: toggleInList(filters.reactorTypes, value),
              })
            }
          />
        </>
      )}
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string }[];
  active: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-[10.5px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = active.includes(opt.value);
          return (
            <Toggle
              key={opt.value}
              size="sm"
              variant="outline"
              pressed={on}
              onPressedChange={() => onToggle(opt.value)}
              aria-label={`Filter by ${opt.label}`}
              className={cn(
                "h-6 rounded-full border-border px-2.5 text-[11px]",
                "aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/90 aria-pressed:hover:text-background",
              )}
            >
              {opt.label}
            </Toggle>
          );
        })}
      </div>
    </div>
  );
}
