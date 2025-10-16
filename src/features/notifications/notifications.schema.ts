import { time } from "node:console";
import { z } from "zod";

export const trip_id_schema = z.object({
  trip_id: z.coerce.number().min(1, "trip_id is required"),
});

export const get_notifications_schema = z.object({
  trip_id: z.coerce.number().min(1, "trip_id is required"),
})

// DD/MM/YYYY
const DateDDMMYYYY = z.string().regex(
  /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
  "Expected DD/MM/YYYY"
);

// HH:mm 24-hour
const TimeHHMM = z.string().regex(
  /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
  "Expected HH:mm:SS"
);

export const post_notifications_body_schema = z.object({
  noti_title: z.coerce.string().min(1, "noti_ext is required"),
  noti_text: z.coerce.string().min(1, "noti_ext is required"),
  noti_date: z.coerce.date(),
  noti_time: TimeHHMM
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

export const example_swagger = z.object({
  noti_title: z.string().openapi({ example: "OSHI" }),
  noti_text: z.string().openapi({ example: "WE LOVE OSHI" }),
  noti_date: z.string().openapi({ example: "2025-08-31T17:00:00.000Z" }),
  noti_time: z.string().openapi({ example: "06:55:00" }),
});

export const get_noti_schemas = z.object({
  noti_id: z.number().openapi({ example: 12345 }),
  noti_title: z.string().openapi({ example: "OSHI" }),
  noti_text: z.string().openapi({ example: "WE LOVE OSHI" }),
  noti_date: z.string().openapi({ example: "2025-08-31T17:00:00.000Z" }),
  noti_time: z.string().openapi({ example: "06:55:00" }),
});

export const get_noti_schema = z.object({
  count: z.number().openapi({ example: 50 }),
  noti: z.array(get_noti_schemas),
});

export const unseen_schema = z.object({
  unseen: z.number().openapi({ example: 5 }),
});