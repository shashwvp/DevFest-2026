import React from 'react';
import { Compass, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-100 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">Valley Escape</div>
              <div className="text-stone-500 text-[11px]">
                Weather-smart getaway discovery for California's Great Central Valley
              </div>
            </div>
          </div>

          <div className="text-stone-500 leading-relaxed max-w-md">
            Serving residents of Modesto, Turlock, Stockton, Fresno, and surrounding San Joaquin Valley 
            communities seeking cooler alpine air, ocean breezes, and shaded river runs.
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500">
          <div>
            © {new Date().getFullYear()} Valley Escape. Real-time lapse rates and thermal microclimate guide.
          </div>
          <div className="flex items-center gap-4">
            <a href="#top" className="hover:text-stone-900 transition-colors">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
