import z from 'zod';

export const TripSchema = z.object({ 
    trip_id:z.number(),
    title:z.string(),
    joined_people:z.number(),
    start_date:z.date(),
    end_date:z.date(),
    poster_image_link:z.string().nullable(),
    planning_status:z.boolean()
});

export const utSchema = z.object({
    user_id: z.string().trim().min(1, "user_id required"),
    trip_id: z.coerce.number().int().positive("trip_id must be a positive integer"),
});

export const mrSchema = z.object({
    member_id: z.string().trim().min(1, "user_id required"),
    role: z.string().trim().min(1, "role required"),
});

export const BodySchema = z.object({ 
    trip_name:z.string().optional(),
    start_date:z.date().optional(),
    end_date:z.date().optional(),
    trip_code:z.string().optional(),
    trip_pass:z.string().optional(),
    planning_status:z.boolean().optional()
});

export const cSchema = z.object({ 
    collab_id:z.number().optional(),
});

export const addtripSchema = z.object({
      trip_name: z.string().trim().min(1),
      start_date: z.coerce.date(),
      end_date: z.coerce.date(),
      trip_code: z.string().trim().min(1, "trip_code required"),
      trip_pass: z.string().trim().min(1, "trip_pass required"),
});