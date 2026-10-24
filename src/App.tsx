/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
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
  RefreshCw,
  TrendingDown,
  CloudFog,
  Sparkles,
  Droplets,
  Snowflake,
  Mountain,
  Warehouse,
  Music,
  Trees,
  X,
  Trash2,
  ArrowRight,
  SearchX,
  CheckSquare,
} from 'lucide-react';

/* ==========================================================================
   TYPES & DATA MODELS
   ========================================================================== */

export type BaseCityId = 'modesto' | 'turlock' | 'stockton' | 'fresno';

export type QuickFilterId = 
  | 'all' 
  | 'coolest-outdoors' 
  | 'air-conditioned-indoors' 
  | 'foothill-getaways';

export type EventCategoryBadge = 
  | 'Outdoor / Water' 
  | 'Indoor AC' 
  | 'Foothill Social' 
  | 'Live Music / Patio' 
  | 'Nature & Heritage';

export type WeatherScenario = 'live' | 'summer' | 'scorcher' | 'mild';
export type TempUnit = 'F' | 'C';

export interface BaseCity {
  id: BaseCityId;
  name: string;
  tagline: string;
  county: string;
  elevation: string;
  elevationFt: number;
  coordinates: { lat: number; lon: number };
  defaultSummerTempF: number;
  highHeatTempF: number;
  mildTempF: number;
  condition: string;
  icon: string;
  primaryHighway: string;
}

export interface RouteDetail {
  driveTime: string;
  driveTimeMinutes: number;
  distanceMiles: number;
  routeHighway: string;
  tip: string;
}

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
  category: string;
  categoryLabel: string;
  region: string;
  county: string;
  elevation: string;
  elevationFt: number;
  image: string;
  coordinates: { lat: number; lon: number };
  defaultTempF: number;
  highHeatTempF: number;
  mildTempF: number;
  condition: string;
  conditionIcon: string;
  waterTempF?: string;
  isIndoorAc?: boolean;
  indoorAcTempF?: number;
  quickFilters: QuickFilterId[];
  microclimateBadges: string[];
  eventTags: string[];
  baseCityRoutes: Record<BaseCityId, RouteDetail>;
  summary: string;
  description: string;
  highlights: string[];
  whatToPack: string[];
  bestDepartureTip: string;
  admissionInfo: string;
  shadeRating: string;
  events?: GetawayEvent[];
}

export interface WeatherCondition {
  tempF: number;
  condition: string;
  icon: string;
  isLive: boolean;
}

/* ==========================================================================
   CENTRAL VALLEY CITIES & GETAWAYS DATASET
   ========================================================================== */

export const BASE_CITIES: Record<BaseCityId, BaseCity> = {
  modesto: {
    id: 'modesto',
    name: 'Modesto',
    tagline: 'Water, Wealth, Contentment, Health',
    county: 'Stanislaus County',
    elevation: '88 ft',
    elevationFt: 88,
    coordinates: { lat: 37.6393, lon: -120.997 },
    defaultSummerTempF: 98,
    highHeatTempF: 104,
    mildTempF: 86,
    condition: 'Hot & Sunny',
    icon: '☀️',
    primaryHighway: 'CA-99 & CA-108',
  },
  turlock: {
    id: 'turlock',
    name: 'Turlock',
    tagline: 'Heart of the Valley',
    county: 'Stanislaus County',
    elevation: '102 ft',
    elevationFt: 102,
    coordinates: { lat: 37.4947, lon: -120.8466 },
    defaultSummerTempF: 97,
    highHeatTempF: 103,
    mildTempF: 85,
    condition: 'Clear & Sunny',
    icon: '☀️',
    primaryHighway: 'CA-99 & Geer Rd',
  },
  stockton: {
    id: 'stockton',
    name: 'Stockton',
    tagline: 'Port City of the San Joaquin',
    county: 'San Joaquin County',
    elevation: '13 ft',
    elevationFt: 13,
    coordinates: { lat: 37.9577, lon: -121.2908 },
    defaultSummerTempF: 95,
    highHeatTempF: 101,
    mildTempF: 83,
    condition: 'Sunny with Delta Haze',
    icon: '🌤️',
    primaryHighway: 'I-5 & CA-99',
  },
  fresno: {
    id: 'fresno',
    name: 'Fresno',
    tagline: 'Gateway to the High Sierra',
    county: 'Fresno County',
    elevation: '308 ft',
    elevationFt: 308,
    coordinates: { lat: 36.7468, lon: -119.7726 },
    defaultSummerTempF: 101,
    highHeatTempF: 107,
    mildTempF: 88,
    condition: 'Intense Sunshine',
    icon: '☀️',
    primaryHighway: 'CA-99 & CA-41 / CA-168',
  },
};

