import React from 'react';
import { BaseCity, Getaway, TempUnit } from '../types';
import { toDisplayTemp } from '../services/weatherService';
import { Mountain, Waves, Sun, TrendingDown } from 'lucide-react';

interface ThermalElevationProfileProps {
  baseCity: BaseCity;
  baseTempF: number;
  getaways: Getaway[];
  destinationTemps: Record<string, number>;
  unit: TempUnit;
  onSelectGetaway: (getaway: Getaway) => void;
}

export const ThermalElevationProfile: React.FC<ThermalElevationProfileProps> = ({
  baseCity,
  baseTempF,
  getaways,
  destinationTemps,
  unit,
  onSelectGetaway,
}) => {
  // Key points across the thermal transect
  const transectPoints = [
    {
      id: 'santa-cruz-coast',
      label: 'Pacific Ocean',
      sublabel: 'Santa Cruz',
      elevation: '20 ft',
      type: 'coastal',
      color: 'bg-blue-600',
    },
    {
      id: 'base-city',
      label: `${baseCity.name} (Base)`,
      sublabel: 'Valley Floor Basin',
      elevation: baseCity.elevation,
      type: 'valley',
      color: 'bg-amber-600',
      isBase: true,
    },
    {
      id: 'knights-ferry-river',
      label: 'Stanislaus River',
      sublabel: 'Knights Ferry',
      elevation: '330 ft',
      type: 'river',
      color: 'bg-teal-600',
    },
    {
      id: 'murphys-wine-caves',
      label: 'Gold Foothills',
      sublabel: 'Murphys Caves',
      elevation: '2,170 ft',
      type: 'foothill',
      color: 'bg-emerald-600',
    },
    {
      id: 'calaveras-big-trees',
      label: 'Giant Sequoias',
      sublabel: 'Big Trees',
      elevation: '4,750 ft',
      type: 'pine',
      color: 'bg-emerald-700',
    },
    {
      id: 'pinecrest-lake',
      label: 'High Sierra',
      sublabel: 'Pinecrest Lake',
      elevation: '5,600 ft',
      type: 'alpine',
      color: 'bg-cyan-700',
    },
  ];

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 my-8 p-6 sm:p-8 bg-stone-900 rounded-3xl border border-stone-800 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5" />
            Thermal Transect Profile
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Why It Works: The Valley Basin Lapse Rate & Ocean Inversion
          </h2>
          <p className="text-sm text-stone-300 mt-1 max-w-2xl">
            Temperatures drop ~3.5°F for every 1,000 feet of Sierra elevation gain, while coastal marine air 
            blocks the Central Valley heat dome from the west.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-stone-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Valley Floor ({toDisplayTemp(baseTempF, unit)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Escapes (Cooler)</span>
          </div>
        </div>
      </div>

      {/* Schematic Transect Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {transectPoints.map((point) => {
          let tempF = baseTempF;
          let matchedGetaway: Getaway | undefined;

          if (point.id !== 'base-city') {
            matchedGetaway = getaways.find((g) => g.id === point.id);
            if (matchedGetaway) {
              tempF = destinationTemps[matchedGetaway.id] || matchedGetaway.defaultTempF;
            }
          }

          const isBase = point.isBase;
          const diffF = tempF - baseTempF;
          const isCooler = diffF < 0;

          return (
            <button
              key={point.id}
              onClick={() => matchedGetaway && onSelectGetaway(matchedGetaway)}
              disabled={isBase}
              className={`text-left p-4 rounded-2xl transition-all relative overflow-hidden flex flex-col justify-between border ${
                isBase
                  ? 'bg-amber-950/40 border-amber-500/50 ring-1 ring-amber-500/30'
                  : 'bg-stone-800/80 border-stone-700/80 hover:bg-stone-700/90 hover:border-amber-400/50 cursor-pointer'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-stone-400">
                  <span className="font-mono">{point.elevation}</span>
                  {isBase ? (
                    <span className="text-amber-400 font-bold uppercase text-[10px]">Your Base</span>
                  ) : (
                    <span className="text-emerald-400 font-mono text-[11px] font-bold">
                      {isCooler ? `${diffF}°F` : '0°F'}
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-white mt-1 leading-snug">
                  {point.label}
                </div>
                <div className="text-xs text-stone-300">
                  {point.sublabel}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-700/60 flex items-center justify-between">
                <div className={`text-xl font-extrabold font-mono tabular-nums ${
                  isBase ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {toDisplayTemp(tempF, unit)}
                </div>
                <div className="text-stone-400 text-xs">
                  {point.type === 'coastal' && <Waves className="w-4 h-4 text-blue-400" />}
                  {point.type === 'valley' && <Sun className="w-4 h-4 text-amber-400" />}
                  {(point.type === 'alpine' || point.type === 'pine' || point.type === 'foothill' || point.type === 'river') && (
                    <Mountain className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
