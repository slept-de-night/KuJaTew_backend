import { query } from "../../core/db"; 
import type { TWeatherItem } from "./weather.schema";

export const WeatherRepo = {
  async findByTripDate(trip_id: number, date: string): Promise<TWeatherItem[]> {
    const sql = `
      SELECT w.weather_id, w.weather_code, w.pit_id
      FROM weather w
      JOIN places_in_trip pit ON pit.pit_id = w.pit_id
      WHERE pit.trip_id = $1 AND pit.date = $2
      ORDER BY w.weather_id
    `;
    const res = await query(sql, [trip_id, date]);
    return res.rows as TWeatherItem[];
  },

  async insertWeather(weather_code: number, pit_id: number): Promise<TWeatherItem> {
    const sql = `
      INSERT INTO weather (weather_code, pit_id)
      VALUES ($1, $2)
      RETURNING weather_id, weather_code, pit_id
    `;
    const res = await query(sql, [weather_code, pit_id]);
    return res.rows[0] as TWeatherItem;
  },

  async deleteByTripDate(trip_id: number, date: string): Promise<number[]> {
    const sql = `
      DELETE FROM weather w
      USING places_in_trip pit
      WHERE w.pit_id = pit.pit_id
        AND pit.trip_id = $1
        AND pit.date = $2
      RETURNING w.weather_id
    `;
    const res = await query(sql, [trip_id, date]);
    return res.rows.map((r: any) => r.weather_id as number);
  },

  async findFirstPlaceOfDate(trip_id: number, date: string): Promise<{
    pit_id: number;
    place_id: number | null;
    lat: number | null;
    lon: number | null;
  } | null> {
    const sql = `
      SELECT
        pit.pit_id,
        pit.place_id,
        (p.lat)::float AS lat,
        (p.lon)::float AS lon
      FROM places_in_trip pit
      LEFT JOIN places p ON pit.place_id = p.place_id
      WHERE
        pit.trip_id = $1
        AND pit.date = $2
        AND COALESCE(pit.is_event, false) = false
        AND COALESCE(pit.is_vote, false) = false
        AND pit.place_id IS NOT NULL
      ORDER BY pit.time_start ASC
      LIMIT 1
    `;
    const res = await query(sql, [trip_id, date]);
    if (!res.rows || res.rows.length === 0) return null;
    const row = res.rows[0] as {
      pit_id: number;
      place_id: number | null;
      lat: number | null;
      lon: number | null;
    };

    return {
      pit_id: row.pit_id,
      place_id: row.place_id,
      lat: row.lat,
      lon: row.lon,
    };
  },
};
