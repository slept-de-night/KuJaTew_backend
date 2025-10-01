
import z from 'zod';

export const UserSchema = z.object({
  name: z.string().min(1, 'name is required'),
  phone: z.string().min(6, 'phone is too short'),
})

export const UsersFullSchema = z.object({
  name: z.string().min(1, 'name is required'),
  phone: z.string(),
  email: z.string(),
  user_id: z.string(),
  profile_picture_path: z.string().nullable()
})

export const ProfileFileSchema = z.object({
  fieldname: z.literal('profile'),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.union([z.literal('image/jpeg'), z.literal('image/jpg'), z.literal('image/png')]),
  buffer: z.instanceof(Buffer),
  size: z.number().max(5 * 1024 * 1024, 'Max 5MB'),

});

export const InvitedSchema = z.array(z.object({
  trip_id: z.number(),
  trip_name: z.string(),
  trip_owner: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  trip_path: z.string().optional(),
  poster_trip_url: z.string().optional()
}))
export const jwtschema  = z.object({
  Refresh_token:z.string(),
  Access_token:z.string()
})
export type JWT_OBJ = z.infer<typeof jwtschema>;
export const ProfileNullableSchema = ProfileFileSchema.nullable();
export type ProfileFile = z.infer<typeof ProfileFileSchema>;
export const IdTokenSchema = z.object({
  idToken: z.string()
})
export const GoogleAuthSchema = z.object({
  iss: z.string(),
  azp: z.string(),
  aud: z.string(),
  sub: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  name: z.string(),
  picture: z.string(),
  given_name: z.string(),
  //family_name:  z.string(),
  iat: z.int(),
  exp: z.int()
})

export const UserIdSchema = z.object({
  user_id: z.string()
})

export const UsersFullOutSchema = z.object({
  name: z.string().min(1, 'name is required'),
  phone: z.string(),
  email: z.string(),
  user_id: z.string(),
  profile_picture_link: z.string().default("")
})

export const LoginSchema = z.object({
  name: z.string().min(1, 'name is required'),
  phone: z.string(),
  email: z.string(),
  user_id: z.string(),
  profile_picture_link: z.string().default(""),
  token: z.object({
    Refresh_token: z.string(),
    Access_token: z.string()
  })

})

export const UpdateInputSchema = z.object({
  image: z.any().openapi({ type: "string", format: "binary" }),
  ...UserSchema.shape
})

export const more_detail = z.object({
    user_id:z.string(),
    username:z.string(),
    role:z.string(),
    user_image:z.string(),
    trip_code:z.string(),
});