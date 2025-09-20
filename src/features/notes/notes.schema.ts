import { z } from "zod";

export const noteintripschema = z.object({
  nit_id: z.number().int(),
  note: z.string(),
  name: z.string(),
  profile_picture_path: z.string().nullable(),
  is_editable: z.number().int()
});

export const noteactivityschema = z.object({
  pnote_id: z.number().int(),
  note: z.string(),
  name: z.string(),
  profile_picture_path: z.string().nullable(),
  is_editable: z.number().int()
});