import { z } from "zod";

export const noteintripschema = z.object({
  note: z.string(),
  name: z.string(),
  profile_picture_path: z.string().nullable(),
  is_editable: z.number().int()
});