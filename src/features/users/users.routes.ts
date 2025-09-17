import { Router } from 'express';
import * as controller from './users.controller';
import multer from 'multer';

import { refreshTokenHandler } from '../../core/middleware/refreshTokenHandler';
export const usersRouter = Router();
export const usersRouterPublic =Router();
const upload = multer({ storage: multer.memoryStorage() });
usersRouter.get('',controller.Users_Details_self);
usersRouter.get('/invited',controller.getinviteds);
usersRouter.get('/:user_id',controller.Users_Details);
usersRouterPublic.post('/login', controller.loginUser);
usersRouterPublic.get('/refresh-token',refreshTokenHandler,controller.getTokenRefresh);
usersRouter.patch('',upload.single('image'),controller.updateUser);
