import React from 'react';
import { BaseCity, Getaway, TempUnit } from '../types';
import { toDisplayTemp, formatDelta } from '../services/weatherService';
import { Clock, MapPin, Bookmark, ArrowRight, Waves } from 'lucide-react';

interface GetawayCardProps {
  getaway: Getaway;
  baseCity: BaseCity;
  baseTempF: number;
  destTempF: number;
  unit: TempUnit;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (getaway: Getaway) => void;
}

export const GetawayCard: React.FC<GetawayCardProps> = ({
  getaway,
  baseCity,
  baseTempF,
  destTempF,
  unit,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  const route = getaway.baseCityRoutes[baseCity.id] || getaway.baseCityRoutes.modesto;
  const delta = formatDelta(destTempF, baseTempF, unit, baseCity.name);

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      
      {/* Top Media Area */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={getaway.image}
          alt={getaway.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

        {/* Top Floating Controls */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          {/* Unboxed category label with subtle shadow */}
          <span className="text-xs font-semibold text-white drop-shadow-sm flex items-center gap-1">
            <span aria-hidden="true">{getaway.conditionIcon}</span>
            <span>{getaway.categoryLabel}</span>
          </span>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(getaway.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900/60 text-white hover:bg-stone-900/90'
            }`}
            title={isSaved ? 'Remove from Saved Escapes' : 'Save to My Weekend Escape'}
            aria-label="Save getaway"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Media Bar: Prominent Temperature & Delta */}
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
          <div>
            <div className="text-2xl font-black font-mono tabular-nums leading-none drop-shadow-xs">
              {toDisplayTemp(destTempF, unit)}
            </div>
            <div className="text-xs font-bold text-emerald-300 font-mono tabular-nums mt-1 drop-shadow-xs">
              {delta.text}
            </div>
          </div>

          {getaway.waterTempF && (
            <div className="text-[11px] font-medium text-cyan-200 flex items-center gap-1 drop-shadow-xs">
              <Waves className="w-3.5 h-3.5" />
              <span>{getaway.waterTempF}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Prominent Temperature Difference Badge (e.g. 24°F Cooler than Modesto) */}
          <div className={`mb-3 px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold font-mono tabular-nums border ${
            delta.isCooler
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/90'
              : 'bg-stone-50 text-stone-700 border-stone-200'
          }`}>
            <span className="text-emerald-700 font-extrabold">{delta.text}</span>
            <span className="text-[11px] font-medium text-stone-500 font-sans">
              {getaway.isIndoorAc ? 'Indoor A/C' : getaway.condition}
            </span>
          </div>

          {/* Metadata: Clean unboxed text with typographic separators (No pills!) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span>{getaway.county}</span>
            <span aria-hidden="true">·</span>
            <span>{getaway.elevation}</span>
            <span aria-hidden="true">·</span>
            <span>{getaway.shadeRating}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-stone-900 mt-2 leading-snug group-hover:text-amber-700 transition-colors">
            {getaway.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
            {getaway.summary}
          </p>

          {/* Drive info from active base city */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{route.driveTime}</span>
              <span className="text-stone-300">·</span>
              <span>{route.distanceMiles} mi</span>
            </div>
            <div className="text-stone-500 truncate max-w-[140px] text-right font-medium">
              {route.routeHighway}
            </div>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            {getaway.events && getaway.events.length > 0
              ? `${getaway.events.length} upcoming cool event`
              : 'Open daily'}
          </span>

          <button
            onClick={() => onSelect(getaway)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 rounded-lg transition-colors"
          >
            <span>Explore Escape</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
