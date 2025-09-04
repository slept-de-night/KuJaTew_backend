import { Router } from 'express';
import * as controler from './users.controller';
import multer from 'multer';

import { refreshTokenHandler } from '../../core/middleware/refreshTokenHandler';
export const usersRouter = Router();
export const usersRouterPublic =Router();
const upload = multer({ storage: multer.memoryStorage() });
usersRouter.get('/:user_id',controler.Users_Details);
usersRouterPublic.post('/login', controler.loginUser);
usersRouterPublic.get('/refresh-token',refreshTokenHandler,controler.getTokenRefresh);
usersRouter.patch('/',upload.single('profile'),controler.updateUser);
usersRouter.get('/invited',controler.getinviteds);