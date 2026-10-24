import React from 'react';
import { BaseCityId, BaseCity, TempUnit, WeatherScenario } from '../types';
import { toDisplayTemp } from '../services/weatherService';
import { Compass, Bookmark, Thermometer, RefreshCw } from 'lucide-react';

interface HeaderBarProps {
  baseCities: Record<string, BaseCity>;
  activeBaseCityId: BaseCityId;
  onSelectBaseCity: (id: BaseCityId) => void;
  baseTempF: number;
  conditionIcon: string;
  conditionText: string;
  isLiveWeather: boolean;
  unit: TempUnit;
  onToggleUnit: () => void;
  scenario: WeatherScenario;
  onSelectScenario: (scen: WeatherScenario) => void;
  onRefreshWeather: () => void;
  isRefreshing: boolean;
  savedCount: number;
  onOpenSavedDrawer: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  baseCities,
  activeBaseCityId,
  onSelectBaseCity,
  baseTempF,
  conditionIcon,
  conditionText,
  isLiveWeather,
  unit,
  onToggleUnit,
  scenario,
  onSelectScenario,
  onRefreshWeather,
  isRefreshing,
  savedCount,
  onOpenSavedDrawer,
}) => {
  const activeCity = baseCities[activeBaseCityId];
  const cityKeys: BaseCityId[] = ['modesto', 'turlock', 'stockton', 'fresno'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-900 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Zone 1: App Brand Wordmark & Location indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <a href="#" className="text-xl font-extrabold tracking-tight text-stone-900 hover:text-amber-700 transition-colors whitespace-nowrap">
                Valley Escape
              </a>
              <div className="text-[11px] text-stone-500 hidden sm:block font-medium">
                Central Valley Beat-The-Heat Guide
              </div>
            </div>
          </div>

          {/* Zone 2: Base City Selector Buttons (Modesto default, Turlock, Stockton, Fresno) */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200/80 overflow-x-auto scrollbar-none max-w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 px-2 hidden lg:inline-block select-none">
              Base:
            </span>
            {cityKeys.map((cityId) => {
              const city = baseCities[cityId];
              const isSelected = activeBaseCityId === cityId;
              return (
                <button
                  key={cityId}
                  onClick={() => onSelectBaseCity(cityId)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                  aria-pressed={isSelected}
                  title={`Set ${city.name} as your departure point (${city.elevation})`}
                >
                  <span>{city.name}</span>
                  {isSelected && <span className="text-[10px] opacity-80">★</span>}
                </button>
              );
            })}
          </div>

          {/* Zone 3: Prominent Base City Temperature & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Prominent Current Base City Temperature Badge */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200/90 rounded-xl text-stone-900 shadow-2xs"
              title={`Current weather in ${activeCity.name}: ${conditionText}`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg" aria-hidden="true">{conditionIcon}</span>
                <div className="flex flex-col text-left leading-tight">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                    {activeCity.name} Base
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-stone-950 font-mono tabular-nums">
                    {toDisplayTemp(baseTempF, unit)}
                  </div>
                </div>
              </div>

              {/* Weather Refresh / Live Indicator */}
              <button
                onClick={onRefreshWeather}
                disabled={isRefreshing}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors rounded-md hover:bg-amber-100/60 ml-0.5"
                title={isLiveWeather ? 'Live weather active (click to refresh)' : 'Simulated weather active (click to check live)'}
                aria-label="Refresh weather data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
              </button>
            </div>

            {/* Scenario Quick Selector (Desktop) */}
            <div className="hidden xl:flex items-center">
              <select
                value={scenario}
                onChange={(e) => onSelectScenario(e.target.value as WeatherScenario)}
                className="text-xs bg-stone-50 border border-stone-200 text-stone-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                title="Simulate heat scenario"
              >
                <option value="summer">Classic Summer (98°F)</option>
                <option value="scorcher">Heatwave (104°F+)</option>
                <option value="mild">Mild Spring/Fall (86°F)</option>
                <option value="live">Live Satellite Weather</option>
              </select>
            </div>

            {/* Fahrenheit / Celsius Toggle */}
            <button
              onClick={onToggleUnit}
              className="px-2.5 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-lg transition-colors font-mono tabular-nums"
              title="Toggle °F / °C"
            >
              °{unit}
            </button>

            {/* Saved Escapes Planner Drawer Button */}
            <button
              onClick={onOpenSavedDrawer}
              className="relative p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200/80"
              title="My Weekend Escape Itinerary"
              aria-label="Saved Escapes"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
