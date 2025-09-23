import z from 'zod';

export const MemberSchema = z.object({ 
    collab_id:z.number(),
    profile_picture_link:z.string(),
    name:z.string(),
    email:z.string(),
    phone:z.string(),
    role:z.string()
});

export const tSchema = z.object({
    trip_id: z.coerce.number().int().positive("trip_id must be a positive integer"),
});

export const tcSchema = z.object({
    trip_id: z.coerce.number().int().positive("trip_id must be a positive integer"),
    collab_id: z.coerce.number().int().positive("trip_id must be a positive integer"),
});

export const roleSchema = z.object({
    collab_id: z.coerce.number().int(),
    role: z.string().trim()
});

export const rSchema = z.object({
    role: z.string().trim()
});