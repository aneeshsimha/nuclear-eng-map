import { useState } from 'react';
import { useFilters } from './components/filters/useFilters';
import { FilterPanel } from './components/filters/FilterPanel';
import { Header } from './components/layout/Header';
import { CardGridView, CardGridViewSkeleton } from './components/views/CardGridView';
import { MatrixView } from './components/views/MatrixView';
import { TableView } from './components/views/TableView';
import { useStartups } from './data/useStartups';
import type { FilterState, ViewMode } from './types/startup';

export default function App() {
  const { startups, loading, error, count } = useStartups();
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  const {
    filters,
    setFilter,
    toggleArrayFilter,
    clearFilters,
    hasActiveFilters,
    filteredStartups,
    availableCountries,
  } = useFilters(startups);

  function handleDrillDown(mode: ViewMode, partial: Partial<FilterState>) {
    if (partial.energyTypes) setFilter('energyTypes', partial.energyTypes);
    if (partial.devPhases) setFilter('devPhases', partial.devPhases);
    setViewMode(mode);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        viewMode={viewMode}
        onViewChange={setViewMode}
        count={filteredStartups.length}
        totalCount={count}
      />
      <div className="flex max-w-screen-2xl mx-auto">
        <FilterPanel
          filters={filters}
          availableCountries={availableCountries}
          hasActiveFilters={hasActiveFilters}
          onToggle={toggleArrayFilter}
          onSearch={(q) => setFilter('searchQuery', q)}
          onClear={clearFilters}
        />
        <main className="flex-1 min-w-0">
          {loading ? (
            <CardGridViewSkeleton />
          ) : viewMode === 'card' ? (
            <CardGridView startups={filteredStartups} />
          ) : viewMode === 'table' ? (
            <TableView startups={filteredStartups} />
          ) : (
            <MatrixView startups={filteredStartups} onDrillDown={handleDrillDown} />
          )}
        </main>
      </div>
    </div>
  );
}
