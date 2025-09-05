import z from 'zod';

export const TripSchema = z.object({ 
    trip_id:z.number(),
    title:z.string(),
    joined_people:z.number(),
    start_date:z.date(),
    end_date:z.date(),
    trip_picture_url:z.string()
})

