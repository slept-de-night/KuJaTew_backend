import { z } from "zod";

export const trip_id_schema = z.object({
  trip_id: z.coerce.number().min(1, "trip_id is required"),
});

export const get_notifications_schema = z.object({
  trip_id: z.coerce.number().min(1, "trip_id is required"),
  limit: z.coerce.number().min(1, "limit is required"),
})

export const post_notifications_body_schema = z.object({
  noti_title: z.coerce.string().min(1, "noti_ext is required"),
  noti_text: z.coerce.string().min(1, "noti_ext is required"),
  noti_time: z.coerce.string().min(1, "noti_time is required"),
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

export const FlightItemSchema = z.object({
  noti_title: z.string().openapi({ example: "OSHI" }),
  noti_text: z.string().openapi({ example: "WE LOVE OSHI" }),
  noti_time: z.string().openapi({ example: "2025-09-20T14:23:00Z" }),
});