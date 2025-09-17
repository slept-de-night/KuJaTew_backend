import { Router } from 'express';
import * as controler from './docs.controller';
import multer from 'multer';

export const docsRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
docsRouter.get('/:trip_id/documents', controler.Get_Docs);