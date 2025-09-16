import { z } from "zod";
export declare const place_id_schema: z.ZodObject<{
    place_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const bookmark_id_schema: z.ZodObject<{
    bookmark_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const trip_id_schema: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const gbookmark_id_schema: z.ZodObject<{
    gbookmark_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const user_name_schema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const trip_code_password_schema: z.ZodObject<{
    trip_code: z.ZodString;
    trip_pass: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=invitations.schema.d.ts.map