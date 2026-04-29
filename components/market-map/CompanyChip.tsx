"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MATURITIES } from "@/lib/energy";
import type { Company } from "@/lib/types";

const REGION_LABEL: Record<Company["region"], string> = {
  us: "United States",
  canada: "Canada",
  uk: "United Kingdom",
  eu: "European Union",
  china: "China",
  russia: "Russia",
  japan: "Japan",
  other: "Other",
};

const REACTOR_LABEL: Record<NonNullable<Company["reactorType"]>, string> = {
  lwr: "LWR",
  htgr: "HTGR",
  sfr: "SFR",
  msr: "MSR",
  smr: "SMR",
  micro: "Microreactor",
  fusion: "Fusion",
  other: "Other",
};

const MATURITY_LABEL: Record<NonNullable<Company["maturity"]>, string> = {
  rnd: "R&D",
  pilot: "Pilot",
  "first-commercial": "First commercial",
  "mass-deployed": "Mass-deployed",
};

const CUSTOMER_LABEL: Record<NonNullable<Company["customer"]>, string> = {
  government: "Government",
  utility: "Utility",
  industrial: "Industrial / B2B",
  consumer: "Consumer",
};

const MATURITY_DOT = Object.fromEntries(
  MATURITIES.map((m) => [m.id, m.dot]),
) as Record<NonNullable<Company["maturity"]>, string>;

interface Props {
  company: Company;
  active: boolean;
}

export function CompanyChip({ company, active }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            data-active={active ? "true" : "false"}
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background px-2 py-1 text-[11px] leading-tight text-foreground/90 transition-all hover:border-foreground/40 hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
              !active && "pointer-events-none opacity-30 grayscale",
            )}
          >
            {company.maturity && (
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                  MATURITY_DOT[company.maturity],
                )}
                aria-hidden
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={company.logoUrl}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 shrink-0 rounded-sm object-contain"
              loading="lazy"
            />
            <span className="truncate font-medium">{company.name}</span>
            {company.funding?.amount && (
              <span className="text-muted-foreground">
                {company.funding.amount}
              </span>
            )}
            {company.badge && (
              <span className="ml-0.5 rounded-sm bg-red-600 px-1 py-px text-[8.5px] font-semibold tracking-wide text-white uppercase">
                {company.badge}
              </span>
            )}
            {company.types.includes("public") && (
              <span className="ml-0.5 rounded-sm bg-blue-600 px-1 py-px text-[8.5px] font-semibold tracking-wide text-white uppercase">
                Public
              </span>
            )}
            {company.types.includes("china") && (
              <span className="ml-0.5 inline-block h-2 w-2 rounded-full bg-red-500" aria-hidden />
            )}
          </a>
        }
      />
      <TooltipContent className="max-w-xs">
        <div className="flex flex-col gap-1.5 py-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{company.name}</span>
            <span className="text-[10px] uppercase tracking-wider text-background/60">
              {REGION_LABEL[company.region]}
              {company.reactorType && ` · ${REACTOR_LABEL[company.reactorType]}`}
            </span>
          </div>
          <p className="text-[11px] leading-snug">{company.description}</p>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10.5px] text-background/70">
            {company.maturity && <span>{MATURITY_LABEL[company.maturity]}</span>}
            {company.customer && <span>· {CUSTOMER_LABEL[company.customer]}</span>}
          </div>
          {company.funding && (
            <div className="text-[10.5px] text-background/70">
              {company.funding.round && <>{company.funding.round} · </>}
              {company.funding.amount && <>{company.funding.amount}</>}
              {company.funding.lead && <> · led by {company.funding.lead}</>}
            </div>
          )}
          <div className="text-[10.5px] text-background/60">
            {new URL(company.url).hostname.replace(/^www\./, "")} ↗
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
