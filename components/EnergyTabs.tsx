"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ENERGY_META, ENERGY_TYPES } from "@/lib/energy";
import { cn } from "@/lib/utils";

export function EnergyTabs() {
  const pathname = usePathname();
  const current = pathname.split("/")[1] ?? "";

  return (
    <nav
      aria-label="Energy types"
      className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto py-2 text-sm">
        {ENERGY_TYPES.map((id) => {
          const meta = ENERGY_META[id];
          const active = current === id;
          return (
            <Link
              key={id}
              href={`/${id}`}
              prefetch
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {meta.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
