import z from 'zod';
export declare const UserSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
}, z.core.$strip>;
export declare const UsersFullSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodString;
    user_id: z.ZodString;
    profile_picture_path: z.ZodString;
}, z.core.$strip>;
export declare const ProfileFileSchema: z.ZodObject<{
    fieldname: z.ZodLiteral<"profile">;
    originalname: z.ZodString;
    encoding: z.ZodString;
    mimetype: z.ZodUnion<readonly [z.ZodLiteral<"image/jpeg">, z.ZodLiteral<"image/jpg">, z.ZodLiteral<"image/png">]>;
    buffer: z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>;
    size: z.ZodNumber;
}, z.core.$strip>;
export type JWT_OBJ = {
    "Refresh_token": string;
    "Access_token": string;
};
export declare const ProfileNullableSchema: z.ZodNullable<z.ZodObject<{
    fieldname: z.ZodLiteral<"profile">;
    originalname: z.ZodString;
    encoding: z.ZodString;
    mimetype: z.ZodUnion<readonly [z.ZodLiteral<"image/jpeg">, z.ZodLiteral<"image/jpg">, z.ZodLiteral<"image/png">]>;
    buffer: z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>;
    size: z.ZodNumber;
}, z.core.$strip>>;
export type ProfileFile = z.infer<typeof ProfileFileSchema>;
export declare const IdTokenSchema: z.ZodObject<{
    idToken: z.ZodString;
}, z.core.$strip>;
export declare const GoogleAuthSchema: z.ZodObject<{
    iss: z.ZodString;
    azp: z.ZodString;
    aud: z.ZodString;
    sub: z.ZodString;
    email: z.ZodString;
    email_verified: z.ZodBoolean;
    name: z.ZodString;
    picture: z.ZodString;
    given_name: z.ZodString;
    family_name: z.ZodString;
    iat: z.ZodInt;
    exp: z.ZodInt;
}, z.core.$strip>;
//# sourceMappingURL=users.schema.d.ts.map