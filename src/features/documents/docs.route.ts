import { Router } from 'express';
import * as controler from './docs.controller';
import multer from 'multer';

export const docsRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
docsRouter.post('/:trip_id/documents', upload.single("file"), controler.Upload_Docs);
docsRouter.get('/:trip_id/documents', controler.Get_Docs);
docsRouter.get('/:trip_id/documents/:doc_id', controler.Get_Doc);
docsRouter.delete('/:trip_id/documents/:doc_id', controler.Delete_Doc);