import { MarketMap } from "@/components/market-map/MarketMap";
import { COMPANIES } from "@/data/companies";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-col gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            The Nuclear Engineering Map
          </h1>
          <span className="text-xs text-muted-foreground">v0.1</span>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          A market map of the companies and labs that make nuclear power. Three big ideas —
          <strong className="font-semibold text-foreground"> the reactor</strong>,
          <strong className="font-semibold text-foreground"> the fuel</strong> that
          feeds it, and{" "}
          <strong className="font-semibold text-foreground">the plant</strong> that
          runs it. Built as an on-ramp for anyone curious about the industry, and
          as a tracker for the companies worth following.
        </p>
      </header>

      <MarketMap companies={COMPANIES} />

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
        . Funding figures are best-effort and may be stale — corrections welcome.
        Logos used under nominative fair use.
      </footer>
    </main>
  );
}
