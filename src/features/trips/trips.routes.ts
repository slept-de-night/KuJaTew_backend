import { Router } from 'express';
import * as controler from './trip.controller';
import multer from 'multer';

import { refreshTokenHandler } from '../../core/middleware/refreshTokenHandler';
export const tripsRouter = Router();
export const tripsRouterPublic = Router();
const upload = multer({ storage: multer.memoryStorage() });
tripsRouter.get('/:user_id', controler.User_All_Trip);
tripsRouter.get('/:trip_id', controler.Specific_Trip);
tripsRouter.post("/", upload.single("trip_image"), controler.Add_Trip);