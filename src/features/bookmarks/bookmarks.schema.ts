import { z } from "zod";

export const place_id_schema = z.object({
  place_id: z.string().min(1, "place_id is required"),
});

export const trip_id_schema = z.object({
  trip_id: z.string().min(1, "trip_id is required"),
});