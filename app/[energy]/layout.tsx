import { EnergyTabs } from "@/components/EnergyTabs";

export default function EnergyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            The Energy Map
          </h1>
          <span className="text-xs text-muted-foreground">v0.2</span>
        </div>
      </header>

      <EnergyTabs />

      {children}

      <footer className="mt-8 border-t border-border pt-4 text-[11px] text-muted-foreground">
        Layout inspired by{" "}
        <a
          href="https://app.topology.vc/robotics"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          topology.vc
        </a>
        . Funding figures are best-effort and may be stale — corrections
        welcome. Logos used under nominative fair use.
      </footer>
    </main>
  );
}
