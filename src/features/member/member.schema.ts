import z from 'zod';

export const MemberSchema = z.object({ 
    collab_id:z.number(),
    profile_picture_link:z.string(),
    name:z.string(),
    email:z.string(),
    phone:z.string(),
    role:z.string()
});

export const utSchema = z.object({
    trip_id: z.coerce.number().int().positive("trip_id must be a positive integer"),
    user_id: z.string().trim().min(1, "user_id required"),
});

export const utcSchema = z.object({
    trip_id: z.coerce.number().int().positive("trip_id must be a positive integer"),
    user_id: z.string().trim().min(1, "user_id required"),
    collab_id: z.coerce.number().int().positive("trip_id must be a positive integer"),
});

export const roleSchema = z.object({
    collab_id: z.number().int(),
    role: z.string().trim()
});

