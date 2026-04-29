import { notFound } from "next/navigation";
import { MarketMap } from "@/components/market-map/MarketMap";
import { getCompanies } from "@/data";
import { ENERGY_META, ENERGY_TYPES, isValidEnergy } from "@/lib/energy";

interface Params {
  energy: string;
}

export function generateStaticParams(): Params[] {
  return ENERGY_TYPES.map((energy) => ({ energy }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { energy } = await params;
  if (!isValidEnergy(energy)) return { title: "Energy Map" };
  const meta = ENERGY_META[energy];
  return {
    title: `${meta.label} · Energy Map`,
    description: meta.blurb,
  };
}

export default async function EnergyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { energy } = await params;
  if (!isValidEnergy(energy)) notFound();

  const meta = ENERGY_META[energy];
  const companies = getCompanies(energy);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">{meta.label}</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">{meta.blurb}</p>
      </div>
      <MarketMap energyType={energy} companies={companies} />
    </section>
  );
}
