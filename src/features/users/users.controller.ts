import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { UserSchema,ProfileFileSchema, ProfileNullableSchema } from './users.schema';
import { asyncHandler } from '../../core/http';

export const createUser = asyncHandler(async (req: Request, res: Response) => {

  let upload_profile = {}; 
  const parsed = UserSchema.parse(req.body);
  const file = ProfileNullableSchema.parse(req.files);
  const user = await UsersService.create(parsed,file);
 
  res.status(201).json({ data: user ,...upload_profile });

});