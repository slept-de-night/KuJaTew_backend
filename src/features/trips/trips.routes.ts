import { Router } from 'express';
import * as controler from './trip.controller';
import multer from 'multer';
import { refreshTokenHandler } from '../../core/middleware/refreshTokenHandler';

export const tripsRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
tripsRouter.get('/by-user/:user_id', controler.User_All_Trip);
tripsRouter.get('/:trip_id', controler.Specific_Trip);
tripsRouter.post("/:user_id", upload.single("trip_image"), controler.Add_Trip);
tripsRouter.delete("/:user_id/:trip_id", controler.Delete_Trip);
tripsRouter.patch("/:user_id/:trip_id", controler.Edit_Trip_Role);