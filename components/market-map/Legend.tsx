import { MATURITIES } from "@/lib/energy";
import { cn } from "@/lib/utils";

export function Legend() {
  return (
    <aside className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 pt-2 text-[11px] text-muted-foreground">
      {MATURITIES.map((m) => (
        <span key={m.id} className="inline-flex items-center gap-1.5">
          <span
            className={cn("inline-block h-1.5 w-1.5 rounded-full", m.dot)}
            aria-hidden
          />
          {m.label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="rounded-sm bg-red-600 px-1 py-px text-[8.5px] font-semibold tracking-wide text-white uppercase">
          Largest round
        </span>
        biggest disclosed raise in its row
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="rounded-sm bg-blue-600 px-1 py-px text-[8.5px] font-semibold tracking-wide text-white uppercase">
          Public
        </span>
        publicly traded
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
        China ecosystem
      </span>
      <span className="inline-flex items-center gap-1.5 opacity-30 grayscale">
        <span className="h-3 w-6 rounded-sm border border-border bg-background" />
        filtered out
      </span>
    </aside>
  );
}
