import { z } from "zod";

export const WeatherItem = z.object({
  weather_id: z.number().int(),
  weather_code: z.number().int(),
  pit_id: z.number().int(),
});

export type TWeatherItem = z.infer<typeof WeatherItem>;

export const WeatherResponse = z.union([
  z.array(WeatherItem),
  z.object({}).strict()
]);

export const GetWeatherParams = z.object({
  trip_id: z.coerce.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), 
});

export type TGetWeatherParams = z.infer<typeof GetWeatherParams>;
