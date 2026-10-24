/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BaseCityId, CategoryId, Getaway, TempUnit, WeatherScenario } from './types';
import { BASE_CITIES, GETAWAYS, ALL_EVENTS } from './data/centralValleyData';
import {
  fetchLiveWeather,
  getScenarioTemp,
  toDisplayTemp,
  formatDelta,
} from './services/weatherService';
import { HeaderBar } from './components/HeaderBar';
import { HeroSection } from './components/HeroSection';
import { ThermalElevationProfile } from './components/ThermalElevationProfile';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { GetawayCard } from './components/GetawayCard';
import { GetawayModal } from './components/GetawayModal';
import { SavedDrawer } from './components/SavedDrawer';
import { EventsSection } from './components/EventsSection';
import { Footer } from './components/Footer';
import { CloudSun, SearchX } from 'lucide-react';

export default function App() {
  // Base City state: defaults to 'modesto' as specified
  const [activeBaseCityId, setActiveBaseCityId] = useState<BaseCityId>('modesto');
  const activeBaseCity = BASE_CITIES[activeBaseCityId] || BASE_CITIES.modesto;

  // Temperature unit state (°F / °C)
  const [unit, setUnit] = useState<TempUnit>('F');

  // Weather scenario ('live', 'summer', 'scorcher', 'mild')
  const [scenario, setScenario] = useState<WeatherScenario>('live');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [liveBaseWeather, setLiveBaseWeather] = useState<{
    tempF: number;
    condition: string;
    icon: string;
    isLive: boolean;
  }>({
    tempF: BASE_CITIES.modesto.defaultSummerTempF,
    condition: BASE_CITIES.modesto.condition,
    icon: BASE_CITIES.modesto.icon,
    isLive: false,
  });

  // Live destination temperatures dictionary: getawayId -> tempF
  const [destinationLiveTemps, setDestinationLiveTemps] = useState<Record<string, number>>({});

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxDriveMinutes, setMaxDriveMinutes] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'coolest' | 'drive' | 'elevation' | 'popular'>('coolest');

  // Modal & Drawer states
  const [selectedGetaway, setSelectedGetaway] = useState<Getaway | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);

  // Saved/Bookmarked getaways in localStorage
  const [savedGetawayIds, setSavedGetawayIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('valley_escape_saved');
      return saved ? JSON.parse(saved) : ['pinecrest-lake', 'knights-ferry'];
    } catch {
      return ['pinecrest-lake', 'knights-ferry'];
    }
  });

  const handleToggleSave = useCallback((id: string) => {
    setSavedGetawayIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('valley_escape_saved', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleClearSaved = useCallback(() => {
    setSavedGetawayIds([]);
    try {
      localStorage.removeItem('valley_escape_saved');
    } catch {
      // ignore
    }
  }, []);

  // Fetch weather dynamically from Open-Meteo for base city & all escape destinations
  const refreshCityWeather = useCallback(async () => {
    setIsRefreshing(true);
    const city = BASE_CITIES[activeBaseCityId];
    try {
      // 1. Fetch live Open-Meteo weather for the active departure base city
      const weather = await fetchLiveWeather(
        city.coordinates.lat,
        city.coordinates.lon,
        city.defaultSummerTempF,
        city.condition,
        city.icon
      );
      setLiveBaseWeather(weather);

      // 2. Dynamically fetch live Open-Meteo temperatures for all escape destinations using lat/long
      const destPromises = GETAWAYS.map(async (g) => {
        const destWeather = await fetchLiveWeather(
          g.coordinates.lat,
          g.coordinates.lon,
          g.defaultTempF,
          g.condition,
          g.conditionIcon
        );
        return {
          id: g.id,
          tempF: g.isIndoorAc ? (g.indoorAcTempF || 68) : destWeather.tempF,
        };
      });

      const destResults = await Promise.all(destPromises);
      const tempsMap: Record<string, number> = {};
      destResults.forEach((item) => {
        tempsMap[item.id] = item.tempF;
      });
      setDestinationLiveTemps(tempsMap);
    } finally {
      setIsRefreshing(false);
    }
  }, [activeBaseCityId]);

  useEffect(() => {
    refreshCityWeather();
  }, [refreshCityWeather]);

  // Compute effective base city temperature based on scenario
  const currentBaseTempF = useMemo(() => {
    return getScenarioTemp(activeBaseCity, scenario, liveBaseWeather.isLive ? liveBaseWeather.tempF : undefined);
  }, [activeBaseCity, scenario, liveBaseWeather]);

  // Compute effective temperature for all getaways
  const getawayTempsF = useMemo(() => {
    const result: Record<string, number> = {};
    for (const g of GETAWAYS) {
      const live = destinationLiveTemps[g.id];
      result[g.id] = getScenarioTemp(g, scenario, live);
    }
    return result;
  }, [scenario, destinationLiveTemps]);

  // Filtered and sorted getaways
  const filteredGetaways = useMemo(() => {
    return GETAWAYS.filter((g) => {
      // Category filter
      if (activeCategory !== 'all' && g.category !== activeCategory) {
        return false;
      }

      // Max drive time filter
      const route = g.baseCityRoutes[activeBaseCityId] || g.baseCityRoutes.modesto;
      if (maxDriveMinutes !== null && route.driveTimeMinutes > maxDriveMinutes) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = g.title.toLowerCase().includes(query);
        const matchesSummary = g.summary.toLowerCase().includes(query);
        const matchesCounty = g.county.toLowerCase().includes(query);
        const matchesHighlights = g.highlights.some((h) => h.toLowerCase().includes(query));
        const matchesRegion = g.region.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesCounty && !matchesHighlights && !matchesRegion) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const tempA = getawayTempsF[a.id] || a.defaultTempF;
      const tempB = getawayTempsF[b.id] || b.defaultTempF;
      const routeA = a.baseCityRoutes[activeBaseCityId] || a.baseCityRoutes.modesto;
      const routeB = b.baseCityRoutes[activeBaseCityId] || b.baseCityRoutes.modesto;

      if (sortBy === 'coolest') {
        // Coolest destination first (lowest temperature)
        return tempA - tempB;
      }
      if (sortBy === 'drive') {
        // Quickest drive first
        return routeA.driveTimeMinutes - routeB.driveTimeMinutes;
      }
      if (sortBy === 'elevation') {
        // Highest elevation first
        return b.elevationFt - a.elevationFt;
      }
      // 'popular': default sequence
      return 0;
    });
  }, [activeCategory, maxDriveMinutes, searchQuery, sortBy, activeBaseCityId, getawayTempsF]);

  // Saved getaways objects
  const savedGetawaysList = useMemo(() => {
    return GETAWAYS.filter((g) => savedGetawayIds.includes(g.id));
  }, [savedGetawayIds]);

  // Hero destination (Pinecrest Lake)
  const heroGetaway = GETAWAYS[0];
  const heroDestTempF = getawayTempsF[heroGetaway.id] || heroGetaway.defaultTempF;

  return (
    <div id="top" className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased selection:bg-amber-200">
      
      {/* 1. Header Bar with Base City buttons and prominent base temperature */}
      <HeaderBar
        baseCities={BASE_CITIES}
        activeBaseCityId={activeBaseCityId}
        onSelectBaseCity={(id) => setActiveBaseCityId(id)}
        baseTempF={currentBaseTempF}
        conditionIcon={activeBaseCity.icon}
        conditionText={activeBaseCity.condition}
        isLiveWeather={liveBaseWeather.isLive}
        unit={unit}
        onToggleUnit={() => setUnit((prev) => (prev === 'F' ? 'C' : 'F'))}
        scenario={scenario}
        onSelectScenario={(s) => setScenario(s)}
        onRefreshWeather={refreshCityWeather}
        isRefreshing={isRefreshing}
        savedCount={savedGetawayIds.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />

      <main className="max-w-7xl mx-auto">
        {/* 2. Hero Section with dynamic temperature contrast & drive filter */}
        <HeroSection
          baseCity={activeBaseCity}
          baseTempF={currentBaseTempF}
          heroGetaway={heroGetaway}
          heroDestTempF={heroDestTempF}
          unit={unit}
          onExploreGetaway={(getaway) => setSelectedGetaway(getaway)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          maxDriveMinutes={maxDriveMinutes}
          onSelectMaxDrive={(m) => setMaxDriveMinutes(m)}
        />

        {/* 3. Thermal Elevation Profile: Visualizes Central Valley Lapse Rates */}
        <ThermalElevationProfile
          baseCity={activeBaseCity}
          baseTempF={currentBaseTempF}
          getaways={GETAWAYS}
          destinationTemps={getawayTempsF}
          unit={unit}
          onSelectGetaway={(getaway) => setSelectedGetaway(getaway)}
        />

        {/* 4. Category Filter & Sorting Tabs */}
        <CategoryFilterBar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          sortBy={sortBy}
          onChangeSortBy={(sort) => setSortBy(sort)}
          totalCount={filteredGetaways.length}
        />

        {/* 5. Getaways Grid */}
        <div className="mx-4 sm:mx-6 lg:mx-8">
          {filteredGetaways.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200">
              <SearchX className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-800">No escapes found</h3>
              <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                No getaways matched your search or drive-time filters from {activeBaseCity.name}. 
                Try clearing your search or extending your drive limit.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMaxDriveMinutes(null);
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-amber-600 text-white rounded-xl hover:bg-amber-500 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGetaways.map((getaway) => (
                <GetawayCard
                  key={getaway.id}
                  getaway={getaway}
                  baseCity={activeBaseCity}
                  baseTempF={currentBaseTempF}
                  destTempF={getawayTempsF[getaway.id] || getaway.defaultTempF}
                  unit={unit}
                  isSaved={savedGetawayIds.includes(getaway.id)}
                  onToggleSave={handleToggleSave}
                  onSelect={(g) => setSelectedGetaway(g)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 6. Cool Down Events Section */}
        <EventsSection
          events={ALL_EVENTS}
          baseCity={activeBaseCity}
          unit={unit}
        />
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* Getaway Deep Dive Modal */}
      <GetawayModal
        getaway={selectedGetaway}
        baseCities={BASE_CITIES}
        activeBaseCityId={activeBaseCityId}
        onSelectBaseCity={(id) => setActiveBaseCityId(id)}
        baseTempF={currentBaseTempF}
        destTempF={
          selectedGetaway
            ? getawayTempsF[selectedGetaway.id] || selectedGetaway.defaultTempF
            : 70
        }
        unit={unit}
        isSaved={selectedGetaway ? savedGetawayIds.includes(selectedGetaway.id) : false}
        onToggleSave={handleToggleSave}
        onClose={() => setSelectedGetaway(null)}
      />

      {/* Saved Escapes / Weekend Itinerary Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedGetaways={savedGetawaysList}
        baseCity={activeBaseCity}
        baseTempF={currentBaseTempF}
        destinationTemps={getawayTempsF}
        unit={unit}
        onRemove={handleToggleSave}
        onSelectGetaway={(g) => setSelectedGetaway(g)}
        onClearAll={handleClearSaved}
      />

    </div>
  );
}
