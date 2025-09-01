import { Router } from 'express';
import {  getTokenRefresh, getUsersDetails, loginUser, updateUser } from './users.controller';
import multer from 'multer';

import { refreshTokenHandler } from '../../core/middleware/refreshTokenHandler';
export const usersRouter = Router();
export const usersRouterPublic =Router();
const upload = multer({ storage: multer.memoryStorage() });
usersRouter.get('/get-user-details',getUsersDetails);
usersRouterPublic.post('/login', loginUser);
usersRouterPublic.get('/refresh-token',refreshTokenHandler,getTokenRefresh);
usersRouter.post('/',upload.single('profile'),updateUser);