import { z } from "zod";

export const place_id_schema = z.object({
  place_id: z.coerce.number().min(1, "place_id is required"),
});

export const bookmark_id_schema = z.object({
  bookmark_id: z.coerce.number().min(1, "place_id is required"),
});

export const trip_id_schema = z.object({
  trip_id: z.coerce.number().min(1, "trip_id is required"),
});

export const gbookmark_id_schema = z.object({
  gbookmark_id: z.coerce.number().min(1, "trip_id is required"),
});

export const user_name_schema = z.object({
  name: z.string().min(1, "invited user must have name"),
});

export const trip_code_password_schema = z.object({
  trip_code: z.string().min(1, "invited user must have name"),
  trip_pass: z.string().min(1, "invited user must have name"),
});