export const GETAWAYS: Getaway[] = [
  // 1. Pinecrest Lake (Foothills - Cool Outdoor)
  {
    id: 'pinecrest-lake',
    title: 'Pinecrest Lake',
    subtitle: 'High-elevation mountain lake in Stanislaus National Forest with granite coves and tall pines',
    category: 'cool-outdoor',
    categoryLabel: 'Foothills - Cool Outdoor',
    region: 'Central Sierra Foothills',
    county: 'Tuolumne County',
    elevation: '5,600 ft',
    elevationFt: 5600,
    image: '/src/assets/images/hero_pinecrest_lake_1792865301138.jpg',
    coordinates: { lat: 38.1974, lon: -119.9928 },
    defaultTempF: 71,
    highHeatTempF: 78,
    mildTempF: 62,
    condition: 'Alpine Breeze & Sun',
    conditionIcon: '🌲',
    waterTempF: '67°F Surface',
    shadeRating: 'Heavy Shaded Ponderosa Canopy',
    quickFilters: ['coolest-outdoors', 'foothill-getaways'],
    microclimateBadges: ['Above the Fog', '20°+ Drop', 'Alpine Breeze'],
    eventTags: ['Outdoor / Water', 'Kayak Meetup', 'Night Cinema'],
    baseCityRoutes: {
      modesto: {
        driveTime: '1 hr 18 min',
        driveTimeMinutes: 78,
        distanceMiles: 68,
        routeHighway: 'CA-108 E via Oakdale & Sonora',
        tip: 'Head out eastbound on CA-108 before 8:30 AM to secure Day Use lot parking.',
      },
      turlock: {
        driveTime: '1 hr 25 min',
        driveTimeMinutes: 85,
        distanceMiles: 74,
        routeHighway: 'Geer Rd north to CA-108 E',
        tip: 'Cut through Oakdale to join CA-108 for the scenic climb past Jamestown.',
      },
      stockton: {
        driveTime: '1 hr 35 min',
        driveTimeMinutes: 95,
        distanceMiles: 84,
        routeHighway: 'CA-4 E or CA-120 E to CA-108 E',
        tip: 'Take CA-4 through Copperopolis or CA-120 past Escalon into the foothills.',
      },
      fresno: {
        driveTime: '2 hr 25 min',
        driveTimeMinutes: 145,
        distanceMiles: 132,
        routeHighway: 'CA-99 N to CA-108 E at Modesto',
        tip: 'A straight shot up CA-99; alternatively consider Shaver Lake for an even quicker climb.',
      },
    },
    summary: 'The gold standard Central Valley summer escape. A pristine 300-acre mountain lake sitting over a mile high, consistently 20°F to 28°F cooler than Modesto.',
    description: 'When the valley floor bakes, Pinecrest offers immediate alpine relief. Granite boulders rim the crystal turquoise shoreline, motorboats cruise at a serene 10 mph limit, and towering sugar pines provide dense, aromatic shade. Rent a paddleboat or kayak at the marina, hike the 4-mile lakeside loop trail, and enjoy an ice cream cone at the community hub.',
    highlights: [
      'Swim beach with roped-off sandy swimming areas',
      'Pinecrest Marina boat rentals (kayaks, paddleboats, aluminum skiffs)',
      'Scenic 4-mile Pinecrest Lake Loop Trail along granite ledges',
      'Historic outdoor amphitheater with weekend Ranger campfire talks',
    ],
    whatToPack: [
      'Light evening windbreaker or sweater (night drops to 48°F–54°F)',
      'Water shoes or strapped sandals for granite rocks',
      'Foldable camp shade chairs & beach umbrella',
      'National Forest day pass ($10 day-use or America the Beautiful)',
    ],
    bestDepartureTip: 'Depart Modesto before 8:30 AM on weekends; the main beach lot fills completely by 10:15 AM.',
    admissionInfo: '$10 Day Use parking fee (or standard USFS Recreation Pass); free walk-in access.',
    events: [
      {
        id: 'event-pinecrest-kayak',
        destinationId: 'pinecrest-lake',
        destinationTitle: 'Pinecrest Lake',
        title: 'Kayak Meetup at Pinecrest',
        date: 'This Saturday',
        time: '10:00 AM - 1:00 PM',
        categoryBadge: 'Outdoor / Water',
        eveningTempF: 71,
        location: 'Pinecrest Marina & South Beach',
        description: 'Join local Sierra paddlers for a refreshing morning paddle exploring hidden granite coves and deep blue alpine waters.',
        isFree: true,
        admissionText: 'Free with own kayak / Marina rentals available',
      },
      {
        id: 'event-pinecrest-movies',
        destinationId: 'pinecrest-lake',
        destinationTitle: 'Pinecrest Lake',
        title: 'Pinecrest Movies Under the Stars',
        date: 'Fridays & Saturdays',
        time: '8:30 PM',
        categoryBadge: 'Outdoor / Water',
        eveningTempF: 58,
        location: 'Pinecrest Amphitheater',
        description: 'Open-air family cinema surrounded by pine boughs with popcorn and hot cocoa under crystal-clear mountain skies.',
        isFree: false,
        admissionText: '$8 Day Park entry / Free walk-in',
      },
    ],
  },

  // 2. Knights Ferry (River / Shaded Outdoor)
  {
    id: 'knights-ferry',
    title: 'Knights Ferry',
    subtitle: 'Stanislaus River rapids, historic 1863 covered bridge, and 61°F cold snowmelt drift',
    category: 'river-shaded',
    categoryLabel: 'River / Shaded Outdoor',
    region: 'Stanislaus River Foothills',
    county: 'Stanislaus County',
    elevation: '330 ft',
    elevationFt: 330,
    image: '/src/assets/images/getaway_knights_ferry_river_1792865302791.jpg',
    coordinates: { lat: 37.8188, lon: -120.6655 },
    defaultTempF: 86,
    highHeatTempF: 92,
    mildTempF: 78,
    condition: 'River Breeze & Filtered Sun',
    conditionIcon: '🛶',
    waterTempF: '61°F Cold Snowmelt',
    shadeRating: 'Cool River Willow Cover',
    quickFilters: ['coolest-outdoors', 'foothill-getaways'],
    microclimateBadges: ['Snowmelt River', 'Willow Shade', '12°F Drop'],
    eventTags: ['River Float', 'Covered Bridge', 'Outdoor / Water'],
    baseCityRoutes: {
      modesto: {
        driveTime: '32 min',
        driveTimeMinutes: 32,
        distanceMiles: 26,
        routeHighway: 'CA-108 E straight through Oakdale',
        tip: 'The closest true river chill! You can be floating in 61°F river water in under 35 minutes.',
      },
      turlock: {
        driveTime: '42 min',
        driveTimeMinutes: 42,
        distanceMiles: 34,
        routeHighway: 'Geer Rd north to Oakdale, then CA-108 E',
        tip: 'Easy drive through almond orchards right into the historic townsite.',
      },
      stockton: {
        driveTime: '48 min',
        driveTimeMinutes: 48,
        distanceMiles: 40,
        routeHighway: 'CA-4 E or CA-120 E to Escalon & CA-108 E',
        tip: 'Scenic country roads via Escalon past blooming orchards.',
      },
      fresno: {
        driveTime: '1 hr 45 min',
        driveTimeMinutes: 105,
        distanceMiles: 110,
        routeHighway: 'CA-99 N to Modesto, CA-108 E',
        tip: 'Ideal half-day rafting trip pairing with an Oakdale cheese factory stop.',
      },
    },
    summary: 'Just 32 minutes from Modesto. Even when the ambient air is warm, the Stanislaus River flows directly out of the Sierra dams at a shivering 61°F, keeping you instantly refreshed.',
    description: 'Home to the longest historic covered bridge west of the Mississippi (built in 1863), Knights Ferry is Stanislaus County’s favorite local river escape. Families launch inflatable rafts or inner tubes for the gentle 4-mile drift down to Orange Blossom Park. Thick canopies of native cottonwoods and weeping willows provide continuous natural shade.',
    highlights: [
      'Historic 1863 wooden covered bridge crossing the river canyon',
      'Gentle 4-mile Stanislaus River rafting drift (Class I-II)',
      'Shady swimming holes and eddy beaches along the Army Corps park',
      'Riverside picnic areas with charcoal grills under giant valley oaks',
    ],
    whatToPack: [
      'Coast Guard-approved life jacket (mandatory for floaters)',
      'Sturdy river sandals or water booties (sharp riverbed stones)',
      'Waterproof phone dry bag & river tow rope',
      'High-SPF water-resistant sunscreen & wide-brim hat',
    ],
    bestDepartureTip: 'Launch before 10:00 AM for the smoothest water flow and quietest eddy beaches before rental crowds arrive.',
    admissionInfo: 'Free day use parking at Army Corps Recreation Area; commercial raft rentals available in town.',
    events: [
      {
        id: 'event-knights-ferry-float',
        destinationId: 'knights-ferry',
        destinationTitle: 'Knights Ferry',
        title: 'Stanislaus River Community Float',
        date: 'Every Saturday',
        time: '9:30 AM - 1:30 PM',
        categoryBadge: 'Outdoor / Water',
        eveningTempF: 78,
        location: 'Knights Ferry Recreation Launch',
        description: 'Casual community flotilla drifting 4 miles down the cold 61°F snowmelt river to Orange Blossom Park with shuttle return.',
        isFree: true,
        admissionText: 'Free public launch / Commercial rentals in town',
      },
      {
        id: 'event-knights-ferry-walk',
        destinationId: 'knights-ferry',
        destinationTitle: 'Knights Ferry',
        title: 'Covered Bridge Moonlight Walk',
        date: 'This Sunday',
        time: '7:30 PM - 9:00 PM',
        categoryBadge: 'Nature & Heritage',
        eveningTempF: 75,
        location: 'Historic Covered Bridge Plaza',
        description: 'Guided twilight stroll through the historic 1863 covered bridge with Stanislaus River canyon acoustics.',
        isFree: true,
        admissionText: 'Free admission',
      },
    ],
  },

  // 3. Downtown Modesto State Theatre & Gallo Center (Air-Conditioned Indoor)
  {
    id: 'downtown-modesto-indoor',
    title: 'Downtown Modesto State Theatre & Gallo Center',
    subtitle: 'Climate-controlled performing arts center, historic indie cinema, and cooled gallery spaces',
    category: 'indoor-ac',
    categoryLabel: 'Air-Conditioned Indoor',
    region: 'Modesto Downtown Arts District',
    county: 'Stanislaus County',
    elevation: '88 ft',
    elevationFt: 88,
    image: '/src/assets/images/modesto_state_theatre_gallo_1792867150448.jpg',
    coordinates: { lat: 37.6415, lon: -120.9995 },
    defaultTempF: 68,
    highHeatTempF: 68,
    mildTempF: 68,
    isIndoorAc: true,
    indoorAcTempF: 68,
    condition: 'Climate-Controlled 68°F A/C',
    conditionIcon: '❄️',
    shadeRating: 'Subterranean 100% Shade',
    quickFilters: ['air-conditioned-indoors'],
    microclimateBadges: ['Misted Patio', 'Indoor A/C Sanctuary', '20°+ Drop'],
    eventTags: ['Indoor AC', 'Classic Films', 'Live Symphony'],
    baseCityRoutes: {
      modesto: {
        driveTime: '5 min',
        driveTimeMinutes: 5,
        distanceMiles: 2,
        routeHighway: 'Downtown Modesto (I & 10th St)',
        tip: 'Center city access; free covered parking in downtown garages after 6 PM.',
      },
      turlock: {
        driveTime: '18 min',
        driveTimeMinutes: 18,
        distanceMiles: 14,
        routeHighway: 'CA-99 N to Modesto / 9th St exit',
        tip: 'Short 18-minute drive north on Highway 99 for dinner and a show.',
      },
      stockton: {
        driveTime: '32 min',
        driveTimeMinutes: 32,
        distanceMiles: 29,
        routeHighway: 'CA-99 S to Central Modesto exit',
        tip: 'Easy 30-minute cruise down CA-99 directly into the arts district.',
      },
      fresno: {
        driveTime: '1 hr 30 min',
        driveTimeMinutes: 90,
        distanceMiles: 92,
        routeHighway: 'CA-99 N straight to Modesto',
        tip: 'Excellent weekend performing arts excursion with fine dining on J Street.',
      },
    },
    summary: 'When daytime valley heat soars into the 100s, escape into the chilled 68°F air-conditioned sanctuary of the Gallo Center for the Arts and the 1934 Art Deco State Theatre.',
    description: 'The premier indoor cultural sanctuary of Stanislaus County. The Gallo Center for the Arts features two acoustically pristine, heavily air-conditioned performance halls hosting Broadway tours, symphonies, and comedy headliners. Just steps away on J Street, the historic 1934 State Theatre provides a vintage air-conditioned auditorium showing independent cinema with craft beer and local wines.',
    highlights: [
      'Gallo Center for the Arts: 1,248-seat Mary Stuart Rogers Theater at a crisp 68°F',
      'The State Theatre: Historic 1934 Art Deco indie cinema with local wines & beers',
      'Mist-cooled outdoor dining patios along Tenth Street Plaza and J Street',
      'McHenry Mansion and Museum air-conditioned Victorian heritage tours',
    ],
    whatToPack: [
      'Light sweater or blazer (the theater A/C is famously strong)',
      'Smart casual evening wear',
      'Downtown parking validation ticket',
    ],
    bestDepartureTip: 'Arrive at 6:15 PM to enjoy dinner on J Street before curtain call at 7:30 PM.',
    admissionInfo: 'State Theatre films ~$11; Gallo Center tickets vary by performance.',
    events: [
      {
        id: 'event-state-theatre-classic',
        destinationId: 'downtown-modesto-indoor',
        destinationTitle: 'Downtown Modesto State Theatre & Gallo Center',
        title: 'Classic Movie Night at State Theatre',
        date: 'Every Wed & Fri',
        time: '7:00 PM',
        categoryBadge: 'Indoor AC',
        eveningTempF: 68,
        location: 'The State Theatre (1307 J St, Modesto)',
        description: 'Watch vintage 35mm Hollywood classic films in the historic 1934 Art Deco auditorium with full climate-controlled 68°F air conditioning and local craft beer.',
        isFree: false,
        admissionText: '$11 General Admission',
      },
      {
        id: 'event-gallo-symphony',
        destinationId: 'downtown-modesto-indoor',
        destinationTitle: 'Downtown Modesto State Theatre & Gallo Center',
        title: 'Modesto Symphony Pops at the Gallo Center',
        date: 'This Saturday',
        time: '7:30 PM',
        categoryBadge: 'Indoor AC',
        eveningTempF: 68,
        location: 'Gallo Center for the Arts (1000 I St, Modesto)',
        description: 'Spectacular orchestral performance in the climate-controlled Mary Stuart Rogers Theater.',
        isFree: false,
        admissionText: 'Tickets from $29',
      },
    ],
  },

  // 4. Murphys / Sonora (Foothills Social / Wine)
  {
    id: 'murphys-sonora',
    title: 'Murphys / Sonora',
    subtitle: 'Gold Country boutique wineries, shaded creekside parks, and naturally 55°F limestone caverns',
    category: 'foothills-wine',
    categoryLabel: 'Foothills Social / Wine',
    region: 'Calaveras & Tuolumne Foothills',
    county: 'Calaveras County',
    elevation: '2,170 ft',
    elevationFt: 2170,
    image: '/src/assets/images/murphys_sonora_wine_1792867162672.jpg',
    coordinates: { lat: 38.1374, lon: -120.4619 },
    defaultTempF: 78,
    highHeatTempF: 84,
    mildTempF: 72,
    condition: 'Foothill Breeze & Wine Cellars',
    conditionIcon: '🍷',
    shadeRating: 'Subterranean 100% Shade',
    quickFilters: ['foothill-getaways', 'air-conditioned-indoors'],
    microclimateBadges: ['20°+ Drop', 'Wine Cave Cellar', 'Creekside Shade'],
    eventTags: ['Live Music / Patio', 'Wine Tasting', 'Subterranean Tour'],
    baseCityRoutes: {
      modesto: {
        driveTime: '1 hr 12 min',
        driveTimeMinutes: 72,
        distanceMiles: 60,
        routeHighway: 'CA-108 E to CA-120 / CA-49 N to CA-4 E',
        tip: 'Cruise through historic Sonora and Columbia State Historic Park along the way.',
      },
      turlock: {
        driveTime: '1 hr 20 min',
        driveTimeMinutes: 80,
        distanceMiles: 68,
        routeHighway: 'CA-99 N to CA-108 E to CA-4 E',
        tip: 'Picturesque rolling foothill drive past Lake Tulloch.',
      },
      stockton: {
        driveTime: '1 hr 02 min',
        driveTimeMinutes: 62,
        distanceMiles: 54,
        routeHighway: 'CA-4 E straight eastbound',
        tip: 'Under an hour from east Stockton! Just cruise out CA-4 straight to Murphys.',
      },
      fresno: {
        driveTime: '2 hr 15 min',
        driveTimeMinutes: 135,
        distanceMiles: 125,
        routeHighway: 'CA-99 N to CA-49 N through Mariposa and Sonora',
        tip: 'Explore the scenic Mother Lode highway corridor.',
      },
    },
    summary: 'The Queen of the Sierra Foothills. Stroll sycamore-shaded historic tasting rooms or descend into Mercer Caverns—a natural limestone grotto that stays 55°F every day of the year.',
    description: 'Murphys and neighboring Sonora pair 19th-century Gold Rush charm with award-winning Sierra Foothills wineries. For immediate cooling relief, Mercer Caverns offers 45-minute walking tours through subterranean chambers that remain a frosty 55°F year-round. On Murphys Main Street, over 25 boutique winery tasting rooms occupy thick limestone-walled cellars with leafy creekside dining.',
    highlights: [
      'Mercer Caverns walking tours (55°F limestone chambers with rare aragonite crystals)',
      'Over 25 wine tasting rooms tucked in historic thick limestone cellars',
      'Shady Murphys Community Park with cold Angels Creek for foot-wading',
      'Historic Downtown Sonora & Columbia State Historic Park wooden boardwalks',
    ],
    whatToPack: [
      'Light fleece or cardigan for 55°F cavern tours',
      'Walking shoes with solid grip for cavern stairs and stone walkways',
      'Insulated cooler bag for transporting local wines back to the valley',
    ],
    bestDepartureTip: 'Combine an 11:00 AM cavern tour with an afternoon creek-side wine tasting lunch under the sycamores.',
    admissionInfo: 'Mercer Caverns: $22 adults; free walking access along Main Street and Community Park.',
    events: [
      {
        id: 'event-murphys-patio-music',
        destinationId: 'murphys-sonora',
        destinationTitle: 'Murphys / Sonora',
        title: 'Live Patio Music in Murphys',
        date: 'Every Weekend',
        time: '5:30 PM - 8:30 PM',
        categoryBadge: 'Live Music / Patio',
        eveningTempF: 72,
        location: 'Murphys Main Street Patios & Park Gazebo',
        description: 'Acoustic indie folk and jazz on sycamore-shaded winery patios with chilled local Viognier and artisan flatbreads.',
        isFree: true,
        admissionText: 'Free admission with glass purchase',
      },
      {
        id: 'event-mercer-caverns-tour',
        destinationId: 'murphys-sonora',
        destinationTitle: 'Murphys / Sonora',
        title: 'Mercer Caverns Subterranean Tour',
        date: 'Daily',
        time: '11:00 AM & 2:00 PM',
        categoryBadge: 'Indoor AC',
        eveningTempF: 55,
        location: 'Mercer Caverns (1665 Sheep Ranch Rd, Murphys)',
        description: 'Descend into naturally chilled 55°F limestone caverns for a guided historical walking tour away from the summer heat.',
        isFree: false,
        admissionText: '$22 Adults / $12 Kids',
      },
    ],
  },

  // 5. Santa Cruz West Cliff Coast (Pacific Coast & Marine Layer)
  {
    id: 'santa-cruz-coast',
    title: 'Santa Cruz West Cliff & Coast',
    subtitle: 'Pacific ocean breezes, coastal bluffs, and misty marine layer relief',
    category: 'coastal',
    categoryLabel: 'Pacific Coast & Marine Layer',
    region: 'Monterey Bay',
    county: 'Santa Cruz County',
    elevation: '20 ft',
    elevationFt: 20,
    image: '/src/assets/images/getaway_santa_cruz_coast_1792865302040.jpg',
    coordinates: { lat: 36.9535, lon: -122.0263 },
    defaultTempF: 66,
    highHeatTempF: 70,
    mildTempF: 61,
    condition: 'Cool Marine Breeze & Sun',
    conditionIcon: '🌊',
    waterTempF: '58°F Pacific Ocean',
    shadeRating: 'Coastal Fog & Ocean Breeze',
    quickFilters: ['coolest-outdoors'],
    microclimateBadges: ['Marine Inversion', '20°+ Drop', 'Pacific Breeze'],
    eventTags: ['Beach Concerts', 'Ocean Breeze', 'Boardwalk'],
    baseCityRoutes: {
      modesto: {
        driveTime: '1 hr 55 min',
        driveTimeMinutes: 115,
        distanceMiles: 104,
        routeHighway: 'CA-132 W to I-580 / CA-152 W over Pacheco Pass',
        tip: 'Take CA-152 across Pacheco Pass into Gilroy, then CA-129 or CA-152 over Mount Madonna.',
      },
      turlock: {
        driveTime: '1 hr 50 min',
        driveTimeMinutes: 110,
        distanceMiles: 99,
        routeHighway: 'CA-165 S to CA-152 W Pacheco Pass',
        tip: 'Direct access via Los Banos and Pacheco Pass avoids northern Altamont commute traffic.',
      },
      stockton: {
        driveTime: '1 hr 55 min',
        driveTimeMinutes: 115,
        distanceMiles: 112,
        routeHighway: 'I-205 W to I-580 W to I-680 S to CA-17 S',
        tip: 'Cross over Highway 17 through the Santa Cruz Mountains early to beat beach traffic.',
      },
      fresno: {
        driveTime: '2 hr 25 min',
        driveTimeMinutes: 145,
        distanceMiles: 148,
        routeHighway: 'CA-99 N to CA-152 W Pacheco Pass to CA-1',
        tip: 'Connect through Los Banos; perfect full-day excursion with a 35°F drop in afternoon heat.',
      },
    },
    summary: 'A breathtaking 30°F+ thermal drop. Watch the thermometer plunge from 98°F in Modesto down to 66°F as the Pacific marine air washes over West Cliff Drive.',
    description: 'When the Central Valley air stays static and hot, Santa Cruz is the classic westward sanctuary. Stroll along West Cliff Drive watching surfers ride Steamer Lane, breathe in salty ocean air scented with cypress trees, explore the historic Beach Boardwalk, or head north toward the secluded, windswept beaches of Wilder Ranch.',
    highlights: [
      'West Cliff Drive coastal walking & cycling promenade',
      'Steamer Lane legendary surf break & Surfing Museum lighthouse',
      'Wilder Ranch State Park rugged coastal fern trails',
      'Santa Cruz Beach Boardwalk seaside nostalgia',
    ],
    whatToPack: [
      'Hoodie or fleece jacket (ocean breezes feel cold even at 65°F)',
      'Comfortable walking shoes for coastal bluff trails',
      'Polarized sunglasses for strong ocean glare',
    ],
    bestDepartureTip: 'Depart base cities between 7:30 AM and 8:00 AM to cross Pacheco Pass and Highway 17 before midday weekend backups.',
    admissionInfo: 'Free beach and bluff access; state beaches charge $10 vehicle parking.',
    events: [
      {
        id: 'event-boardwalk-summer-bands',
        destinationId: 'santa-cruz-coast',
        destinationTitle: 'Santa Cruz West Cliff & Coast',
        title: 'Boardwalk Free Summer Bands on the Beach',
        date: 'Thursday & Friday Evenings',
        time: '6:30 PM & 8:30 PM',
        categoryBadge: 'Outdoor / Water',
        eveningTempF: 62,
        location: 'Santa Cruz Beach Boardwalk Main Stage',
        description: 'Live rock and retro bands performing right on the sandy beach as the sun sets over Monterey Bay.',
        isFree: true,
        admissionText: 'Free admission on the sand',
      },
    ],
  },

  // 6. Calaveras Big Trees State Park
  {
    id: 'calaveras-big-trees',
    title: 'Calaveras Big Trees State Park',
    subtitle: 'Ancient Giant Sequoias, Sierra cedar groves, and fragrant mountain trails',
    category: 'cool-outdoor',
    categoryLabel: 'Foothills - Cool Outdoor',
    region: 'Calaveras Sierra Foothills',
    county: 'Calaveras County',
    elevation: '4,750 ft',
    elevationFt: 4750,
    image: '/src/assets/images/hero_pinecrest_lake_1792865301138.jpg',
    coordinates: { lat: 38.2796, lon: -120.3093 },
    defaultTempF: 74,
    highHeatTempF: 80,
    mildTempF: 64,
    condition: 'Deep Forest Shade & Crisp Air',
    conditionIcon: '🌲',
    shadeRating: 'Heavy Shaded Ponderosa Canopy',
    quickFilters: ['coolest-outdoors', 'foothill-getaways'],
    microclimateBadges: ['Above the Fog', '20°+ Drop', 'Giant Sequoia Canopy'],
    eventTags: ['Ranger Walk', 'Ancient Trees', 'Nature & Heritage'],
    baseCityRoutes: {
      modesto: {
        driveTime: '1 hr 25 min',
        driveTimeMinutes: 85,
        distanceMiles: 72,
        routeHighway: 'CA-108 E to CA-120 / CA-49 N to CA-4 E through Angels Camp',
        tip: 'Climb CA-4 through Arnold; the scent of cedar and pine hits immediately after Murphys.',
      },
      turlock: {
        driveTime: '1 hr 35 min',
        driveTimeMinutes: 95,
        distanceMiles: 80,
        routeHighway: 'CA-99 N to Modesto or East via Jamestown / Angels Camp',
        tip: 'Scenic route past New Melones Lake bridge.',
      },
      stockton: {
        driveTime: '1 hr 15 min',
        driveTimeMinutes: 75,
        distanceMiles: 65,
        routeHighway: 'CA-4 E straight past Copperopolis and Angels Camp',
        tip: 'The fastest mountain getaway for Stockton residents—under 80 minutes to giant sequoias!',
      },
      fresno: {
        driveTime: '2 hr 30 min',
        driveTimeMinutes: 150,
        distanceMiles: 140,
        routeHighway: 'CA-99 N to CA-49 N via Mariposa and Sonora',
        tip: 'A beautiful historical Gold Rush highway drive.',
      },
    },
    summary: 'Stand in the shade of 2,000-year-old Giant Sequoias. At 4,750 ft elevation, the ancient canopy blocks the valley glare for a 74°F mountain sanctuary.',
    description: 'Preserved since 1852, Calaveras Big Trees features two colossal groves of Giant Sequoias alongside the rushing Stanislaus River North Fork. The North Grove Trail is an easy 1.7-mile shaded loop weaving past trees wider than a city bus.',
    highlights: [
      'North Grove Trail among towering giant sequoias and dogwood flowers',
      'The historic Discovery Tree stump',
      'Scenic picnic grounds beside the cold Stanislaus River North Fork',
      'Visitor center museum with interactive Sierra geology exhibits',
    ],
    whatToPack: [
      'Comfortable trail sneakers or walking boots',
      'Insulated water bottle for trail hydration',
      'California State Parks Pass (or $10 day use vehicle fee)',
    ],
    bestDepartureTip: 'Stockton travelers can make this in 75 minutes via CA-4 E; leave by 8:30 AM to catch the quiet morning bird calls.',
    admissionInfo: '$10 vehicle day-use fee (honors California State Library Free Parks Pass).',
    events: [
      {
        id: 'event-big-trees-walk',
        destinationId: 'calaveras-big-trees',
        destinationTitle: 'Calaveras Big Trees State Park',
        title: 'Ranger-Led Giant Sequoia Ecology Walk',
        date: 'Saturdays & Sundays',
        time: '11:00 AM',
        categoryBadge: 'Nature & Heritage',
        eveningTempF: 74,
        location: 'North Grove Visitor Center Plaza',
        description: 'Learn the fire ecology and 2,000-year survival secrets of the Sierra redwoods with hands-on cone identification in deep shade.',
        isFree: true,
        admissionText: 'Included with park entrance',
      },
    ],
  },

  // 7. Forestiere Underground Gardens (Air-Conditioned Indoor / Subterranean)
  {
    id: 'forestiere-underground-gardens',
    title: 'Forestiere Underground Gardens',
    subtitle: 'Naturally 68°F subterranean stone chambers and sunken citrus courtyards',
    category: 'indoor-ac',
    categoryLabel: 'Air-Conditioned Indoor',
    region: 'Fresno Valley Basin',
    county: 'Fresno County',
    elevation: '290 ft (Subterranean)',
    elevationFt: 290,
    image: '/src/assets/images/getaway_subterranean_gardens_1792865303323.jpg',
    coordinates: { lat: 36.8143, lon: -119.8653 },
    defaultTempF: 68,
    highHeatTempF: 68,
    mildTempF: 68,
    isIndoorAc: true,
    indoorAcTempF: 68,
    condition: 'Naturally 68°F Subterranean',
    conditionIcon: '🏛️',
    shadeRating: 'Subterranean 100% Shade',
    quickFilters: ['air-conditioned-indoors'],
    microclimateBadges: ['Subterranean Oasis', '20°+ Drop', '100% Earth Shade'],
    eventTags: ['Indoor AC', 'Guided Architecture', 'Lantern Tours'],
    baseCityRoutes: {
      modesto: {
        driveTime: '1 hr 25 min',
        driveTimeMinutes: 85,
        distanceMiles: 88,
        routeHighway: 'CA-99 S directly to Shaw Ave exit',
        tip: 'Conveniently located right off CA-99 in Northwest Fresno.',
      },
      turlock: {
        driveTime: '1 hr 12 min',
        driveTimeMinutes: 72,
        distanceMiles: 75,
        routeHighway: 'CA-99 S south past Merced and Madera',
        tip: 'Quick straight drive on Highway 99.',
      },
      stockton: {
        driveTime: '1 hr 55 min',
        driveTimeMinutes: 115,
        distanceMiles: 120,
        routeHighway: 'CA-99 S past Modesto',
        tip: 'Stop at Bravo Farms in Madera for farm-fresh refreshment.',
      },
      fresno: {
        driveTime: '14 min',
        driveTimeMinutes: 14,
        distanceMiles: 8,
        routeHighway: 'CA-99 / West Shaw Avenue',
        tip: 'Right in your backyard! Instant 30°F relief without leaving town.',
      },
    },
    summary: 'A subterranean marvel hand-carved between 1906 and 1946 to escape Fresno’s blistering heat. It stays a constant 68°F underground year-round.',
    description: 'When outside temperatures soar above 105°F, walking down the stone ramp into Forestiere Underground Gardens is an astonishing sensory transformation. Built 10 to 25 feet beneath the hardpan earth, this subterranean complex features 65 interconnected rooms, courtyards, Roman arches, and skylights with citrus trees bearing fruit underground.',
    highlights: [
      'Constant 65°F–68°F natural underground microclimate',
      'Hand-chiseled Roman stone vaults and skylight courtyards',
      'Living underground citrus trees producing oranges, lemons, and grapefruits',
      'Guided historical walking tour through 40-year hand-crafted architecture',
    ],
    whatToPack: [
      'Light cardigan (it genuinely feels cool down inside)',
      'Walking shoes with good rubber traction for earthen floors',
    ],
    bestDepartureTip: 'Reserve guided tour tickets online in advance, as midday slots sell out fast on hot summer weekends.',
    admissionInfo: '$23 adults, $12 kids; guided 60-minute walking tours require advance booking.',
  },
];

