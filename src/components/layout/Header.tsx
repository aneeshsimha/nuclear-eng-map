import type { ViewMode } from '../../types/startup';
import { ViewSwitcher } from './ViewSwitcher';

interface Props {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  count: number;
  totalCount: number;
}

export function Header({ viewMode, onViewChange, count, totalCount }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">
              Energy Startup Map
            </h1>
            <p className="text-xs text-gray-500">
              {count === totalCount
                ? `${totalCount} startups`
                : `${count} of ${totalCount} startups`}
            </p>
          </div>
        </div>
        <ViewSwitcher current={viewMode} onChange={onViewChange} />
      </div>
    </header>
  );
}
