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

// YYYY-MM-DD
const DateYYYYMMDD = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  "Expected YYYY-MM-DD"
);

// HH:mm 24-hour
const TimeHHMM = z.string().regex(
  /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
  "Expected HH:mm:SS"
);

const IATA = z.string().length(3, "3-letter IATA code");
const CountryFull = z.string().min(2).max(56);

export const CreateFlightBodySchema = z.object({
  dep_date: DateYYYYMMDD,
  dep_time: TimeHHMM,
  dep_country: CountryFull,
  dep_airp_code: IATA,

  arr_date: DateYYYYMMDD,
  arr_time: TimeHHMM,
  arr_country: CountryFull,
  arr_airp_code: IATA,

  airl_name: z.string().min(2).max(64),
});
export type CreateFlightBody = z.infer<typeof CreateFlightBodySchema>;

//swagger
export const FlightItemSchema = z.object({
  flight_id: z.number().int().openapi({ example: 123 }),
  dep_date: z.string().openapi({ example: "2025-08-31T17:00:00.000Z" }),
  dep_time: z.string().openapi({ example: "08:45:00" }),
  dep_country: z.string().openapi({ example: "Thailand" }),
  dep_airp_code: z.string().openapi({ example: "BKK" }),

  arr_date: z.string().openapi({ example: "2025-09-01T17:00:00.000Z" }),
  arr_time: z.string().openapi({ example: "12:30:00" }),
  arr_country: z.string().openapi({ example: "Japan" }),
  arr_airp_code: z.string().openapi({ example: "HND" }),

  airl_name: z.string().openapi({ example: "Thai Airways" }),
});

export const PostFlightSchema = z.object({
  dep_date: z.string().openapi({ example: "2025-09-29T17:00:00.000Z" }),
  dep_time: z.string().openapi({ example: "08:45:00" }),
  dep_country: z.string().openapi({ example: "Thailand" }),
  dep_airp_code: z.string().openapi({ example: "BKK" }),

  arr_date: z.string().openapi({ example: "2025-09-30T17:00:00.000Z" }),
  arr_time: z.string().openapi({ example: "12:30:00" }),
  arr_country: z.string().openapi({ example: "Uganda" }),
  arr_airp_code: z.string().openapi({ example: "UGD" }),

  airl_name: z.string().openapi({ example: "ไปช่วยกัปตัน American Airline" }),
});

export const FlightListResponseSchema = z.object({
  flights: z.array(FlightItemSchema),
});

export const TripIdParamSchema = z.object({
  trip_id: z.number().int().openapi({
    param: {
      name: "trip_id",
      in: "path",
      required: true,
    },
    example: 2,
  }),
});

export const FlightIdParamSchema = z.object({
  flight_id: z.number().int().openapi({
    param: {
      name: "flight_id",
      in: "path",
      required: true,
    },
  }),
});

export const TripFlightParamSchema = TripIdParamSchema.merge(FlightIdParamSchema);

export const putflightitemschema = z.object({
  dep_date: z.string().openapi({ example: "2025-09-29T17:00:00.000Z" }),
  dep_time: z.string().openapi({ example: "08:45:00" }),
  dep_country: z.string().openapi({ example: "Thailand" }),
  dep_airp_code: z.string().openapi({ example: "BKK" }),

  arr_date: z.string().openapi({ example: "2025-09-30T17:00:00.000Z" }),
  arr_time: z.string().openapi({ example: "12:30:00" }),
  arr_country: z.string().openapi({ example: "Moon" }),
  arr_airp_code: z.string().openapi({ example: "MON" }),

  airl_name: z.string().openapi({ example: "ไปช่วยกัปตัน American Airline" }),
});