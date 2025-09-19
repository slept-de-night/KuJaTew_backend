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

//response schema

export const BookmarkItemSchema = z.object({
  bookmark_id: z.number().int().openapi({ example: 1 }),
  place_name: z.string().openapi({ example: "Central World Mall" }),
  place_id: z.number().int().openapi({ example: 10023 }),
  rating: z.number().int().min(0).max(5).openapi({ example: 4 }),
  rating_count: z.number().int().openapi({ example: 230 }),
  address: z.string().openapi({ example: "999/9 Rama I Rd, Pathum Wan, Bangkok 10330" }),
  api_id: z.string().openapi({ example: "ChIJN1t_tDeuEmsRUsoyG83frY4" }),
  place_picture_path: z.string().openapi({ example: "/uploads/places/10023.jpg" }),
  website_url: z.string().url().openapi({ example: "https://www.centralworld.co.th" }),
});

export const BookmarkPlaceList = z.object({
  bookmarks: z.array(BookmarkItemSchema),
});

export const GuideBookmarkItemSchema = z.object({
  trip_id: z.number().int().openapi({ example: 101 }),
  gbookmark_id: z.number().int().openapi({ example: 5 }),
  duration: z.string().openapi({ example: "7" }), // number of days as string
  trip_url: z.string().url().openapi({ example: "https://api.example.com/trips/101" }),
  trip_picture_path: z.string().openapi({ example: "/uploads/trips/101.jpg" }),
  trip_owner: z.string().openapi({ example: "Alice Smith" }),
});

export const BookmarkGuideList = z.object({
  guide_bookmarks: z.array(GuideBookmarkItemSchema),
});

export const PlaceIdParamSchema = z.object({
  place_id: z.number().int().openapi({
    param: { name: "place_id", in: "path", required: true },
    example: 2,
  }),
});

export const BookmarkIdParamSchema = z.object({
  bookmark_id: z.number().int().openapi({
    param: { name: "bookmark_id", in: "path", required: true },
  }),
});

export const TripIdParamSchema = z.object({
  trip_id: z.number().int().openapi({
    param: { name: "trip_id", in: "path", required: true },
    example: 2,
  }),
});

export const GBookmarkIdParamSchema = z.object({
  gbookmark_id: z.number().int().openapi({
    param: { name: "gbookmark_id", in: "path", required: true },
  }),
});