export const ALL_EVENTS: GetawayEvent[] = GETAWAYS.flatMap(
  (g) => g.events || []
);

/* ==========================================================================
   WEATHER SERVICE & HELPERS (OPEN-METEO API)
   ========================================================================== */

const weatherCache = new Map<string, { data: WeatherCondition; expires: number }>();

export async function fetchLiveWeather(
  lat: number,
  lon: number,
  fallbackTempF: number,
  fallbackCondition: string,
  fallbackIcon: string
): Promise<WeatherCondition> {
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expires > now) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('Weather API error');

    const json = await res.json();
    const current = json.current;
    if (current && typeof current.temperature_2m === 'number') {
      const code = current.weather_code || 0;
      let text = 'Clear Sky';
      let icon = '☀️';
      if (code === 1 || code === 2) { text = 'Partly Cloudy'; icon = '🌤️'; }
      else if (code === 3) { text = 'Overcast'; icon = '☁️'; }
      else if (code === 45 || code === 48) { text = 'Coastal Fog'; icon = '🌫️'; }
      else if (code >= 51 && code <= 67) { text = 'Light Rain'; icon = '🌧️'; }

      const result: WeatherCondition = {
        tempF: Math.round(current.temperature_2m),
        condition: text,
        icon: icon,
        isLive: true,
      };

      weatherCache.set(cacheKey, { data: result, expires: now + 10 * 60 * 1000 });
      return result;
    }
  } catch {
    // Graceful fallback
  }

  const fallback: WeatherCondition = {
    tempF: fallbackTempF,
    condition: fallbackCondition,
    icon: fallbackIcon,
    isLive: false,
  };
  weatherCache.set(cacheKey, { data: fallback, expires: now + 5 * 60 * 1000 });
  return fallback;
}

