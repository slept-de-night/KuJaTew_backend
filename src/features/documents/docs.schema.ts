import { z } from "zod";

export const UploadDocumentSchema = z.object({
    trip_id: z.coerce.number().int(),
});

export const GetDocumentSchema = z.object({
    trip_id: z.coerce.number().int(),
    doc_id: z.coerce.number().int(),
});

export const DocumentDBSchema = z.object({
    doc_id: z.coerce.number().int(),
    doc_name: z.string(),
    path: z.string(),
    doc_size: z.coerce.number(),
    mem_type: z.string(),
    modified: z.date(),
    trip_id: z.coerce.number(),
});

export const getalldoc = z.object({
    doc_id: z.coerce.number().int(),
    doc_name: z.string(),
    doc_size: z.coerce.number(),
    mimetype: z.string(),
    modified: z.date(),
})