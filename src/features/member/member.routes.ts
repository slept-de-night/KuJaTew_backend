import { Router } from 'express';
import * as controler from './member.controller';
import multer from 'multer';

export const memberRouter = Router();
memberRouter.get('/:trip_id/:user_id', controler.Trip_Members);
memberRouter.patch('/:trip_id/:user_id', controler.Edit_Role);
memberRouter.delete('/:trip_id/:collab_id/:user_id', controler.Delete_Member);