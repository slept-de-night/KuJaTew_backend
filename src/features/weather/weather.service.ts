import fetch from "node-fetch";
import { WeatherRepo } from "./weather.repo";
import type { TWeatherItem } from "./weather.schema";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDateUTC(dateStr: string): Date {
  const parts: string[] = dateStr.split("-");
  if (parts.length !== 3) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }

  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);

  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) {
    throw new Error(`Invalid number in date string: ${dateStr}`);
  }

  return new Date(Date.UTC(y, m - 1, d));
}
function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function diffDaysUtc(targetISO: string): number {
  const t = parseDateUTC(targetISO).getTime();
  const today = todayUTC().getTime();
  return Math.round((t - today) / MS_PER_DAY);
}

const BUCKET = {
  CLEAR: 0,
  CLOUDS: 1,
  FOG: 2,
  DRIZZLE: 3,
  RAIN: 4,
  SNOW: 5,
  ICE: 6,
  THUNDER: 7,
} as const;

const apiBucketMap: Record<number, number[]> = {
  [BUCKET.CLEAR]:   [1000],
  [BUCKET.CLOUDS]:  [1003, 1006, 1009],
  [BUCKET.FOG]:     [1030, 1135, 1147, 1114],
  [BUCKET.DRIZZLE]: [1150, 1153],
  [BUCKET.RAIN]:    [1063,1180,1183,1186,1189,1192,1195,1240,1243,1246],
  [BUCKET.SNOW]:    [1066,1117,1210,1213,1216,1219,1222,1225,1255,1258,1279,1282],
  [BUCKET.ICE]:     [1069,1072,1168,1171,1198,1201,1204,1207,1237,1249,1252,1261,1264],
  [BUCKET.THUNDER]: [1087,1273,1276],
};

function mapApiCodeToBucket(apiCode: number): number {
  for (const [bucket, codes] of Object.entries(apiBucketMap)) {
    if (codes.includes(apiCode)) return Number(bucket);
  }
  return BUCKET.CLEAR;
}

async function getWeatherApiCodeForDate(lat: number, lon: number, dateISO: string): Promise<number | null> {
  const key = process.env.WEATHER_API_KEY;
  if (!key) {
    throw new Error("WEATHER_API_KEY is not set");
  }
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(
    key
  )}&q=${lat},${lon}&days=3&aqi=no&alerts=no`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WeatherAPI error: ${res.status} ${text}`);
  }
  const data: any = await res.json();

  const forecastList: any[] = data?.forecast?.forecastday ?? [];
  const match = forecastList.find((f) => f?.date === dateISO);
  if (match?.day?.condition?.code != null) {
    return Number(match.day.condition.code);
  }

  const curCode = data?.current?.condition?.code;
  if (curCode != null) return Number(curCode);

  return null;
}

export const WeatherService = {
  async getByTripDate(trip_id: number, date: string): Promise<TWeatherItem[] | Record<string, never>> {
    const d = diffDaysUtc(date);
    
    if ( d < 0 ){
      const cached = await WeatherRepo.findByTripDate(trip_id, date);
      if (cached.length > 0) return cached; 
    }

    if ( d > 2 ) {
      return {};
    }

    const cached = await WeatherRepo.findByTripDate(trip_id, date);
    if (cached.length > 0) return cached;

    const first = await WeatherRepo.findFirstPlaceOfDate(trip_id, date);
    if (!first || first.lat == null || first.lon == null) {
      return {};
    }

    const apiCode = await getWeatherApiCodeForDate(first.lat, first.lon, date);
    if (apiCode == null) {
      return {};
    }
    const weather_code = mapApiCodeToBucket(apiCode);

    const row = await WeatherRepo.insertWeather(weather_code, first.pit_id);
    return [row];
  },

  async checkAndDelete(trip_id: number, date: string): Promise<{ deleted_ids: number[]; reason: string }> {
    const existing = await WeatherRepo.findByTripDate(trip_id, date);
    if (existing.length === 0) {
      return { deleted_ids: [], reason: "no weather rows to delete" };
    }
    const first = await WeatherRepo.findFirstPlaceOfDate(trip_id, date);
    if (!first) {
      const deleted = await WeatherRepo.deleteByTripDate(trip_id, date);
      return { deleted_ids: deleted, reason: "no first place; purge weather" };
    }

    const mismatch = existing.some((w) => w.pit_id !== first.pit_id);
    if (mismatch) {
      const deleted = await WeatherRepo.deleteByTripDate(trip_id, date);
      return { deleted_ids: deleted, reason: "first place changed; purge weather" };
    }
    return { deleted_ids: [], reason: "first place unchanged" };
  },
};
