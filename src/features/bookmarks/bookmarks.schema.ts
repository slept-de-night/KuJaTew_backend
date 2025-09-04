import { z } from "zod";

export const add_place_bookmark = z.object({
  place_id: z.string().min(1, "place_id is required"),
});

export const remove_place_bookmark = z.object({
  place_id: z.string().min(1, "place_id is required"),
});

export const add_guide_bookmark = z.object({
  trip_id: z.string().min(1, "trip_id is required"),
});

export const remove_guide_bookmark = z.object({
  trip_id: z.string().min(1, "trip_id is required"),
});