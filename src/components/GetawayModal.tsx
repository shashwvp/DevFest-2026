import React from 'react';
import { BaseCity, BaseCityId, Getaway, TempUnit } from '../types';
import { toDisplayTemp, formatDelta } from '../services/weatherService';
import {
  X,
  Compass,
  Clock,
  MapPin,
  Waves,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Calendar,
  Share2,
  Navigation,
} from 'lucide-react';

interface GetawayModalProps {
  getaway: Getaway | null;
  baseCities: Record<string, BaseCity>;
  activeBaseCityId: BaseCityId;
  onSelectBaseCity: (id: BaseCityId) => void;
  baseTempF: number;
  destTempF: number;
  unit: TempUnit;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
}

export const GetawayModal: React.FC<GetawayModalProps> = ({
  getaway,
  baseCities,
  activeBaseCityId,
  onSelectBaseCity,
  baseTempF,
  destTempF,
  unit,
  isSaved,
  onToggleSave,
  onClose,
}) => {
  if (!getaway) return null;

  const activeBaseCity = baseCities[activeBaseCityId];
  const route = getaway.baseCityRoutes[activeBaseCityId] || getaway.baseCityRoutes.modesto;
  const delta = formatDelta(destTempF, baseTempF, unit, activeBaseCity.name);

  const cityKeys: BaseCityId[] = ['modesto', 'turlock', 'stockton', 'fresno'];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out ${getaway.title} on Valley Escape! It's currently ${toDisplayTemp(
          destTempF,
          unit
        )} (${delta.text} vs ${activeBaseCity.name}). Route: ${route.driveTime} via ${route.routeHighway}.`
      );
      alert('Trip details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Sticky Close & Top Actions */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-colors backdrop-blur-md"
            title="Share this escape"
            aria-label="Share escape"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleSave(getaway.id)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900/70 hover:bg-stone-900 text-white'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to My Weekend Escape'}
            aria-label="Save getaway"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-colors backdrop-blur-md"
            title="Close"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Visual Area */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-stone-900">
          <img
            src={getaway.image}
            alt={getaway.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="text-xs font-semibold text-amber-300 flex items-center gap-2 mb-1">
              <span>{getaway.region}</span>
              <span>·</span>
              <span>{getaway.county}</span>
              <span>·</span>
              <span>{getaway.elevation}</span>
            </div>
            <h2 id="modal-title" className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {getaway.title}
            </h2>
            <p className="text-sm text-stone-300 mt-1 max-w-2xl">
              {getaway.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Temperature Delta Comparison Bar */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              {/* Base City Temp */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {activeBaseCity.name} Valley Floor
                  </div>
                  <div className="text-xl font-black text-stone-900 font-mono tabular-nums">
                    {toDisplayTemp(baseTempF, unit)}
                  </div>
                </div>
              </div>

              {/* Delta Relief Badge */}
              <div className="text-center sm:px-6 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Thermal Relief Delta
                </div>
                <div className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
                  {delta.text}
                </div>
              </div>

              {/* Destination Temp */}
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {getaway.title.split(' ')[0]} Microclimate
                  </div>
                  <div className="text-xl font-black text-stone-900 font-mono tabular-nums">
                    {toDisplayTemp(destTempF, unit)}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 text-lg">
                  {getaway.conditionIcon}
                </div>
              </div>

            </div>

            {getaway.waterTempF && (
              <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-600" />
                  Water Temperature:
                </span>
                <span className="font-mono font-bold text-cyan-700">{getaway.waterTempF}</span>
              </div>
            )}
          </div>

          {/* Route & Departure Switcher */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-700" />
                <span className="text-sm font-bold text-stone-900">
                  Drive from Central Valley Departure Base
                </span>
              </div>

              {/* City Switcher */}
              <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-lg">
                {cityKeys.map((cKey) => (
                  <button
                    key={cKey}
                    onClick={() => onSelectBaseCity(cKey)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      activeBaseCityId === cKey
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {baseCities[cKey].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-800">
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <div className="text-[11px] font-semibold text-stone-500 uppercase">Drive Time</div>
                <div className="text-base font-bold font-mono text-stone-950 mt-0.5">
                  {route.driveTime}
                </div>
                <div className="text-xs text-stone-500 font-mono">{route.distanceMiles} miles</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 sm:col-span-2">
                <div className="text-[11px] font-semibold text-stone-500 uppercase">Recommended Highway Route</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">
                  {route.routeHighway}
                </div>
                <div className="text-xs text-amber-900 mt-1 font-medium">
                  💡 {route.tip}
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-stone-600 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span><strong>Timing Tip:</strong> {getaway.bestDepartureTip}</span>
            </div>
          </div>

          {/* Deep-Dive Narrative Description */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              About This Valley Getaway
            </h3>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {getaway.description}
            </p>
          </div>

          {/* Highlights & What to Pack Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Highlights */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
              <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Highlights & Activities
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                {getaway.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Pack */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
              <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                What to Pack for Thermal Comfort
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                {getaway.whatToPack.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Admission & Logistics */}
          <div className="text-xs text-stone-600 p-4 rounded-xl bg-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-stone-800">Pass & Admission Info: </span>
              <span>{getaway.admissionInfo}</span>
            </div>
            <div className="font-mono text-stone-500 text-[11px]">
              GPS: {getaway.coordinates.lat.toFixed(4)}, {getaway.coordinates.lon.toFixed(4)}
            </div>
          </div>

          {/* Upcoming Events at this Getaway */}
          {getaway.events && getaway.events.length > 0 && (
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Upcoming Cool Down Events
              </h4>
              <div className="space-y-3">
                {getaway.events.map((ev) => (
                  <div key={ev.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-stone-900">{ev.title}</div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                        <span>{ev.date}</span>
                        <span>·</span>
                        <span>{ev.time}</span>
                        <span>·</span>
                        <span>{ev.location}</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">{ev.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-emerald-700">
                        {toDisplayTemp(ev.eveningTempF, unit)} Evening
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                        {ev.isFree ? 'Free Admission' : 'Standard Entry'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action CTA */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={() => onToggleSave(getaway.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
                isSaved
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved to Your Trip' : 'Save to Weekend Itinerary'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
