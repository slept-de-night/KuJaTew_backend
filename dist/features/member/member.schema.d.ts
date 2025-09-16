import z from 'zod';
export declare const MemberSchema: z.ZodObject<{
    collab_id: z.ZodNumber;
    profile_picture_link: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    role: z.ZodString;
}, z.core.$strip>;
export declare const utSchema: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    user_id: z.ZodString;
}, z.core.$strip>;
export declare const utcSchema: z.ZodObject<{
    trip_id: z.ZodCoercedNumber<unknown>;
    user_id: z.ZodString;
    collab_id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const roleSchema: z.ZodObject<{
    collab_id: z.ZodNumber;
    role: z.ZodString;
}, z.core.$strip>;
export declare const urSchema: z.ZodObject<{
    user_id: z.ZodString;
    role: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=member.schema.d.ts.map