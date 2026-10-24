import { BaseCity, Getaway, WeatherScenario, TempUnit } from '../types';

export interface WeatherCondition {
  tempF: number;
  condition: string;
  icon: string;
  apparentTempF?: number;
  windSpeedMph?: number;
  humidity?: number;
  isLive: boolean;
}

const WMO_MAP: Record<number, { text: string; icon: string }> = {
  0: { text: 'Clear Sky', icon: '☀️' },
  1: { text: 'Mainly Clear', icon: '🌤️' },
  2: { text: 'Partly Cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Coastal Fog / Haze', icon: '🌫️' },
  48: { text: 'Depositing Rime Fog', icon: '🌫️' },
  51: { text: 'Light Drizzle', icon: '🌦️' },
  61: { text: 'Slight Rain', icon: '🌧️' },
  80: { text: 'Rain Showers', icon: '🌦️' },
};

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

// In-memory cache to avoid hammering Open-Meteo
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
      const mapped = WMO_MAP[code] || { text: 'Pleasant', icon: '☀️' };

      const result: WeatherCondition = {
        tempF: Math.round(current.temperature_2m),
        condition: mapped.text,
        icon: mapped.icon,
        apparentTempF: Math.round(current.apparent_temperature || current.temperature_2m),
        windSpeedMph: Math.round(current.wind_speed_10m || 5),
        humidity: current.relative_humidity_2m || 30,
        isLive: true,
      };

      weatherCache.set(cacheKey, { data: result, expires: now + 10 * 60 * 1000 });
      return result;
    }
  } catch {
    // Fall back gracefully
  }

  const fallback: WeatherCondition = {
    tempF: fallbackTempF,
    condition: fallbackCondition,
    icon: fallbackIcon,
    apparentTempF: fallbackTempF,
    windSpeedMph: 8,
    humidity: 28,
    isLive: false,
  };
  weatherCache.set(cacheKey, { data: fallback, expires: now + 5 * 60 * 1000 });
  return fallback;
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

  // default 'summer'
  return isBaseCity ? baseOrDest.defaultSummerTempF : baseOrDest.defaultTempF;
}
