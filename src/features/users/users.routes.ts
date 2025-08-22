import { Router } from 'express';
import { createUser } from './users.controller';
import multer from 'multer';

export const usersRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
usersRouter.post('/create-user',upload.single('profile'), createUser);