import z, { boolean } from 'zod';

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