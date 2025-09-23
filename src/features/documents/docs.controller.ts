import { Request, Response } from 'express';
import { DocService } from './docs.service';
import { docSchema } from './docs.schema';
import { ProfileFileSchema } from '../users/users.schema';
import { asyncHandler } from '../../core/http';
import { BadRequest, INTERNAL } from '../../core/errors';
import z from 'zod';
import { trip_code_password_schema } from '../invitations/invitations.schema';

let user_id = 'nutty';

export const Get_Docs = asyncHandler(async (req: Request, res: Response) => {
//   const parsed = z.object({user_id:z.string()}).safeParse((req as any).user); 
//   if(!parsed.success) throw BadRequest("Invalide Request");
//   let user_id = parsed.data.user_id;

  const parseparams = z.object({trip_id:z.coerce.number()}).safeParse(req.params);
  if (!parseparams.success) throw BadRequest("Invalide Request");
  const result = await DocService.get_docs(user_id, parseparams.data.trip_id);
  res.status(200).json(result);
});