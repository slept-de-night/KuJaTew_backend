
import z from 'zod';

export const UserSchema = z.object({
    name:z.string().min(1, 'name is required'),
    email:z.string(),
    phone:z.string().min(6, 'phone is too short'),
})

export const ProfileFileSchema = z.object({
  fieldname: z.literal('profile'),                   
  originalname: z.string(),
  mimetype: z.union([z.literal('image/jpeg'), z.literal('image/jpg')]),
  size: z.number().max(5 * 1024 * 1024, 'Max 5MB'),
  buffer: z.instanceof(Buffer),                         
});

export const ProfileNullableSchema = ProfileFileSchema.nullable().optional();
export type ProfileFile = z.infer<typeof ProfileFileSchema>;