import { z } from "zod";

export const noteintripschema = z.object({
  nit_id: z.coerce.number().int(),
  note: z.string(),
  name: z.string(),
  user_id: z.string(),
  profile_picture_path: z.string().nullable(),
  is_editable: z.coerce.number().int(),
  note_time: z.coerce.date(),
});

export const noteactivityschema = z.object({
  pnote_id: z.coerce.number().int(),
  pit_id: z.coerce.number().int(),
  note: z.string(),
  name: z.string(),
  profile_picture_path: z.string().nullable(),
  is_editable: z.coerce.number().int()
});