import {z} from 'zod';

export const userschema = z.object({
    username:z.string(),
    email:z.string(),
    phone:z.string(),
    profile_picture_link:z.string(),
});

export const guideschema = z.object({
    guide_name:z.string(),
    total_copied:z.coerce.number(),
    start_date:z.date(),
    end_date:z.date(),
    owner_name:z.string(),
    guide_poster_link:z.string(),
});