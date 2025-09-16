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

let user_id = 'keen1234';

export const Get_All_Notes_In_Trip = asyncHandler(async (req: Request, res: Response) => {
    // const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    // if(!parseduser.success) throw BadRequest("Invalide Request");
    // let user_id = parseduser.data.user_id;

    const parseparams = z.object({trip_id: z.coerce.number().int()}).safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params"); 

    const notes_data = await NoteService.get_note_in_trip(user_id, parseparams.data.trip_id);
    res.status(200).json(notes_data);
});

export const Edit_Trip_Note = asyncHandler(async (req: Request, res: Response) => {
    // const parseduser = z.object({user_id:z.string()}).safeParse((req as any).user); 
    // if(!parseduser.success) throw BadRequest("Invalide Request");
    // let user_id = parseduser.data.user_id;

    const parseparams = z.object({
        trip_id: z.coerce.number().int(), 
        nit_id:z.coerce.number().int()})
    .safeParse(req.params);
    if(!parseparams.success) throw INTERNAL("Fail to parse params"); 

    const parsebody = z.object({note:z.string().min(1)}).safeParse(req.body);
    console.log(req.body);
    if(!parsebody.success) throw INTERNAL("Fail to parse body");
    const updated_data = await NoteService.edit_trip_note(user_id, parseparams.data.trip_id, parseparams.data.nit_id, parsebody.data.note);
    res.status(200).json(updated_data);
});