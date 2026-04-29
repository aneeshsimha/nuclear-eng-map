import { useState } from 'react';
import type { EnergyStartup } from '../../types/startup';
import {
  DEV_PHASE_META,
  ENERGY_TYPE_META,
  FUNDING_STAGE_META,
  formatFunding,
} from '../../utils/classify';
import { StartupDetailModal } from '../cards/StartupDetailModal';

type SortKey = 'name' | 'country' | 'fundingStage' | 'devPhase' | 'totalFundingUsd' | 'founded';

interface Props {
  startups: EnergyStartup[];
}

function Th({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: 'asc' | 'desc';
  onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-900 select-none"
      onClick={() => onSort(sortKey)}
    >
      {label}
      {active && <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );
}

export function TableView({ startups }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<EnergyStartup | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const sorted = [...startups].sort((a, b) => {
    let av: string | number = '';
    let bv: string | number = '';
    if (sortKey === 'name') { av = a.name; bv = b.name; }
    else if (sortKey === 'country') { av = a.country; bv = b.country; }
    else if (sortKey === 'fundingStage') { av = FUNDING_STAGE_META[a.fundingStage].order; bv = FUNDING_STAGE_META[b.fundingStage].order; }
    else if (sortKey === 'devPhase') { av = DEV_PHASE_META[a.devPhase].order; bv = DEV_PHASE_META[b.devPhase].order; }
    else if (sortKey === 'totalFundingUsd') { av = a.totalFundingUsd ?? -1; bv = b.totalFundingUsd ?? -1; }
    else if (sortKey === 'founded') { av = a.founded ?? 0; bv = b.founded ?? 0; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

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
      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th label="Company" sortKey="name" current={sortKey} dir={sortDir} onSort={handleSort} />
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Energy types</th>
              <Th label="Phase" sortKey="devPhase" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Funding" sortKey="fundingStage" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Total raised" sortKey="totalFundingUsd" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Founded" sortKey="founded" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Country" sortKey="country" current={sortKey} dir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((s) => {
              const phase = DEV_PHASE_META[s.devPhase];
              const funding = FUNDING_STAGE_META[s.fundingStage];
              return (
                <tr
                  key={s.id}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => setSelected(s)}
                >
                  <td className="px-3 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                    {s.name}
                    {s.classificationConfidence < 0.5 && (
                      <span className="ml-1 text-amber-400 text-xs" title="Low confidence">⚠</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {s.energyTypes.map((t) => (
                        <span
                          key={t}
                          className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${ENERGY_TYPE_META[t].bgColor} ${ENERGY_TYPE_META[t].color}`}
                        >
                          {ENERGY_TYPE_META[t].label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${phase.bgColor} ${phase.color}`}>
                      {phase.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${funding.bgColor} ${funding.color}`}>
                      {funding.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">
                    {formatFunding(s.totalFundingUsd)}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">{s.founded ?? '—'}</td>
                  <td className="px-3 py-2.5 text-gray-500">{s.country}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <StartupDetailModal startup={selected} onClose={() => setSelected(null)} />
    </>
  );
}
