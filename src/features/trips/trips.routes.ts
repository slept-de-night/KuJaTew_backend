import { Router } from 'express';
import * as controler from './trip.controller';
import multer from 'multer';

export const tripsRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
tripsRouter.get('/by-user/:user_id', controler.User_All_Trip);
tripsRouter.get('/by-trip/:trip_id', controler.Specific_Trip);
tripsRouter.post("/:user_id", upload.single("file"), controler.Add_Trip);
tripsRouter.patch("/:user_id/:trip_id", controler.Edit_Trip_Role);
tripsRouter.put("/:user_id/:trip_id", upload.single("file") ,controler.Edit_Trip_Detail);
tripsRouter.delete("/:user_id/:trip_id", controler.Delete_Trip);