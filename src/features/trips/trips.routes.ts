import { Router } from 'express';
import * as controler from './trip.controller';
import multer from 'multer';

export const tripsRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
tripsRouter.get('/by-user', controler.User_All_Trip); //test with authen
tripsRouter.get('/by-trip/:trip_id', controler.Specific_Trip);
tripsRouter.get('/:trip_id/summarize', controler.Trip_Sum);
tripsRouter.get('/recommended', controler.Recommended_trip);
tripsRouter.get('/invited', controler.Invited_Trips);
tripsRouter.post("/", upload.single("file"), controler.Add_Trip);
tripsRouter.patch("/:trip_id", upload.single("file") ,controler.Edit_Trip_Detail);
tripsRouter.delete("/:trip_id", controler.Delete_Trip);
tripsRouter.delete("/:trip_id/leave", controler.Leave_Trip);