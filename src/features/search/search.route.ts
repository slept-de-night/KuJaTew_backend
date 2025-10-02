import { Router } from 'express';
import * as controler from './search.controller'
import multer from 'multer';

export const searchRouter = Router();
searchRouter.get('/users/:username/:trip_id', controler.SearchUser);
searchRouter.get('/guides/:guide_name', controler.SearchGuide);