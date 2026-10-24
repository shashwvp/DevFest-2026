import React from 'react';
import { BaseCity, Getaway, TempUnit } from '../types';
import { toDisplayTemp, formatDelta } from '../services/weatherService';
import { Compass, Clock, Waves, Mountain, Wind, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  baseCity: BaseCity;
  baseTempF: number;
  heroGetaway: Getaway;
  heroDestTempF: number;
  unit: TempUnit;
  onExploreGetaway: (getaway: Getaway) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  maxDriveMinutes: number | null;
  onSelectMaxDrive: (mins: number | null) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  baseCity,
  baseTempF,
  heroGetaway,
  heroDestTempF,
  unit,
  onExploreGetaway,
  searchQuery,
  onSearchChange,
  maxDriveMinutes,
  onSelectMaxDrive,
}) => {
  const heroRoute = heroGetaway.baseCityRoutes[baseCity.id] || heroGetaway.baseCityRoutes.modesto;
  const delta = formatDelta(heroDestTempF, baseTempF, unit);

  return (
    <div className="relative overflow-hidden bg-stone-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-xl border border-stone-800">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroGetaway.image}
          alt={heroGetaway.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 sm:py-16 lg:py-20 flex flex-col justify-between min-h-[500px]">
        
        {/* Top Kicker & Weather Delta Tag */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 backdrop-blur-xs">
            <Compass className="w-3.5 h-3.5" />
            Departing from {baseCity.name} ({baseCity.elevation})
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-300 font-mono tabular-nums">
            Valley Floor: {toDisplayTemp(baseTempF, unit)}
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-emerald-400 font-semibold font-mono tabular-nums">
            Alpine Relief: {delta.text}
          </span>
        </div>

        {/* Headline & Value Proposition */}
        <div className="mt-6 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
            Escape the Valley Heat. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300">
              Find Your Cool Within 90 Minutes.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl text-balance">
            When {baseCity.name} hits triple digits, step into 71°F pine-fringed Sierra waters, 
            coastal marine breezes at Santa Cruz, or subterranean 68°F stone grottos. Real-time temperature 
            deltas curated for Central Valley road trips.
          </p>

          {/* Interactive Hero Spotlight Delta Card */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-700/80 max-w-xl shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5" />
                  Top Recommended Escape
                </div>
                <div className="text-lg font-bold text-white mt-0.5">
                  {heroGetaway.title}
                </div>
                <div className="text-xs text-stone-300 flex items-center gap-2 mt-1">
                  <span>{heroRoute.driveTime} from {baseCity.name}</span>
                  <span>·</span>
                  <span>{heroRoute.distanceMiles} miles via {heroRoute.routeHighway}</span>
                </div>
              </div>

              {/* Dynamic Delta Metric Box */}
              <div className="text-right shrink-0 bg-stone-800/90 px-3.5 py-2 rounded-xl border border-stone-700">
                <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                  {toDisplayTemp(heroDestTempF, unit)}
                </div>
                <div className="text-[11px] font-bold text-emerald-300 font-mono tabular-nums">
                  {delta.text}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-300 italic truncate max-w-xs sm:max-w-md">
                "{heroGetaway.summary}"
              </span>
              <button
                onClick={() => onExploreGetaway(heroGetaway)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-colors shrink-0 ml-2"
              >
                <span>View Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Bar: Search + Drive Time Selector */}
        <div className="mt-10 pt-6 border-t border-stone-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search escapes, lakes, rivers, or events from ${baseCity.name}...`}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-stone-800/90 text-white placeholder-stone-400 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Drive Time Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            <span className="text-xs font-semibold text-stone-400 whitespace-nowrap shrink-0 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Drive Limit:
            </span>
            {[
              { label: 'Any', value: null },
              { label: '≤ 45 min', value: 45 },
              { label: '≤ 90 min', value: 90 },
              { label: '≤ 2 hrs', value: 120 },
            ].map((opt) => {
              const active = maxDriveMinutes === opt.value;
              return (
                <button
                  key={opt.label}
                  onClick={() => onSelectMaxDrive(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
