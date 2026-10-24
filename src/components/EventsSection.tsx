import React, { useState } from 'react';
import { GetawayEvent, TempUnit, BaseCity, EventCategoryBadge, Getaway } from '../types';
import { toDisplayTemp, formatDelta } from '../services/weatherService';
import { Calendar, Moon, MapPin, Clock, ArrowRight, Waves, Warehouse, Music, Trees } from 'lucide-react';

interface EventsSectionProps {
  events: GetawayEvent[];
  baseCity: BaseCity;
  baseTempF: number;
  unit: TempUnit;
  onSelectGetawayById?: (destinationId: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  baseCity,
  baseTempF,
  unit,
  onSelectGetawayById,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<string>('all');

  const filterBadges: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Matched Events', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'Outdoor / Water', label: 'Outdoor / Water', icon: <Waves className="w-3.5 h-3.5" /> },
    { id: 'Indoor AC', label: 'Indoor AC', icon: <Warehouse className="w-3.5 h-3.5" /> },
    { id: 'Live Music / Patio', label: 'Live Music / Patio', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'Nature & Heritage', label: 'Nature & Heritage', icon: <Trees className="w-3.5 h-3.5" /> },
  ];

  const filteredEvents = events.filter((ev) => {
    if (selectedBadge === 'all') return true;
    return ev.categoryBadge === selectedBadge;
  });

  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 my-14 pt-10 border-t border-stone-200" id="events-matching">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Event Matching Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 mt-1">
            Matched Local Getaway Events
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Realistic seasonal events mapped directly to our cool-weather getaways. Compare evening and water 
            temperatures directly against {baseCity.name} valley heat.
          </p>
        </div>

        {/* Category Badges Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {filterBadges.map((badge) => {
            const isActive = selectedBadge === badge.id;
            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200/80'
                }`}
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((ev) => {
          const delta = formatDelta(ev.eveningTempF, baseTempF, unit, baseCity.name);

          return (
            <div
              key={ev.id}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Time Row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-tight uppercase ${
                    ev.categoryBadge === 'Indoor AC'
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : ev.categoryBadge === 'Outdoor / Water'
                      ? 'bg-teal-100 text-teal-900 border border-teal-200'
                      : ev.categoryBadge === 'Live Music / Patio'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}>
                    {ev.categoryBadge}
                  </span>

                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {ev.time}
                  </span>
                </div>

                {/* Event Name */}
                <h3 className="text-base font-bold text-stone-900 leading-snug group-hover:text-amber-700 transition-colors">
                  {ev.title}
                </h3>

                {/* Mapped Destination / Location */}
                <div className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{ev.location}</span>
                </div>

                {/* Event Description */}
                <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              {/* Bottom Temperature Delta & Action */}
              <div className="mt-5 pt-3.5 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-stone-900">
                      {toDisplayTemp(ev.eveningTempF, unit)}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="font-bold text-emerald-700">
                      {delta.text}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-stone-500">
                    {ev.admissionText || (ev.isFree ? 'Free Admission' : 'Standard Entry')}
                  </span>
                </div>

                {onSelectGetawayById && (
                  <button
                    onClick={() => onSelectGetawayById(ev.destinationId)}
                    className="w-full py-2 px-3 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View {ev.destinationTitle} Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