export function toDisplayTemp(tempF: number, unit: TempUnit): string {
  if (unit === 'C') {
    const c = Math.round(((tempF - 32) * 5) / 9);
    return `${c}°C`;
  }
  return `${Math.round(tempF)}°F`;
}

export function formatDelta(
  destTempF: number,
  baseTempF: number,
  unit: TempUnit,
  baseCityName: string = 'Modesto'
): { text: string; rawDeltaF: number; isCooler: boolean; shortBadge: string } {
  const rawDeltaF = Math.round(destTempF - baseTempF);
  const isCooler = rawDeltaF < 0;
  const absF = Math.abs(rawDeltaF);

  if (unit === 'C') {
    const absC = Math.round((absF * 5) / 9);
    if (absC === 0) {
      return {
        text: `Same temp as ${baseCityName}`,
        rawDeltaF,
        isCooler: false,
        shortBadge: '0°C',
      };
    }
    return {
      text: isCooler
        ? `${absC}°C Cooler than ${baseCityName}`
        : `${absC}°C Warmer than ${baseCityName}`,
      rawDeltaF,
      isCooler,
      shortBadge: `${isCooler ? '-' : '+'}${absC}°C`,
    };
  }

  if (absF === 0) {
    return {
      text: `Same temp as ${baseCityName}`,
      rawDeltaF,
      isCooler: false,
      shortBadge: '0°F',
    };
  }

  return {
    text: isCooler
      ? `${absF}°F Cooler than ${baseCityName}`
      : `${absF}°F Warmer than ${baseCityName}`,
    rawDeltaF,
    isCooler,
    shortBadge: `${isCooler ? '-' : '+'}${absF}°F`,
  };
}

