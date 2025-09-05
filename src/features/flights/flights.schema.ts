import { z } from "zod";

const DATE = /^\d{4}-\d{2}-\d{2}$/;                  
const TIME = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;  
const IATA = /^[A-Z]{3}$/;                           

export const create_flight_body_schema = z.object({
  dep_date: z.string().regex(DATE, "dep_date must be YYYY-MM-DD"),
  dep_time: z.string().regex(TIME, "dep_time must be HH:MM or HH:MM:SS"),
  dep_country: z.string().min(1),
  dep_airp_code: z.string().toUpperCase().regex(IATA, "must be IATA 3-letter"),

  arr_date: z.string().regex(DATE, "arr_date must be YYYY-MM-DD"),
  arr_time: z.string().regex(TIME, "arr_time must be HH:MM or HH:MM:SS"),
  arr_country: z.string().min(1),
  arr_airp_code: z.string().toUpperCase().regex(IATA, "must be IATA 3-letter"),

  airl_name: z.string().min(1),
});

export const trip_id_schema = z.object({
  trip_id: z.number().min(1, "trip_id is required"),
});

export const add_place_bookmark = z.object({
  place_id: z.string().min(1, "place_id is required"),
});

export const delete_flight_schema = z.object({
  trip_id: z.number().min(1, "trip_id is required"),
  flight_id: z.number().min(1, "flight_id is required")
});

export const add_guide_bookmark = z.object({
  trip_id: z.string().min(1, "trip_id is required"),
});

export const remove_guide_bookmark = z.object({
  trip_id: z.string().min(1, "trip_id is required"),
});