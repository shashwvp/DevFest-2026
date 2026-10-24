import React from 'react';
import { BaseCity, Getaway, TempUnit } from '../types';
import { toDisplayTemp, formatDelta } from '../services/weatherService';
import {
  Clock,
  MapPin,
  Bookmark,
  ArrowRight,
  Waves,
  Calendar,
  CloudFog,
  Sparkles,
  TrendingDown,
} from 'lucide-react';

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
        {/* Measured Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

        {/* Top Floating Controls */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          {/* Category Tag Badge */}
          <span className="px-2.5 py-1 rounded-lg bg-stone-950/70 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 shadow-xs">
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

        {/* Bottom Media Bar: Temperature Badge Tag & Delta */}
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
          <div className="flex items-center gap-2">
            {/* Temperature Badge Tag */}
            <div className="px-3 py-1.5 rounded-xl bg-stone-900/80 backdrop-blur-md border border-white/20 text-white shadow-xs">
              <div className="text-xl sm:text-2xl font-black font-mono tabular-nums leading-none">
                {toDisplayTemp(destTempF, unit)}
              </div>
            </div>

            {/* Difference Tag */}
            <div className="text-xs font-extrabold text-emerald-300 font-mono tabular-nums drop-shadow-xs">
              {delta.text}
            </div>
          </div>

          {getaway.waterTempF && (
            <div className="text-[11px] font-medium text-cyan-200 flex items-center gap-1 drop-shadow-xs bg-stone-950/60 px-2 py-1 rounded-lg backdrop-blur-xs border border-cyan-400/30">
              <Waves className="w-3.5 h-3.5" />
              <span>{getaway.waterTempF}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Badge Tags Row: Temperature Delta Tag & Microclimate Status Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {/* Prominent Delta Badge Tag */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono border ${
              delta.isCooler
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-stone-50 text-stone-700 border-stone-200'
            }`}>
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>{delta.text}</span>
            </span>

            {/* Microclimate Status Badges ("Above the Fog", "Misted Patio", "20°+ Drop") */}
            {getaway.microclimateBadges?.map((badge, idx) => {
              const isDrop = badge.includes('Drop');
              const isFog = badge.includes('Fog');
              const isPatio = badge.includes('Patio');
              const isRiver = badge.includes('River');
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold tracking-tight border ${
                    isDrop
                      ? 'bg-cyan-50 text-cyan-900 border-cyan-200'
                      : isFog
                      ? 'bg-sky-50 text-sky-900 border-sky-200'
                      : isPatio
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : isRiver
                      ? 'bg-teal-50 text-teal-900 border-teal-200'
                      : 'bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  {isDrop && <span className="text-[10px]">❄️</span>}
                  {isFog && <CloudFog className="w-3 h-3 text-sky-600" />}
                  {isPatio && <Sparkles className="w-3 h-3 text-amber-600" />}
                  <span>{badge}</span>
                </span>
              );
            })}
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span>{getaway.county}</span>
            <span aria-hidden="true">·</span>
            <span>{getaway.elevation}</span>
            <span aria-hidden="true">·</span>
            <span>{getaway.shadeRating}</span>
          </div>

          {/* Destination Title */}
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

          {/* Matched Local Event Inside Card */}
          {getaway.events && getaway.events.length > 0 && (
            <div className="mt-3.5 p-3 rounded-xl bg-stone-50 border border-stone-200/90 text-left">
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Matched Event</span>
                </div>

                {/* Event Category Badge Tag */}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight uppercase ${
                  getaway.events[0].categoryBadge === 'Indoor AC'
                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                    : getaway.events[0].categoryBadge === 'Outdoor / Water'
                    ? 'bg-teal-100 text-teal-900 border border-teal-200'
                    : getaway.events[0].categoryBadge === 'Live Music / Patio'
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  {getaway.events[0].categoryBadge}
                </span>
              </div>

              {/* Event Name */}
              <div className="text-xs font-bold text-stone-900 truncate">
                {getaway.events[0].title}
              </div>

              {/* Event Time */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{getaway.events[0].time}</span>
                </span>

                {getaway.events.length > 1 && (
                  <span className="text-amber-700 font-semibold text-[10px]">
                    +{getaway.events.length - 1} more
                  </span>
                )}
              </div>

              {/* Event Tags Badge Tags */}
              {getaway.eventTags && getaway.eventTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-stone-200/60">
                  {getaway.eventTags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-stone-200/80 text-stone-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Action */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            {getaway.events && getaway.events.length > 0
              ? `${getaway.events.length} cool event${getaway.events.length === 1 ? '' : 's'}`
              : 'Open daily'}
          </span>

          <button
            onClick={() => onSelect(getaway)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 rounded-lg transition-colors cursor-pointer"
          >
            <span>Explore Escape</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
