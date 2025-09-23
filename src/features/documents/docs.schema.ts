import { z } from "zod";

export const docSchema = z.object({
    doc_id:z.coerce.number(),
    doc_name:z.string(),
    mimetype:z.string(),
    doc_size:z.number(),
    modified_at:z.date(),
});