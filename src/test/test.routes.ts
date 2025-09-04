import { Router } from 'express';
import { getuser } from './test.controller';
import multer from 'multer';

import { refreshTokenHandler } from '../core/middleware/refreshTokenHandler';
export const testRouter = Router();
testRouter.use('',getuser);



