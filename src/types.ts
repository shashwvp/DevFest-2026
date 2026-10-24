export type BaseCityId = 'modesto' | 'turlock' | 'stockton' | 'fresno';

export interface BaseCity {
  id: BaseCityId;
  name: string;
  tagline: string;
  county: string;
  elevation: string;
  elevationFt: number;
  coordinates: {
    lat: number;
    lon: number;
  };
  defaultSummerTempF: number;
  highHeatTempF: number;
  mildTempF: number;
  condition: string;
  icon: string;
  primaryHighway: string;
}

export type QuickFilterId = 
  | 'all' 
  | 'coolest-outdoors' 
  | 'air-conditioned-indoors' 
  | 'foothill-getaways';

export type CategoryId = 
  | 'all' 
  | 'cool-outdoor' 
  | 'river-shaded' 
  | 'indoor-ac' 
  | 'foothills-wine' 
  | 'coastal' 
  | 'evening';

export interface RouteDetail {
  driveTime: string;
  driveTimeMinutes: number;
  distanceMiles: number;
  routeHighway: string;
  tip: string;
}

export type EventCategoryBadge = 
  | 'Outdoor / Water' 
  | 'Indoor AC' 
  | 'Foothill Social' 
  | 'Live Music / Patio' 
  | 'Nature & Heritage';

export interface GetawayEvent {
  id: string;
  destinationId: string;
  destinationTitle: string;
  title: string;
  date: string;
  time: string;
  categoryBadge: EventCategoryBadge;
  eveningTempF: number;
  location: string;
  description: string;
  isFree?: boolean;
  admissionText?: string;
}

export interface Getaway {
  id: string;
  title: string;
  subtitle: string;
  category: CategoryId;
  categoryLabel: string;
  region: string;
  county: string;
  elevation: string;
  elevationFt: number;
  image: string;
  fallbackGradient: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  defaultTempF: number;
  highHeatTempF: number;
  mildTempF: number;
  condition: string;
  conditionIcon: string;
  reliefType: 'alpine' | 'coastal' | 'water' | 'underground' | 'evening';
  waterTempF?: string;
  isIndoorAc?: boolean;
  indoorAcTempF?: number;
  baseCityRoutes: Record<BaseCityId, RouteDetail>;
  summary: string;
  description: string;
  highlights: string[];
  whatToPack: string[];
  bestDepartureTip: string;
  admissionInfo: string;
  shadeRating: 'Heavy Shaded Ponderosa Canopy' | 'Coastal Fog & Ocean Breeze' | 'Cool River Willow Cover' | 'Subterranean 100% Shade' | 'Open Twilight Sky';
  quickFilters?: QuickFilterId[];
  microclimateBadges?: string[];
  eventTags?: string[];
  events?: GetawayEvent[];
}

export type WeatherScenario = 'live' | 'scorcher' | 'summer' | 'mild';
export type TempUnit = 'F' | 'C';
