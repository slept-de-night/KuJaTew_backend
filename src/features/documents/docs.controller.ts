import { Request, Response } from 'express';
import { DocService } from './docs.service';
import * as scheme from './docs.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import z from 'zod';
import { trip_code_password_schema } from '../invitations/invitations.schema';


export const Upload_Docs = asyncHandler(async (req: Request, res: Response) => {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parsed.success) throw BadRequest("Invalide Request");
    let user_id = parsed.data.user_id;

    const parseparams = scheme.UploadDocumentSchema.safeParse(req.params);
    if (!parseparams.success) throw BadRequest("Invalide Request");

    const file = req.file;
    if (file) {
        const allowedTypes = ["image/png", "image/jpeg", "application/pdf", "application/msword"];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ error: "Invalid file type" });
        }
    } else {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await DocService.uploadDocument(user_id, parseparams.data.trip_id, file);
    res.status(201).json(result);
});

export const Get_Docs = asyncHandler(async (req: Request, res: Response) => {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parsed.success) throw BadRequest("Invalide Request");
    let user_id = parsed.data.user_id;

    const parseparams = scheme.UploadDocumentSchema.safeParse(req.params);
    if (!parseparams.success) throw BadRequest("Invalide Request");
    const {trip_id} = parseparams.data;

    const result = await DocService.get_all_docs(user_id, trip_id);
    res.status(200).json(result);
});

export const Get_Doc = asyncHandler(async (req: Request, res: Response) => {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parsed.success) throw BadRequest("Invalide Request");
    let user_id = parsed.data.user_id;

    const parseparams = scheme.GetDocumentSchema.safeParse(req.params);
    if (!parseparams.success) throw BadRequest("Invalide Request");
    const {trip_id, doc_id} = parseparams.data;

    const result = await DocService.get_spec_doc(user_id, trip_id, doc_id);
    res.status(200).json(result);
});

export const Delete_Doc = asyncHandler(async (req: Request, res: Response) => {
    const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parsed.success) throw BadRequest("Invalide Request");
    let user_id = parsed.data.user_id;

    const parseparams = scheme.GetDocumentSchema.safeParse(req.params);
    if (!parseparams.success) throw BadRequest("Invalide Request");
    const {trip_id, doc_id} = parseparams.data;

    const result = await DocService.delete_doc(user_id, trip_id, doc_id);
    res.status(204).json(result);
});