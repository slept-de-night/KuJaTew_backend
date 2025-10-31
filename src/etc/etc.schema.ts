import z from 'zod';

export const ImageFileSchema = z.object({
  fieldname: z.literal('image'),                   
  originalname: z.string(),
  encoding:z.string(),
  mimetype: z.union([z.literal('image/jpeg'), z.literal('image/jpg'),z.literal('image/png')]),
  buffer: z.instanceof(Buffer),        
  size: z.number().max(10 * 1024 * 1024, 'Max 10MB'),
         
});
export type ImageFile = z.infer<typeof ImageFileSchema>;