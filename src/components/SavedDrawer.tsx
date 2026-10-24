import React from 'react';
import { BaseCity, Getaway, TempUnit } from '../types';
import { toDisplayTemp, formatDelta } from '../services/weatherService';
import { X, Trash2, MapPin, Clock, ArrowRight, Share2, CheckSquare } from 'lucide-react';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedGetaways: Getaway[];
  baseCity: BaseCity;
  baseTempF: number;
  destinationTemps: Record<string, number>;
  unit: TempUnit;
  onRemove: (id: string) => void;
  onSelectGetaway: (getaway: Getaway) => void;
  onClearAll: () => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedGetaways,
  baseCity,
  baseTempF,
  destinationTemps,
  unit,
  onRemove,
  onSelectGetaway,
  onClearAll,
}) => {
  if (!isOpen) return null;

  // Aggregate packing list
  const combinedPackingItems = Array.from(
    new Set(savedGetaways.flatMap((g) => g.whatToPack))
  );

  const handleCopyItinerary = () => {
    if (savedGetaways.length === 0) return;
    const lines = [
      `🌊 My Valley Escape Plan from ${baseCity.name} (${toDisplayTemp(baseTempF, unit)})`,
      `----------------------------------------------------`,
      ...savedGetaways.map((g) => {
        const destTemp = destinationTemps[g.id] || g.defaultTempF;
        const route = g.baseCityRoutes[baseCity.id] || g.baseCityRoutes.modesto;
        const delta = formatDelta(destTemp, baseTempF, unit);
        return `• ${g.title}: ${toDisplayTemp(destTemp, unit)} (${delta.text})\n  Drive: ${route.driveTime} (${route.distanceMiles} mi via ${route.routeHighway})\n  Tip: ${route.tip}`;
      }),
      `\n🎒 Recommended Packing List:`,
      ...combinedPackingItems.map((item) => `  [ ] ${item}`),
    ];

    if (navigator.clipboard) {
      navigator.clipboard.writeText(lines.join('\n'));
      alert('Weekend Escape Plan copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              My Weekend Escape Plan
            </h2>
            <div className="text-xs text-stone-500 font-medium">
              Base: {baseCity.name} · {savedGetaways.length} destination{savedGetaways.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedGetaways.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-stone-400 hover:text-rose-600 transition-colors p-1.5"
                title="Clear all saved"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {savedGetaways.length === 0 ? (
            <div className="text-center py-16 text-stone-400 space-y-3">
              <div className="text-4xl">🌲</div>
              <div className="text-sm font-semibold text-stone-600">No escapes saved yet</div>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Click the bookmark icon on any getaway card to build your personalized beat-the-heat road trip!
              </p>
            </div>
          ) : (
            <>
              {savedGetaways.map((getaway) => {
                const destTemp = destinationTemps[getaway.id] || getaway.defaultTempF;
                const route = getaway.baseCityRoutes[baseCity.id] || getaway.baseCityRoutes.modesto;
                const delta = formatDelta(destTemp, baseTempF, unit);

                return (
                  <div
                    key={getaway.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-stone-50 transition-colors relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-stone-500 font-medium">
                          {getaway.county} · {getaway.elevation}
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                          {getaway.title}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-extrabold font-mono text-stone-900">
                          {toDisplayTemp(destTemp, unit)}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600 font-mono">
                          {delta.text}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
                      <div className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{route.driveTime}</span>
                        <span>·</span>
                        <span>{route.distanceMiles} mi</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onSelectGetaway(getaway);
                            onClose();
                          }}
                          className="text-amber-700 hover:text-amber-800 font-semibold text-xs"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => onRemove(getaway.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Dynamic Packing Checklist */}
              {combinedPackingItems.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                    Combined Packing Checklist
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {combinedPackingItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {savedGetaways.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
            <button
              onClick={handleCopyItinerary}
              className="w-full py-2.5 px-4 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Weekend Plan to Share</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
