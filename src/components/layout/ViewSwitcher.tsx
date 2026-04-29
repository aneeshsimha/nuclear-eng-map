import type { ViewMode } from '../../types/startup';
import { VIEW_MODES } from '../../types/startup';

const LABELS: Record<ViewMode, string> = {
  card: 'Cards',
  matrix: 'Matrix',
  table: 'Table',
};

const ICONS: Record<ViewMode, string> = {
  card: '⊞',
  matrix: '⊟',
  table: '≡',
};

interface Props {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewSwitcher({ current, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {VIEW_MODES.map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            current === mode
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mr-1">{ICONS[mode]}</span>
          {LABELS[mode]}
        </button>
      ))}
    </div>
  );
}
