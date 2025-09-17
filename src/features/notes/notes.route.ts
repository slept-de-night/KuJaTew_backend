import { Router } from 'express';
import * as controler from './notes.controller';
import multer from 'multer';

export const notesRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
notesRouter.get('/:trip_id/notes', controler.Get_All_Notes_In_Trip);
notesRouter.put('/:trip_id/:nit_id/notes', controler.Edit_Trip_Note);