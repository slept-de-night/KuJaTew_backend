import { z } from "zod";
export declare const trip_id_schema: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const flight_id_schema: z.ZodObject<{
    flight_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const trip_flight_schema: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    flight_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const TripParamsSchema: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type TripParams = z.infer<typeof TripParamsSchema>;
export declare const CreateFlightBodySchema: z.ZodObject<{
    dep_date: z.ZodString;
    dep_time: z.ZodString;
    dep_country: z.ZodString;
    dep_airp_code: z.ZodString;
    arr_date: z.ZodString;
    arr_time: z.ZodString;
    arr_country: z.ZodString;
    arr_airp_code: z.ZodString;
    airl_name: z.ZodString;
}, z.core.$strip>;
export type CreateFlightBody = z.infer<typeof CreateFlightBodySchema>;
//# sourceMappingURL=flights.schema.d.ts.map