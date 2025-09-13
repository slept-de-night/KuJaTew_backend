import z from 'zod';
export declare const ImageFileSchema: z.ZodObject<{
    fieldname: z.ZodLiteral<"image">;
    originalname: z.ZodString;
    encoding: z.ZodString;
    mimetype: z.ZodUnion<readonly [z.ZodLiteral<"image/jpeg">, z.ZodLiteral<"image/jpg">, z.ZodLiteral<"image/png">]>;
    buffer: z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>;
    size: z.ZodNumber;
}, z.core.$strip>;
export type ImageFile = z.infer<typeof ImageFileSchema>;
//# sourceMappingURL=etc.schema.d.ts.map