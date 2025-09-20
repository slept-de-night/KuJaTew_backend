import { Router } from 'express';
import * as controler from './notes.controller';
import multer from 'multer';

export const notesRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
notesRouter.get('/:trip_id/notes', controler.Get_All_Notes_In_Trip);
notesRouter.post('/:trip_id/notes', controler.Add_Overview_Note);
notesRouter.put('/:trip_id/:nit_id/notes', controler.Edit_Overview_Note);
notesRouter.delete('/:trip_id/:nit_id/notes', controler.Delete_Overview_Note);