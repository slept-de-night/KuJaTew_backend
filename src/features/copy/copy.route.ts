import { Router } from 'express';
import * as controler from './copy.controller';
import multer from 'multer';

export const copyRouter = Router();
copyRouter.get('/:trip_id/copy', controler.Get_Copy);
copyRouter.post('/:trip_id/copy', controler.Add_Copy);

copyRouter.post('/:trip_id/copyTrip', controler.copy_trip);