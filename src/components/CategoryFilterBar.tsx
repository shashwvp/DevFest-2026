import React from 'react';
import { QuickFilterId } from '../types';
import { Compass, Droplets, Snowflake, Mountain } from 'lucide-react';

interface CategoryFilterBarProps {
  activeFilter: QuickFilterId;
  onSelectFilter: (filter: QuickFilterId) => void;
  sortBy: 'coolest' | 'drive' | 'elevation' | 'popular';
  onChangeSortBy: (sort: 'coolest' | 'drive' | 'elevation' | 'popular') => void;
  totalCount: number;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  activeFilter,
  onSelectFilter,
  sortBy,
  onChangeSortBy,
  totalCount,
}) => {
  const quickFilters: { id: QuickFilterId; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Escapes', icon: <Compass className="w-4 h-4" /> },
    { id: 'coolest-outdoors', label: 'Coolest Outdoors (River/Lakes)', icon: <Droplets className="w-4 h-4" /> },
    { id: 'air-conditioned-indoors', label: 'Air-Conditioned Indoors', icon: <Snowflake className="w-4 h-4" /> },
    { id: 'foothill-getaways', label: 'Foothill Getaways', icon: <Mountain className="w-4 h-4" /> },
  ];

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
      
      {/* Quick Filter Buttons at Top */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0">
        {quickFilters.map((qf) => {
          const isActive = activeFilter === qf.id;
          return (
            <button
              key={qf.id}
              onClick={() => onSelectFilter(qf.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:text-stone-950 hover:bg-stone-200/90 border-stone-200/70'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-stone-500'}>
                {qf.icon}
              </span>
              <span>{qf.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sorting selector & Result count */}
      <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-stone-500 shrink-0">
        <span className="font-medium text-stone-600">
          {totalCount} escape destination{totalCount === 1 ? '' : 's'}
        </span>
        <span className="text-stone-300">·</span>
        <div className="flex items-center gap-1.5">
          <label htmlFor="sort-select" className="font-medium text-stone-500 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onChangeSortBy(e.target.value as any)}
            className="bg-white border border-stone-200 text-stone-800 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-2xs"
          >
            <option value="coolest">Coolest First (Highest Drop)</option>
            <option value="drive">Quickest Drive</option>
            <option value="elevation">Highest Elevation</option>
            <option value="popular">Local Favorites</option>
          </select>
        </div>
      </div>

    </div>
  );
};
