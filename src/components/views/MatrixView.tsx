import { useMemo, useState } from 'react';
import type { DevPhase, EnergyStartup, EnergyType, FilterState, ViewMode } from '../../types/startup';
import { DEV_PHASES, ENERGY_TYPES } from '../../types/startup';
import { DEV_PHASE_META, ENERGY_TYPE_META } from '../../utils/classify';
import { StartupDetailModal } from '../cards/StartupDetailModal';

interface Props {
  startups: EnergyStartup[];
  onDrillDown: (mode: ViewMode, partial: Partial<FilterState>) => void;
}

const MAX_PREVIEW = 3;

export function MatrixView({ startups, onDrillDown }: Props) {
  const [selected, setSelected] = useState<EnergyStartup | null>(null);

  const matrix = useMemo(() => {
    const m = new Map<EnergyType, Map<DevPhase, EnergyStartup[]>>();
    for (const et of ENERGY_TYPES) {
      const row = new Map<DevPhase, EnergyStartup[]>();
      for (const dp of DEV_PHASES) row.set(dp, []);
      m.set(et, row);
    }
    for (const s of startups) {
      for (const et of s.energyTypes) {
        const row = m.get(et);
        if (row) {
          const cell = row.get(s.devPhase);
          if (cell) cell.push(s);
        }
      }
    }
    return m;
  }, [startups]);

  const rowTotals = useMemo(
    () =>
      new Map(
        ENERGY_TYPES.map((et) => [
          et,
          [...(matrix.get(et)?.values() ?? [])].reduce((sum, arr) => sum + arr.length, 0),
        ]),
      ),
    [matrix],
  );

  return (
    <>
      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                Energy type
              </th>
              {DEV_PHASES.map((dp) => {
                const meta = DEV_PHASE_META[dp];
                return (
                  <th
                    key={dp}
                    className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider"
                  >
                    <span className={`px-2 py-0.5 rounded-full ${meta.bgColor} ${meta.color}`}>
                      {meta.label}
                    </span>
                  </th>
                );
              })}
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {ENERGY_TYPES.map((et) => {
              const row = matrix.get(et)!;
              const total = rowTotals.get(et) ?? 0;
              const etMeta = ENERGY_TYPE_META[et];

              return (
                <tr key={et} className="border-t border-gray-100">
                  <td className="px-3 py-3 font-medium">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${etMeta.bgColor} ${etMeta.color}`}>
                      {etMeta.label}
                    </span>
                  </td>
                  {DEV_PHASES.map((dp) => {
                    const cell = row.get(dp)!;
                    if (cell.length === 0) {
                      return (
                        <td key={dp} className="px-3 py-3 text-center text-gray-200 text-lg">
                          —
                        </td>
                      );
                    }
                    const preview = cell.slice(0, MAX_PREVIEW);
                    const overflow = cell.length - MAX_PREVIEW;
                    return (
                      <td key={dp} className="px-3 py-3 align-top">
                        <button
                          onClick={() =>
                            onDrillDown('card', {
                              energyTypes: [et],
                              devPhases: [dp],
                            })
                          }
                          className="block w-full text-left rounded-lg hover:bg-blue-50 p-1.5 transition-colors cursor-pointer"
                        >
                          <div className="space-y-1">
                            {preview.map((s) => (
                              <div
                                key={s.id}
                                className="text-xs text-gray-700 truncate hover:text-blue-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelected(s);
                                }}
                              >
                                {s.name}
                              </div>
                            ))}
                            {overflow > 0 && (
                              <div className="text-xs text-blue-600 font-medium">
                                +{overflow} more
                              </div>
                            )}
                          </div>
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-center">
                    {total > 0 ? (
                      <span className="text-sm font-semibold text-gray-700">{total}</span>
                    ) : (
                      <span className="text-gray-200">0</span>
                    )}
                  </td>
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
