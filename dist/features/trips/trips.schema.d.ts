import z from 'zod';
export declare const TripSchema: z.ZodObject<{
    trip_id: z.ZodNumber;
    title: z.ZodString;
    joined_people: z.ZodNumber;
    start_date: z.ZodDate;
    end_date: z.ZodDate;
    poster_image_link: z.ZodNullable<z.ZodString>;
    planning_status: z.ZodBoolean;
}, z.core.$strip>;
export declare const tSchema: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const mrSchema: z.ZodObject<{
    member_id: z.ZodString;
    role: z.ZodString;
}, z.core.$strip>;
export declare const BodySchema: z.ZodObject<{
    trip_name: z.ZodOptional<z.ZodString>;
    start_date: z.ZodOptional<z.ZodDate>;
    end_date: z.ZodOptional<z.ZodDate>;
    trip_code: z.ZodOptional<z.ZodString>;
    trip_pass: z.ZodOptional<z.ZodString>;
    planning_status: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const cSchema: z.ZodObject<{
    collab_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const addtripSchema: z.ZodObject<{
    trip_name: z.ZodString;
    start_date: z.ZodCoercedDate<unknown>;
    end_date: z.ZodCoercedDate<unknown>;
    trip_code: z.ZodString;
    trip_pass: z.ZodString;
}, z.core.$strip>;
export declare const tripsumschema: z.ZodObject<{
    trip_id: z.ZodNumber;
    title: z.ZodString;
    joined_people: z.ZodNumber;
    start_date: z.ZodDate;
    end_date: z.ZodDate;
    budget: z.ZodNumber;
    poster_image_link: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const pschema: z.ZodObject<{
    joined_people: z.ZodNumber;
}, z.core.$strip>;
export declare const TripCreateSchema: z.ZodObject<{
    trip_name: z.ZodString;
    start_date: z.ZodDate;
    end_date: z.ZodDate;
    trip_code: z.ZodString;
    trip_pass: z.ZodString;
}, z.core.$strip>;
export declare const TripUpdateSchema: z.ZodObject<{
    trip_name: z.ZodDefault<z.ZodString>;
    start_date: z.ZodDefault<z.ZodDate>;
    end_date: z.ZodDefault<z.ZodDate>;
    trip_code: z.ZodDefault<z.ZodString>;
    trip_pass: z.ZodDefault<z.ZodString>;
    trip_image: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=trips.schema.d.ts.map