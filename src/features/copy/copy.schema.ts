import { z } from "zod";

export const copySchema = z.object({
    total_copied: z.coerce.number().int(),
});