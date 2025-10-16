import { z } from "zod";

export const copySchema = z.object({
    total_copied: z.coerce.number().int(),
});

export const trip_id_schema = z.object({
  trip_id: z.coerce.number().min(1, "trip_id is required"),
});

export const trip_code_schema = z.object({
  trips_name: z.coerce.string().min(1, "trip_name is required"),
  start_date: z.coerce.string().min(1, "start_date is required"),
  trip_code: z.coerce.string().min(1, "trip_code is required"),
  trip_password: z.coerce.string().min(1, "trip_password is required"),
});

export const trip_id_schema_swag = z.object({
  trip_id: z.number().int().openapi({ example: 60 }),
});

export const trip_code_schema_swag = z.object({
  trips_name: z.string().openapi({ example: "Tokyo Kyoto" }),
  start_date: z.string().openapi({ example: "2026/07/01" }),
  trip_code: z.string().openapi({ example: "54awdxk7745" }),
  trip_password: z.string().openapi({ example: "oshilmao" }),
});

export const trip_copied_schema = z.object({
  message: z.string().openapi({ example: "Trip Copied" }),
  trip_id: z.number().int().openapi({ example: 123 }),
});
