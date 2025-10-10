import { z } from "zod";

export const copySchema = z.object({
    total_copied: z.coerce.number().int(),
});

export const trip_id_schema = z.object({
  trip_id: z.coerce.number().min(1, "trip_id is required"),
});

export const trip_code_schema = z.object({
  trip_code: z.coerce.string().min(1, "trip_code is required"),
});

export const trip_id_schema_swag = z.object({
  trip_id: z.number().int().openapi({ example: 60 }),
});

export const trip_code_schema_swag = z.object({
  trip_code: z.number().int().openapi({ example: "54awdxk78" }),
});