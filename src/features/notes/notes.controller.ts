import { Request, Response } from 'express';
import { NoteService } from './notes.service';
import * as schema from "./notes.schema";
import { ProfileFileSchema } from '../users/users.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import z from 'zod';
import { trip_code_password_schema } from '../invitations/invitations.schema';
import { native } from 'pg';
import no from 'zod/v4/locales/no.js';
import { PassThrough } from 'node:stream';


//overview part
export const Get_Overview_Notes = asyncHandler(async (req: Request, res: Response) => {
    const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parseduser.success) throw BadRequest("Invalide Request");
    let user_id = parseduser.data.user_id;

    const parseparams = z.object({trip_id: z.coerce.number().int()}).safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params"); 

    const notes_data = await NoteService.get_overview_notes(user_id, parseparams.data.trip_id);
    res.status(200).json(notes_data);
});

export const Edit_Overview_Note = asyncHandler(async (req: Request, res: Response) => {
    const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parseduser.success) throw BadRequest("Invalide Request");
    let user_id = parseduser.data.user_id;

    const parseparams = z.object({
        trip_id: z.coerce.number().int(), 
        nit_id:z.coerce.number().int()})
    .safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params"); 

    const parsebody = z.object({note:z.string().min(1)}).safeParse(req.body);
    if(!parsebody.success) throw INTERNAL("Fail to parse body");
    const updated_data = await NoteService.edit_overview_note(user_id, parseparams.data.trip_id, parseparams.data.nit_id, parsebody.data.note);
    res.status(200).json(updated_data);
});

export const Add_Overview_Note = asyncHandler(async (req: Request, res: Response) => {
    const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parseduser.success) throw BadRequest("Invalide Request");
    let user_id = parseduser.data.user_id;

    const parseparams = z.object({
        trip_id: z.coerce.number().int()
    }).safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params"); 

    const parsebody = z.object({note:z.string().min(1, "Can't insert empty string")}).safeParse(req.body);
    if(!parsebody.success) throw INTERNAL("Fail to parse body");
    const data = await NoteService.add_overview_note(user_id, parseparams.data.trip_id, parsebody.data.note);
    res.status(201).json(data);
});

export const Delete_Overview_Note = asyncHandler(async (req: Request, res: Response) => {
    const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parseduser.success) throw BadRequest("Invalide Request");
    let user_id = parseduser.data.user_id;

    const parseparams = z.object({
        trip_id: z.coerce.number().int(),
        nit_id:z.coerce.number().int()
    }).safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params"); 

    const data = await NoteService.delete_overview_note(user_id, parseparams.data.trip_id, parseparams.data.nit_id);
    res.status(204).json(data);
});
//activity part
export const Get_Activity_Notes = asyncHandler(async (req: Request, res: Response) => {
    const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parseduser.success) throw BadRequest("Invalide Request");
    let user_id = parseduser.data.user_id;

    const parseparams = z.object({
        trip_id: z.coerce.number().int(),
    }).safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params"); 
    const {trip_id} = parseparams.data;

    const notes_data = await NoteService.get_activity_notes(user_id, trip_id);
    res.status(200).json(notes_data);
});

export const Edit_Activity_Note = asyncHandler(async (req: Request, res: Response) => {
    const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parseduser.success) throw BadRequest("Invalide Request");
    let user_id = parseduser.data.user_id;
    console.log(req.params)
    const parseparams = z.object({
        trip_id: z.coerce.number().int(), 
        pnote_id:z.coerce.number().int()})
    .safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params");
    const {trip_id, pnote_id} = parseparams.data;

    const parsebody = z.object({note:z.string().min(1)}).safeParse(req.body);
    if(!parsebody.success) throw INTERNAL("Fail to parse body");
    const updated_data = await NoteService.edit_activity_note(user_id, trip_id, pnote_id, parsebody.data.note);
    res.status(200).json(updated_data);
});

export const Add_Activity_Note = asyncHandler(async (req: Request, res: Response) => {
    const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parseduser.success) throw BadRequest("Invalide Request");
    let user_id = parseduser.data.user_id;

    const parseparams = z.object({
        trip_id: z.coerce.number().int(),
        pit_id: z.coerce.number().int(),
    }).safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params"); 
    const {trip_id, pit_id} = parseparams.data;

    const parsebody = z.object({note:z.string().min(1, "Can't insert empty string")}).safeParse(req.body);
    if(!parsebody.success) throw INTERNAL("Fail to parse body");
    const data = await NoteService.add_activity_note(user_id, trip_id, pit_id, parsebody.data.note);
    res.status(201).json(data);
});

export const Delete_Activity_note = asyncHandler(async (req: Request, res: Response) => {
    const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    if(!parseduser.success) throw BadRequest("Invalide Request");
    let user_id = parseduser.data.user_id;

    const parseparams = z.object({
        trip_id: z.coerce.number().int(),
        pnote_id:z.coerce.number().int()
    }).safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params");
    const {trip_id, pnote_id} = parseparams.data;

    const data = await NoteService.delete_activity_note(user_id, trip_id, pnote_id);
    res.status(204).json(data);
});