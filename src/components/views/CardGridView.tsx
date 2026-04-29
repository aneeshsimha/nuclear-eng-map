import { useState } from 'react';
import type { EnergyStartup } from '../../types/startup';
import { StartupCard } from '../cards/StartupCard';
import { StartupDetailModal } from '../cards/StartupDetailModal';

interface Props {
  startups: EnergyStartup[];
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>
      <div className="flex gap-1">
        <div className="h-5 bg-gray-100 rounded-full w-16" />
        <div className="h-5 bg-gray-100 rounded-full w-20" />
      </div>
    </div>
  );
}

export function CardGridView({ startups }: Props) {
  const [selected, setSelected] = useState<EnergyStartup | null>(null);

  if (startups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-5xl mb-4">🔍</span>
        <p className="text-lg font-medium text-gray-600">No startups match your filters</p>
        <p className="text-sm mt-1">Try removing some filters to see more results</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {startups.map((s) => (
          <StartupCard key={s.id} startup={s} onClick={() => setSelected(s)} />
        ))}
      </div>
      <StartupDetailModal startup={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export function CardGridViewSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