export function getScenarioTemp(
  baseOrDest: BaseCity | Getaway,
  scenario: WeatherScenario,
  liveTempF?: number
): number {
  if ('isIndoorAc' in baseOrDest && baseOrDest.isIndoorAc) {
    return baseOrDest.indoorAcTempF || 68;
  }

  if (scenario === 'live' && liveTempF !== undefined) {
    return liveTempF;
  }

  const isBaseCity = 'defaultSummerTempF' in baseOrDest;

  if (scenario === 'scorcher') {
    return baseOrDest.highHeatTempF;
  }

  if (scenario === 'mild') {
    return baseOrDest.mildTempF;
  }

  return isBaseCity ? baseOrDest.defaultSummerTempF : baseOrDest.defaultTempF;
}

/* ==========================================================================
   MAIN VALLEY ESCAPE APPLICATION COMPONENT
   ========================================================================== */

export default function App() {
  // Base City: defaults to Modesto
  const [activeBaseCityId, setActiveBaseCityId] = useState<BaseCityId>('modesto');
  const activeBaseCity = BASE_CITIES[activeBaseCityId] || BASE_CITIES.modesto;

  // Temperature unit (°F / °C)
  const [unit, setUnit] = useState<TempUnit>('F');

  // Weather scenario ('live', 'summer', 'scorcher', 'mild')
  const [scenario, setScenario] = useState<WeatherScenario>('live');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [liveBaseWeather, setLiveBaseWeather] = useState<WeatherCondition>({
    tempF: BASE_CITIES.modesto.defaultSummerTempF,
    condition: BASE_CITIES.modesto.condition,
    icon: BASE_CITIES.modesto.icon,
    isLive: false,
  });

  // Dynamic destination temperatures dictionary
  const [destinationLiveTemps, setDestinationLiveTemps] = useState<Record<string, number>>({});

  // Quick Filter & Search states
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterId>('all');
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

  // Fetch weather dynamically from Open-Meteo API for base city and all destinations
  const refreshCityWeather = useCallback(async () => {
    setIsRefreshing(true);
    const city = BASE_CITIES[activeBaseCityId];
    try {
      // 1. Fetch live base city weather
      const weather = await fetchLiveWeather(
        city.coordinates.lat,
        city.coordinates.lon,
        city.defaultSummerTempF,
        city.condition,
        city.icon
      );
      setLiveBaseWeather(weather);

      // 2. Dynamically fetch live Open-Meteo weather for all destinations in parallel
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

  // Compute effective base city temperature
  const currentBaseTempF = useMemo(() => {
    return getScenarioTemp(activeBaseCity, scenario, liveBaseWeather.isLive ? liveBaseWeather.tempF : undefined);
  }, [activeBaseCity, scenario, liveBaseWeather]);

  // Compute effective temperatures for all destinations
  const getawayTempsF = useMemo(() => {
    const result: Record<string, number> = {};
    for (const g of GETAWAYS) {
      const live = destinationLiveTemps[g.id];
      result[g.id] = getScenarioTemp(g, scenario, live);
    }
    return result;
  }, [scenario, destinationLiveTemps]);

  // Filter and sort getaways
  const filteredGetaways = useMemo(() => {
    return GETAWAYS.filter((g) => {
      // Quick filter
      if (activeQuickFilter !== 'all') {
        if (!g.quickFilters?.includes(activeQuickFilter)) {
          return false;
        }
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
        return tempA - tempB;
      }
      if (sortBy === 'drive') {
        return routeA.driveTimeMinutes - routeB.driveTimeMinutes;
      }
      if (sortBy === 'elevation') {
        return b.elevationFt - a.elevationFt;
      }
      return 0;
    });
  }, [activeQuickFilter, maxDriveMinutes, searchQuery, sortBy, activeBaseCityId, getawayTempsF]);

  // Saved getaways list
  const savedGetawaysList = useMemo(() => {
    return GETAWAYS.filter((g) => savedGetawayIds.includes(g.id));
  }, [savedGetawayIds]);

  // Top spotlight getaway
  const heroGetaway = GETAWAYS[0];
  const heroDestTempF = getawayTempsF[heroGetaway.id] || heroGetaway.defaultTempF;
  const heroRoute = heroGetaway.baseCityRoutes[activeBaseCity.id] || heroGetaway.baseCityRoutes.modesto;
  const heroDelta = formatDelta(heroDestTempF, currentBaseTempF, unit, activeBaseCity.name);

  const cityKeys: BaseCityId[] = ['modesto', 'turlock', 'stockton', 'fresno'];

  const quickFilterTabs: { id: QuickFilterId; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Escapes', icon: <Compass className="w-4 h-4" /> },
    { id: 'coolest-outdoors', label: 'Coolest Outdoors (River/Lakes)', icon: <Droplets className="w-4 h-4" /> },
    { id: 'air-conditioned-indoors', label: 'Air-Conditioned Indoors', icon: <Snowflake className="w-4 h-4" /> },
    { id: 'foothill-getaways', label: 'Foothill Getaways', icon: <Mountain className="w-4 h-4" /> },
  ];

  return (
    <div id="top" className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased selection:bg-amber-200">
      
      {/* ====================================================================
          1. HEADER BAR
          ==================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-900 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-3 sm:gap-4">
            
            {/* Title & Wordmark */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <a href="#" className="text-xl font-extrabold tracking-tight text-stone-900 hover:text-amber-700 transition-colors whitespace-nowrap">
                  Valley Escape
                </a>
                <div className="text-[11px] text-stone-500 hidden sm:block font-medium">
                  Central Valley Beat-The-Heat Guide
                </div>
              </div>
            </div>

            {/* Base City Selector Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200/80 overflow-x-auto scrollbar-none max-w-full">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 px-2 hidden lg:inline-block select-none">
                Base:
              </span>
              {cityKeys.map((cityId) => {
                const city = BASE_CITIES[cityId];
                const isSelected = activeBaseCityId === cityId;
                return (
                  <button
                    key={cityId}
                    onClick={() => setActiveBaseCityId(cityId)}
                    className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                    aria-pressed={isSelected}
                    title={`Set ${city.name} as departure point (${city.elevation})`}
                  >
                    <span>{city.name}</span>
                    {isSelected && <span className="text-[10px] opacity-80">★</span>}
                  </button>
                );
              })}
            </div>

            {/* Prominent Base City Temperature & Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Prominent Current Base City Temperature Badge */}
              <div
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-amber-50 border border-amber-200/90 rounded-xl text-stone-900 shadow-2xs"
                title={`Current weather in ${activeBaseCity.name}: ${activeBaseCity.condition}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-lg" aria-hidden="true">{activeBaseCity.icon}</span>
                  <div className="flex flex-col text-left leading-tight">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                      {activeBaseCity.name} Base
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-stone-950 font-mono tabular-nums">
                      {toDisplayTemp(currentBaseTempF, unit)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={refreshCityWeather}
                  disabled={isRefreshing}
                  className="p-1 text-stone-400 hover:text-stone-700 transition-colors rounded-md hover:bg-amber-100/60 ml-0.5"
                  title="Refresh live Open-Meteo weather"
                  aria-label="Refresh weather data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
                </button>
              </div>

              {/* Scenario Quick Selector (Desktop) */}
              <div className="hidden xl:flex items-center">
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value as WeatherScenario)}
                  className="text-xs bg-stone-50 border border-stone-200 text-stone-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  title="Simulate heat scenario"
                >
                  <option value="live">Live Satellite Weather</option>
                  <option value="summer">Classic Summer (98°F)</option>
                  <option value="scorcher">Heatwave (104°F+)</option>
                  <option value="mild">Mild Spring/Fall (86°F)</option>
                </select>
              </div>

              {/* °F / °C Toggle */}
              <button
                onClick={() => setUnit((prev) => (prev === 'F' ? 'C' : 'F'))}
                className="px-2.5 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-lg transition-colors font-mono tabular-nums"
                title="Toggle °F / °C"
              >
                °{unit}
              </button>

              {/* Saved Escapes Drawer Button */}
              <button
                onClick={() => setIsSavedDrawerOpen(true)}
                className="relative p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200/80"
                title="My Weekend Escape Itinerary"
                aria-label="Saved Escapes"
              >
                <Bookmark className="w-4 h-4" />
                {savedGetawayIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {savedGetawayIds.length}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ====================================================================
          2. HERO SECTION
          ==================================================================== */}
      <main className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-stone-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-xl border border-stone-800">
          <div className="absolute inset-0 z-0">
            <img
              src={heroGetaway.image}
              alt={heroGetaway.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 sm:py-16 lg:py-20 flex flex-col justify-between min-h-[480px]">
            {/* Top Delta Tag */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 backdrop-blur-xs">
                <Compass className="w-3.5 h-3.5" />
                Departing from {activeBaseCity.name} ({activeBaseCity.elevation})
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-300 font-mono tabular-nums">
                Valley Floor: {toDisplayTemp(currentBaseTempF, unit)}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-emerald-400 font-semibold font-mono tabular-nums">
                Alpine Drop: {heroDelta.text}
              </span>
            </div>

            {/* Headline */}
            <div className="mt-6 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
                Escape the Valley Heat. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300">
                  Find Your Cool Within 90 Minutes.
                </span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl text-balance">
                When {activeBaseCity.name} hits triple digits, step into 71°F pine-fringed Sierra waters, 
                coastal marine breezes at Santa Cruz, or climate-controlled 68°F theaters. Real-time temperature 
                deltas curated for Central Valley road trips.
              </p>

              {/* Hero Spotlight Card */}
              <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-700/80 max-w-xl shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5" />
                      Top Recommended Escape
                    </div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {heroGetaway.title}
                    </div>
                    <div className="text-xs text-stone-300 flex items-center gap-2 mt-1">
                      <span>{heroRoute.driveTime} from {activeBaseCity.name}</span>
                      <span>·</span>
                      <span>{heroRoute.distanceMiles} miles via {heroRoute.routeHighway}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 bg-stone-800/90 px-3.5 py-2 rounded-xl border border-stone-700">
                    <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                      {toDisplayTemp(heroDestTempF, unit)}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-300 font-mono tabular-nums">
                      {heroDelta.text}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-xs text-stone-300 italic truncate max-w-xs sm:max-w-md">
                    "{heroGetaway.summary}"
                  </span>
                  <button
                    onClick={() => setSelectedGetaway(heroGetaway)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-colors shrink-0 ml-2 cursor-pointer"
                  >
                    <span>View Route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Search & Drive Limit */}
            <div className="mt-10 pt-6 border-t border-stone-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search escapes, lakes, rivers, or events from ${activeBaseCity.name}...`}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-stone-800/90 text-white placeholder-stone-400 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
                <span className="text-xs font-semibold text-stone-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Drive Limit:
                </span>
                {[
                  { label: 'Any', value: null },
                  { label: '≤ 45 min', value: 45 },
                  { label: '≤ 90 min', value: 90 },
                  { label: '≤ 2 hrs', value: 120 },
                ].map((opt) => {
                  const active = maxDriveMinutes === opt.value;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setMaxDriveMinutes(opt.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ====================================================================
            3. QUICK FILTERS (Top buttons)
            ==================================================================== */}
        <div className="mx-4 sm:mx-6 lg:mx-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0">
            {quickFilterTabs.map((qf) => {
              const isActive = activeQuickFilter === qf.id;
              return (
                <button
                  key={qf.id}
                  onClick={() => setActiveQuickFilter(qf.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 border cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:text-stone-950 hover:bg-stone-200/90 border-stone-200/70'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-stone-500'}>
                    {qf.icon}
                  </span>
                  <span>{qf.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-stone-500 shrink-0">
            <span className="font-medium text-stone-600">
              {filteredGetaways.length} escape destination{filteredGetaways.length === 1 ? '' : 's'}
            </span>
            <span className="text-stone-300">·</span>
            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-select" className="font-medium text-stone-500 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-200 text-stone-800 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-2xs"
              >
                <option value="coolest">Coolest First (Highest Drop)</option>
                <option value="drive">Quickest Drive</option>
                <option value="elevation">Highest Elevation</option>
                <option value="popular">Local Favorites</option>
              </select>
            </div>
          </div>
        </div>

        {/* ====================================================================
            4. GETAWAYS GRID WITH PROMINENT BADGE TAGS
            ==================================================================== */}
        <div className="mx-4 sm:mx-6 lg:mx-8">
          {filteredGetaways.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200">
              <SearchX className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-800">No escapes found</h3>
              <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                No getaways matched your filters from {activeBaseCity.name}. 
                Try resetting your filters or expanding your drive limit.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMaxDriveMinutes(null);
                  setActiveQuickFilter('all');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-amber-600 text-white rounded-xl hover:bg-amber-500 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGetaways.map((getaway) => {
                const destTempF = getawayTempsF[getaway.id] || getaway.defaultTempF;
                const route = getaway.baseCityRoutes[activeBaseCity.id] || getaway.baseCityRoutes.modesto;
                const delta = formatDelta(destTempF, currentBaseTempF, unit, activeBaseCity.name);
                const isSaved = savedGetawayIds.includes(getaway.id);

                return (
                  <div
                    key={getaway.id}
                    className="group bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Media Header */}
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                      <img
                        src={getaway.image}
                        alt={getaway.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

                      {/* Category Tag Badge */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-stone-950/70 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 shadow-xs">
                          <span aria-hidden="true">{getaway.conditionIcon}</span>
                          <span>{getaway.categoryLabel}</span>
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSave(getaway.id);
                          }}
                          className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                            isSaved
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-900/60 text-white hover:bg-stone-900/90'
                          }`}
                          title={isSaved ? 'Remove from Saved' : 'Save to Weekend Escape'}
                          aria-label="Save getaway"
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Temperature Badge Tag on Photo */}
                      <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1.5 rounded-xl bg-stone-900/80 backdrop-blur-md border border-white/20 text-white shadow-xs">
                            <div className="text-xl sm:text-2xl font-black font-mono tabular-nums leading-none">
                              {toDisplayTemp(destTempF, unit)}
                            </div>
                          </div>
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

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Microclimate Status Badges ("Above the Fog", "Misted Patio", "20°+ Drop") */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          {/* Temperature Difference Badge */}
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono border ${
                            delta.isCooler
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-stone-50 text-stone-700 border-stone-200'
                          }`}>
                            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{delta.text}</span>
                          </span>

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

                        {/* Title */}
                        <h3 className="text-lg font-bold text-stone-900 mt-2 leading-snug group-hover:text-amber-700 transition-colors">
                          {getaway.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-sm text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {getaway.summary}
                        </p>

                        {/* Driving Route from active base city */}
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

                        {/* Matched Event Details Inside Card */}
                        {getaway.events && getaway.events.length > 0 && (
                          <div className="mt-3.5 p-3 rounded-xl bg-stone-50 border border-stone-200/90 text-left">
                            <div className="flex items-center justify-between gap-1.5 mb-1.5">
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                <span>Matched Event</span>
                              </div>

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

                            <div className="text-xs font-bold text-stone-900 truncate">
                              {getaway.events[0].title}
                            </div>

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

                            {/* Event Tags Badges */}
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

                      {/* Card Action */}
                      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs text-stone-500 font-medium">
                          {getaway.events && getaway.events.length > 0
                            ? `${getaway.events.length} cool event${getaway.events.length === 1 ? '' : 's'}`
                            : 'Open daily'}
                        </span>

                        <button
                          onClick={() => setSelectedGetaway(getaway)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>Explore Escape</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ====================================================================
            5. EVENT MATCHING SECTION
            ==================================================================== */}
        <section className="mx-4 sm:mx-6 lg:mx-8 my-14 pt-10 border-t border-stone-200" id="events-matching">
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
                Realistic seasonal events mapped directly to our cool-weather getaways. Compare event 
                temperatures directly against {activeBaseCity.name} valley heat.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_EVENTS.map((ev) => {
              const delta = formatDelta(ev.eveningTempF, currentBaseTempF, unit, activeBaseCity.name);

              return (
                <div
                  key={ev.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
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

                    <h3 className="text-base font-bold text-stone-900 leading-snug group-hover:text-amber-700 transition-colors">
                      {ev.title}
                    </h3>

                    <div className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

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

                    <button
                      onClick={() => {
                        const found = GETAWAYS.find((g) => g.id === ev.destinationId);
                        if (found) setSelectedGetaway(found);
                      }}
                      className="w-full py-2 px-3 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View {ev.destinationTitle} Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ====================================================================
          6. FOOTER
          ==================================================================== */}
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
            <a href="#top" className="hover:text-stone-900 transition-colors">Back to top ↑</a>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          7. GETAWAY DETAIL MODAL
          ==================================================================== */}
      {selectedGetaway && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
          <div 
            className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    const destTemp = getawayTempsF[selectedGetaway.id] || selectedGetaway.defaultTempF;
                    const r = selectedGetaway.baseCityRoutes[activeBaseCity.id] || selectedGetaway.baseCityRoutes.modesto;
                    const d = formatDelta(destTemp, currentBaseTempF, unit, activeBaseCity.name);
                    navigator.clipboard.writeText(
                      `Check out ${selectedGetaway.title} on Valley Escape! Currently ${toDisplayTemp(destTemp, unit)} (${d.text}). Route: ${r.driveTime} via ${r.routeHighway}.`
                    );
                    alert('Trip details copied to clipboard!');
                  }
                }}
                className="p-2.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-colors backdrop-blur-md cursor-pointer"
                title="Share this escape"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleToggleSave(selectedGetaway.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                  savedGetawayIds.includes(selectedGetaway.id)
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-900/70 hover:bg-stone-900 text-white'
                }`}
                title="Save getaway"
              >
                <Bookmark className={`w-4 h-4 ${savedGetawayIds.includes(selectedGetaway.id) ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => setSelectedGetaway(null)}
                className="p-2.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-colors backdrop-blur-md cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-stone-900">
              <img
                src={selectedGetaway.image}
                alt={selectedGetaway.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="text-xs font-semibold text-amber-300 flex items-center gap-2 mb-1">
                  <span>{selectedGetaway.region}</span>
                  <span>·</span>
                  <span>{selectedGetaway.county}</span>
                  <span>·</span>
                  <span>{selectedGetaway.elevation}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {selectedGetaway.title}
                </h2>
                <p className="text-sm text-stone-300 mt-1 max-w-2xl">
                  {selectedGetaway.subtitle}
                </p>

                {/* Microclimate Badges in Modal */}
                {selectedGetaway.microclimateBadges && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    {selectedGetaway.microclimateBadges.map((b, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Temperature Delta Comparison Bar */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        {activeBaseCity.name} Valley Floor
                      </div>
                      <div className="text-xl font-black text-stone-900 font-mono tabular-nums">
                        {toDisplayTemp(currentBaseTempF, unit)}
                      </div>
                    </div>
                  </div>

                  <div className="text-center sm:px-6 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Thermal Relief Delta
                    </div>
                    <div className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
                      {formatDelta(getawayTempsF[selectedGetaway.id] || selectedGetaway.defaultTempF, currentBaseTempF, unit, activeBaseCity.name).text}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <div className="text-right">
                      <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        {selectedGetaway.title.split(' ')[0]} Microclimate
                      </div>
                      <div className="text-xl font-black text-stone-900 font-mono tabular-nums">
                        {toDisplayTemp(getawayTempsF[selectedGetaway.id] || selectedGetaway.defaultTempF, unit)}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 text-lg">
                      {selectedGetaway.conditionIcon}
                    </div>
                  </div>
                </div>

                {selectedGetaway.waterTempF && (
                  <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
                    <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-cyan-600" />
                      Water Temperature:
                    </span>
                    <span className="font-mono font-bold text-cyan-700">{selectedGetaway.waterTempF}</span>
                  </div>
                )}
              </div>

              {/* Driving Route from Base */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-amber-700" />
                    <span className="text-sm font-bold text-stone-900">
                      Drive from {activeBaseCity.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-lg">
                    {cityKeys.map((cKey) => (
                      <button
                        key={cKey}
                        onClick={() => setActiveBaseCityId(cKey)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                          activeBaseCityId === cKey
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {BASE_CITIES[cKey].name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-800">
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <div className="text-[11px] font-semibold text-stone-500 uppercase">Drive Time</div>
                    <div className="text-base font-bold font-mono text-stone-950 mt-0.5">
                      {(selectedGetaway.baseCityRoutes[activeBaseCity.id] || selectedGetaway.baseCityRoutes.modesto).driveTime}
                    </div>
                    <div className="text-xs text-stone-500 font-mono">
                      {(selectedGetaway.baseCityRoutes[activeBaseCity.id] || selectedGetaway.baseCityRoutes.modesto).distanceMiles} miles
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 sm:col-span-2">
                    <div className="text-[11px] font-semibold text-stone-500 uppercase">Recommended Highway Route</div>
                    <div className="text-sm font-bold text-stone-900 mt-0.5">
                      {(selectedGetaway.baseCityRoutes[activeBaseCity.id] || selectedGetaway.baseCityRoutes.modesto).routeHighway}
                    </div>
                    <div className="text-xs text-amber-900 mt-1 font-medium">
                      💡 {(selectedGetaway.baseCityRoutes[activeBaseCity.id] || selectedGetaway.baseCityRoutes.modesto).tip}
                    </div>
                  </div>
                </div>
              </div>

              {/* Narrative */}
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  About This Valley Getaway
                </h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                  {selectedGetaway.description}
                </p>
              </div>

              {/* Highlights & Packing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
                  <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key Highlights & Activities
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                    {selectedGetaway.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
                  <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    What to Pack for Thermal Comfort
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                    {selectedGetaway.whatToPack.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Events */}
              {selectedGetaway.events && selectedGetaway.events.length > 0 && (
                <div className="pt-4 border-t border-stone-200">
                  <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    Matched Events at This Destination
                  </h4>
                  <div className="space-y-3">
                    {selectedGetaway.events.map((ev) => (
                      <div key={ev.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-sm font-bold text-stone-900">{ev.title}</div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-amber-100 text-amber-900 border border-amber-200">
                              {ev.categoryBadge}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                            <span>{ev.date}</span>
                            <span>·</span>
                            <span>{ev.time}</span>
                            <span>·</span>
                            <span>{ev.location}</span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1">{ev.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-semibold text-emerald-700 font-mono">
                            {toDisplayTemp(ev.eveningTempF, unit)} evening
                          </div>
                          <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                            {ev.admissionText || (ev.isFree ? 'Free Admission' : 'Standard Entry')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => handleToggleSave(selectedGetaway.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    savedGetawayIds.includes(selectedGetaway.id)
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${savedGetawayIds.includes(selectedGetaway.id) ? 'fill-current' : ''}`} />
                  <span>{savedGetawayIds.includes(selectedGetaway.id) ? 'Saved in Itinerary' : 'Save to Weekend Itinerary'}</span>
                </button>

                <button
                  onClick={() => setSelectedGetaway(null)}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          8. SAVED ESCAPES DRAWER
          ==================================================================== */}
      {isSavedDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  My Weekend Escape Plan
                </h2>
                <div className="text-xs text-stone-500 font-medium">
                  Base: {activeBaseCity.name} · {savedGetawaysList.length} destination{savedGetawaysList.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {savedGetawaysList.length > 0 && (
                  <button
                    onClick={handleClearSaved}
                    className="text-xs text-stone-400 hover:text-rose-600 transition-colors p-1.5 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsSavedDrawerOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {savedGetawaysList.length === 0 ? (
                <div className="text-center py-16 text-stone-400 space-y-3">
                  <div className="text-4xl">🌲</div>
                  <div className="text-sm font-semibold text-stone-600">No escapes saved yet</div>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto">
                    Click the bookmark icon on any getaway card to build your personalized beat-the-heat road trip!
                  </p>
                </div>
              ) : (
                <>
                  {savedGetawaysList.map((getaway) => {
                    const destTemp = getawayTempsF[getaway.id] || getaway.defaultTempF;
                    const route = getaway.baseCityRoutes[activeBaseCity.id] || getaway.baseCityRoutes.modesto;
                    const delta = formatDelta(destTemp, currentBaseTempF, unit, activeBaseCity.name);

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
                                setSelectedGetaway(getaway);
                                setIsSavedDrawerOpen(false);
                              }}
                              className="text-amber-700 hover:text-amber-800 font-semibold text-xs cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleToggleSave(getaway.id)}
                              className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Combined Packing List */}
                  <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                      <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                      Combined Packing Checklist
                    </h4>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {Array.from(new Set(savedGetawaysList.flatMap((g) => g.whatToPack))).map((item, idx) => (
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
                </>
              )}
            </div>

            {savedGetawaysList.length > 0 && (
              <div className="p-4 border-t border-stone-200 bg-stone-50">
                <button
                  onClick={() => {
                    const lines = [
                      `🌊 My Valley Escape Plan from ${activeBaseCity.name} (${toDisplayTemp(currentBaseTempF, unit)})`,
                      `----------------------------------------------------`,
                      ...savedGetawaysList.map((g) => {
                        const destTemp = getawayTempsF[g.id] || g.defaultTempF;
                        const route = g.baseCityRoutes[activeBaseCity.id] || g.baseCityRoutes.modesto;
                        const delta = formatDelta(destTemp, currentBaseTempF, unit, activeBaseCity.name);
                        return `• ${g.title}: ${toDisplayTemp(destTemp, unit)} (${delta.text})\n  Drive: ${route.driveTime} (${route.distanceMiles} mi via ${route.routeHighway})`;
                      }),
                    ];
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(lines.join('\n'));
                      alert('Trip plan copied to clipboard!');
                    }
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Weekend Plan to Share</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
