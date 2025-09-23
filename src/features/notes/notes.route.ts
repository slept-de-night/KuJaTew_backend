import { Router } from 'express';
import * as controler from './notes.controller';
import multer from 'multer';

export const notesRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
//overview part
notesRouter.get('/:trip_id/notes', controler.Get_Overview_Notes);
notesRouter.post('/:trip_id/notes', controler.Add_Overview_Note);
notesRouter.put('/:trip_id/:nit_id/notes', controler.Edit_Overview_Note);
notesRouter.delete('/:trip_id/:nit_id/notes', controler.Delete_Overview_Note);

//activity part
notesRouter.get('/:trip_id/:pit_id/act_notes', controler.Get_Activity_Notes);
notesRouter.post('/:trip_id/:pit_id/act_notes', controler.Add_Activity_Note);
notesRouter.put('/:trip_id/:pnote_id/act_notes', controler.Edit_Activity_Note);
notesRouter.delete('/:trip_id/:pnote_id/act_notes', controler.Delete_Activity_note);