import React from 'react';
import { GetawayEvent, TempUnit, BaseCity } from '../types';
import { toDisplayTemp } from '../services/weatherService';
import { Calendar, Moon, MapPin, Ticket } from 'lucide-react';

interface EventsSectionProps {
  events: GetawayEvent[];
  baseCity: BaseCity;
  unit: TempUnit;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  baseCity,
  unit,
}) => {
  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 my-12 pt-8 border-t border-stone-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5" />
            Beat-The-Heat Calendar
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Cool Down Events & Twilight Evenings
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            When daytime heat subsides or high in the mountains where evenings are crisp, enjoy 
            twilight cinema, river floats, and starlight concerts.
          </p>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Showing regional events accessible from {baseCity.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-stone-500 font-medium mb-1.5">
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {ev.date}
                </span>
                <span>{ev.time}</span>
              </div>

              <h3 className="text-base font-bold text-stone-900 leading-snug">
                {ev.title}
              </h3>

              <div className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3 h-3 text-stone-400" />
                <span className="truncate">{ev.location}</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                {ev.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-emerald-700 font-bold font-mono">
                <Moon className="w-3.5 h-3.5" />
                <span>{toDisplayTemp(ev.eveningTempF, unit)} evening</span>
              </div>

              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                ev.isFree
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-stone-100 text-stone-600'
              }`}>
                {ev.isFree ? 'Free Event' : 'Tickets / Entry'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
