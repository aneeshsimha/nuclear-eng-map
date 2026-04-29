import type { FilterState } from '../../types/startup';
import {
  DEV_PHASES,
  ENERGY_TYPES,
  FUNDING_STAGES,
  MARKET_SEGMENTS,
} from '../../types/startup';
import {
  DEV_PHASE_META,
  ENERGY_TYPE_META,
  FUNDING_STAGE_META,
  MARKET_SEGMENT_META,
} from '../../utils/classify';
import { FilterChip } from './FilterChip';

interface Props {
  filters: FilterState;
  availableCountries: string[];
  hasActiveFilters: boolean;
  onToggle: <T extends string>(key: keyof FilterState, item: T) => void;
  onSearch: (q: string) => void;
  onClear: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
      {children}
    </p>
  );
}

function ToggleButton({
  active,
  color,
  bgColor,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  bgColor: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
        active
          ? `${bgColor} ${color} border-current`
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
      }`}
    >
      {children}
    </button>
  );
}

export function FilterPanel({
  filters,
  availableCountries,
  hasActiveFilters,
  onToggle,
  onSearch,
  onClear,
}: Props) {
  const activeChips: { label: string; onRemove: () => void }[] = [];

  filters.energyTypes.forEach((t) =>
    activeChips.push({
      label: ENERGY_TYPE_META[t].label,
      onRemove: () => onToggle('energyTypes', t),
    }),
  );
  filters.devPhases.forEach((d) =>
    activeChips.push({
      label: DEV_PHASE_META[d].label,
      onRemove: () => onToggle('devPhases', d),
    }),
  );
  filters.marketSegments.forEach((m) =>
    activeChips.push({
      label: MARKET_SEGMENT_META[m].label,
      onRemove: () => onToggle('marketSegments', m),
    }),
  );
  filters.fundingStages.forEach((f) =>
    activeChips.push({
      label: FUNDING_STAGE_META[f].label,
      onRemove: () => onToggle('fundingStages', f),
    }),
  );
  filters.countries.forEach((c) =>
    activeChips.push({
      label: c,
      onRemove: () => onToggle('countries', c),
    }),
  );

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto h-[calc(100vh-57px)] sticky top-[57px]">
      <div className="p-4 space-y-5">
        {/* Search */}
        <div>
          <SectionLabel>Search</SectionLabel>
          <input
            type="text"
            placeholder="Name, tech, description..."
            value={filters.searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Active filters */}
        {hasActiveFilters && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>Active filters</SectionLabel>
              <button
                onClick={onClear}
                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {activeChips.map((chip) => (
                <FilterChip key={chip.label} label={chip.label} onRemove={chip.onRemove} />
              ))}
            </div>
          </div>
        )}

        {/* Energy type */}
        <div>
          <SectionLabel>Energy type</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {ENERGY_TYPES.map((t) => (
              <ToggleButton
                key={t}
                active={filters.energyTypes.includes(t)}
                color={ENERGY_TYPE_META[t].color}
                bgColor={ENERGY_TYPE_META[t].bgColor}
                onClick={() => onToggle('energyTypes', t)}
              >
                {ENERGY_TYPE_META[t].label}
              </ToggleButton>
            ))}
          </div>
        </div>

        {/* Dev phase */}
        <div>
          <SectionLabel>Development phase</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {DEV_PHASES.map((d) => (
              <ToggleButton
                key={d}
                active={filters.devPhases.includes(d)}
                color={DEV_PHASE_META[d].color}
                bgColor={DEV_PHASE_META[d].bgColor}
                onClick={() => onToggle('devPhases', d)}
              >
                {DEV_PHASE_META[d].label}
              </ToggleButton>
            ))}
          </div>
        </div>

        {/* Market segment */}
        <div>
          <SectionLabel>Market segment</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {MARKET_SEGMENTS.map((m) => (
              <ToggleButton
                key={m}
                active={filters.marketSegments.includes(m)}
                color={MARKET_SEGMENT_META[m].color}
                bgColor={MARKET_SEGMENT_META[m].bgColor}
                onClick={() => onToggle('marketSegments', m)}
              >
                {MARKET_SEGMENT_META[m].label}
              </ToggleButton>
            ))}
          </div>
        </div>

        {/* Funding stage */}
        <div>
          <SectionLabel>Funding stage</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {FUNDING_STAGES.map((f) => (
              <ToggleButton
                key={f}
                active={filters.fundingStages.includes(f)}
                color={FUNDING_STAGE_META[f].color}
                bgColor={FUNDING_STAGE_META[f].bgColor}
                onClick={() => onToggle('fundingStages', f)}
              >
                {FUNDING_STAGE_META[f].label}
              </ToggleButton>
            ))}
          </div>
        </div>

        {/* Country */}
        {availableCountries.length > 0 && (
          <div>
            <SectionLabel>Country</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {availableCountries.map((c) => (
                <ToggleButton
                  key={c}
                  active={filters.countries.includes(c)}
                  color="text-gray-700"
                  bgColor="bg-gray-200"
                  onClick={() => onToggle('countries', c)}
                >
                  {c}
                </ToggleButton>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
