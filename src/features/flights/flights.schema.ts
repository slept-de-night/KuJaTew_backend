import { z } from "zod";

export const trip_id_schema = z.object({
  trip_id: z.coerce.number().min(1, "trip_id is required"),
});

export const flight_id_schema = z.object({
  flight_id: z.coerce.number().min(1, "trip_id is required"),
});

export const trip_flight_schema = z.object({
  trip_id: z.coerce.number().min(1, "trip_id is required"),
  flight_id: z.coerce.number().min(1, "trip_id is required"),
});

export const TripParamsSchema = z.object({
  trip_id: z.coerce.number().int().positive(),
});
export type TripParams = z.infer<typeof TripParamsSchema>;

// DD/MM/YYYY
const DateDDMMYYYY = z.string().regex(
  /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
  "Expected DD/MM/YYYY"
);

// HH:mm 24-hour
const TimeHHMM = z.string().regex(
  /^([01]\d|2[0-3]):([0-5]\d)$/,
  "Expected HH:mm"
);

const IATA = z.string().length(3, "3-letter IATA code");
const CountryFull = z.string().min(2).max(56); // full name like "Thailand"

export const CreateFlightBodySchema = z.object({
  dep_date: DateDDMMYYYY,
  dep_time: TimeHHMM,
  dep_country: CountryFull,
  dep_airp_code: IATA,

  arr_date: DateDDMMYYYY,
  arr_time: TimeHHMM,
  arr_country: CountryFull,
  arr_airp_code: IATA,

  airl_name: z.string().min(2).max(64), // airline name
});
export type CreateFlightBody = z.infer<typeof CreateFlightBodySchema>;
